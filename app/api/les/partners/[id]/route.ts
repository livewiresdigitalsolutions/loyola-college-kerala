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
        const { name, location, logo } = body;
        const { id } = await params;
        const idNum = parseInt(id);
        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        if (isDevelopment) {
            const { data, error } = await supabase.from('les_partners').update({ name, location, logo }).eq('id', idNum).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('UPDATE les_partners SET name = ?, location = ?, logo = ? WHERE id = ?', [name, location, logo, idNum]);
            await connection.end();
            return NextResponse.json({ id: idNum, name, location, logo });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update partner', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);
        if (isDevelopment) {
            const { error } = await supabase.from('les_partners').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM les_partners WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Partner deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete partner', details: error.message }, { status: 500 });
    }
}
