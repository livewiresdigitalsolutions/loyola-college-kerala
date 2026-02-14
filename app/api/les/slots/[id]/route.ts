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
        const { label, value } = body;
        const { id } = await params;
        const idNum = parseInt(id);
        if (!label) return NextResponse.json({ error: 'Label is required' }, { status: 400 });

        if (isDevelopment) {
            const { data, error } = await supabase.from('les_counseling_slots').update({ label, value }).eq('id', idNum).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('UPDATE les_counseling_slots SET label = ?, value = ? WHERE id = ?', [label, value, idNum]);
            await connection.end();
            return NextResponse.json({ id: idNum, label, value });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update slot', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);
        if (isDevelopment) {
            const { error } = await supabase.from('les_counseling_slots').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM les_counseling_slots WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Slot deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete slot', details: error.message }, { status: 500 });
    }
}
