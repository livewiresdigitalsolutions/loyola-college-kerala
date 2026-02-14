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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);
        if (isDevelopment) {
            const { error } = await supabase.from('les_appointments').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM les_appointments WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Appointment deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete appointment', details: error.message }, { status: 500 });
    }
}
