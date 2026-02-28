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

async function saveFamilyInfoMySQL(admissionId: number, data: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [existing] = await connection.execute(
      'SELECT id FROM admission_family_info WHERE admission_id = ?',
      [admissionId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      await connection.execute(
        `UPDATE admission_family_info SET
          father_name = ?, father_mobile = ?, father_education = ?, father_occupation = ?,
          mother_name = ?, mother_mobile = ?, mother_education = ?, mother_occupation = ?,
          annual_family_income = ?, is_disabled = ?, disability_type = ?,
          disability_percentage = ?, dependent_of = ?, seeking_admission_under_quota = ?,
          scholarship_or_fee_concession = ?, hostel_accommodation_required = ?,
          emergency_contact_name = ?, emergency_contact_relation = ?,
          emergency_contact_mobile = ?, updated_at = CURRENT_TIMESTAMP
        WHERE admission_id = ?`,
        [
          data.father_name, data.father_mobile, data.father_education, data.father_occupation,
          data.mother_name, data.mother_mobile, data.mother_education, data.mother_occupation,
          data.annual_family_income, data.is_disabled || 'no', data.disability_type || null,
          data.disability_percentage || null, data.dependent_of || 'none',
          data.seeking_admission_under_quota || 'no', data.scholarship_or_fee_concession || 'no',
          data.hostel_accommodation_required || 'no', data.emergency_contact_name,
          data.emergency_contact_relation, data.emergency_contact_mobile, admissionId
        ]
      );
    } else {
      await connection.execute(
        `INSERT INTO admission_family_info (
          admission_id, father_name, father_mobile, father_education, father_occupation,
          mother_name, mother_mobile, mother_education, mother_occupation,
          annual_family_income, is_disabled, disability_type, disability_percentage,
          dependent_of, seeking_admission_under_quota, scholarship_or_fee_concession,
          hostel_accommodation_required, emergency_contact_name, emergency_contact_relation,
          emergency_contact_mobile
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          admissionId, data.father_name, data.father_mobile, data.father_education,
          data.father_occupation, data.mother_name, data.mother_mobile, data.mother_education,
          data.mother_occupation, data.annual_family_income, data.is_disabled || 'no',
          data.disability_type || null, data.disability_percentage || null,
          data.dependent_of || 'none', data.seeking_admission_under_quota || 'no',
          data.scholarship_or_fee_concession || 'no', data.hostel_accommodation_required || 'no',
          data.emergency_contact_name, data.emergency_contact_relation,
          data.emergency_contact_mobile
        ]
      );
    }

    return { success: true };
  } catch (error) {
    throw error;
  } finally {
    await connection.end();
  }
}

async function saveFamilyInfoSupabase(admissionId: number, data: any) {
  try {
    const { data: existing } = await supabase
      .from('admission_family_info')
      .select('id')
      .eq('admission_id', admissionId)
      .single();

    const familyData = {
      admission_id: admissionId,
      father_name: data.father_name,
      father_mobile: data.father_mobile,
      father_education: data.father_education,
      father_occupation: data.father_occupation,
      mother_name: data.mother_name,
      mother_mobile: data.mother_mobile,
      mother_education: data.mother_education,
      mother_occupation: data.mother_occupation,
      annual_family_income: data.annual_family_income,
      is_disabled: data.is_disabled || 'no',
      disability_type: data.disability_type || null,
      disability_percentage: data.disability_percentage || null,
      dependent_of: data.dependent_of || 'none',
      seeking_admission_under_quota: data.seeking_admission_under_quota || 'no',
      scholarship_or_fee_concession: data.scholarship_or_fee_concession || 'no',
      hostel_accommodation_required: data.hostel_accommodation_required || 'no',
      emergency_contact_name: data.emergency_contact_name,
      emergency_contact_relation: data.emergency_contact_relation,
      emergency_contact_mobile: data.emergency_contact_mobile,
      updated_at: new Date().toISOString()
    };

    if (existing) {
      const { error } = await supabase
        .from('admission_family_info')
        .update(familyData)
        .eq('admission_id', admissionId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('admission_family_info')
        .insert(familyData);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
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
      ? await saveFamilyInfoSupabase(admission_id, data)
      : await saveFamilyInfoMySQL(admission_id, data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
