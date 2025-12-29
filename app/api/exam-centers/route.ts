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

async function fetchFromMySQL() {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const [centers] = await connection.execute(
      'SELECT id, centre_name, location FROM exam_centers ORDER BY id'
    );
    return centers;
  } finally {
    await connection.end();
  }
}

async function fetchFromSupabase() {
  const { data, error } = await supabase
    .from('exam_centers')
    .select('id, centre_name, location')
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { centre_name, location } = body;

    if (!centre_name) {
      return NextResponse.json(
        { error: 'Center name is required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      // Supabase insert
      const { data, error } = await supabase
        .from('exam_centers')
        .insert([{ 
          centre_name, 
          location: location || null 
        }])
        .select('id, centre_name, location');

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      // MySQL insert
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        const [result] = await connection.execute(
          'INSERT INTO exam_centers (centre_name, location) VALUES (?, ?)',
          [centre_name, location || null]
        );
        const insertId = (result as any).insertId;
        return NextResponse.json({ 
          id: insertId, 
          centre_name, 
          location: location || null
        });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    console.error('Error creating exam center:', error);
    return NextResponse.json(
      { error: 'Failed to create exam center', details: error.message },
      { status: 500 }
    );
  }
}
