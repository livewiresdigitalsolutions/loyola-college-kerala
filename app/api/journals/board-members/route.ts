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
                .from('journal_board_members')
                .select('*')
                .order('sort_order');
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows] = await connection.execute(
                'SELECT * FROM journal_board_members ORDER BY sort_order, id'
            );
            await connection.end();
            data = rows;
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching board members:', error);
        return NextResponse.json({ error: 'Failed to fetch board members', details: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, designation, affiliation, email, phone, image, category, sort_order } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('journal_board_members')
                .insert({ name, role: role || null, designation: designation || null, affiliation: affiliation || null, email: email || null, phone: phone || null, image: image || null, category: category || 'board', sort_order: sort_order || 0 })
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO journal_board_members (name, role, designation, affiliation, email, phone, image, category, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [name, role || null, designation || null, affiliation || null, email || null, phone || null, image || null, category || 'board', sort_order || 0]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, ...body });
        }
    } catch (error: any) {
        console.error('Error creating board member:', error);
        return NextResponse.json({ error: 'Failed to create board member', details: error.message }, { status: 500 });
    }
}
