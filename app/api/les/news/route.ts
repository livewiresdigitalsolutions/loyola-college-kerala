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

async function fetchFromMySQL() {
    const connection = await mysql.createConnection(mysqlConfig);
    try {
        const [rows] = await connection.execute(
            'SELECT id, title, time_ago, content, link FROM les_news ORDER BY id DESC'
        );
        return rows;
    } finally {
        await connection.end();
    }
}

async function fetchFromSupabase() {
    const { data, error } = await supabase
        .from('les_news')
        .select('id, title, time_ago, content, link')
        .order('id', { ascending: false });
    if (error) throw error;
    return data;
}

export async function GET() {
    try {
        const data = isDevelopment
            ? await fetchFromSupabase()
            : await fetchFromMySQL();
        return NextResponse.json(data);
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
        const { title, time_ago } = body;
        if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        if (isDevelopment) {
            const { data, error } = await supabase.from('les_news').insert({ title, time_ago: time_ago || 'Just now' }).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute('INSERT INTO les_news (title, time_ago) VALUES (?, ?)', [title, time_ago || 'Just now']);
            await connection.end();
            return NextResponse.json({ id: result.insertId, title, time_ago });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create news', details: error.message }, { status: 500 });
    }
}
