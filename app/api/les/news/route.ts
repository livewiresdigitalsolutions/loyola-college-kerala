import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';

const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'loyola',
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function computeTimeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
}

async function fetchFromMySQL() {
    const connection = await mysql.createConnection(mysqlConfig);
    try {
        const [rows] = await connection.execute(
            'SELECT id, title, created_at, content, link FROM les_news ORDER BY created_at DESC'
        );
        return rows;
    } finally {
        await connection.end();
    }
}

async function fetchFromSupabase() {
    const { data, error } = await supabase
        .from('les_news')
        .select('id, title, created_at, content, link')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function GET() {
    try {
        const data = isDevelopment
            ? await fetchFromSupabase()
            : await fetchFromMySQL();

        // Map rows to include computed timeAgo
        const mapped = (data as any[]).map((row: any) => ({
            id: row.id,
            title: row.title,
            timeAgo: row.created_at ? computeTimeAgo(row.created_at) : 'Just now',
            content: row.content,
            link: row.link,
            created_at: row.created_at,
        }));

        return NextResponse.json(mapped);
    } catch (error) {
        console.error('Error fetching LES news:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news items' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title } = body;
        if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        if (isDevelopment) {
            const { data, error } = await supabase.from('les_news').insert({ title, created_at: new Date().toISOString() }).select();
            if (error) throw error;
            return NextResponse.json({ ...data[0], timeAgo: 'Just now' });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute('INSERT INTO les_news (title, created_at) VALUES (?, NOW())', [title]);
            await connection.end();
            return NextResponse.json({ id: result.insertId, title, timeAgo: 'Just now' });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create news', details: error.message }, { status: 500 });
    }
}
