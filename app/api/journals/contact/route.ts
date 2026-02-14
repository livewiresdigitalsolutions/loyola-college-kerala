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

// GET: List all contact submissions
export async function GET() {
    try {
        let data;
        if (isDevelopment) {
            const { data: rows, error } = await supabase
                .from('journal_contacts')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows] = await connection.execute(
                'SELECT * FROM journal_contacts ORDER BY created_at DESC'
            );
            await connection.end();
            data = rows;
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json({ error: 'Failed to fetch contacts', details: error.message }, { status: 500 });
    }
}

// POST: Submit a new contact message
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
        }

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('journal_contacts')
                .insert({ name, email, phone: phone || null, message })
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO journal_contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
                [name, email, phone || null, message]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, name, email, phone, message });
        }
    } catch (error: any) {
        console.error('Error saving contact:', error);
        return NextResponse.json({ error: 'Failed to save message', details: error.message }, { status: 500 });
    }
}
