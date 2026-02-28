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
            'SELECT id, src, alt, category FROM les_gallery ORDER BY id'
        );
        return rows;
    } finally {
        await connection.end();
    }
}

async function fetchFromSupabase() {
    const { data, error } = await supabase
        .from('les_gallery')
        .select('id, src, alt, category')
        .order('id');
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
        return NextResponse.json(
            { error: 'Failed to fetch gallery images' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { src, alt } = body;
        if (!src) return NextResponse.json({ error: 'Image src is required' }, { status: 400 });
        if (isDevelopment) {
            const { data, error } = await supabase.from('les_gallery').insert({ src, alt: alt || '' }).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute('INSERT INTO les_gallery (src, alt) VALUES (?, ?)', [src, alt || '']);
            await connection.end();
            return NextResponse.json({ id: result.insertId, src, alt });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create gallery item', details: error.message }, { status: 500 });
    }
}
