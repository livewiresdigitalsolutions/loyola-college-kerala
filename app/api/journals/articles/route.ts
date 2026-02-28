import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getArticlesByUser, createArticle } from '@/lib/journal-db';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JOURNAL_JWT_SECRET || process.env.JWT_SECRET || 'loyola-journal-secret-key-min-32-characters'
);

async function getUser(request: NextRequest) {
    const token = request.cookies.get('journal_auth_token')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

// GET /api/journals/articles — list user's articles
export async function GET(request: NextRequest) {
    try {
        const user = await getUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const articles = await getArticlesByUser(user.id as number);
        return NextResponse.json(articles);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
}

// POST /api/journals/articles — create new article (draft)
export async function POST(request: NextRequest) {
    try {
        const user = await getUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { title, abstract, content, keywords, category, cover_image } = await request.json();

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const article = await createArticle({
            user_id: user.id as number,
            title,
            abstract: abstract || null,
            content,
            keywords: keywords || null,
            category: category || null,
            cover_image: cover_image || null,
        });

        return NextResponse.json({
            success: true,
            message: 'Article saved as draft.',
            article,
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }
}
