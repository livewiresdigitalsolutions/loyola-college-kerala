import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/journal-db';

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

// GET /api/journals/articles/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const article = await getArticleById(parseInt(id));

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // If article is approved, anyone can view it
        if (article.status === 'approved') {
            return NextResponse.json(article);
        }

        // Otherwise, only the author can view it
        const user = await getUser(request);
        if (!user || user.id !== article.user_id) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        return NextResponse.json(article);
    } catch (error: any) {
        console.error('Get article error:', error);
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
    }
}

// PUT /api/journals/articles/[id] — update draft
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { id } = await params;
        const article = await getArticleById(parseInt(id));

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        if (article.user_id !== user.id) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        if (article.status !== 'draft') {
            return NextResponse.json(
                { error: 'Only draft articles can be edited' },
                { status: 400 }
            );
        }

        const { title, abstract, content, keywords, category, cover_image } = await request.json();

        const updated = await updateArticle(parseInt(id), {
            title: title || article.title,
            abstract: abstract !== undefined ? abstract : article.abstract,
            content: content || article.content,
            keywords: keywords !== undefined ? keywords : article.keywords,
            category: category !== undefined ? category : article.category,
            cover_image: cover_image !== undefined ? cover_image : article.cover_image,
        });

        return NextResponse.json({
            success: true,
            message: 'Article updated.',
            article: updated,
        });
    } catch (error: any) {
        console.error('Update article error:', error);
        return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
    }
}

// DELETE /api/journals/articles/[id] — delete draft
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { id } = await params;
        const article = await getArticleById(parseInt(id));

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        if (article.user_id !== user.id) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        if (article.status !== 'draft') {
            return NextResponse.json(
                { error: 'Only draft articles can be deleted' },
                { status: 400 }
            );
        }

        await deleteArticle(parseInt(id));

        return NextResponse.json({
            success: true,
            message: 'Article deleted.',
        });
    } catch (error: any) {
        console.error('Delete article error:', error);
        return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
    }
}
