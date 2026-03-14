import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';
const mysqlConfig = { host: process.env.DB_HOST || 'localhost', port: parseInt(process.env.DB_PORT || '3306'), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_DATABASE || 'loyola' };
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; reqId: string }> }) {
    try {
        const { reqId } = await params;
        const { text, sort_order } = await request.json();
        if (isDevelopment) {
            const { data, error } = await supabase.from('career_requirements').update({ text, sort_order }).eq('id', parseInt(reqId)).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('UPDATE career_requirements SET text=?, sort_order=? WHERE id=?', [text, sort_order ?? 0, parseInt(reqId)]);
            await connection.end();
            return NextResponse.json({ id: parseInt(reqId), text });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update requirement', details: error.message }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; reqId: string }> }) {
    try {
        const { reqId } = await params;
        if (isDevelopment) {
            const { error } = await supabase.from('career_requirements').delete().eq('id', parseInt(reqId));
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM career_requirements WHERE id = ?', [parseInt(reqId)]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Requirement deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete requirement', details: error.message }, { status: 500 });
    }
}
