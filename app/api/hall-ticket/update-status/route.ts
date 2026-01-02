import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

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

async function updateStatusMySQL(email: string, status: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.execute(
      'UPDATE hall_ticket SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
      [status, email]
    );
    return { success: true };
  } catch (error) {
    console.error('MySQL Update Status Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function updateStatusSupabase(email: string, status: string) {
  try {
    const { error } = await supabase
      .from('hall_ticket')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase Update Status Error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, status } = body;

    if (!email || !status) {
      return NextResponse.json(
        { error: 'Email and status are required' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await updateStatusSupabase(email, status)
      : await updateStatusMySQL(email, status);

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { error: 'Failed to update status', details: error.message },
      { status: 500 }
    );
  }
}
