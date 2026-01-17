import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { RowDataPacket } from 'mysql2';

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

interface AdmissionRow extends RowDataPacket {
  [key: string]: any;
}

async function getAdmissionsByIdsMySQL(ids: number[]) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    if (ids.length === 0) {
      await connection.end();
      return [];
    }

    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await connection.execute<AdmissionRow[]>(
      `SELECT 
        bi.*,
        pi.full_name,
        pi.email,
        pi.mobile,
        pi.gender,
        pi.dob,
        pi.nationality,
        pi.category,
        fi.father_name,
        fi.mother_name,
        ai.communication_address,
        ai.communication_city,
        ai.communication_state,
        ai.communication_pincode
       FROM admission_basic_info bi
       LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
       LEFT JOIN admission_family_info fi ON bi.id = fi.admission_id
       LEFT JOIN admission_address_info ai ON bi.id = ai.admission_id
       WHERE bi.id IN (${placeholders})`,
      ids
    );

    await connection.end();
    return rows;
  } catch (error) {
    console.error('MySQL Error:', error);
    await connection.end();
    throw error;
  }
}


async function getAdmissionsByIdsSupabase(ids: number[]) {
  try {
    if (ids.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from('admission_form')
      .select('*')
      .in('id', ids);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Supabase Error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }
    
    const data = isDevelopment
      ? await getAdmissionsByIdsSupabase(ids)
      : await getAdmissionsByIdsMySQL(ids);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching admissions by IDs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admissions', details: error.message },
      { status: 500 }
    );
  }
}
