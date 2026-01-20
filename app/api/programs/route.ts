import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3303'),
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
    const [programs] = await connection.execute(
      'SELECT id, discipline FROM program_level ORDER BY id'
    );
    return programs;
  } finally {
    await connection.end();
  }
}

async function fetchFromSupabase() {
  const { data, error } = await supabase
    .from('program_level')
    .select('id, discipline')
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
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { discipline } = body;

    if (!discipline) {
      return NextResponse.json(
        { error: 'Program name is required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const { data, error } = await supabase
        .from('program_level')
        .insert([{ discipline }])
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      const [result] = await connection.execute(
        'INSERT INTO program_level (discipline) VALUES (?)',
        [discipline]
      );
      await connection.end();
      return NextResponse.json({ id: (result as any).insertId, discipline });
    }
  } catch (error: any) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program', details: error.message },
      { status: 500 }
    );
  }
}
