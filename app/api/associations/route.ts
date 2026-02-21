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

// GET /api/associations — list all active associations (public)
export async function GET() {
    try {
        let data;
        if (isDevelopment) {
            const { data: rows, error } = await supabase
                .from('associations')
                .select('id, slug, name, full_name, category, department, tag_color, banner_gradient, motto, description')
                .eq('is_active', true)
                .order('sort_order');
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows] = await connection.execute(
                `SELECT id, slug, name, full_name, category, department, tag_color, banner_gradient, motto, description
                 FROM associations WHERE is_active = true ORDER BY sort_order`
            );
            data = rows;
            await connection.end();
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching associations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch associations', details: error.message },
            { status: 500 }
        );
    }
}
