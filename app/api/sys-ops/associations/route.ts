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

// Auto-generate slug from name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// GET — list all associations (admin, including inactive)
export async function GET() {
    try {
        let data;
        if (isDevelopment) {
            const { data: rows, error } = await supabase
                .from('associations')
                .select('*')
                .order('sort_order');
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows] = await connection.execute('SELECT * FROM associations ORDER BY sort_order');
            data = rows;
            await connection.end();
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching associations (admin):', error);
        return NextResponse.json({ error: 'Failed to fetch associations', details: error.message }, { status: 500 });
    }
}

// POST — create new association
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, full_name, category, department, motto, description, about_paragraphs, contact_email, contact_phone, address, bg_image, is_active, sort_order } = body;

        if (!name || !full_name) {
            return NextResponse.json({ error: 'name and full_name are required' }, { status: 400 });
        }

        const slug = generateSlug(name);

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('associations')
                .insert({
                    slug, name, full_name, category, department,
                    tag_color: '#059669',
                    banner_gradient: 'from-emerald-700 via-green-800 to-teal-900',
                    motto, description,
                    about_paragraphs: about_paragraphs || [],
                    contact_email, contact_phone, address, bg_image,
                    is_active: is_active !== false,
                    sort_order: sort_order || 0,
                })
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                `INSERT INTO associations (slug, name, full_name, category, department, tag_color, banner_gradient, motto, description, about_paragraphs, contact_email, contact_phone, address, bg_image, is_active, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [slug, name, full_name, category || null, department || null, '#059669',
                    'from-emerald-700 via-green-800 to-teal-900', motto || null,
                    description || null, JSON.stringify(about_paragraphs || []),
                    contact_email || null, contact_phone || null, address || null,
                    bg_image || null, is_active !== false, sort_order || 0]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, slug, ...body });
        }
    } catch (error: any) {
        console.error('Error creating association:', error);
        return NextResponse.json({ error: 'Failed to create association', details: error.message }, { status: 500 });
    }
}
