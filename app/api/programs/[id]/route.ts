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
  { params }: { params: Promise<{ id: string }> }  // Changed to Promise
) {
  try {
    const body = await request.json();
    const { discipline } = body;
    const { id } = await params;  // Await params
    const idNum = parseInt(id);

    if (!discipline) {
      return NextResponse.json(
        { error: 'Program name is required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const { data, error } = await supabase
        .from('program_level')
        .update({ discipline })
        .eq('id', idNum)
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      await connection.execute(
        'UPDATE program_level SET discipline = ? WHERE id = ?',
        [discipline, idNum]
      );
      await connection.end();
      return NextResponse.json({ id: idNum, discipline });
    }
  } catch (error: any) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: 'Failed to update program', details: error.message },
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
        .from('program_level')
        .delete()
        .eq('id', idNum);

      if (error) throw error;
      return NextResponse.json({ message: 'Program deleted successfully' });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      await connection.execute('DELETE FROM program_level WHERE id = ?', [idNum]);
      await connection.end();
      return NextResponse.json({ message: 'Program deleted successfully' });
    }
  } catch (error: any) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: 'Failed to delete program', details: error.message },
      { status: 500 }
    );
  }
}
