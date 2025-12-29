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

async function fetchFromMySQL(degreeId?: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const query = degreeId
      ? 'SELECT id, course_name, degree_id FROM course WHERE degree_id = ? ORDER BY id'
      : 'SELECT id, course_name, degree_id FROM course ORDER BY id';
    
    const params = degreeId ? [degreeId] : [];
    const [courses] = await connection.execute(query, params);
    return courses;
  } finally {
    await connection.end();
  }
}

async function fetchFromSupabase(degreeId?: string) {
  let query = supabase
    .from('course')
    .select('id, course_name, degree_id')
    .order('id');
  
  if (degreeId) {
    query = query.eq('degree_id', degreeId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const degreeId = searchParams.get('degree_id');
    
    const data = isDevelopment
      ? await fetchFromSupabase(degreeId || undefined)
      : await fetchFromMySQL(degreeId || undefined);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { course_name, degree_id } = body;

    if (!course_name || !degree_id) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const { data, error } = await supabase
        .from('course')
        .insert([{ course_name, degree_id }])
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      const [result] = await connection.execute(
        'INSERT INTO course (course_name, degree_id) VALUES (?, ?)',
        [course_name, degree_id]
      );
      await connection.end();
      return NextResponse.json({ 
        id: (result as any).insertId, 
        course_name, 
        degree_id 
      });
    }
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course', details: error.message },
      { status: 500 }
    );
  }
}
