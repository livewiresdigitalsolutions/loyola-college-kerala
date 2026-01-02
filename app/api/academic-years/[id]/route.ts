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

// PUT: Update academic year
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { year_start, year_end, label, is_current } = body;
    const { id } = await params;
    const idNum = parseInt(id);

    if (!year_start || !year_end) {
      return NextResponse.json(
        { error: 'year_start and year_end are required' },
        { status: 400 }
      );
    }

    if (year_start >= year_end) {
      return NextResponse.json(
        { error: 'year_start must be less than year_end' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      // If setting as current, unset all others first
      if (is_current) {
        await supabase
          .from('academic_years')
          .update({ is_current: false })
          .neq('id', idNum);
      }

      const { data, error } = await supabase
        .from('academic_years')
        .update({
          year_start: parseInt(year_start),
          year_end: parseInt(year_end),
          label: label || `${year_start}-${year_end}`,
          is_current: is_current !== undefined ? is_current : false
        })
        .eq('id', idNum)
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);

      // If setting as current, unset all others first
      if (is_current) {
        await connection.execute(
          'UPDATE academic_years SET is_current = FALSE WHERE is_current = TRUE AND id != ?',
          [idNum]
        );
      }

      await connection.execute(
        'UPDATE academic_years SET year_start = ?, year_end = ?, label = ?, is_current = ? WHERE id = ?',
        [
          parseInt(year_start),
          parseInt(year_end),
          label || `${year_start}-${year_end}`,
          is_current !== undefined ? is_current : false,
          idNum
        ]
      );

      await connection.end();

      return NextResponse.json({
        id: idNum,
        year_start: parseInt(year_start),
        year_end: parseInt(year_end),
        label: label || `${year_start}-${year_end}`,
        is_current: is_current !== undefined ? is_current : false
      });
    }
  } catch (error: any) {
    console.error('Error updating academic year:', error);
    return NextResponse.json(
      { error: 'Failed to update academic year', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete academic year
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isDevelopment) {
      const { error } = await supabase
        .from('academic_years')
        .delete()
        .eq('id', idNum);

      if (error) throw error;
      return NextResponse.json({ message: 'Academic year deleted successfully' });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      await connection.execute('DELETE FROM academic_years WHERE id = ?', [idNum]);
      await connection.end();
      return NextResponse.json({ message: 'Academic year deleted successfully' });
    }
  } catch (error: any) {
    console.error('Error deleting academic year:', error);
    return NextResponse.json(
      { error: 'Failed to delete academic year', details: error.message },
      { status: 500 }
    );
  }
}
