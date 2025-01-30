# models.py
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import json
from bson import ObjectId
from datetime import datetime

class TechStackRequest(BaseModel):
    frontend: Optional[str] = None
    backend: Optional[str] = None
    database: Optional[str] = None
    authentication: Optional[str] = None
    fileStorage: Optional[str] = None
    payments: Optional[str] = None
    ai: Optional[str] = None

    def get_dict(self) -> Dict[str, str]:
        return {k: v for k, v in self.model_dump().items() if v is not None}

class FileStructure(BaseModel):
    filename: str
    content: str
    language: str

    def model_dump(self) -> Dict[str, str]:
        return {
            "filename": self.filename,
            "content": self.content,
            "language": self.language
        }

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, BaseModel):
            return obj.model_dump()
        return super().default(obj)