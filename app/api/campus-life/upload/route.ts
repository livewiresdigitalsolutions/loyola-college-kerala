import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'assets', 'campus-life');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        if (!ALLOWED_TYPES.includes(file.type))
            return NextResponse.json({ error: 'Only JPG, PNG, WebP, GIF allowed' }, { status: 400 });
        if (file.size > MAX_SIZE)
            return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 });

        await mkdir(UPLOAD_DIR, { recursive: true });

        const ext = path.extname(file.name) || '.jpg';
        const base = file.name.replace(ext, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 60);
        const filename = `${Date.now()}-${base}${ext}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        await writeFile(filepath, Buffer.from(await file.arrayBuffer()));

        return NextResponse.json({ url: `/assets/campus-life/${filename}`, filename, originalName: file.name });
    } catch (error: any) {
        return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 });
    }
}
