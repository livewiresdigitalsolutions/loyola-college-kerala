import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';

        if (!isImage && !isPdf) {
            return NextResponse.json({ error: 'Only images and PDFs are allowed' }, { status: 400 });
        }

        // Size limits: 5MB images, 10MB PDFs
        const maxSize = isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: `File too large. Max ${isImage ? '5MB' : '10MB'}` }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = file.name.split('.').pop() || (isImage ? 'jpg' : 'pdf');
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'assets', 'journals', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const url = `/assets/journals/uploads/${fileName}`;
        return NextResponse.json({ url, fileName });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 });
    }
}
