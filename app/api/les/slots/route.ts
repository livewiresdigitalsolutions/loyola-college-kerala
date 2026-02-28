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
        if (isDevelopment) {
            const { data, error } = await supabase
                .from('les_counseling_slots')
                .select('id, label, value')
                .order('id');
            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows] = await connection.execute('SELECT id, label, value FROM les_counseling_slots ORDER BY id');
            await connection.end();
            return NextResponse.json(rows);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { label, value } = body;
        if (!label) return NextResponse.json({ error: 'Label is required' }, { status: 400 });

        if (isDevelopment) {
            const { data, error } = await supabase.from('les_counseling_slots').insert({ label, value: value || label }).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO les_counseling_slots (label, value) VALUES (?, ?)',
                [label, value || label]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, label, value: value || label });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create slot', details: error.message }, { status: 500 });
    }
}
