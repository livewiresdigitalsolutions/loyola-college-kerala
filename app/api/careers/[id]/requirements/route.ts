import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';
const mysqlConfig = { host: process.env.DB_HOST || 'localhost', port: parseInt(process.env.DB_PORT || '3306'), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_DATABASE || 'loyola' };
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (isDevelopment) {
            const { data, error } = await supabase.from('career_requirements').select('*').eq('opening_id', parseInt(id)).order('sort_order');
            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows]: any = await connection.execute('SELECT * FROM career_requirements WHERE opening_id = ? ORDER BY sort_order', [parseInt(id)]);
            await connection.end();
            return NextResponse.json(rows);
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch requirements', details: error.message }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { text, sort_order = 0 } = await request.json();
        if (!text) return NextResponse.json({ error: 'text is required' }, { status: 400 });
        if (isDevelopment) {
            const { data, error } = await supabase.from('career_requirements').insert({ opening_id: parseInt(id), text, sort_order }).select();
            if (error) throw error;
            return NextResponse.json(data[0], { status: 201 });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute('INSERT INTO career_requirements (opening_id, text, sort_order) VALUES (?,?,?)', [parseInt(id), text, sort_order]);
            await connection.end();
            return NextResponse.json({ id: result.insertId, text }, { status: 201 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create requirement', details: error.message }, { status: 500 });
    }
}
