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
                .from('academic_committees')
                .select('*')
                .order('sort_order');
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows] = await connection.execute(
                'SELECT * FROM academic_committees ORDER BY sort_order, id'
            );
            await connection.end();
            data = rows;
        }
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch committees', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, type, sort_order } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('academic_committees')
                .insert({ name, description: description || null, type: type || null, sort_order: sort_order || 0 })
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO academic_committees (name, description, type, sort_order) VALUES (?, ?, ?, ?)',
                [name, description || null, type || null, sort_order || 0]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, name, description, type, sort_order });
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to create committee', details: error.message },
            { status: 500 }
        );
    }
}
