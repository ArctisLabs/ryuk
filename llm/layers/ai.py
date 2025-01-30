# ai_layer.py
from typing import Dict, List

class AILayerGenerator:
    def _generate_ai_layer(self, tech_stack: Dict[str, str]) -> List[Dict[str, str]]:
        files = []
        ai = tech_stack.get("ai", "").lower()
        frontend = tech_stack.get("frontend", "").lower()

        if not ai:
            return files

        ai_handlers = {
            "openai": self._handle_openai_setup,
            "anthropic": self._handle_anthropic_setup,
            "gemini": self._handle_gemini_setup
        }

        if ai in ai_handlers:
            files.extend(ai_handlers[ai](frontend))

        return files

    def _handle_openai_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/lib/openai.ts",
                "content": self._openai_config_template(),
                "language": "typescript"
            },
            {
                "filename": "app/api/chat/route.ts",
                "content": self._openai_chat_template(),
                "language": "typescript"
            }
        ]

    def _handle_anthropic_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/lib/anthropic.ts",
                "content": self._anthropic_config_template(),
                "language": "typescript"
            },
            {
                "filename": "app/api/chat/route.ts",
                "content": self._anthropic_chat_template(),
                "language": "typescript"
            }
        ]

    def _handle_gemini_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/lib/gemini.ts",
                "content": self._gemini_config_template(),
                "language": "typescript"
            },
            {
                "filename": "app/api/chat/route.ts",
                "content": self._gemini_chat_template(),
                "language": "typescript"
            }
        ]

    def _openai_config_template(self):
        return '''
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})'''

    def _openai_chat_template(self):
        return '''
import { NextResponse } from "next/server"
import { openai } from "@/lib/openai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })
    
    return NextResponse.json(response.choices[0].message)
  } catch (error) {
    console.error('Error in AI route:', error)
    return NextResponse.json(
      { error: 'Error processing AI request' },
      { status: 500 }
    )
  }
}'''

    def _anthropic_config_template(self):
        return '''
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})'''

    def _anthropic_chat_template(self):
        return '''
import { NextResponse } from "next/server"
import { anthropic } from "@/lib/anthropic"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages,
    })
    
    return NextResponse.json(response.content[0])
  } catch (error) {
    console.error('Error in AI route:', error)
    return NextResponse.json(
      { error: 'Error processing AI request' },
      { status: 500 }
    )
  }
}'''

    def _gemini_config_template(self):
        return '''
import { GoogleGenerativeAI } from '@google/generative-ai'

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
export const model = genAI.getGenerativeModel({ model: 'gemini-pro' })'''

    def _gemini_chat_template(self):
        return '''
import { NextResponse } from "next/server"
import { model } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    const chat = model.startChat({
      history: messages,
    })
    
    const result = await chat.sendMessage(messages[messages.length - 1].content)
    const response = await result.response
    
    return NextResponse.json({ content: response.text() })
  } catch (error) {
    console.error('Error in AI route:', error)
    return NextResponse.json(
      { error: 'Error processing AI request' },
      { status: 500 }
    )
  }
}'''