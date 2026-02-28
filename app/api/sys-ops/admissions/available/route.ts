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

interface AvailableAdmissionRow extends RowDataPacket {
  id: number;
  user_email: string;
  full_name: string;
  father_name: string;
  email: string;
  mobile: string;
  gender: string;
  dob: string;
  program_level_id: number;
  degree_id: number;
  course_id: number;
  exam_center_id: number;
  payment_status: string;
  form_status: string;
  created_at: string;
  updated_at: string;
}

async function getAvailableAdmissionsMySQL(
  page: number,
  perPage: number,
  search: string,
  program: string,
  degree: string,
  course: string,
  year: string
) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const offset = (page - 1) * perPage;
    let whereClause = 'bi.payment_status = ? AND ht.id IS NULL';
    const safePerPage = Math.max(1, Number(perPage));
    const safeOffset = Math.max(0, Number(offset));
    const params: any[] = ['completed'];

    // Academic year filter
    if (year && year !== 'all') {
      whereClause += ' AND bi.academic_year = ?';
      params.push(year);
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
    if (search) {
      whereClause += ' AND (pi.full_name LIKE ? OR bi.user_email LIKE ? OR pi.mobile LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Get total count
    const [countResult] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as total 
       FROM admission_basic_info bi
       LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
       LEFT JOIN hall_ticket ht ON bi.id = ht.admission_id
       WHERE ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Get paginated data
    const [rows] = await connection.execute<AvailableAdmissionRow[]>(
      `SELECT 
        bi.id,
        bi.user_email,
        bi.program_level_id,
        bi.degree_id,
        bi.course_id,
        bi.exam_center_id,
        bi.payment_status,
        bi.form_status,
        bi.created_at,
        bi.updated_at,
        pi.full_name,
        pi.email,
        pi.mobile,
        pi.gender,
        pi.dob,
        fi.father_name
       FROM admission_basic_info bi
       LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
       LEFT JOIN admission_family_info fi ON bi.id = fi.admission_id
       LEFT JOIN hall_ticket ht ON bi.id = ht.admission_id
       WHERE ${whereClause}
       ORDER BY bi.created_at DESC
       LIMIT ${safePerPage} OFFSET ${safeOffset}`,
      params
    );

    const pages = Math.ceil(total / perPage);

    await connection.end();

    return {
      admissions: rows,
      total,
      totalPages: pages,
      page,
      perPage,
    };
  } catch (error) {
    await connection.end();
    throw error;
  }
}

async function getAvailableAdmissionsSupabase(
  page: number,
  perPage: number,
  search: string,
  program: string,
  degree: string,
  course: string,
  year: string
) {
  try {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('admission_basic_info')
      .select(`
        id,
        user_email,
        program_level_id,
        degree_id,
        course_id,
        exam_center_id,
        payment_status,
        form_status,
        created_at,
        updated_at,
        academic_year,
        admission_personal_info (
          full_name,
          email,
          mobile,
          gender,
          dob
        ),
        admission_family_info (
          father_name
        )
      `, { count: 'exact' })
      .eq('payment_status', 'completed');

    // Academic year filter
    if (year && year !== 'all') {
      query = query.eq('academic_year', year);
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
    if (search) {
      query = query.or(`admission_personal_info.full_name.ilike.%${search}%,user_email.ilike.%${search}%,admission_personal_info.mobile.ilike.%${search}%`);
    }

    const { data: admissions, count, error: admError } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (admError) throw admError;

    // Get all admission IDs that already have hall tickets
    const { data: hallTickets, error: htError } = await supabase
      .from('hall_ticket')
      .select('admission_id');

    if (htError) throw htError;

    const allocatedIds = new Set(hallTickets?.map(ht => ht.admission_id) || []);

    // Filter out admissions that already have hall tickets and flatten data
    const available = (admissions || [])
      .filter((adm: any) => !allocatedIds.has(adm.id))
      .map((item: any) => ({
        ...item,
        full_name: item.admission_personal_info?.full_name,
        email: item.admission_personal_info?.email,
        mobile: item.admission_personal_info?.mobile,
        gender: item.admission_personal_info?.gender,
        dob: item.admission_personal_info?.dob,
        father_name: item.admission_family_info?.father_name,
      }));

    const total = available.length;
    const pages = Math.ceil(total / perPage);

    return {
      admissions: available,
      total,
      totalPages: pages,
      page,
      perPage,
    };
  } catch (error) {
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
    const year = searchParams.get('year') || 'all';

    const result = isDevelopment
      ? await getAvailableAdmissionsSupabase(page, perPage, search, program, degree, course, year)
      : await getAvailableAdmissionsMySQL(page, perPage, search, program, degree, course, year);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch available admissions', details: error.message },
      { status: 500 }
    );
  }
}
