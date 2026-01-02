import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { RowDataPacket } from 'mysql2';

const isDevelopment = process.env.DB_TYPE === 'supabase';

const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3303'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'loyola',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HallTicketRow extends RowDataPacket {
  [key: string]: any;
}

// MySQL function
async function getHallTicketByEmailMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [rows] = await connection.execute<HallTicketRow[]>(
      'SELECT * FROM hall_ticket WHERE email = ?',
      [email]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('MySQL Get Hall Ticket By Email Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Supabase function
async function getHallTicketByEmailSupabase(email: string) {
  try {
    const { data, error } = await supabase
      .from('hall_ticket')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Supabase Get Hall Ticket By Email Error:', error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const data = isDevelopment
      ? await getHallTicketByEmailSupabase(email)
      : await getHallTicketByEmailMySQL(email);

    if (!data) {
      return NextResponse.json(
        { error: 'Hall ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching hall ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hall ticket', details: error.message },
      { status: 500 }
    );
  }
}
