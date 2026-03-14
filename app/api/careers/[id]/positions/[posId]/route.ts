import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';
const mysqlConfig = { host: process.env.DB_HOST || 'localhost', port: parseInt(process.env.DB_PORT || '3306'), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_DATABASE || 'loyola' };
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; posId: string }> }) {
    try {
        const { posId } = await params;
        const { discipline, count, sort_order } = await request.json();
        if (isDevelopment) {
            const { data, error } = await supabase.from('career_positions').update({ discipline, count, sort_order }).eq('id', parseInt(posId)).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('UPDATE career_positions SET discipline=?, count=?, sort_order=? WHERE id=?', [discipline, count, sort_order ?? 0, parseInt(posId)]);
            await connection.end();
            return NextResponse.json({ id: parseInt(posId), discipline, count });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update position', details: error.message }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; posId: string }> }) {
    try {
        const { posId } = await params;
        if (isDevelopment) {
            const { error } = await supabase.from('career_positions').delete().eq('id', parseInt(posId));
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM career_positions WHERE id = ?', [parseInt(posId)]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Position deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete position', details: error.message }, { status: 500 });
    }
}
