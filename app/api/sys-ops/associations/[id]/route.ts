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

// PUT — update association
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        const idNum = parseInt(id);
        const { name, full_name, category, department, motto, description, about_paragraphs, contact_email, contact_phone, address, bg_image, is_active, sort_order } = body;

        if (!name || !full_name) {
            return NextResponse.json({ error: 'name and full_name are required' }, { status: 400 });
        }

        const slug = generateSlug(name);

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('associations')
                .update({
                    slug, name, full_name, category, department,
                    motto, description,
                    about_paragraphs: about_paragraphs || [],
                    contact_email, contact_phone, address, bg_image, is_active, sort_order,
                })
                .eq('id', idNum)
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute(
                `UPDATE associations SET slug=?, name=?, full_name=?, category=?, department=?,
                 motto=?, description=?, about_paragraphs=?, contact_email=?, contact_phone=?,
                 address=?, bg_image=?, is_active=?, sort_order=? WHERE id=?`,
                [slug, name, full_name, category, department, motto, description,
                    JSON.stringify(about_paragraphs || []), contact_email, contact_phone, address,
                    bg_image || null, is_active, sort_order, idNum]
            );
            await connection.end();
            return NextResponse.json({ id: idNum, slug, ...body });
        }
    } catch (error: any) {
        console.error('Error updating association:', error);
        return NextResponse.json({ error: 'Failed to update association', details: error.message }, { status: 500 });
    }
}

// DELETE — delete association
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);

        if (isDevelopment) {
            const { error } = await supabase.from('associations').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM associations WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Association deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting association:', error);
        return NextResponse.json({ error: 'Failed to delete association', details: error.message }, { status: 500 });
    }
}
