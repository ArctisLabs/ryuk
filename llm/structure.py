from typing import Dict, List, Any
import json
from models import FileStructure, CustomJSONEncoder
from layers.ai import AILayerGenerator
from layers.auth import AuthLayerGenerator
from layers.backend import BackendTemplatesManager
from layers.database import DatabaseLayerGenerator
from layers.frontends import FrontendTemplatesManager
from layers.payment import PaymentsLayerGenerator
from layers.storage import StorageLayerGenerator

class ProjectStructureManager(
    FrontendTemplatesManager,
    BackendTemplatesManager,
    DatabaseLayerGenerator,
    AuthLayerGenerator,
    StorageLayerGenerator,
    PaymentsLayerGenerator,
    AILayerGenerator
):
    def __init__(self):
        self.frontend_templates = self._initialize_frontend_templates()
        self.backend_templates = self._initialize_backend_templates()

    def generate_project_structure(self, tech_stack: Dict[str, str]) -> List[Dict[str, str]]:
        try:
            files = []
            
            # Generate frontend layer
            frontend = tech_stack.get("frontend", "").lower()
            if frontend in self.frontend_templates:
                files.extend(self._generate_frontend_files(frontend))
            
            # Generate backend layer
            backend = tech_stack.get("backend", "").lower()
            if backend in self.backend_templates:
                files.extend(self._generate_backend_files(backend, frontend))
            
            # Generate additional layers
            layer_generators = {
                "database": self._generate_database_layer,
                "authentication": self._generate_auth_layer,
                "fileStorage": self._generate_storage_layer,
                "payments": self._generate_payment_layer,
                "ai": self._generate_ai_layer
            }

            for key, generator in layer_generators.items():
                if tech_stack.get(key):
                    files.extend(generator(tech_stack))

            # Validate and process files
            validated_files = [
                FileStructure(
                    filename=file["filename"],
                    content=file["content"],
                    language=file["language"]
                ).model_dump()
                for file in files
            ]

            return json.loads(json.dumps(validated_files, cls=CustomJSONEncoder))
            
        except Exception as e:
            print(f"Error generating project structure: {str(e)}")
            raise

    def _process_file_content(self, content: Any) -> str:
        """Process file content with proper error handling and type checking"""
        try:
            if isinstance(content, str):
                return content
            if content is None:
                return ""
            return json.dumps(content, cls=CustomJSONEncoder)
        except Exception as e:
            print(f"Error processing file content: {str(e)}")
            return ""

    def _flatten_structure(self, structure: dict, prefix: str = "") -> List[tuple]:
        """Flatten nested directory structure"""
        try:
            files = []
            for key, value in structure.items():
                path = f"{prefix}/{key}" if prefix else key
                if isinstance(value, dict):
                    files.extend(self._flatten_structure(value, path))
                else:
                    files.append((path, value))
            return files
        except Exception as e:
            print(f"Error flattening structure: {str(e)}")
            return []

    def _detect_language(self, filepath: str) -> str:
        """Detect file language based on extension"""
        try:
            ext = filepath.split(".")[-1].lower()
            language_map = {
                "ts": "typescript",
                "tsx": "typescript",
                "js": "javascript",
                "jsx": "javascript",
                "py": "python",
                "rs": "rust",
                "json": "json",
                "css": "css",
                "html": "html",
                "vue": "vue",
                "toml": "toml"
            }
            return language_map.get(ext, "plaintext")
        except Exception:
            return "plaintext"