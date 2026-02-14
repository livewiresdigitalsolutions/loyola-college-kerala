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
        const { title, time_ago } = body;
        const { id } = await params;
        const idNum = parseInt(id);
        if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

        if (isDevelopment) {
            const { data, error } = await supabase.from('les_news').update({ title, time_ago }).eq('id', idNum).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('UPDATE les_news SET title = ?, time_ago = ? WHERE id = ?', [title, time_ago, idNum]);
            await connection.end();
            return NextResponse.json({ id: idNum, title, time_ago });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update news', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);
        if (isDevelopment) {
            const { error } = await supabase.from('les_news').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM les_news WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'News deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete news', details: error.message }, { status: 500 });
    }
}
