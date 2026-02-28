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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const committeeId = searchParams.get('committee_id');

        let data;
        if (isDevelopment) {
            let query = supabase
                .from('academic_committee_members')
                .select('*')
                .order('sort_order');
            if (committeeId) {
                query = query.eq('committee_id', parseInt(committeeId));
            }
            const { data: rows, error } = await query;
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            if (committeeId) {
                const [rows] = await connection.execute(
                    'SELECT * FROM academic_committee_members WHERE committee_id = ? ORDER BY sort_order, id',
                    [parseInt(committeeId)]
                );
                data = rows;
            } else {
                const [rows] = await connection.execute(
                    'SELECT * FROM academic_committee_members ORDER BY sort_order, id'
                );
                data = rows;
            }
            await connection.end();
        }
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch committee members', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { committee_id, name, designation, image, sort_order } = body;

        if (!name || !committee_id) {
            return NextResponse.json({ error: 'Name and committee_id are required' }, { status: 400 });
        }

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('academic_committee_members')
                .insert({
                    committee_id,
                    name,
                    designation: designation || null,
                    image: image || '/assets/defaultprofile.png',
                    sort_order: sort_order || 0,
                })
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO academic_committee_members (committee_id, name, designation, image, sort_order) VALUES (?, ?, ?, ?, ?)',
                [committee_id, name, designation || null, image || '/assets/defaultprofile.png', sort_order || 0]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, committee_id, name, designation, image, sort_order });
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to create committee member', details: error.message },
            { status: 500 }
        );
    }
}
