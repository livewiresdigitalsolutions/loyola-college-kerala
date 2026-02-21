import { NextRequest, NextResponse } from 'next/server';
import { getAllArticlesAdmin, getAllUsersAdmin } from '@/lib/journal-db';

// GET /api/journals/admin/articles — admin get all articles
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'articles';
        const status = searchParams.get('status') || 'all';

        if (type === 'users') {
            const users = await getAllUsersAdmin();
            return NextResponse.json(users);
        }

        const articles = await getAllArticlesAdmin(status);
        return NextResponse.json(articles);
    } catch (error: any) {
        console.error('Admin fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
