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
  { params }: { params: Promise<{ id: string }> }  // Changed to Promise
) {
  try {
    const body = await request.json();
    const { degree_name, program_level_id } = body;
    const { id } = await params;  // Await params
    const idNum = parseInt(id);

    if (!degree_name || !program_level_id) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const { data, error } = await supabase
        .from('degree')
        .update({ degree_name, program_level_id })
        .eq('id', idNum)
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      await connection.execute(
        'UPDATE degree SET degree_name = ?, program_level_id = ? WHERE id = ?',
        [degree_name, program_level_id, idNum]
      );
      await connection.end();
      return NextResponse.json({ id: idNum, degree_name, program_level_id });
    }
  } catch (error: any) {
    console.error('Error updating degree:', error);
    return NextResponse.json(
      { error: 'Failed to update degree', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Changed to Promise
) {
  try {
    const { id } = await params;  // Await params
    const idNum = parseInt(id);

    if (isDevelopment) {
      const { error } = await supabase
        .from('degree')
        .delete()
        .eq('id', idNum);

      if (error) throw error;
      return NextResponse.json({ message: 'Degree deleted successfully' });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      await connection.execute('DELETE FROM degree WHERE id = ?', [idNum]);
      await connection.end();
      return NextResponse.json({ message: 'Degree deleted successfully' });
    }
  } catch (error: any) {
    console.error('Error deleting degree:', error);
    return NextResponse.json(
      { error: 'Failed to delete degree', details: error.message },
      { status: 500 }
    );
  }
}
