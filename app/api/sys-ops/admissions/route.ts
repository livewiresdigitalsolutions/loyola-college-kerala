import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { RowDataPacket } from 'mysql2';

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

interface CountResult extends RowDataPacket {
  total: number;
}

interface AdmissionRow extends RowDataPacket {
  id: number;
  user_email: string;
  full_name: string;
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
  exam_center_name: string;
  exam_center_location: string;
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
    const safePerPage = Math.max(1, Number(perPage));
    const safeOffset = Math.max(0, Number(offset));
    const params: any[] = [];

    // Status filter
    if (status && status !== 'all') {
      if (status === 'completed') {
        whereClause += ' AND bi.payment_status = ?';
        params.push('completed');
      } else {
        whereClause += ' AND (bi.form_status = ? OR bi.form_status IS NULL)';
        params.push(status);
      }
    }

    // Program filter
    if (program && program !== 'all') {
      whereClause += ' AND bi.program_level_id = ?';
      params.push(parseInt(program));
    }

    // Degree filter
    if (degree && degree !== 'all') {
      whereClause += ' AND bi.degree_id = ?';
      params.push(parseInt(degree));
    }

    // Course filter
    if (course && course !== 'all') {
      whereClause += ' AND bi.course_id = ?';
      params.push(parseInt(course));
    }

    // Search filter
    const applySearch = process.env.SEARCH_ON_SERVER !== 'false';
    if (search && applySearch) {
      whereClause += ' AND (pi.full_name LIKE ? OR bi.user_email LIKE ? OR pi.mobile LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Get total count with filters
    const [countResult] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as total 
       FROM admission_basic_info bi
       LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
       WHERE ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Get paginated data with filters and JOINs
    const [rows] = await connection.execute<AdmissionRow[]>(
      `SELECT 
        bi.id, bi.user_email, bi.program_level_id, bi.degree_id, 
        bi.course_id, bi.exam_center_id, bi.form_status, 
        bi.payment_status, bi.updated_at, bi.created_at,
        pi.full_name, pi.mobile, pi.email,
        ec.centre_name as exam_center_name,
        ec.location as exam_center_location
       FROM admission_basic_info bi
       LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
       LEFT JOIN exam_centers ec ON bi.exam_center_id = ec.id
       WHERE ${whereClause}
       ORDER BY bi.updated_at DESC
       LIMIT ${safePerPage} OFFSET ${safeOffset}`,
      params
    );

    const pages = Math.ceil(total / perPage);

    await connection.end();

    return {
      data: rows,
      total,
      pages,
      page,
      perPage,
    };
  } catch (error) {
    console.error('MySQL Get Admissions Error:', error);
    await connection.end();
    throw error;
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
      .from('admission_basic_info')
      .select(`
        id, user_email, program_level_id, degree_id, course_id, 
        exam_center_id, form_status, payment_status, 
        updated_at, created_at,
        admission_personal_info (
          full_name, mobile, email
        ),
        exam_centers!exam_center_id (
          centre_name,
          location
        )
      `, { count: 'exact' });

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

    // Search filter
    const applySearch = process.env.SEARCH_ON_SERVER !== 'false';
    if (search && applySearch) {
      query = query.or(`admission_personal_info.full_name.ilike.%${search}%,user_email.ilike.%${search}%,admission_personal_info.mobile.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Transform Supabase response to match MySQL format
    const transformedData = data?.map((item: any) => ({
      ...item,
      full_name: item.admission_personal_info?.full_name || null,
      mobile: item.admission_personal_info?.mobile || null,
      email: item.admission_personal_info?.email || null,
      exam_center_name: item.exam_centers?.centre_name || null,
      exam_center_location: item.exam_centers?.location || null,
    })) || [];

    const total = count || 0;
    const pages = Math.ceil(total / perPage);

    return {
      data: transformedData,
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
