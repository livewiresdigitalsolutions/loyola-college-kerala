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
            'SELECT id, name, phone FROM les_assistance ORDER BY id'
        );
        return rows;
    } finally {
        await connection.end();
    }
}

async function fetchFromSupabase() {
    const { data, error } = await supabase
        .from('les_assistance')
        .select('id, name, phone')
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
        console.error('Error fetching LES assistance contacts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch assistance contacts' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone } = body;
        if (!name || !phone) return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
        if (isDevelopment) {
            const { data, error } = await supabase.from('les_assistance').insert({ name, phone }).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute('INSERT INTO les_assistance (name, phone) VALUES (?, ?)', [name, phone]);
            await connection.end();
            return NextResponse.json({ id: result.insertId, name, phone });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create assistance contact', details: error.message }, { status: 500 });
    }
}
