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

// MySQL Function - Get Complete Admission Data
async function getCompleteAdmissionMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    // Get basic info
    const [basicRows] = await connection.execute(
      'SELECT * FROM admission_basic_info WHERE user_email = ?',
      [email]
    );

    if (!Array.isArray(basicRows) || basicRows.length === 0) {
      return null;
    }

    const basicInfo = basicRows[0] as any;
    const admissionId = basicInfo.id;

    // Get personal info
    const [personalRows] = await connection.execute(
      'SELECT * FROM admission_personal_info WHERE admission_id = ?',
      [admissionId]
    );
    const personalInfo = Array.isArray(personalRows) && personalRows.length > 0 ? personalRows[0] : null;

    // Get family info
    const [familyRows] = await connection.execute(
      'SELECT * FROM admission_family_info WHERE admission_id = ?',
      [admissionId]
    );
    const familyInfo = Array.isArray(familyRows) && familyRows.length > 0 ? familyRows[0] : null;

    // Get address info
    const [addressRows] = await connection.execute(
      'SELECT * FROM admission_address_info WHERE admission_id = ?',
      [admissionId]
    );
    const addressInfo = Array.isArray(addressRows) && addressRows.length > 0 ? addressRows[0] : null;

    // Get academic marks
    const [academicMarks] = await connection.execute(
      'SELECT * FROM academic_marks WHERE admission_form_id = ? ORDER BY qualification_level',
      [admissionId]
    );

    // Get subject-wise marks for each academic record
    for (const mark of academicMarks as any[]) {
      const [subjects] = await connection.execute(
        'SELECT * FROM subject_wise_marks WHERE academic_marks_id = ? ORDER BY subject_order',
        [mark.id]
      );
      mark.subjects = subjects;
    }

    // Combine all data
    return {
      // Structured data
      basicInfo,
      personalInfo,
      familyInfo,
      addressInfo,
      // Flattened data for backward compatibility (merge all sections)
      ...basicInfo,
      ...(personalInfo || {}),
      ...(familyInfo || {}),
      ...(addressInfo || {}),
      // Academic marks (only defined once now)
      academicMarks: academicMarks || []
    };
  } catch (error) {
    console.error('MySQL Get Complete Admission Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Supabase Function - Get Complete Admission Data
async function getCompleteAdmissionSupabase(email: string) {
  try {
    // Get basic info
    const { data: basicInfo, error: basicError } = await supabase
      .from('admission_basic_info')
      .select('*')
      .eq('user_email', email)
      .single();

    if (basicError || !basicInfo) {
      if (basicError?.code === 'PGRST116') return null;
      throw basicError;
    }

    const admissionId = basicInfo.id;

    // Get personal info
    const { data: personalInfo } = await supabase
      .from('admission_personal_info')
      .select('*')
      .eq('admission_id', admissionId)
      .single();

    // Get family info
    const { data: familyInfo } = await supabase
      .from('admission_family_info')
      .select('*')
      .eq('admission_id', admissionId)
      .single();

    // Get address info
    const { data: addressInfo } = await supabase
      .from('admission_address_info')
      .select('*')
      .eq('admission_id', admissionId)
      .single();

    // Get academic marks with subjects
    const { data: academicMarks, error: marksError } = await supabase
      .from('academic_marks')
      .select('*, subject_wise_marks(*)')
      .eq('admission_form_id', admissionId)
      .order('qualification_level');

    if (marksError) throw marksError;

    // Combine all data
    return {
      // Structured data
      basicInfo,
      personalInfo: personalInfo || null,
      familyInfo: familyInfo || null,
      addressInfo: addressInfo || null,
      // Flattened data for backward compatibility (merge all sections)
      ...basicInfo,
      ...(personalInfo || {}),
      ...(familyInfo || {}),
      ...(addressInfo || {}),
      // Academic marks (only defined once now)
      academicMarks: academicMarks || []
    };
  } catch (error) {
    console.error('Supabase Get Complete Admission Error:', error);
    throw error;
  }
}

// GET - Retrieve complete admission data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    console.log('Complete form GET request for email:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', data: null },
        { status: 400 }
      );
    }

    const data = isDevelopment
      ? await getCompleteAdmissionSupabase(email)
      : await getCompleteAdmissionMySQL(email);

    if (!data) {
      console.log('No form data found for email:', email);
      return NextResponse.json(
        { data: null, message: 'No form data found' },
        { status: 404 }
      );
    }

    console.log('Form data loaded successfully for:', email);
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching complete admission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admission data', details: error.message, data: null },
      { status: 500 }
    );
  }
}
