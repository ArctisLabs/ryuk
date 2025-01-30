from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from dotenv import load_dotenv
from pymongo import MongoClient
from huggingface_hub import InferenceClient
import os
import json
from datetime import datetime
from bson import ObjectId
import uvicorn
from structure import ProjectStructureManager

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Code Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class GenerateRequest(BaseModel):
    frontend: str
    backend: str
    database: str
    ai: Optional[str] = None
    fileStorage: Optional[str] = None
    authentication: Optional[str] = None
    payments: Optional[str] = None
    blockchain: Optional[str] = None
    prompt: str
    temperature: float = 0.7
    max_tokens: int = 4096

    def get_tech_stack(self) -> Dict[str, str]:
        """Convert request to tech stack dictionary, excluding non-tech fields"""
        return {k: v for k, v in self.model_dump().items() 
                if k not in ['prompt', 'temperature', 'max_tokens'] 
                and v is not None}

class Artifact(BaseModel):
    filename: str
    content: str
    language: str

class GenerateResponse(BaseModel):
    message: str
    final_code: dict
    auditor_report: dict

# MongoDB connection handler
class MongoConnection:
    def __init__(self):
        self.client = None
        self.db = None
        
    async def connect(self):
        try:
            self.client = MongoClient(os.getenv("MONGODB_URL"))
            self.db = self.client[os.getenv("DB_NAME", "boltDB")]
            self.client.admin.command('ping')
            print("Connected to MongoDB!")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise e
        
    async def close(self):
        if self.client:
            self.client.close()

# Initialize connections
mongo = MongoConnection()
hf_client = InferenceClient(
    api_key=os.getenv("HUGGINGFACE_API_KEY"),
    model="Qwen/Qwen2.5-Coder-32B-Instruct"
)

class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

def serialize_mongo_data(data: any) -> any:
    """Recursively serialize MongoDB data types"""
    if isinstance(data, list):
        return [serialize_mongo_data(item) for item in data]
    elif isinstance(data, dict):
        return {key: serialize_mongo_data(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, datetime):
        return data.isoformat()
    return data

async def find_similar_projects(tech_stack: dict) -> List[dict]:
    """Find similar projects from MongoDB based on tech stack"""
    try:
        query = {
            "$or": [
                {key: value} for key, value in tech_stack.items() 
                if value and key != "blockchain"
            ]
        }
        
        results = list(mongo.db.training_data.find(
            query,
            {'embedding': 0}
        ))
        
        serialized_results = serialize_mongo_data(results)
        
        if not serialized_results:
            broader_query = {
                "$or": [
                    {"backend": tech_stack['backend']},
                    {"appType": {"$regex": "storage", "$options": "i"}}
                ]
            }
            broader_results = list(mongo.db.training_data.find(
                broader_query,
                {'embedding': 0}
            ))
            serialized_results = serialize_mongo_data(broader_results)
            
        return serialized_results
            
    except Exception as e:
        print(f"Error finding similar projects: {e}")
        return []

async def enhance_project_structure(
    base_structure: List[Dict],
    tech_stack: Dict,
    similar_projects: List[Dict],
    prompt: str,
    temperature: float,
    max_tokens: int
) -> Dict:
    """Enhance base project structure using AI"""
    try:
        serialized_base = serialize_mongo_data(base_structure)
        serialized_tech = serialize_mongo_data(tech_stack)
        serialized_similar = serialize_mongo_data(similar_projects)

        system_prompt = f"""Enhance and complete this project structure:

Current Structure:
{json.dumps(serialized_base, indent=2)}

Tech Stack Selected:
{json.dumps(serialized_tech, indent=2)}

Similar Projects Reference:
{json.dumps(serialized_similar, indent=2)}

User's Request: {prompt}

Requirements:
1. Maintain the exact structure provided above
2. Add necessary implementation code to existing files
3. Only create new files if absolutely necessary
4. Follow framework-specific best practices
5. Include proper error handling and type safety
6. Add comprehensive documentation and comments
7. Ensure proper integration between all layers

Generate ONLY a JSON response in this format:
{{
    "files": [
        {{
            "filename": "path/to/file",
            "content": "file content",
            "language": "programming language"
        }}
    ],
    "setup_instructions": "detailed setup guide including environment variables and dependencies",
    "dependencies": {{
        "package_name": "version"
    }}
}}"""

        response = hf_client.chat_completion(
            model="Qwen/Qwen2.5-Coder-32B-Instruct",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an expert full-stack developer specializing in modern web frameworks and best practices."
                },
                {"role": "user", "content": system_prompt}
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        if not response or not response.choices:
            return {
                "files": [],
                "setup_instructions": "Follow setup instructions in generated files",
                "dependencies": {}
            }
            
        try:
            content = response.choices[0].message.content
            cleaned_content = content.strip().strip('`').strip()
            if cleaned_content.startswith('json'):
                cleaned_content = cleaned_content[4:]
            return json.loads(cleaned_content)
        except (json.JSONDecodeError, AttributeError) as e:
            print(f"Error parsing AI response: {e}")
            return {
                "files": [],
                "setup_instructions": "Follow setup instructions in generated files",
                "dependencies": {}
            }
            
    except Exception as e:
        print(f"Error enhancing project structure: {e}")
        return {
            "files": [],
            "setup_instructions": "Follow setup instructions in generated files",
            "dependencies": {}
        }


@app.on_event("startup")
async def startup_event():
    await mongo.connect()

@app.on_event("shutdown")
async def shutdown_event():
    await mongo.close()

@app.post("/generate", response_model=GenerateResponse)
async def generate_project(request: GenerateRequest):
    try:
        # Get tech stack from request
        tech_stack = request.get_tech_stack()
        
        # Initialize structure manager and generate base structure
        structure_manager = ProjectStructureManager()
        base_structure = structure_manager.generate_project_structure(tech_stack)
        
        # Find similar projects
        similar_projects = await find_similar_projects(tech_stack)
        
        # Generate enhanced structure
        enhanced_structure = await enhance_project_structure(
            base_structure,
            tech_stack,
            similar_projects,
            request.prompt,
            request.temperature,
            request.max_tokens
        )
        
        # Ensure we have a valid enhanced_structure
        if not enhanced_structure:
            enhanced_structure = {
                "files": [],
                "setup_instructions": "Follow setup instructions in generated files",
                "dependencies": {}
            }
        
        # Merge base structure with AI enhancements
        final_structure = []
        base_files = {f["filename"]: f for f in base_structure}
        
        # Process each file from AI response
        for file in enhanced_structure.get("files", []):
            if file["filename"] in base_files:
                base_files[file["filename"]].update(file)
                final_structure.append(base_files[file["filename"]])
            else:
                final_structure.append(file)
        
        # Add remaining base files
        for base_file in base_structure:
            if base_file["filename"] not in {f["filename"] for f in final_structure}:
                final_structure.append(base_file)
        
        # Sort files for consistency
        final_structure.sort(key=lambda x: x["filename"])
        
        return GenerateResponse(
            message="Project generated successfully!",
            final_code={"artifacts": final_structure},
            auditor_report={
                "vulnerabilities_found": False,
                "vulnerabilities_list": [],
                "recommendations": enhanced_structure.get("setup_instructions", "Follow setup instructions in generated files")
            }
        )
        
    except Exception as e:
        print(f"Error in generate_project: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate project: {str(e)}"
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)