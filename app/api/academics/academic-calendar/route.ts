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
                .from('academic_calendar')
                .select('*')
                .order('published_date', { ascending: false });
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows] = await connection.execute(
                'SELECT * FROM academic_calendar ORDER BY published_date DESC, id DESC'
            );
            await connection.end();
            data = rows;
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching academic calendar:', error);
        return NextResponse.json(
            { error: 'Failed to fetch academic calendar', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { academic_year, title, description, pdf_url, published_date } = body;

        if (!title || !academic_year) {
            return NextResponse.json({ error: 'Title and academic year are required' }, { status: 400 });
        }

        const record = {
            academic_year,
            title,
            description: description || null,
            pdf_url: pdf_url || null,
            published_date: published_date || new Date().toISOString().split('T')[0],
        };

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('academic_calendar')
                .insert(record)
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO academic_calendar (academic_year, title, description, pdf_url, published_date) VALUES (?, ?, ?, ?, ?)',
                [record.academic_year, record.title, record.description, record.pdf_url, record.published_date]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, ...record });
        }
    } catch (error: any) {
        console.error('Error creating academic calendar item:', error);
        return NextResponse.json(
            { error: 'Failed to create academic calendar item', details: error.message },
            { status: 500 }
        );
    }
}
