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

// GET — list activities (filter by association_id)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const associationId = searchParams.get('association_id');

        let data;
        if (isDevelopment) {
            let query = supabase
                .from('association_activities')
                .select('*')
                .order('sort_order');
            if (associationId) {
                query = query.eq('association_id', parseInt(associationId));
            }
            const { data: rows, error } = await query;
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            if (associationId) {
                const [rows] = await connection.execute(
                    'SELECT * FROM association_activities WHERE association_id = ? ORDER BY sort_order',
                    [parseInt(associationId)]
                );
                data = rows;
            } else {
                const [rows] = await connection.execute('SELECT * FROM association_activities ORDER BY sort_order');
                data = rows;
            }
            await connection.end();
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching activities:', error);
        return NextResponse.json({ error: 'Failed to fetch activities', details: error.message }, { status: 500 });
    }
}

// POST — add activity
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { association_id, title, date, location, description, type, sort_order } = body;

        if (!association_id || !title) {
            return NextResponse.json({ error: 'association_id and title are required' }, { status: 400 });
        }

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('association_activities')
                .insert({
                    association_id, title, date, location, description, type,
                    sort_order: sort_order || 0,
                })
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [association_id, title, date || null, location || null, description || null, type || null, sort_order || 0]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, ...body });
        }
    } catch (error: any) {
        console.error('Error creating activity:', error);
        return NextResponse.json({ error: 'Failed to create activity', details: error.message }, { status: 500 });
    }
}
