import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDev = process.env.DB_TYPE === 'supabase';
const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'loyola',
};
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all') === '1';

        if (isDev) {
            let q = supabase.from('campus_life_items').select('*').order('sort_order', { ascending: true });
            if (!all) q = q.eq('is_active', true);
            const { data, error } = await q;
            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const sql = all
                ? 'SELECT * FROM campus_life_items ORDER BY sort_order ASC'
                : 'SELECT * FROM campus_life_items WHERE is_active = 1 ORDER BY sort_order ASC';
            const [rows] = await connection.execute(sql);
            await connection.end();
            return NextResponse.json(rows);
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch', details: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, category, image_url, sort_order = 0 } = await request.json();
        if (!title || !image_url) return NextResponse.json({ error: 'title and image_url are required' }, { status: 400 });

        if (isDev) {
            const { data, error } = await supabase.from('campus_life_items')
                .insert({ title, description, category, image_url, is_active: true, sort_order })
                .select();
            if (error) throw error;
            return NextResponse.json(data[0], { status: 201 });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO campus_life_items (title, description, category, image_url, is_active, sort_order) VALUES (?,?,?,?,1,?)',
                [title, description || null, category || null, image_url, sort_order]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, title, image_url }, { status: 201 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create', details: error.message }, { status: 500 });
    }
}
