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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name, gender, contactNumber, address, email, age,
            qualification, institutionName, institutionAddress, programme, duration
        } = body;

        if (!name || !gender || !contactNumber || !email || !programme) {
            return NextResponse.json(
                { success: false, message: 'All required fields must be filled' },
                { status: 400 }
            );
        }

        if (isDevelopment) {
            const { error } = await supabase
                .from('les_volunteer_registrations')
                .insert([{
                    name, gender, contact_number: contactNumber, address, email, age,
                    qualification, institution_name: institutionName,
                    institution_address: institutionAddress, programme, duration
                }]);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                await connection.execute(
                    `INSERT INTO les_volunteer_registrations 
           (name, gender, contact_number, address, email, age, qualification, institution_name, institution_address, programme, duration) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [name, gender, contactNumber, address || '', email, age || '', qualification || '', institutionName || '', institutionAddress || '', programme, duration || '']
                );
            } finally {
                await connection.end();
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Registration submitted successfully! We will review your application.'
        });
    } catch (error: any) {
        console.error('Error submitting volunteer registration:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to submit registration. Please try again.' },
            { status: 500 }
        );
    }
}
