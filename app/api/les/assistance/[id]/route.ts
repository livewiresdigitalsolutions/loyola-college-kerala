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
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const { name, phone } = body;
        const { id } = await params;
        const idNum = parseInt(id);
        if (!name || !phone) return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
        if (isDevelopment) {
            const { data, error } = await supabase.from('les_assistance').update({ name, phone }).eq('id', idNum).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('UPDATE les_assistance SET name = ?, phone = ? WHERE id = ?', [name, phone, idNum]);
            await connection.end();
            return NextResponse.json({ id: idNum, name, phone });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update assistance contact', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);
        if (isDevelopment) {
            const { error } = await supabase.from('les_assistance').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM les_assistance WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Assistance contact deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete assistance contact', details: error.message }, { status: 500 });
    }
}
