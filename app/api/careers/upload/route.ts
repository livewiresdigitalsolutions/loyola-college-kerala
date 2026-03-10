import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Files saved to public/assets/careers/downloads/ and served as /assets/careers/downloads/<filename>
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'assets', 'careers', 'downloads');

const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
];

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Unsupported file type. Allowed: PDF, PNG, JPG, WebP, DOC, DOCX, XLS, XLSX, TXT' },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10 MB' },
                { status: 400 }
            );
        }

        // Ensure the upload directory exists
        await mkdir(UPLOAD_DIR, { recursive: true });

        // Build a safe unique filename
        const ext = path.extname(file.name) || '.bin';
        const baseName = file.name
            .replace(ext, '')
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .substring(0, 60);
        const filename = `${Date.now()}-${baseName}${ext}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Write to disk
        const bytes = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(bytes));

        const url = `/assets/careers/downloads/${filename}`;
        return NextResponse.json({ url, filename, originalName: file.name });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Upload failed', details: error.message },
            { status: 500 }
        );
    }
}
