import { NextRequest, NextResponse } from 'next/server';
import { getArticleById, updateArticle } from '@/lib/journal-db';

// POST /api/journals/articles/[id]/review — admin approve/reject
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Admin auth check (uses sys-ops session from sessionStorage — validated server-side via header)
        const adminUser = request.headers.get('x-admin-user');
        if (!adminUser) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { id } = await params;
        const { action, remarks } = await request.json();

        if (!action || !['approve', 'reject'].includes(action)) {
            return NextResponse.json(
                { error: 'Action must be either "approve" or "reject"' },
                { status: 400 }
            );
        }

        const article = await getArticleById(parseInt(id));

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        if (article.status !== 'submitted' && article.status !== 'under_review') {
            return NextResponse.json(
                { error: 'Only submitted articles can be reviewed' },
                { status: 400 }
            );
        }

        const updateData: Record<string, any> = {
            status: action === 'approve' ? 'approved' : 'rejected',
            admin_remarks: remarks || null,
            reviewed_at: new Date(),
            reviewed_by: adminUser,
        };

        if (action === 'approve') {
            updateData.published_at = new Date();
        }

        await updateArticle(parseInt(id), updateData);

        return NextResponse.json({
            success: true,
            message: `Article ${action === 'approve' ? 'approved and published' : 'rejected'} successfully.`,
        });
    } catch (error: any) {
        console.error('Review article error:', error);
        return NextResponse.json({ error: 'Failed to review article' }, { status: 500 });
    }
}
