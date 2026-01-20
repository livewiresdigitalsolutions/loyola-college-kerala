import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { getAcademicYearConfig } from '@/app/lib/academicYearConfig';

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

// MySQL Functions
async function saveBasicInfoMySQL(email: string, data: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.beginTransaction();

    const academicYear = getAcademicYearConfig();

    const [existing] = await connection.execute(
      'SELECT id FROM admission_basic_info WHERE user_email = ?',
      [email]
    );

    let admissionId: number;

    if (Array.isArray(existing) && existing.length > 0) {
      admissionId = (existing[0] as any).id;

      await connection.execute(
        `UPDATE admission_basic_info SET
          program_level_id = ?, degree_id = ?, course_id = ?,
          second_preference_course_id = ?, third_preference_course_id = ?,
          exam_center_id = ?, academic_year = ?, form_status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_email = ?`,
        [
          data.program_level_id || null,
          data.degree_id || null,
          data.course_id || null,
          data.second_preference_course_id || null,
          data.third_preference_course_id || null,
          data.exam_center_id || null,
          academicYear.start,
          data.form_status || 'draft',
          email
        ]
      );
    } else {
      const [result] = await connection.execute(
        `INSERT INTO admission_basic_info (
          user_email, program_level_id, degree_id, course_id,
          second_preference_course_id, third_preference_course_id,
          exam_center_id, academic_year, form_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          email,
          data.program_level_id || null,
          data.degree_id || null,
          data.course_id || null,
          data.second_preference_course_id || null,
          data.third_preference_course_id || null,
          data.exam_center_id || null,
          academicYear.start,
          data.form_status || 'draft'
        ]
      );
      admissionId = (result as any).insertId;
    }

    await connection.commit();
    return { success: true, admissionId };
  } catch (error) {
    await connection.rollback();
    console.error('MySQL Save Basic Info Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getBasicInfoMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM admission_basic_info WHERE user_email = ?',
      [email]
    );

    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('MySQL Get Basic Info Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Supabase Functions
async function saveBasicInfoSupabase(email: string, data: any) {
  try {
    const academicYear = getAcademicYearConfig();

    const { data: existing, error: fetchError } = await supabase
      .from('admission_basic_info')
      .select('id')
      .eq('user_email', email)
      .single();

    const basicData = {
      user_email: email,
      program_level_id: data.program_level_id || null,
      degree_id: data.degree_id || null,
      course_id: data.course_id || null,
      second_preference_course_id: data.second_preference_course_id || null,
      third_preference_course_id: data.third_preference_course_id || null,
      exam_center_id: data.exam_center_id || null,
      academic_year: academicYear.start,
      form_status: data.form_status || 'draft',
      updated_at: new Date().toISOString()
    };

    let admissionId: number;

    if (existing && !fetchError) {
      admissionId = existing.id;
      const { error } = await supabase
        .from('admission_basic_info')
        .update(basicData)
        .eq('user_email', email);

      if (error) throw error;
    } else {
      const { data: insertData, error } = await supabase
        .from('admission_basic_info')
        .insert(basicData)
        .select('id')
        .single();

      if (error) throw error;
      admissionId = insertData.id;
    }

    return { success: true, admissionId };
  } catch (error) {
    console.error('Supabase Save Basic Info Error:', error);
    throw error;
  }
}

async function getBasicInfoSupabase(email: string) {
  try {
    const { data, error } = await supabase
      .from('admission_basic_info')
      .select('*')
      .eq('user_email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Supabase Get Basic Info Error:', error);
    return null;
  }
}

// API Routes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, data } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const academicYear = getAcademicYearConfig();
    if (!academicYear.isOpen) {
      return NextResponse.json(
        { error: 'Admissions are currently closed' },
        { status: 403 }
      );
    }

    const result = isDevelopment
      ? await saveBasicInfoSupabase(email, data)
      : await saveBasicInfoMySQL(email, data);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error saving basic info:', error);
    return NextResponse.json(
      { error: 'Failed to save basic info', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const data = isDevelopment
      ? await getBasicInfoSupabase(email)
      : await getBasicInfoMySQL(email);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching basic info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch basic info', details: error.message },
      { status: 500 }
    );
  }
}
