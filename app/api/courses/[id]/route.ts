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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Add Promise type
) {
  try {
    const body = await request.json();
    const { course_name, degree_id } = body;
    const { id } = await params;  // Await params here
    const idNum = parseInt(id);

    if (!course_name || !degree_id) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const { data, error } = await supabase
        .from('course')
        .update({ course_name, degree_id })
        .eq('id', idNum)
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      await connection.execute(
        'UPDATE course SET course_name = ?, degree_id = ? WHERE id = ?',
        [course_name, degree_id, idNum]
      );
      await connection.end();
      return NextResponse.json({ id: idNum, course_name, degree_id });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update course', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Add Promise type
) {
  try {
    const { id } = await params;  // Await params here
    const idNum = parseInt(id);

    if (isDevelopment) {
      const { error } = await supabase
        .from('course')
        .delete()
        .eq('id', idNum);

      if (error) throw error;
      return NextResponse.json({ message: 'Course deleted successfully' });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      await connection.execute('DELETE FROM course WHERE id = ?', [idNum]);
      await connection.end();
      return NextResponse.json({ message: 'Course deleted successfully' });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete course', details: error.message },
      { status: 500 }
    );
  }
}
