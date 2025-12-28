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

interface AdminUserRow extends RowDataPacket {
  id: number;
  username: string;
  role: string;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
}

async function getAdminUsersMySQL() {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const [rows] = await connection.execute<AdminUserRow[]>(
      'SELECT id, username, role, created_at, last_login, is_active FROM admin_users ORDER BY created_at DESC'
    );

    return rows;
  } catch (error) {
    console.error('MySQL Get Admin Users Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getAdminUsersSupabase() {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, username, role, created_at, last_login, is_active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Supabase Get Admin Users Error:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const admins = isDevelopment
      ? await getAdminUsersSupabase()
      : await getAdminUsersMySQL();

    return NextResponse.json({
      success: true,
      admins,
    });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin users', details: error.message },
      { status: 500 }
    );
  }
}
