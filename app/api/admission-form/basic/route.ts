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

async function saveBasicInfoMySQL(email: string, data: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const academicYear = getAcademicYearConfig();

    // Check if record exists
    const [existing] = await connection.execute(
      'SELECT id FROM admission_basic_info WHERE user_email = ?',
      [email]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Update existing
      const id = (existing[0] as any).id;
      await connection.execute(
        `UPDATE admission_basic_info SET
          program_level_id = ?,
          degree_id = ?,
          course_id = ?,
          second_preference_course_id = ?,
          third_preference_course_id = ?,
          exam_center_id = ?,
          academic_year = ?,
          form_status = ?,
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
      return { id };
    } else {
      // Insert new
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
      return { id: (result as any).insertId };
    }
  } catch (error) {
    console.error('MySQL Basic Info Save Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

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

    if (existing && !fetchError) {
      const { error } = await supabase
        .from('admission_basic_info')
        .update(basicData)
        .eq('user_email', email);

      if (error) throw error;
      return { id: existing.id };
    } else {
      const { data: insertData, error } = await supabase
        .from('admission_basic_info')
        .insert(basicData)
        .select('id')
        .single();

      if (error) throw error;
      return { id: insertData.id };
    }
  } catch (error) {
    console.error('Supabase Basic Info Save Error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, data } = body;

    console.log('Basic Info POST:', { email, hasData: !!data });

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Data is required' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await saveBasicInfoSupabase(email, data)
      : await saveBasicInfoMySQL(email, data);

    return NextResponse.json({ 
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Basic Info API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save basic info' },
      { status: 500 }
    );
  }
}
