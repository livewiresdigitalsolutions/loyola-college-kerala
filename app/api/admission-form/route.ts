// app/api/admission-form/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { getAcademicYearConfig } from '@/app/lib/academicYearConfig';

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

async function saveFormMySQL(email: string, formData: any) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    // Get current academic year from config
    const academicYear = getAcademicYearConfig();
    
    // Check if form already exists
    const [existing] = await connection.execute(
      'SELECT id FROM admission_form WHERE user_email = ?',
      [email]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Update existing form
      await connection.execute(
        `UPDATE admission_form SET
          program_level_id = ?, degree_id = ?, course_id = ?, exam_center_id = ?,
          full_name = ?, gender = ?, dob = ?, mobile = ?, email = ?,
          aadhaar = ?, nationality = ?, religion = ?, category = ?, blood_group = ?,
          father_name = ?, mother_name = ?, parent_mobile = ?, parent_email = ?,
          address = ?, city = ?, state = ?, pincode = ?,
          emergency_contact_name = ?, emergency_contact_relation = ?, emergency_contact_mobile = ?,
          tenth_board = ?, tenth_school = ?, tenth_year = ?, tenth_percentage = ?, tenth_subjects = ?,
          twelfth_board = ?, twelfth_school = ?, twelfth_year = ?, twelfth_percentage = ?,
          twelfth_stream = ?, twelfth_subjects = ?,
          ug_university = ?, ug_college = ?, ug_degree = ?, ug_year = ?, ug_percentage = ?,
          pg_university = ?, pg_college = ?, pg_degree = ?, pg_year = ?, pg_percentage = ?,
          previous_gap = ?, extracurricular = ?, achievements = ?,
          academic_year = ?, form_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_email = ?`,
        [
          formData.program_level_id || null,
          formData.degree_id || null,
          formData.course_id || null,
          formData.exam_center_id || null,
          formData.full_name || null,
          formData.gender || null,
          formData.dob || null,
          formData.mobile || null,
          formData.email || null,
          formData.aadhaar || null,
          formData.nationality || null,
          formData.religion || null,
          formData.category || null,
          formData.blood_group || null,
          formData.father_name || null,
          formData.mother_name || null,
          formData.parent_mobile || null,
          formData.parent_email || null,
          formData.address || null,
          formData.city || null,
          formData.state || null,
          formData.pincode || null,
          formData.emergency_contact_name || null,
          formData.emergency_contact_relation || null,
          formData.emergency_contact_mobile || null,
          formData.tenth_board || null,
          formData.tenth_school || null,
          formData.tenth_year || null,
          formData.tenth_percentage || null,
          formData.tenth_subjects || null,
          formData.twelfth_board || null,
          formData.twelfth_school || null,
          formData.twelfth_year || null,
          formData.twelfth_percentage || null,
          formData.twelfth_stream || null,
          formData.twelfth_subjects || null,
          formData.ug_university || null,
          formData.ug_college || null,
          formData.ug_degree || null,
          formData.ug_year || null,
          formData.ug_percentage || null,
          formData.pg_university || null,
          formData.pg_college || null,
          formData.pg_degree || null,
          formData.pg_year || null,
          formData.pg_percentage || null,
          formData.previous_gap || null,
          formData.extracurricular || null,
          formData.achievements || null,
          academicYear.label, // Store academic year as label (e.g., "2025-26")
          formData.form_status || 'draft',
          email
        ]
      );
    } else {
      // Insert new form
      await connection.execute(
        `INSERT INTO admission_form (
          user_email, program_level_id, degree_id, course_id, exam_center_id,
          full_name, gender, dob, mobile, email,
          aadhaar, nationality, religion, category, blood_group,
          father_name, mother_name, parent_mobile, parent_email,
          address, city, state, pincode,
          emergency_contact_name, emergency_contact_relation, emergency_contact_mobile,
          tenth_board, tenth_school, tenth_year, tenth_percentage, tenth_subjects,
          twelfth_board, twelfth_school, twelfth_year, twelfth_percentage,
          twelfth_stream, twelfth_subjects,
          ug_university, ug_college, ug_degree, ug_year, ug_percentage,
          pg_university, pg_college, pg_degree, pg_year, pg_percentage,
          previous_gap, extracurricular, achievements, academic_year, form_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          email,
          formData.program_level_id || null,
          formData.degree_id || null,
          formData.course_id || null,
          formData.exam_center_id || null,
          formData.full_name || null,
          formData.gender || null,
          formData.dob || null,
          formData.mobile || null,
          formData.email || null,
          formData.aadhaar || null,
          formData.nationality || null,
          formData.religion || null,
          formData.category || null,
          formData.blood_group || null,
          formData.father_name || null,
          formData.mother_name || null,
          formData.parent_mobile || null,
          formData.parent_email || null,
          formData.address || null,
          formData.city || null,
          formData.state || null,
          formData.pincode || null,
          formData.emergency_contact_name || null,
          formData.emergency_contact_relation || null,
          formData.emergency_contact_mobile || null,
          formData.tenth_board || null,
          formData.tenth_school || null,
          formData.tenth_year || null,
          formData.tenth_percentage || null,
          formData.tenth_subjects || null,
          formData.twelfth_board || null,
          formData.twelfth_school || null,
          formData.twelfth_year || null,
          formData.twelfth_percentage || null,
          formData.twelfth_stream || null,
          formData.twelfth_subjects || null,
          formData.ug_university || null,
          formData.ug_college || null,
          formData.ug_degree || null,
          formData.ug_year || null,
          formData.ug_percentage || null,
          formData.pg_university || null,
          formData.pg_college || null,
          formData.pg_degree || null,
          formData.pg_year || null,
          formData.pg_percentage || null,
          formData.previous_gap || null,
          formData.extracurricular || null,
          formData.achievements || null,
          academicYear.label, // Store academic year as label
          formData.form_status || 'draft'
        ]
      );
    }

    return { success: true };
  } catch (error) {
    console.error('MySQL Save Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function saveFormSupabase(email: string, formData: any) {
  try {
    // Get current academic year from config
    const academicYear = getAcademicYearConfig();
    
    const { data: existing, error: fetchError } = await supabase
      .from('admission_form')
      .select('id')
      .eq('user_email', email)
      .single();

    const formDataWithEmail = {
      user_email: email,
      program_level_id: formData.program_level_id || null,
      degree_id: formData.degree_id || null,
      course_id: formData.course_id || null,
      exam_center_id: formData.exam_center_id || null,
      full_name: formData.full_name || null,
      gender: formData.gender || null,
      dob: formData.dob || null,
      mobile: formData.mobile || null,
      email: formData.email || null,
      aadhaar: formData.aadhaar || null,
      nationality: formData.nationality || null,
      religion: formData.religion || null,
      category: formData.category || null,
      blood_group: formData.blood_group || null,
      father_name: formData.father_name || null,
      mother_name: formData.mother_name || null,
      parent_mobile: formData.parent_mobile || null,
      parent_email: formData.parent_email || null,
      address: formData.address || null,
      city: formData.city || null,
      state: formData.state || null,
      pincode: formData.pincode || null,
      emergency_contact_name: formData.emergency_contact_name || null,
      emergency_contact_relation: formData.emergency_contact_relation || null,
      emergency_contact_mobile: formData.emergency_contact_mobile || null,
      tenth_board: formData.tenth_board || null,
      tenth_school: formData.tenth_school || null,
      tenth_year: formData.tenth_year || null,
      tenth_percentage: formData.tenth_percentage || null,
      tenth_subjects: formData.tenth_subjects || null,
      twelfth_board: formData.twelfth_board || null,
      twelfth_school: formData.twelfth_school || null,
      twelfth_year: formData.twelfth_year || null,
      twelfth_percentage: formData.twelfth_percentage || null,
      twelfth_stream: formData.twelfth_stream || null,
      twelfth_subjects: formData.twelfth_subjects || null,
      ug_university: formData.ug_university || null,
      ug_college: formData.ug_college || null,
      ug_degree: formData.ug_degree || null,
      ug_year: formData.ug_year || null,
      ug_percentage: formData.ug_percentage || null,
      pg_university: formData.pg_university || null,
      pg_college: formData.pg_college || null,
      pg_degree: formData.pg_degree || null,
      pg_year: formData.pg_year || null,
      pg_percentage: formData.pg_percentage || null,
      previous_gap: formData.previous_gap || null,
      extracurricular: formData.extracurricular || null,
      achievements: formData.achievements || null,
      academic_year: academicYear.label, // Store academic year as label
      form_status: formData.form_status || 'draft',
      updated_at: new Date().toISOString()
    };

    if (existing && !fetchError) {
      // Update existing form
      const { error } = await supabase
        .from('admission_form')
        .update(formDataWithEmail)
        .eq('user_email', email);

      if (error) throw error;
    } else {
      // Insert new form
      const { error } = await supabase
        .from('admission_form')
        .insert(formDataWithEmail);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Supabase Save Error:', error);
    throw error;
  }
}

async function getFormMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM admission_form WHERE user_email = ?',
      [email]
    );

    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('MySQL Get Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getFormSupabase(email: string) {
  try {
    const { data, error } = await supabase
      .from('admission_form')
      .select('*')
      .eq('user_email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Supabase Get Error:', error);
    return null;
  }
}

// POST - Save form
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, formData } = body;

    console.log('POST Request received:', { email, hasFormData: !!formData });

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!formData) {
      return NextResponse.json(
        { error: 'Form data is required' },
        { status: 400 }
      );
    }

    // Check if admissions are open
    const academicYear = getAcademicYearConfig();
    if (!academicYear.isOpen) {
      return NextResponse.json(
        { error: 'Admissions are currently closed for the academic year' },
        { status: 403 }
      );
    }

    const result = isDevelopment
      ? await saveFormSupabase(email, formData)
      : await saveFormMySQL(email, formData);

    return NextResponse.json({ 
      success: true, 
      message: 'Form saved successfully',
      academicYear: academicYear.label
    });
  } catch (error: any) {
    console.error('Error saving form:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save form',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve form
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const data = isDevelopment
      ? await getFormSupabase(email)
      : await getFormMySQL(email);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching form:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch form',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
