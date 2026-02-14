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
            name, gender, address, mobileNo, email, age,
            counselingDate, counselingStaff, counselingSlot, message
        } = body;

        if (!name || !gender || !mobileNo || !email || !counselingDate || !counselingStaff || !counselingSlot) {
            return NextResponse.json(
                { success: false, message: 'All required fields must be filled' },
                { status: 400 }
            );
        }

        if (isDevelopment) {
            const { error } = await supabase
                .from('les_appointments')
                .insert([{
                    name, gender, address, mobile_no: mobileNo, email, age,
                    counseling_date: counselingDate, counseling_staff: counselingStaff,
                    counseling_slot: counselingSlot, message
                }]);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                await connection.execute(
                    `INSERT INTO les_appointments 
           (name, gender, address, mobile_no, email, age, counseling_date, counseling_staff, counseling_slot, message) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [name, gender, address || '', mobileNo, email, age || '', counselingDate, counselingStaff, counselingSlot, message || '']
                );
            } finally {
                await connection.end();
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Appointment booked successfully! We will contact you soon.'
        });
    } catch (error: any) {
        console.error('Error submitting appointment:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to book appointment. Please try again.' },
            { status: 500 }
        );
    }
}
