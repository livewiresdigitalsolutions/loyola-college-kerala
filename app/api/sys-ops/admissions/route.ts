// app/api/sys-ops/admissions/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { RowDataPacket } from 'mysql2';

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

interface CountResult extends RowDataPacket {
  total: number;
}

interface AdmissionRow extends RowDataPacket {
  id: number;
  user_email: string;
  full_name: string;
  mobile: string;
  program_level_id: number;
  degree_id: number;
  course_id: number;
  form_status: string;
  payment_status: string;
  updated_at: string;
  created_at: string;
}

async function getAdmissionsMySQL(
  page: number,
  perPage: number,
  search: string,
  status: string,
  program: string,
  degree: string,
  course: string
) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const offset = (page - 1) * perPage;
    let whereClause = '1=1';
    const params: any[] = [];

    // Status filter
    if (status && status !== 'all') {
      if (status === 'completed') {
        whereClause += ' AND payment_status = ?';
        params.push('completed');
      } else {
        whereClause += ' AND (form_status = ? OR form_status IS NULL)';
        params.push(status);
      }
    }

    // Program filter
    if (program && program !== 'all') {
      whereClause += ' AND program_level_id = ?';
      params.push(parseInt(program));
    }

    // Degree filter
    if (degree && degree !== 'all') {
      whereClause += ' AND degree_id = ?';
      params.push(parseInt(degree));
    }

    // Course filter
    if (course && course !== 'all') {
      whereClause += ' AND course_id = ?';
      params.push(parseInt(course));
    }

    // Search filter (optional - can be disabled by setting SEARCH_ON_SERVER=false)
    const applySearch = process.env.SEARCH_ON_SERVER !== 'false';
    if (search && applySearch) {
      whereClause += ' AND (full_name LIKE ? OR user_email LIKE ? OR mobile LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Get total count with filters
    const [countResult] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as total FROM admission_form WHERE ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Get paginated data with filters
    const [rows] = await connection.execute<AdmissionRow[]>(
      `SELECT id, user_email, full_name, mobile, program_level_id, degree_id, 
              course_id, form_status, payment_status, updated_at, created_at
       FROM admission_form 
       WHERE ${whereClause}
       ORDER BY updated_at DESC
       LIMIT ? OFFSET ?`,
      [...params, perPage, offset]
    );

    const pages = Math.ceil(total / perPage);

    return {
      data: rows,
      total,
      pages,
      page,
      perPage,
    };
  } catch (error) {
    console.error('MySQL Get Admissions Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getAdmissionsSupabase(
  page: number,
  perPage: number,
  search: string,
  status: string,
  program: string,
  degree: string,
  course: string
) {
  try {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('admission_form')
      .select('id, user_email, full_name, mobile, program_level_id, degree_id, course_id, form_status, payment_status, updated_at, created_at', { count: 'exact' });

    // Status filter
    if (status && status !== 'all') {
      if (status === 'completed') {
        query = query.eq('payment_status', 'completed');
      } else {
        query = query.eq('form_status', status);
      }
    }

    // Program filter
    if (program && program !== 'all') {
      query = query.eq('program_level_id', parseInt(program));
    }

    // Degree filter
    if (degree && degree !== 'all') {
      query = query.eq('degree_id', parseInt(degree));
    }

    // Course filter
    if (course && course !== 'all') {
      query = query.eq('course_id', parseInt(course));
    }

    // Search filter (optional - can be disabled by setting SEARCH_ON_SERVER=false)
    const applySearch = process.env.SEARCH_ON_SERVER !== 'false';
    if (search && applySearch) {
      query = query.or(`full_name.ilike.%${search}%,user_email.ilike.%${search}%,mobile.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const total = count || 0;
    const pages = Math.ceil(total / perPage);

    return {
      data: data || [],
      total,
      pages,
      page,
      perPage,
    };
  } catch (error) {
    console.error('Supabase Get Admissions Error:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const program = searchParams.get('program') || 'all';
    const degree = searchParams.get('degree') || 'all';
    const course = searchParams.get('course') || 'all';

    const result = isDevelopment
      ? await getAdmissionsSupabase(page, perPage, search, status, program, degree, course)
      : await getAdmissionsMySQL(page, perPage, search, status, program, degree, course);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching admissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admissions', details: error.message },
      { status: 500 }
    );
  }
}
