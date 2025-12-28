// app/api/exam-centers/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';

// MySQL connection config
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3303'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'loyola',
};

// Supabase config
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchFromMySQL() {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const [centers] = await connection.execute(
      'SELECT id, centre_name FROM exam_centers ORDER BY id'
    );
    return centers;
  } finally {
    await connection.end();
  }
}

async function fetchFromSupabase() {
  const { data, error } = await supabase
    .from('exam_centers')
    .select('id, centre_name')
    .order('id');
  
  if (error) throw error;
  return data;
}

export async function GET() {
  try {
    const data = isDevelopment 
      ? await fetchFromSupabase()
      : await fetchFromMySQL();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching exam centers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam centers' },
      { status: 500 }
    );
  }
}
