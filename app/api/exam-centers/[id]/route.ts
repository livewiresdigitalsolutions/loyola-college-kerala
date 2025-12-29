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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { centre_name, location } = body;
    const { id } = await params;
    const idNum = parseInt(id);

    if (!centre_name) {
      return NextResponse.json(
        { error: 'Center name is required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      // Supabase update
      const { data, error } = await supabase
        .from('exam_centers')
        .update({ 
          centre_name, 
          location: location || null 
        })
        .eq('id', idNum)
        .select('id, centre_name, location');

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      // MySQL update
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        await connection.execute(
          'UPDATE exam_centers SET centre_name = ?, location = ? WHERE id = ?',
          [centre_name, location || null, idNum]
        );
        return NextResponse.json({ 
          id: idNum, 
          centre_name, 
          location: location || null
        });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    console.error('Error updating exam center:', error);
    return NextResponse.json(
      { error: 'Failed to update exam center', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isDevelopment) {
      // Supabase delete
      const { error } = await supabase
        .from('exam_centers')
        .delete()
        .eq('id', idNum);

      if (error) throw error;
      return NextResponse.json({ message: 'Exam center deleted successfully' });
    } else {
      // MySQL delete
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        await connection.execute('DELETE FROM exam_centers WHERE id = ?', [idNum]);
        return NextResponse.json({ message: 'Exam center deleted successfully' });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    console.error('Error deleting exam center:', error);
    return NextResponse.json(
      { error: 'Failed to delete exam center', details: error.message },
      { status: 500 }
    );
  }
}
