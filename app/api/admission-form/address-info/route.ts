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
async function saveAddressInfoMySQL(email: string, data: any) {
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
      'SELECT id FROM admission_address_info WHERE admission_id = ?',
      [admissionId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      await connection.execute(
        `UPDATE admission_address_info SET
          communication_address = ?, communication_city = ?, communication_state = ?,
          communication_district = ?, communication_pincode = ?, communication_country = ?,
          permanent_address = ?, permanent_city = ?, permanent_state = ?,
          permanent_district = ?, permanent_pincode = ?, permanent_country = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE admission_id = ?`,
        [
          data.communication_address || null,
          data.communication_city || null,
          data.communication_state || null,
          data.communication_district || null,
          data.communication_pincode || null,
          data.communication_country || null,
          data.permanent_address || null,
          data.permanent_city || null,
          data.permanent_state || null,
          data.permanent_district || null,
          data.permanent_pincode || null,
          data.permanent_country || null,
          admissionId
        ]
      );
    } else {
      await connection.execute(
        `INSERT INTO admission_address_info (
          admission_id, communication_address, communication_city, communication_state,
          communication_district, communication_pincode, communication_country,
          permanent_address, permanent_city, permanent_state,
          permanent_district, permanent_pincode, permanent_country
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          admissionId,
          data.communication_address || null,
          data.communication_city || null,
          data.communication_state || null,
          data.communication_district || null,
          data.communication_pincode || null,
          data.communication_country || null,
          data.permanent_address || null,
          data.permanent_city || null,
          data.permanent_state || null,
          data.permanent_district || null,
          data.permanent_pincode || null,
          data.permanent_country || null
        ]
      );
    }

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error('MySQL Save Address Info Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getAddressInfoMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [rows] = await connection.execute(
      `SELECT ai.* FROM admission_address_info ai
       JOIN admission_basic_info bi ON ai.admission_id = bi.id
       WHERE bi.user_email = ?`,
      [email]
    );

    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('MySQL Get Address Info Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Supabase Functions
async function saveAddressInfoSupabase(email: string, data: any) {
  try {
    const { data: basicInfo, error: basicError } = await supabase
      .from('admission_basic_info')
      .select('id')
      .eq('user_email', email)
      .single();

    if (basicError || !basicInfo) {
      throw new Error('Basic info not found. Please complete step 1 first.');
    }

    const addressData = {
      admission_id: basicInfo.id,
      communication_address: data.communication_address || null,
      communication_city: data.communication_city || null,
      communication_state: data.communication_state || null,
      communication_district: data.communication_district || null,
      communication_pincode: data.communication_pincode || null,
      communication_country: data.communication_country || null,
      permanent_address: data.permanent_address || null,
      permanent_city: data.permanent_city || null,
      permanent_state: data.permanent_state || null,
      permanent_district: data.permanent_district || null,
      permanent_pincode: data.permanent_pincode || null,
      permanent_country: data.permanent_country || null,
      updated_at: new Date().toISOString()
    };

    const { data: existing } = await supabase
      .from('admission_address_info')
      .select('id')
      .eq('admission_id', basicInfo.id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('admission_address_info')
        .update(addressData)
        .eq('admission_id', basicInfo.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('admission_address_info')
        .insert(addressData);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Supabase Save Address Info Error:', error);
    throw error;
  }
}

async function getAddressInfoSupabase(email: string) {
  try {
    const { data: basicInfo } = await supabase
      .from('admission_basic_info')
      .select('id')
      .eq('user_email', email)
      .single();

    if (!basicInfo) return null;

    const { data, error } = await supabase
      .from('admission_address_info')
      .select('*')
      .eq('admission_id', basicInfo.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Supabase Get Address Info Error:', error);
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
      ? await saveAddressInfoSupabase(email, data)
      : await saveAddressInfoMySQL(email, data);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error saving address info:', error);
    return NextResponse.json(
      { error: 'Failed to save address info', details: error.message },
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
      ? await getAddressInfoSupabase(email)
      : await getAddressInfoMySQL(email);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching address info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address info', details: error.message },
      { status: 500 }
    );
  }
}
