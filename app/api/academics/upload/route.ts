import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'assets', 'academics', 'uploads');

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type (images + PDFs)
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
            'application/pdf',
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG, PDF' },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB for PDFs, 5MB for images)
        const MAX_SIZE = file.type === 'application/pdf' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: `File too large. Maximum size is ${file.type === 'application/pdf' ? '10MB' : '5MB'}` },
                { status: 400 }
            );
        }

        // Ensure upload directory exists
        await mkdir(UPLOAD_DIR, { recursive: true });

        // Generate unique filename
        const ext = path.extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.png');
        const safeName = file.name
            .replace(ext, '')
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .substring(0, 50);
        const filename = `${Date.now()}-${safeName}${ext}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Write file to disk
        const bytes = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(bytes));

        // Return the public URL path
        const url = `/assets/academics/uploads/${filename}`;

        return NextResponse.json({ url, filename });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to upload file', details: error.message },
            { status: 500 }
        );
    }
}
