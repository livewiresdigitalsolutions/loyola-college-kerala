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
        const { address, emails, phones, office_hours_weekdays, office_hours_saturday, office_hours_sunday } = body;
        const { id } = await params;
        const idNum = parseInt(id);
        if (isDevelopment) {
            const { data, error } = await supabase.from('les_contact_info').update({ address, emails: JSON.stringify(emails), phones: JSON.stringify(phones), office_hours_weekdays, office_hours_saturday, office_hours_sunday }).eq('id', idNum).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('UPDATE les_contact_info SET address = ?, emails = ?, phones = ?, office_hours_weekdays = ?, office_hours_saturday = ?, office_hours_sunday = ? WHERE id = ?', [address, JSON.stringify(emails), JSON.stringify(phones), office_hours_weekdays, office_hours_saturday, office_hours_sunday, idNum]);
            await connection.end();
            return NextResponse.json({ id: idNum, address, emails, phones, office_hours_weekdays, office_hours_saturday, office_hours_sunday });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update contact info', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);
        if (isDevelopment) {
            const { error } = await supabase.from('les_contact_info').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM les_contact_info WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Contact info deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete contact info', details: error.message }, { status: 500 });
    }
}
