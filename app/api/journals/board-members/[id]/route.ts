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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, role, designation, affiliation, email, phone, image, category, sort_order } = body;

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('journal_board_members')
                .update({ name, role, designation, affiliation, email, phone, image, category, sort_order })
                .eq('id', id)
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute(
                'UPDATE journal_board_members SET name=?, role=?, designation=?, affiliation=?, email=?, phone=?, image=?, category=?, sort_order=? WHERE id=?',
                [name, role || null, designation || null, affiliation || null, email || null, phone || null, image || null, category || 'board', sort_order || 0, id]
            );
            await connection.end();
            return NextResponse.json({ id, ...body });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (isDevelopment) {
            const { error } = await supabase.from('journal_board_members').delete().eq('id', id);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM journal_board_members WHERE id=?', [id]);
            await connection.end();
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete', details: error.message }, { status: 500 });
    }
}
