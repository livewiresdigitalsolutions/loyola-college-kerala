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

// MySQL Functions
async function savePersonalInfoMySQL(email: string, data: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.beginTransaction();

    // Get admission_id from basic_info
    const [basicInfo] = await connection.execute(
      'SELECT id FROM admission_basic_info WHERE user_email = ?',
      [email]
    );

    if (!Array.isArray(basicInfo) || basicInfo.length === 0) {
      throw new Error('Basic info not found. Please complete step 1 first.');
    }

    const admissionId = (basicInfo[0] as any).id;

    // Check if personal info exists
    const [existing] = await connection.execute(
      'SELECT id FROM admission_personal_info WHERE admission_id = ?',
      [admissionId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      await connection.execute(
        `UPDATE admission_personal_info SET
          full_name = ?, gender = ?, dob = ?, mobile = ?, email = ?,
          aadhaar = ?, nationality = ?, religion = ?, category = ?,
          seat_reservation_quota = ?, caste = ?, mother_tongue = ?, nativity = ?,
          blood_group = ?, is_disabled = ?, disability_type = ?,
          disability_percentage = ?, dependent_of = ?,
          seeking_admission_under_quota = ?, scholarship_or_fee_concession = ?,
          hostel_accommodation_required = ?, previous_gap = ?,
          extracurricular = ?, achievements = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE admission_id = ?`,
        [
          data.full_name || null,
          data.gender || null,
          data.dob || null,
          data.mobile || null,
          data.email || null,
          data.aadhaar || null,
          data.nationality || null,
          data.religion || null,
          data.category || null,
          data.seat_reservation_quota || null,
          data.caste || null,
          data.mother_tongue || null,
          data.nativity || null,
          data.blood_group || null,
          data.is_disabled || 'no',
          data.disability_type || null,
          data.disability_percentage || null,
          data.dependent_of || 'none',
          data.seeking_admission_under_quota || 'no',
          data.scholarship_or_fee_concession || 'no',
          data.hostel_accommodation_required || 'no',
          data.previous_gap || null,
          data.extracurricular || null,
          data.achievements || null,
          admissionId
        ]
      );
    } else {
      await connection.execute(
        `INSERT INTO admission_personal_info (
          admission_id, full_name, gender, dob, mobile, email,
          aadhaar, nationality, religion, category, seat_reservation_quota,
          caste, mother_tongue, nativity, blood_group,
          is_disabled, disability_type, disability_percentage,
          dependent_of, seeking_admission_under_quota,
          scholarship_or_fee_concession, hostel_accommodation_required,
          previous_gap, extracurricular, achievements
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          admissionId,
          data.full_name || null,
          data.gender || null,
          data.dob || null,
          data.mobile || null,
          data.email || null,
          data.aadhaar || null,
          data.nationality || null,
          data.religion || null,
          data.category || null,
          data.seat_reservation_quota || null,
          data.caste || null,
          data.mother_tongue || null,
          data.nativity || null,
          data.blood_group || null,
          data.is_disabled || 'no',
          data.disability_type || null,
          data.disability_percentage || null,
          data.dependent_of || 'none',
          data.seeking_admission_under_quota || 'no',
          data.scholarship_or_fee_concession || 'no',
          data.hostel_accommodation_required || 'no',
          data.previous_gap || null,
          data.extracurricular || null,
          data.achievements || null
        ]
      );
    }

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

async function getPersonalInfoMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [rows] = await connection.execute(
      `SELECT pi.* FROM admission_personal_info pi
       JOIN admission_basic_info bi ON pi.admission_id = bi.id
       WHERE bi.user_email = ?`,
      [email]
    );

    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  } finally {
    await connection.end();
  }
}

// Supabase Functions
async function savePersonalInfoSupabase(email: string, data: any) {
  try {
    const { data: basicInfo, error: basicError } = await supabase
      .from('admission_basic_info')
      .select('id')
      .eq('user_email', email)
      .single();

    if (basicError || !basicInfo) {
      throw new Error('Basic info not found. Please complete step 1 first.');
    }

    const personalData = {
      admission_id: basicInfo.id,
      full_name: data.full_name || null,
      gender: data.gender || null,
      dob: data.dob || null,
      mobile: data.mobile || null,
      email: data.email || null,
      aadhaar: data.aadhaar || null,
      nationality: data.nationality || null,
      religion: data.religion || null,
      category: data.category || null,
      seat_reservation_quota: data.seat_reservation_quota || null,
      caste: data.caste || null,
      mother_tongue: data.mother_tongue || null,
      nativity: data.nativity || null,
      blood_group: data.blood_group || null,
      is_disabled: data.is_disabled || 'no',
      disability_type: data.disability_type || null,
      disability_percentage: data.disability_percentage || null,
      dependent_of: data.dependent_of || 'none',
      seeking_admission_under_quota: data.seeking_admission_under_quota || 'no',
      scholarship_or_fee_concession: data.scholarship_or_fee_concession || 'no',
      hostel_accommodation_required: data.hostel_accommodation_required || 'no',
      previous_gap: data.previous_gap || null,
      extracurricular: data.extracurricular || null,
      achievements: data.achievements || null,
      updated_at: new Date().toISOString()
    };

    const { data: existing } = await supabase
      .from('admission_personal_info')
      .select('id')
      .eq('admission_id', basicInfo.id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('admission_personal_info')
        .update(personalData)
        .eq('admission_id', basicInfo.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('admission_personal_info')
        .insert(personalData);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

async function getPersonalInfoSupabase(email: string) {
  try {
    const { data: basicInfo } = await supabase
      .from('admission_basic_info')
      .select('id')
      .eq('user_email', email)
      .single();

    if (!basicInfo) return null;

    const { data, error } = await supabase
      .from('admission_personal_info')
      .select('*')
      .eq('admission_id', basicInfo.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
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

    const result = isDevelopment
      ? await savePersonalInfoSupabase(email, data)
      : await savePersonalInfoMySQL(email, data);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to save personal info', details: error.message },
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
      ? await getPersonalInfoSupabase(email)
      : await getPersonalInfoMySQL(email);

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch personal info', details: error.message },
      { status: 500 }
    );
  }
}
