# backend_templates.py
from typing import Dict, List, Any

class BackendTemplatesManager:
    def _initialize_backend_templates(self) -> Dict[str, Any]:
        return {
            "node": self._get_node_structure(),
            "python": self._get_python_structure(),
            "rust": self._get_rust_structure()
        }

    def _generate_backend_files(self, backend: str, frontend: str) -> List[Dict[str, str]]:
        try:
            files = []
            structure = self.backend_templates[backend]["structure"]
            prefix = "app/api" if frontend == "nextjs" else "backend"
                
            for filepath, content in self._flatten_structure(structure, prefix):
                files.append({
                    "filename": filepath,
                    "content": self._process_file_content(content),
                    "language": self._detect_language(filepath)
                })
                
            return files
        except Exception as e:
            print(f"Error generating backend files: {str(e)}")
            return []

    def _get_node_structure(self) -> Dict[str, Any]:
        return {
            "structure": {
                "src": {
                    "controllers": {
                        "index.ts": self._node_controller_template()
                    },
                    "models": {},
                    "routes": {
                        "index.ts": self._node_routes_template()
                    },
                    "middleware": {
                        "auth.ts": self._node_auth_middleware_template()
                    },
                    "config": {
                        "database.ts": self._node_db_config_template()
                    },
                    "app.ts": self._node_app_template()
                },
                "package.json": self._node_package_template(),
                "tsconfig.json": self._ts_config_template()
            }
        }

    def _get_python_structure(self) -> Dict[str, Any]:
        return {
            "structure": {
                "app": {
                    "routers": {
                        "__init__.py": "",
                        "api.py": self._python_router_template()
                    },
                    "models": {
                        "__init__.py": "",
                        "base.py": self._python_models_template()
                    },
                    "schemas": {
                        "__init__.py": "",
                        "base.py": self._python_schemas_template()
                    },
                    "services": {
                        "__init__.py": "",
                        "base.py": self._python_services_template()
                    },
                    "core": {
                        "config.py": self._python_config_template(),
                        "security.py": self._python_security_template()
                    },
                    "__init__.py": "",
                    "main.py": self._python_main_template()
                },
                "requirements.txt": self._python_requirements_template(),
                "Dockerfile": self._python_dockerfile_template()
            }
        }

    def _get_rust_structure(self) -> Dict[str, Any]:
        return {
            "structure": {
                "src": {
                    "handlers": {
                        "mod.rs": self._rust_handlers_template()
                    },
                    "models": {
                        "mod.rs": self._rust_models_template()
                    },
                    "routes": {
                        "mod.rs": self._rust_routes_template()
                    },
                    "lib.rs": self._rust_lib_template(),
                    "main.rs": self._rust_main_template()
                },
                "Cargo.toml": self._rust_cargo_template()
            }
        }


    def _rust_handlers_template(self):
        return '''
use actix_web::{web, HttpResponse};
use serde_json::json;

pub async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(json!({ "status": "healthy" }))
}'''

    def _rust_models_template(self):
        return '''
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
}'''


    def _rust_routes_template(self):
        return '''
use actix_web::web;
use crate::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/health", web::get().to(handlers::health_check))
    );
}'''

    def _rust_lib_template(self):
        return '''
pub mod handlers;
pub mod models;
pub mod routes;'''

    def _rust_main_template(self):
        return '''
use actix_web::{App, HttpServer, middleware};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .configure(routes::config)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}'''

    def _rust_cargo_template(self):
        return '''
[package]
name = "rust-backend"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["full"] }
env_logger = "0.9"
dotenv = "0.15"'''

    def _node_controller_template(self):
        return '''
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  }
}

export const userController = new UserController();'''

    def _node_routes_template(self):
        return '''
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Auth Routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// User Routes
router.get('/users', authMiddleware, userController.getUsers);
router.get('/users/:id', authMiddleware, userController.getUserById);
router.post('/users', authMiddleware, userController.createUser);

export { router };'''

    def _node_auth_middleware_template(self):
        return '''
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};'''

    def _node_db_config_template(self):
        return '''
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};'''

    def _node_service_template(self):
        return '''
import { User, IUser } from '../models/user.model';

export class UserService {
  async createUser(userData: Partial<IUser>) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw new Error('Error creating user');
    }
  }

  async getUsers() {
    try {
      const users = await User.find({});
      return users;
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }

  async getUserById(id: string) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw new Error('Error fetching user');
    }
  }
}'''

    def _node_model_template(self):
        return '''
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});'''

    def _node_app_template(self):
        return '''
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes';
import { connectDB } from './config/database';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api', router);

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;'''


    def _node_package_template(self):
        return '''{
  "name": "node-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mongoose": "^8.0.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.4",
    "@types/cors": "^2.8.17",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.2"
  }
}'''
   
    def _ts_config_template(self):
        return '''{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}'''

    def _python_router_template(self):
        return '''
from fastapi import APIRouter, Depends
from app.schemas.base import UserCreate, User
from app.services.base import UserService

router = APIRouter()

@router.post("/users/", response_model=User)
async def create_user(user: UserCreate, service: UserService = Depends()):
    return await service.create_user(user)

@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int, service: UserService = Depends()):
    return await service.get_user(user_id)'''

    def _python_models_template(self):
        return '''
from sqlalchemy import Column, Integer, String
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)'''

    def _python_schemas_template(self):
        return '''
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True'''

    def _python_services_template(self):
        return '''
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.base import User
from app.schemas.base import UserCreate

class UserService:
    def __init__(self, db: Session = Depends(SessionLocal)):
        self.db = db
    
    async def create_user(self, user: UserCreate) -> User:
        db_user = User(
            email=user.email,
            name=user.name,
            hashed_password=user.password  # Remember to hash in production
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    async def get_user(self, user_id: int) -> User:
        return self.db.query(User).filter(User.id == user_id).first()'''

    
    def _python_config_template(self):
        return '''
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI App"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    DATABASE_URL: str
    
    class Config:
        env_file = ".env"

settings = Settings()'''


    def _python_security_template(self):
        return '''
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your-secret-key"  # Change in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt'''

    def _python_main_template(self):
        return '''
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import api

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")'''

    def _python_requirements_template(self):
        return '''
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.2
pydantic-settings==2.1.0
python-jose==3.3.0
passlib==1.7.4
python-multipart==0.0.6
python-dotenv==1.0.0
email-validator==2.1.0.post1'''

    def _python_dockerfile_template(self):
        return '''
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]'''

     






