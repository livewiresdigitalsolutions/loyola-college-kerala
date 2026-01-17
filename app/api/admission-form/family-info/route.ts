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
async function saveFamilyInfoMySQL(email: string, data: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.beginTransaction();

    const [basicInfo] = await connection.execute(
      'SELECT id FROM admission_basic_info WHERE user_email = ?',
      [email]
    );

    if (!Array.isArray(basicInfo) || basicInfo.length === 0) {
      throw new Error('Basic info not found. Please complete step 1 first.');
    }

    const admissionId = (basicInfo[0] as any).id;

    const [existing] = await connection.execute(
      'SELECT id FROM admission_family_info WHERE admission_id = ?',
      [admissionId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      await connection.execute(
        `UPDATE admission_family_info SET
          father_name = ?, father_mobile = ?, father_education = ?, father_occupation = ?,
          mother_name = ?, mother_mobile = ?, mother_education = ?, mother_occupation = ?,
          annual_family_income = ?, parent_mobile = ?, parent_email = ?,
          emergency_contact_name = ?, emergency_contact_relation = ?, emergency_contact_mobile = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE admission_id = ?`,
        [
          data.father_name || null,
          data.father_mobile || null,
          data.father_education || null,
          data.father_occupation || null,
          data.mother_name || null,
          data.mother_mobile || null,
          data.mother_education || null,
          data.mother_occupation || null,
          data.annual_family_income || null,
          data.parent_mobile || null,
          data.parent_email || null,
          data.emergency_contact_name || null,
          data.emergency_contact_relation || null,
          data.emergency_contact_mobile || null,
          admissionId
        ]
      );
    } else {
      await connection.execute(
        `INSERT INTO admission_family_info (
          admission_id, father_name, father_mobile, father_education, father_occupation,
          mother_name, mother_mobile, mother_education, mother_occupation,
          annual_family_income, parent_mobile, parent_email,
          emergency_contact_name, emergency_contact_relation, emergency_contact_mobile
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          admissionId,
          data.father_name || null,
          data.father_mobile || null,
          data.father_education || null,
          data.father_occupation || null,
          data.mother_name || null,
          data.mother_mobile || null,
          data.mother_education || null,
          data.mother_occupation || null,
          data.annual_family_income || null,
          data.parent_mobile || null,
          data.parent_email || null,
          data.emergency_contact_name || null,
          data.emergency_contact_relation || null,
          data.emergency_contact_mobile || null
        ]
      );
    }

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error('MySQL Save Family Info Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getFamilyInfoMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [rows] = await connection.execute(
      `SELECT fi.* FROM admission_family_info fi
       JOIN admission_basic_info bi ON fi.admission_id = bi.id
       WHERE bi.user_email = ?`,
      [email]
    );

    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('MySQL Get Family Info Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Supabase Functions
async function saveFamilyInfoSupabase(email: string, data: any) {
  try {
    const { data: basicInfo, error: basicError } = await supabase
      .from('admission_basic_info')
      .select('id')
      .eq('user_email', email)
      .single();

    if (basicError || !basicInfo) {
      throw new Error('Basic info not found. Please complete step 1 first.');
    }

    const familyData = {
      admission_id: basicInfo.id,
      father_name: data.father_name || null,
      father_mobile: data.father_mobile || null,
      father_education: data.father_education || null,
      father_occupation: data.father_occupation || null,
      mother_name: data.mother_name || null,
      mother_mobile: data.mother_mobile || null,
      mother_education: data.mother_education || null,
      mother_occupation: data.mother_occupation || null,
      annual_family_income: data.annual_family_income || null,
      parent_mobile: data.parent_mobile || null,
      parent_email: data.parent_email || null,
      emergency_contact_name: data.emergency_contact_name || null,
      emergency_contact_relation: data.emergency_contact_relation || null,
      emergency_contact_mobile: data.emergency_contact_mobile || null,
      updated_at: new Date().toISOString()
    };

    const { data: existing } = await supabase
      .from('admission_family_info')
      .select('id')
      .eq('admission_id', basicInfo.id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('admission_family_info')
        .update(familyData)
        .eq('admission_id', basicInfo.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('admission_family_info')
        .insert(familyData);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Supabase Save Family Info Error:', error);
    throw error;
  }
}

async function getFamilyInfoSupabase(email: string) {
  try {
    const { data: basicInfo } = await supabase
      .from('admission_basic_info')
      .select('id')
      .eq('user_email', email)
      .single();

    if (!basicInfo) return null;

    const { data, error } = await supabase
      .from('admission_family_info')
      .select('*')
      .eq('admission_id', basicInfo.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Supabase Get Family Info Error:', error);
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
      ? await saveFamilyInfoSupabase(email, data)
      : await saveFamilyInfoMySQL(email, data);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error saving family info:', error);
    return NextResponse.json(
      { error: 'Failed to save family info', details: error.message },
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
      ? await getFamilyInfoSupabase(email)
      : await getFamilyInfoMySQL(email);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching family info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch family info', details: error.message },
      { status: 500 }
    );
  }
}
