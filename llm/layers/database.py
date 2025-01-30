# database_layer.py
from typing import Dict, List

class DatabaseLayerGenerator:
    def _generate_database_layer(self, tech_stack: Dict[str, str]) -> List[Dict[str, str]]:
        files = []
        database = tech_stack.get("database", "").lower()
        frontend = tech_stack.get("frontend", "").lower()
        backend = tech_stack.get("backend", "").lower()

        if not database:
            return files

        prefix = "app/lib" if frontend == "nextjs" else "src/lib"
        
        db_handlers = {
            "mongodb": self._handle_mongodb_setup,
            "postgres": self._handle_postgres_setup,
            "supabase": self._handle_supabase_setup,
            "firebase": self._handle_firebase_setup
        }

        if database in db_handlers:
            files.extend(db_handlers[database](frontend, backend, prefix))

        return files

    def _handle_mongodb_setup(self, frontend: str, backend: str, prefix: str) -> List[Dict[str, str]]:
        files = []
        
        if frontend == "nextjs":
            files.extend([
                {
                    "filename": f"{prefix}/mongodb.ts",
                    "content": self._mongodb_nextjs_template(),
                    "language": "typescript"
                },
                {
                    "filename": f"{prefix}/models/types.ts",
                    "content": self._mongodb_types_template(),
                    "language": "typescript"
                },
                {
                    "filename": f"{prefix}/models/user.ts",
                    "content": self._mongodb_user_model_template(),
                    "language": "typescript"
                }
            ])
        elif backend == "python":
            files.extend([
                {
                    "filename": "app/core/mongodb.py",
                    "content": self._mongodb_python_template(),
                    "language": "python"
                },
                {
                    "filename": "app/models/mongodb_models.py",
                    "content": self._mongodb_python_models_template(),
                    "language": "python"
                }
            ])
        return files

    def _handle_postgres_setup(self, frontend: str, backend: str, prefix: str) -> List[Dict[str, str]]:
        files = []
        
        if frontend == "nextjs":
            files.extend([
                {
                    "filename": f"{prefix}/db.ts",
                    "content": self._postgres_nextjs_template(),
                    "language": "typescript"
                },
                {
                    "filename": f"{prefix}/models/index.ts",
                    "content": self._postgres_models_template(),
                    "language": "typescript"
                }
            ])
        elif backend == "python":
            files.extend([
                {
                    "filename": "app/core/database.py",
                    "content": self._postgres_python_template(),
                    "language": "python"
                },
                {
                    "filename": "app/models/sql_models.py",
                    "content": self._postgres_python_models_template(),
                    "language": "python"
                }
            ])
        return files

    def _handle_supabase_setup(self, frontend: str, backend: str, prefix: str) -> List[Dict[str, str]]:
        return [{
            "filename": f"{prefix}/supabase.ts",
            "content": self._supabase_client_template(),
            "language": "typescript"
        }]

    def _handle_firebase_setup(self, frontend: str, backend: str, prefix: str) -> List[Dict[str, str]]:
        return [{
            "filename": f"{prefix}/firebase.ts",
            "content": self._firebase_client_template(),
            "language": "typescript"
        }]

    def _mongodb_nextjs_template(self):
        return '''
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise'''

    def _mongodb_models_template(self):
        return '''
import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
})

export const User = models.User || model('User', UserSchema)'''

    def _mongodb_python_template(self):
        return '''
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.get_default_database()'''

    def _postgres_nextjs_template(self):
        return '''
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
})

export default pool'''

    def _postgres_python_template(self):
        return '''
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()'''

    def _supabase_client_template(self):
        return '''
import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)'''

    def _firebase_client_template(self):
        return '''
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const db = getFirestore(app)'''

    def _mongodb_python_models_template(self):
        return '''from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)

class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
        populate_by_name = True
        arbitrary_types_allowed = True

class UserModel(MongoBaseModel):
    name: str
    email: str
    image: Optional[str] = None'''

    def _postgres_python_models_template(self):
        return '''
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class BaseModel(Base):
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())'''

    def _postgres_models_template(self):
        return '''
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'User',
});'''
