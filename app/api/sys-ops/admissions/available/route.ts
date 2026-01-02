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
  father_name: string;
  mobile: string;
  email: string;
  program_level_id: number;
  degree_id: number;
  course_id: number;
  exam_center_id: number;
  form_status: string;
  payment_status: string;
  updated_at: string;
  created_at: string;
}

// Get admissions that don't have hall tickets allocated
async function getAvailableAdmissionsMySQL(
  page: number,
  perPage: number,
  search: string,
  program: string,
  degree: string,
  course: string
) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const offset = (page - 1) * perPage;
    let whereClause = 'af.payment_status = "completed"';
    const params: any[] = [];

    // Exclude admissions that already have hall tickets
    whereClause += ' AND af.id NOT IN (SELECT admission_id FROM hall_ticket)';

    if (program && program !== 'all') {
      whereClause += ' AND af.program_level_id = ?';
      params.push(parseInt(program));
    }

    if (degree && degree !== 'all') {
      whereClause += ' AND af.degree_id = ?';
      params.push(parseInt(degree));
    }

    if (course && course !== 'all') {
      whereClause += ' AND af.course_id = ?';
      params.push(parseInt(course));
    }

    if (search) {
      whereClause += ' AND (af.full_name LIKE ? OR af.user_email LIKE ? OR af.mobile LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const [countResult] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as total FROM admission_form af WHERE ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const [rows] = await connection.execute<AdmissionRow[]>(
      `SELECT af.id, af.user_email, af.full_name, af.father_name, af.mobile, af.email,
              af.program_level_id, af.degree_id, af.course_id, af.exam_center_id,
              af.form_status, af.payment_status, af.updated_at, af.created_at
       FROM admission_form af
       WHERE ${whereClause}
       ORDER BY af.updated_at DESC
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
    console.error('MySQL Get Available Admissions Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getAvailableAdmissionsSupabase(
  page: number,
  perPage: number,
  search: string,
  program: string,
  degree: string,
  course: string
) {
  try {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // First, get all admission IDs that already have hall tickets
    const { data: allocatedIds } = await supabase
      .from('hall_ticket')
      .select('admission_id');

    const excludeIds = allocatedIds?.map(item => item.admission_id) || [];

    let query = supabase
      .from('admission_form')
      .select('id, user_email, full_name, father_name, mobile, email, program_level_id, degree_id, course_id, exam_center_id, form_status, payment_status, updated_at, created_at', { count: 'exact' })
      .eq('payment_status', 'completed');

    // Exclude already allocated admissions
    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }

    if (program && program !== 'all') {
      query = query.eq('program_level_id', parseInt(program));
    }

    if (degree && degree !== 'all') {
      query = query.eq('degree_id', parseInt(degree));
    }

    if (course && course !== 'all') {
      query = query.eq('course_id', parseInt(course));
    }

    if (search) {
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
    console.error('Supabase Get Available Admissions Error:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || '';
    const program = searchParams.get('program') || 'all';
    const degree = searchParams.get('degree') || 'all';
    const course = searchParams.get('course') || 'all';

    const result = isDevelopment
      ? await getAvailableAdmissionsSupabase(page, perPage, search, program, degree, course)
      : await getAvailableAdmissionsMySQL(page, perPage, search, program, degree, course);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching available admissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available admissions', details: error.message },
      { status: 500 }
    );
  }
}
