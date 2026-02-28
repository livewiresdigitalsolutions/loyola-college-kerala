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

async function fetchCounselorsMySQL() {
    const connection = await mysql.createConnection(mysqlConfig);
    try {
        const [counselors] = await connection.execute(
            'SELECT id, name, specialization FROM les_counselors ORDER BY id'
        );
        const [slots] = await connection.execute(
            'SELECT id, label, value FROM les_counseling_slots ORDER BY id'
        );
        return { counselors, slots };
    } finally {
        await connection.end();
    }
}

async function fetchCounselorsSupabase() {
    const [counselorsRes, slotsRes] = await Promise.all([
        supabase.from('les_counselors').select('id, name, specialization').order('id'),
        supabase.from('les_counseling_slots').select('id, label, value').order('id'),
    ]);
    if (counselorsRes.error) throw counselorsRes.error;
    if (slotsRes.error) throw slotsRes.error;
    return { counselors: counselorsRes.data, slots: slotsRes.data };
}

export async function GET() {
    try {
        const data = isDevelopment
            ? await fetchCounselorsSupabase()
            : await fetchCounselorsMySQL();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch counselors' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, specialization, image } = body;
        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        if (isDevelopment) {
            const { data, error } = await supabase.from('les_counselors').insert({ name, specialization, image }).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute('INSERT INTO les_counselors (name, specialization, image) VALUES (?, ?, ?)', [name, specialization, image]);
            await connection.end();
            return NextResponse.json({ id: result.insertId, name, specialization, image });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create counselor', details: error.message }, { status: 500 });
    }
}
