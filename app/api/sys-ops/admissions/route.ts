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
  course: string,
  year: string,
  exportMode: boolean = false
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

    // Year filter
    if (year && year !== 'all' && year !== '') {
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

    const selectFields = exportMode
      ? `bi.id, bi.user_email, bi.program_level_id, bi.degree_id,
         bi.course_id, bi.second_preference_course_id, bi.third_preference_course_id,
         bi.exam_center_id, bi.form_status, bi.payment_status,
         bi.payment_id, bi.payment_amount, bi.admission_quota, bi.academic_year,
         bi.updated_at, bi.created_at, bi.submitted_at,
         pi.full_name, pi.gender, pi.dob, pi.mobile, pi.email,
         pi.aadhaar, pi.nationality, pi.religion, pi.category, pi.caste,
         pi.mother_tongue, pi.nativity, pi.blood_group,
         pi.is_disabled, pi.hostel_accommodation_required,
         fi.father_name, fi.father_mobile, fi.father_occupation,
         fi.mother_name, fi.mother_mobile, fi.mother_occupation,
         fi.annual_family_income,
         ai.communication_city, ai.communication_state,
         ai.communication_district, ai.communication_pincode,
         ec.centre_name as exam_center_name, ec.location as exam_center_location,
         pl.discipline as program_name,
         d.degree_name,
         c1.course_name,
         c2.course_name as second_pref_course_name,
         c3.course_name as third_pref_course_name`
      : `bi.id, bi.user_email, bi.program_level_id, bi.degree_id,
         bi.course_id, bi.exam_center_id, bi.form_status,
         bi.payment_status, bi.updated_at, bi.created_at,
         pi.full_name, pi.mobile, pi.email,
         ec.centre_name as exam_center_name,
         ec.location as exam_center_location`;

    const joinClause = exportMode
      ? `FROM admission_basic_info bi
         LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
         LEFT JOIN admission_family_info fi ON bi.id = fi.admission_id
         LEFT JOIN admission_address_info ai ON bi.id = ai.admission_id
         LEFT JOIN exam_centers ec ON bi.exam_center_id = ec.id
         LEFT JOIN program_level pl ON bi.program_level_id = pl.id
         LEFT JOIN degree d ON bi.degree_id = d.id
         LEFT JOIN course c1 ON bi.course_id = c1.id
         LEFT JOIN course c2 ON bi.second_preference_course_id = c2.id
         LEFT JOIN course c3 ON bi.third_preference_course_id = c3.id`
      : `FROM admission_basic_info bi
         LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
         LEFT JOIN exam_centers ec ON bi.exam_center_id = ec.id`;

    // Get paginated data with filters and JOINs
    const [rows] = await connection.execute<AdmissionRow[]>(
      `SELECT ${selectFields}
       ${joinClause}
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
  course: string,
  year: string,
  exportMode: boolean = false
) {
  try {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const selectQuery = exportMode
      ? `id, user_email, program_level_id, degree_id, course_id,
         second_preference_course_id, third_preference_course_id,
         exam_center_id, form_status, payment_status,
         payment_id, payment_amount, admission_quota, academic_year,
         updated_at, created_at, submitted_at,
         admission_personal_info (
           full_name, gender, dob, mobile, email,
           aadhaar, nationality, religion, category, caste,
           mother_tongue, nativity, blood_group, is_disabled, hostel_accommodation_required
         ),
         admission_family_info (
           father_name, father_mobile, father_occupation,
           mother_name, mother_mobile, mother_occupation, annual_family_income
         ),
         admission_address_info (
           communication_city, communication_state,
           communication_district, communication_pincode
         ),
         exam_centers!exam_center_id ( centre_name, location )`
      : `id, user_email, program_level_id, degree_id, course_id,
         exam_center_id, form_status, payment_status,
         updated_at, created_at,
         admission_personal_info ( full_name, mobile, email ),
         exam_centers!exam_center_id ( centre_name, location )`;

    let query = supabase
      .from('admission_basic_info')
      .select(selectQuery, { count: 'exact' });

    // Status filter
    if (status && status !== 'all') {
      if (status === 'completed') {
        query = query.eq('payment_status', 'completed');
      } else {
        query = query.eq('form_status', status);
      }
    }

    // Year filter
    if (year && year !== 'all' && year !== '') {
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
      // Export mode extra fields
      ...(exportMode ? {
        gender: item.admission_personal_info?.gender || null,
        dob: item.admission_personal_info?.dob || null,
        aadhaar: item.admission_personal_info?.aadhaar || null,
        nationality: item.admission_personal_info?.nationality || null,
        religion: item.admission_personal_info?.religion || null,
        category: item.admission_personal_info?.category || null,
        caste: item.admission_personal_info?.caste || null,
        mother_tongue: item.admission_personal_info?.mother_tongue || null,
        nativity: item.admission_personal_info?.nativity || null,
        blood_group: item.admission_personal_info?.blood_group || null,
        is_disabled: item.admission_personal_info?.is_disabled || null,
        hostel_accommodation_required: item.admission_personal_info?.hostel_accommodation_required || null,
        father_name: item.admission_family_info?.father_name || null,
        father_mobile: item.admission_family_info?.father_mobile || null,
        father_occupation: item.admission_family_info?.father_occupation || null,
        mother_name: item.admission_family_info?.mother_name || null,
        mother_mobile: item.admission_family_info?.mother_mobile || null,
        mother_occupation: item.admission_family_info?.mother_occupation || null,
        annual_family_income: item.admission_family_info?.annual_family_income || null,
        communication_city: item.admission_address_info?.communication_city || null,
        communication_state: item.admission_address_info?.communication_state || null,
        communication_district: item.admission_address_info?.communication_district || null,
        communication_pincode: item.admission_address_info?.communication_pincode || null,
      } : {}),
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
    const year = searchParams.get('year') || '';
    const exportMode = searchParams.get('export') === 'true';

    const result = isDevelopment
      ? await getAdmissionsSupabase(page, perPage, search, status, program, degree, course, year, exportMode)
      : await getAdmissionsMySQL(page, perPage, search, status, program, degree, course, year, exportMode);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch admissions', details: error.message },
      { status: 500 }
    );
  }
}
