// app/api/sys-ops/available-years/route.ts
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

export async function GET() {
  try {
    if (isDevelopment) {
      // Supabase query
      const { data, error } = await supabase
        .from('admission_form')
        .select('academic_year')
        .not('academic_year', 'is', null);

      if (error) throw error;

      // Get unique years and sort them in descending order
      const uniqueYears = [...new Set(data.map(item => item.academic_year))]
        .filter(year => year && year.trim() !== '')
        .sort((a, b) => {
          // Extract start year from format "2024-2025"
          const yearA = parseInt(a.split('-')[0]);
          const yearB = parseInt(b.split('-')[0]);
          return yearB - yearA; // Descending order
        });

      return NextResponse.json(uniqueYears);
    } else {
      // MySQL query
      const connection = await mysql.createConnection(mysqlConfig);
      
      const [rows] = await connection.execute(`
        SELECT DISTINCT academic_year
        FROM admission_form
        WHERE academic_year IS NOT NULL AND academic_year != ''
        ORDER BY academic_year DESC
      `);
      
      await connection.end();
      
      const years = (rows as any[]).map(row => row.academic_year);
      return NextResponse.json(years);
    }
  } catch (error: any) {
    console.error('Error fetching available years:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available years', details: error.message },
      { status: 500 }
    );
  }
}
