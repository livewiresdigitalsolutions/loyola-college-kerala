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

// GET: Fetch all academic years
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currentOnly = searchParams.get('current') === 'true';

    if (isDevelopment) {
      let query = supabase
        .from('academic_years')
        .select('id, year_start, year_end, label, is_current, created_at')
        .order('year_start', { ascending: false });

      if (currentOnly) {
        query = query.eq('is_current', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json(data);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      
      const query = currentOnly
        ? 'SELECT id, year_start, year_end, label, is_current, created_at FROM academic_years WHERE is_current = TRUE ORDER BY year_start DESC'
        : 'SELECT id, year_start, year_end, label, is_current, created_at FROM academic_years ORDER BY year_start DESC';
      
      const [rows] = await connection.execute(query);
      await connection.end();
      return NextResponse.json(rows);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch academic years', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new academic year
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { year_start, year_end, label, is_current } = body;

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
          .eq('is_current', true);
      }

      const { data, error } = await supabase
        .from('academic_years')
        .insert([{
          year_start: parseInt(year_start),
          year_end: parseInt(year_end),
          label: label || `${year_start}-${year_end}`,
          is_current: is_current || false
        }])
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);

      // If setting as current, unset all others first
      if (is_current) {
        await connection.execute(
          'UPDATE academic_years SET is_current = FALSE WHERE is_current = TRUE'
        );
      }

      const [result] = await connection.execute(
        'INSERT INTO academic_years (year_start, year_end, label, is_current) VALUES (?, ?, ?, ?)',
        [
          parseInt(year_start),
          parseInt(year_end),
          label || `${year_start}-${year_end}`,
          is_current || false
        ]
      );

      await connection.end();
      
      return NextResponse.json({
        id: (result as any).insertId,
        year_start: parseInt(year_start),
        year_end: parseInt(year_end),
        label: label || `${year_start}-${year_end}`,
        is_current: is_current || false
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create academic year', details: error.message },
      { status: 500 }
    );
  }
}
