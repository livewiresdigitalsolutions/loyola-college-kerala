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

async function saveAddressInfoMySQL(admissionId: number, data: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
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
          data.communication_address, data.communication_city, data.communication_state,
          data.communication_district, data.communication_pincode, data.communication_country,
          data.permanent_address, data.permanent_city, data.permanent_state,
          data.permanent_district, data.permanent_pincode, data.permanent_country,
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
          admissionId, data.communication_address, data.communication_city, data.communication_state,
          data.communication_district, data.communication_pincode, data.communication_country,
          data.permanent_address, data.permanent_city, data.permanent_state,
          data.permanent_district, data.permanent_pincode, data.permanent_country
        ]
      );
    }

    return { success: true };
  } catch (error) {
    console.error('MySQL Address Info Save Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function saveAddressInfoSupabase(admissionId: number, data: any) {
  try {
    const { data: existing } = await supabase
      .from('admission_address_info')
      .select('id')
      .eq('admission_id', admissionId)
      .single();

    const addressData = {
      admission_id: admissionId,
      communication_address: data.communication_address,
      communication_city: data.communication_city,
      communication_state: data.communication_state,
      communication_district: data.communication_district,
      communication_pincode: data.communication_pincode,
      communication_country: data.communication_country,
      permanent_address: data.permanent_address,
      permanent_city: data.permanent_city,
      permanent_state: data.permanent_state,
      permanent_district: data.permanent_district,
      permanent_pincode: data.permanent_pincode,
      permanent_country: data.permanent_country,
      updated_at: new Date().toISOString()
    };

    if (existing) {
      const { error } = await supabase
        .from('admission_address_info')
        .update(addressData)
        .eq('admission_id', admissionId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('admission_address_info')
        .insert(addressData);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Supabase Address Info Save Error:', error);
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
      ? await saveAddressInfoSupabase(admission_id, data)
      : await saveAddressInfoMySQL(admission_id, data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Address Info API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
