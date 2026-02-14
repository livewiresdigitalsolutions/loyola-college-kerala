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

export async function GET() {
    try {
        let data;
        if (isDevelopment) {
            const { data: rows, error } = await supabase
                .from('journal_issues')
                .select('*')
                .order('sort_order');
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows] = await connection.execute(
                'SELECT * FROM journal_issues ORDER BY sort_order, id DESC'
            );
            await connection.end();
            data = rows;
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching journal issues:', error);
        return NextResponse.json({ error: 'Failed to fetch issues', details: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { volume, issue, year, title, pdf_url, cover_image, is_current, sort_order } = body;

        if (!volume || !issue || !year) {
            return NextResponse.json({ error: 'Volume, issue, and year are required' }, { status: 400 });
        }

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('journal_issues')
                .insert({ volume, issue, year, title: title || null, pdf_url: pdf_url || null, cover_image: cover_image || null, is_current: is_current || false, sort_order: sort_order || 0 })
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO journal_issues (volume, issue, year, title, pdf_url, cover_image, is_current, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [volume, issue, year, title || null, pdf_url || null, cover_image || null, is_current ? 1 : 0, sort_order || 0]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, ...body });
        }
    } catch (error: any) {
        console.error('Error creating journal issue:', error);
        return NextResponse.json({ error: 'Failed to create issue', details: error.message }, { status: 500 });
    }
}
