import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getArticleById, updateArticle } from '@/lib/journal-db';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JOURNAL_JWT_SECRET || process.env.JWT_SECRET || 'loyola-journal-secret-key-min-32-characters'
);

// POST /api/journals/articles/[id]/submit — submit for review
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get('journal_auth_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const { id } = await params;
        const article = await getArticleById(parseInt(id));

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        if (article.user_id !== payload.id) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        if (article.status !== 'draft') {
            return NextResponse.json(
                { error: 'Only draft articles can be submitted for review' },
                { status: 400 }
            );
        }

        await updateArticle(parseInt(id), {
            status: 'submitted',
            submitted_at: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: 'Article submitted for review. You will be notified once it is reviewed.',
        });
    } catch (error: any) {
        console.error('Submit article error:', error);
        return NextResponse.json({ error: 'Failed to submit article' }, { status: 500 });
    }
}
