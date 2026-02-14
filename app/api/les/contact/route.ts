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

export async function GET() {
    try {
        if (isDevelopment) {
            const { data, error } = await supabase
                .from('les_contact_submissions')
                .select('*')
                .order('id', { ascending: false });
            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows] = await connection.execute('SELECT * FROM les_contact_submissions ORDER BY id DESC');
            await connection.end();
            return NextResponse.json(rows);
        }
    } catch (error) {
        console.error('Error fetching contact submissions:', error);
        return NextResponse.json({ error: 'Failed to fetch contact submissions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, subject, message } = body;

        if (!firstName || !lastName || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, message: 'All required fields must be filled' },
                { status: 400 }
            );
        }

        if (isDevelopment) {
            const { error } = await supabase
                .from('les_contact_submissions')
                .insert([{
                    first_name: firstName, last_name: lastName,
                    email, phone, subject, message
                }]);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                await connection.execute(
                    `INSERT INTO les_contact_submissions 
           (first_name, last_name, email, phone, subject, message) 
           VALUES (?, ?, ?, ?, ?, ?)`,
                    [firstName, lastName, email, phone || '', subject, message]
                );
            } finally {
                await connection.end();
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.'
        });
    } catch (error: any) {
        console.error('Error submitting contact form:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send message. Please try again.' },
            { status: 500 }
        );
    }
}
