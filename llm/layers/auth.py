# auth_layer.py
from typing import Dict, List

class AuthLayerGenerator:
    def _generate_auth_layer(self, tech_stack: Dict[str, str]) -> List[Dict[str, str]]:
        files = []
        auth = tech_stack.get("authentication", "").lower()
        frontend = tech_stack.get("frontend", "").lower()
        backend = tech_stack.get("backend", "").lower()

        if not auth:
            return files

        # Generate auth-specific files
        auth_handlers = {
            "nextauth": self._handle_nextauth_setup,
            "clerk": self._handle_clerk_setup,
            "firebase": self._handle_firebase_auth_setup
        }

        if auth in auth_handlers:
            files.extend(auth_handlers[auth](frontend))

        # Add Node.js backend auth components if needed
        if backend == "node":
            files.extend(self._add_node_auth_components())

        return files

    def _handle_nextauth_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/api/auth/[...nextauth]/route.ts",
                "content": self._nextauth_template(),
                "language": "typescript"
            },
            {
                "filename": "app/lib/auth.ts",
                "content": self._nextauth_config_template(),
                "language": "typescript"
            }
        ]

    def _handle_clerk_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/api/clerk/route.ts",
                "content": self._clerk_config_template(),
                "language": "typescript"
            },
            {
                "filename": "middleware.ts",
                "content": self._clerk_middleware_template(),
                "language": "typescript"
            }
        ]

    def _handle_firebase_auth_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/lib/auth.ts",
                "content": self._firebase_auth_template(),
                "language": "typescript"
            }
        ]

    def _add_node_auth_components(self) -> List[Dict[str, str]]:
        return [
            {
                "filename": "src/controllers/auth.controller.ts",
                "content": self._node_auth_controller_template(),
                "language": "typescript"
            },
            {
                "filename": "src/middleware/auth.ts",
                "content": self._node_auth_middleware_template(),
                "language": "typescript"
            }
        ]


    def _nextauth_template(self):
        return '''
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }'''

    def _nextauth_config_template(self):
        return '''
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
  },
}'''

    def _clerk_config_template(self):
        return '''
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"]
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}'''

    def _clerk_middleware_template(self):
        return '''
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"]
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}'''

    def _firebase_auth_template(self):
        return '''
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth'
import { app } from './firebase'

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}'''
    
    def _node_auth_controller_template(self):
        return '''
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
      });

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      );

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      );

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  }
}

export const authController = new AuthController();'''


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
