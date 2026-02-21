import { NextRequest, NextResponse } from 'next/server';
import { getPublicArticles } from '@/lib/journal-db';

// GET /api/journals/articles/public — get top published articles (no auth)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '3');

        const articles = await getPublicArticles(Math.min(limit, 10));

        return NextResponse.json(articles);
    } catch (error: any) {
        console.error('Get public articles error:', error);
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
}
