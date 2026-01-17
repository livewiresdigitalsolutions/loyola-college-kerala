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

async function savePersonalInfoMySQL(admissionId: number, data: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    // Check if record exists
    const [existing] = await connection.execute(
      'SELECT id FROM admission_personal_info WHERE admission_id = ?',
      [admissionId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Update
      await connection.execute(
        `UPDATE admission_personal_info SET
          full_name = ?, gender = ?, dob = ?, mobile = ?, email = ?,
          aadhaar = ?, nationality = ?, religion = ?, category = ?,
          seat_reservation_quota = ?, caste = ?, mother_tongue = ?,
          nativity = ?, blood_group = ?, updated_at = CURRENT_TIMESTAMP
        WHERE admission_id = ?`,
        [
          data.full_name, data.gender, data.dob, data.mobile, data.email,
          data.aadhaar, data.nationality, data.religion || null, data.category,
          data.seat_reservation_quota, data.caste, data.mother_tongue,
          data.nativity, data.blood_group || null, admissionId
        ]
      );
    } else {
      // Insert
      await connection.execute(
        `INSERT INTO admission_personal_info (
          admission_id, full_name, gender, dob, mobile, email,
          aadhaar, nationality, religion, category,
          seat_reservation_quota, caste, mother_tongue,
          nativity, blood_group
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          admissionId, data.full_name, data.gender, data.dob, data.mobile, data.email,
          data.aadhaar, data.nationality, data.religion || null, data.category,
          data.seat_reservation_quota, data.caste, data.mother_tongue,
          data.nativity, data.blood_group || null
        ]
      );
    }

    return { success: true };
  } catch (error) {
    console.error('MySQL Personal Info Save Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function savePersonalInfoSupabase(admissionId: number, data: any) {
  try {
    const { data: existing } = await supabase
      .from('admission_personal_info')
      .select('id')
      .eq('admission_id', admissionId)
      .single();

    const personalData = {
      admission_id: admissionId,
      full_name: data.full_name,
      gender: data.gender,
      dob: data.dob,
      mobile: data.mobile,
      email: data.email,
      aadhaar: data.aadhaar,
      nationality: data.nationality,
      religion: data.religion || null,
      category: data.category,
      seat_reservation_quota: data.seat_reservation_quota,
      caste: data.caste,
      mother_tongue: data.mother_tongue,
      nativity: data.nativity,
      blood_group: data.blood_group || null,
      updated_at: new Date().toISOString()
    };

    if (existing) {
      const { error } = await supabase
        .from('admission_personal_info')
        .update(personalData)
        .eq('admission_id', admissionId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('admission_personal_info')
        .insert(personalData);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Supabase Personal Info Save Error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { admission_id, data } = await request.json();

    if (!admission_id) {
      return NextResponse.json(
        { success: false, error: 'Admission ID is required' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await savePersonalInfoSupabase(admission_id, data)
      : await savePersonalInfoMySQL(admission_id, data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Personal Info API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
