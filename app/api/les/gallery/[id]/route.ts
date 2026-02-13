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
        const { src, alt } = body;
        const { id } = await params;
        const idNum = parseInt(id);
        if (!src) return NextResponse.json({ error: 'Image src is required' }, { status: 400 });
        if (isDevelopment) {
            const { data, error } = await supabase.from('les_gallery').update({ src, alt }).eq('id', idNum).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('UPDATE les_gallery SET src = ?, alt = ? WHERE id = ?', [src, alt, idNum]);
            await connection.end();
            return NextResponse.json({ id: idNum, src, alt });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update gallery', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);
        if (isDevelopment) {
            const { error } = await supabase.from('les_gallery').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM les_gallery WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Gallery item deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete gallery item', details: error.message }, { status: 500 });
    }
}
