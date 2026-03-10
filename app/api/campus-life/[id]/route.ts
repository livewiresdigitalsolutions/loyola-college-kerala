import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDev = process.env.DB_TYPE === 'supabase';
const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'loyola',
};
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);
        const body = await request.json();
        const { title, description, category, image_url, is_active, sort_order } = body;

        if (isDev) {
            const { data, error } = await supabase.from('campus_life_items')
                .update({ title, description, category, image_url, is_active, sort_order })
                .eq('id', idNum).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute(
                'UPDATE campus_life_items SET title=?, description=?, category=?, image_url=?, is_active=?, sort_order=? WHERE id=?',
                [title, description || null, category || null, image_url, is_active ? 1 : 0, sort_order ?? 0, idNum]
            );
            await connection.end();
            return NextResponse.json({ id: idNum, ...body });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update', details: error.message }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);

        if (isDev) {
            const { error } = await supabase.from('campus_life_items').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM campus_life_items WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete', details: error.message }, { status: 500 });
    }
}
