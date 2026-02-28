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

async function getAvailableYearsMySQL() {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [rows] = await connection.execute(`
      SELECT DISTINCT academic_year
      FROM admission_basic_info
      WHERE academic_year IS NOT NULL AND academic_year != ''
      ORDER BY academic_year DESC
    `);

    await connection.end();
    return rows as { academic_year: string }[];
  } catch (error) {
    await connection.end();
    throw error;
  }
}

async function getAvailableYearsSupabase() {
  const { data, error } = await supabase
    .from('admission_basic_info')
    .select('academic_year')
    .not('academic_year', 'is', null)
    .neq('academic_year', '')
    .order('academic_year', { ascending: false });

  if (error) throw error;

  // Get unique years
  const uniqueYears = [...new Set(data.map((item: any) => item.academic_year))];
  return uniqueYears.map((year) => ({ academic_year: year }));
}

export async function GET() {
  try {
    const years = isDevelopment
      ? await getAvailableYearsSupabase()
      : await getAvailableYearsMySQL();

    // Extract just the year values as an array of strings
    const yearList = years.map((row) => row.academic_year);

    // Return as an array, not an object with years property
    return NextResponse.json(yearList);
  } catch (error: any) {
    // Return empty array on error
    return NextResponse.json([], { status: 500 });
  }
}
