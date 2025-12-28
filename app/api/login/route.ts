// app/api/login/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

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

async function loginWithMySQL(email: string, password: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const [rows] = await connection.execute(
      'SELECT email, password_hash FROM user_credentials WHERE email = ?',
      [email]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return { success: false, error: 'Invalid email or password' };
    }

    const user = rows[0] as { email: string; password_hash: string };
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return { success: false, error: 'Invalid email or password' };
    }

    return { success: true, email: user.email };
  } finally {
    await connection.end();
  }
}

async function loginWithSupabase(email: string, password: string) {
  const { data: user, error } = await supabase
    .from('user_credentials')
    .select('email, password_hash')
    .eq('email', email)
    .single();

  if (error || !user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    return { success: false, error: 'Invalid email or password' };
  }

  return { success: true, email: user.email };
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await loginWithSupabase(email, password)
      : await loginWithMySQL(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful!',
      email: result.email,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
