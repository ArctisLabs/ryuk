# storage_layer.py
from typing import Dict, List

class StorageLayerGenerator:
    def _generate_storage_layer(self, tech_stack: Dict[str, str]) -> List[Dict[str, str]]:
        files = []
        storage = tech_stack.get("fileStorage", "").lower()
        frontend = tech_stack.get("frontend", "").lower()

        if not storage:
            return files

        storage_handlers = {
            "uploadthing": self._handle_uploadthing_setup,
            "s3": self._handle_s3_setup,
            "cloudinary": self._handle_cloudinary_setup
        }

        if storage in storage_handlers:
            files.extend(storage_handlers[storage](frontend))

        return files

    def _handle_uploadthing_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/api/uploadthing/core.ts",
                "content": self._uploadthing_core_template(),
                "language": "typescript"
            },
            {
                "filename": "app/api/uploadthing/route.ts",
                "content": self._uploadthing_route_template(),
                "language": "typescript"
            }
        ]

    def _handle_s3_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/lib/s3.ts",
                "content": self._aws_s3_template(),
                "language": "typescript"
            },
            {
                "filename": "app/api/upload/route.ts",
                "content": self._aws_upload_route_template(),
                "language": "typescript"
            }
        ]

    def _handle_cloudinary_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/lib/cloudinary.ts",
                "content": self._cloudinary_config_template(),
                "language": "typescript"
            },
            {
                "filename": "app/api/upload/route.ts",
                "content": self._cloudinary_upload_template(),
                "language": "typescript"
            }
        ]

    def _uploadthing_core_template(self):
        return '''
import { createUploadthing, type FileRouter } from "uploadthing/next"
 
const f = createUploadthing()
 
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      return { userId: "user" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("File URL:", file.url)
    }),
} satisfies FileRouter
 
export type OurFileRouter = typeof ourFileRouter'''

    def _uploadthing_route_template(self):
        return '''
import { createNextRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"
 
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
})'''

    def _aws_s3_template(self):
        return '''
import { S3Client } from "@aws-sdk/client-s3"

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})'''

    def _aws_upload_route_template(self):
        return '''
import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from "@/lib/s3"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.name,
      Body: buffer,
      ContentType: file.type,
    })

    await s3Client.send(command)
    
    return NextResponse.json({ 
      message: "File uploaded successfully" 
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    )
  }
}'''

    def _cloudinary_config_template(self):
        return '''
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary'''

    def _cloudinary_upload_template(self):
        return '''
import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(buffer)
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    )
  }
}'''
