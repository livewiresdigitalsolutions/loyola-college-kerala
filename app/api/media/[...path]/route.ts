import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: filePathArray } = await context.params;
    
    // Define the permanent storage location outside the project root if in production,
    // or an 'uploads' folder in the project root if in development.
    // For VPS deployments, it is highly recommended to use a path like '/var/www/loyola-uploads'
    // but without knowing the exact VPS structure, we'll use an 'uploads' folder situated
    // one level above the current working directory to survive standard Next.js deployments inside the project folder.
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUploadDir = isProduction 
      ? path.join(process.cwd(), '..', 'loyola-uploads') 
      : path.join(process.cwd(), 'uploads');

    const absolutePath = path.join(baseUploadDir, ...filePathArray);

    // Security check: ensure the requested path is actually inside our upload directory
    if (!absolutePath.startsWith(baseUploadDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    if (!fs.existsSync(absolutePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    
    // Determine content type
    const ext = path.extname(absolutePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.pdf') contentType = 'application/pdf';

    // Add cache headers so browsers cache the images
    return new NextResponse(fileBuffer, {
      headers: { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });
  } catch (e) {
    console.error("Error serving media file:", e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
