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

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchFromMySQL() {
    const connection = await mysql.createConnection(mysqlConfig);
    try {
        const [rows] = await connection.execute(
            'SELECT id, emails, phones, address, office_hours_weekdays, office_hours_saturday, office_hours_sunday FROM les_contact_info LIMIT 1'
        );
        const row = (rows as any[])[0];
        if (!row) return null;
        return {
            email: typeof row.emails === 'string' ? JSON.parse(row.emails) : row.emails,
            phone: typeof row.phones === 'string' ? JSON.parse(row.phones) : row.phones,
            address: row.address,
            officeHours: {
                weekdays: row.office_hours_weekdays,
                saturday: row.office_hours_saturday,
                sunday: row.office_hours_sunday,
            },
        };
    } finally {
        await connection.end();
    }
}

async function fetchFromSupabase() {
    const { data, error } = await supabase
        .from('les_contact_info')
        .select('*')
        .limit(1)
        .single();
    if (error) throw error;
    return {
        email: data.emails,
        phone: data.phones,
        address: data.address,
        officeHours: {
            weekdays: data.office_hours_weekdays,
            saturday: data.office_hours_saturday,
            sunday: data.office_hours_sunday,
        },
    };
}

export async function GET() {
    try {
        const data = isDevelopment
            ? await fetchFromSupabase()
            : await fetchFromMySQL();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch contact info' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { address, emails, phones, office_hours_weekdays, office_hours_saturday, office_hours_sunday } = body;
        if (isDevelopment) {
            const { data, error } = await supabase.from('les_contact_info').insert({ address, emails: JSON.stringify(emails), phones: JSON.stringify(phones), office_hours_weekdays, office_hours_saturday, office_hours_sunday }).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute('INSERT INTO les_contact_info (address, emails, phones, office_hours_weekdays, office_hours_saturday, office_hours_sunday) VALUES (?, ?, ?, ?, ?, ?)', [address, JSON.stringify(emails), JSON.stringify(phones), office_hours_weekdays, office_hours_saturday, office_hours_sunday]);
            await connection.end();
            return NextResponse.json({ id: result.insertId, address, emails, phones, office_hours_weekdays, office_hours_saturday, office_hours_sunday });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create contact info', details: error.message }, { status: 500 });
    }
}
