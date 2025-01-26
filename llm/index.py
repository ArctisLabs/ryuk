from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
from pymongo import MongoClient
from huggingface_hub import InferenceClient
import os
import json
from datetime import datetime
from bson import ObjectId
import uvicorn

load_dotenv()

app = FastAPI(title="Code Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

class Artifact(BaseModel):
    filename: str
    content: str
    language: str

class GenerateResponse(BaseModel):
    message: str
    final_code: dict
    auditor_report: dict


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
        return super().default(obj)

async def find_similar_projects(tech_stack: dict) -> List[dict]:
    try:
        query = {
            "$or": [
                {"frontend": tech_stack['frontend']},
                {"backend": tech_stack['backend']},
                {"database": tech_stack['database']},
                {"ai": tech_stack['ai']},
                {"authentication": tech_stack['authentication']},
                {"payments": tech_stack['payments']},
                {"blockchain": tech_stack['blockchain']}
            ]
        }
        
        results = mongo.db.training_data.find(
            query,
            {'embedding': 0}
        )
        
        similar_projects = list(results)
        
        if not similar_projects:
            broader_query = {
                "$or": [
                    {"backend": tech_stack['backend']},
                    {"appType": {"$regex": "storage", "$options": "i"}}
                ]
            }
            results = mongo.db.training_data.find(
                broader_query,
                {'embedding': 0}
            )
            similar_projects = list(results)
            
        return similar_projects
            
    except Exception as e:
        print(f"Error finding similar projects: {e}")
        return []

async def generate_code_from_prompt(tech_stack: dict, similar_projects: List[dict], prompt: str) -> dict:
    try:
        serializable_projects = json.loads(
            json.dumps(similar_projects, cls=MongoJSONEncoder)
        )
        
        system_prompt = f"""Generate a complete project structure based on:

Tech Stack:
{json.dumps(tech_stack, indent=2)}

Similar Projects:
{json.dumps(serializable_projects, indent=2)}

User Request: {prompt}

Generate a complete project structure including:
1. All necessary files with their content
2. Setup instructions
3. Dependencies

Return ONLY a JSON response in this exact format:
{{
    "files": [
        {{
            "filename": "path/to/file",
            "content": "file content",
            "language": "programming language"
        }}
    ],
    "setup_instructions": "setup guide",
    "dependencies": {{
        "dependency": "version"
    }}
}}"""

        response = hf_client.chat_completion(
            model="Qwen/Qwen2.5-Coder-32B-Instruct",
            messages=[
                {"role": "system", "content": "You are an expert full-stack developer."},
                {"role": "user", "content": system_prompt}
            ],
            temperature=0.7,
            max_tokens=4096
        )
        
        content = response.choices[0].message.content
        
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            cleaned_content = content.strip().strip('`').strip()
            if cleaned_content.startswith('json'):
                cleaned_content = cleaned_content[4:]
            return json.loads(cleaned_content)
            
    except Exception as e:
        print(f"Error generating code: {e}")
        return None

@app.on_event("startup")
async def startup_event():
    await mongo.connect()
    print("Connected to MongoDB!")

@app.on_event("shutdown")
async def shutdown_event():
    await mongo.close()

# API endpoints
@app.post("/generate", response_model=GenerateResponse)
async def generate_project(request: GenerateRequest):
    try:
        tech_stack = {k: v for k, v in request.dict().items() 
                     if k not in ['prompt', 'temperature', 'max_tokens'] and v is not None}
        
        similar_projects = await find_similar_projects(tech_stack)
        
        if not similar_projects:
            return GenerateResponse(
                message="No similar projects found, generating from scratch.",
                final_code={"artifacts": []},
                auditor_report={
                    "vulnerabilities_found": False,
                    "vulnerabilities_list": [],
                    "recommendations": ""
                }
            )
        
        result = await generate_code_from_prompt(tech_stack, similar_projects, request.prompt)
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to generate code")
            
        return GenerateResponse(
            message="Code generated successfully",
            final_code={"artifacts": result.get("files", [])},
            auditor_report={
                "vulnerabilities_found": False,
                "vulnerabilities_list": [],
                "recommendations": result.get("setup_instructions", "")
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)