import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';
const mysqlConfig = { host: process.env.DB_HOST || 'localhost', port: parseInt(process.env.DB_PORT || '3306'), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_DATABASE || 'loyola' };
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; dlId: string }> }) {
    try {
        const { dlId } = await params;
        const { label, href, sort_order } = await request.json();
        if (isDevelopment) {
            const { data, error } = await supabase.from('career_downloads').update({ label, href, sort_order }).eq('id', parseInt(dlId)).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('UPDATE career_downloads SET label=?, href=?, sort_order=? WHERE id=?', [label, href, sort_order ?? 0, parseInt(dlId)]);
            await connection.end();
            return NextResponse.json({ id: parseInt(dlId), label, href });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update download', details: error.message }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; dlId: string }> }) {
    try {
        const { dlId } = await params;
        if (isDevelopment) {
            const { error } = await supabase.from('career_downloads').delete().eq('id', parseInt(dlId));
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM career_downloads WHERE id = ?', [parseInt(dlId)]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Download deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete download', details: error.message }, { status: 500 });
    }
}
