// api/les-forms/appointment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { RowDataPacket } from 'mysql2';

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

interface CountResult extends RowDataPacket {
  total: number;
}

interface AppointmentRow extends RowDataPacket {
  id: number;
  user_email: string;
  name: string;
  gender: string;
  address: string;
  mobile_number: string;
  email: string;
  age: string;
  counseling_date: string;
  counseling_staff: string;
  counseling_slot: string;
  message: string;
  updated_at: string;
  created_at: string;
}

async function getAppointmentsMySQL(
  page: number,
  perPage: number,
  search: string,
  staff: string,
  slot: string
) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const offset = (page - 1) * perPage;
    let whereClause = '1=1';
    const safePerPage = Math.max(1, Number(perPage));
    const safeOffset = Math.max(0, Number(offset));
    const params: any[] = [];

    // Staff filter
    if (staff && staff !== 'all') {
      whereClause += ' AND counseling_staff = ?';
      params.push(staff);
    }

    // Slot filter
    if (slot && slot !== 'all') {
      whereClause += ' AND counseling_slot = ?';
      params.push(slot);
    }

    // Search filter
    const applySearch = process.env.SEARCH_ON_SERVER !== 'false';
    if (search && applySearch) {
      whereClause += ' AND (name LIKE ? OR user_email LIKE ? OR mobile_number LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Get total count
    const [countResult] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as total FROM appointments WHERE ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Get paginated data
    const [rows] = await connection.execute<AppointmentRow[]>(
      `SELECT id, user_email, name, gender, address, mobile_number, email, 
              age, counseling_date, counseling_staff, counseling_slot, 
              message, updated_at, created_at
       FROM appointments 
       WHERE ${whereClause}
       ORDER BY updated_at DESC
       LIMIT ${safePerPage} OFFSET ${safeOffset}`,
      params
    );

    const pages = Math.ceil(total / perPage);
    await connection.end();

    return {
      data: rows,
      total,
      pages,
      page,
      perPage,
    };
  } catch (error) {
    console.error('MySQL Get Appointments Error:', error);
    await connection.end();
    throw error;
  }
}

async function getAppointmentsSupabase(
  page: number,
  perPage: number,
  search: string,
  staff: string,
  slot: string
) {
  try {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('appointments')
      .select('id, user_email, name, gender, address, mobile_number, email, age, counseling_date, counseling_staff, counseling_slot, message, updated_at, created_at', { count: 'exact' });

    // Staff filter
    if (staff && staff !== 'all') {
      query = query.eq('counseling_staff', staff);
    }

    // Slot filter
    if (slot && slot !== 'all') {
      query = query.eq('counseling_slot', slot);
    }

    // Search filter
    const applySearch = process.env.SEARCH_ON_SERVER !== 'false';
    if (search && applySearch) {
      query = query.or(`name.ilike.%${search}%,user_email.ilike.%${search}%,mobile_number.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const total = count || 0;
    const pages = Math.ceil(total / perPage);

    return {
      data: data || [],
      total,
      pages,
      page,
      perPage,
    };
  } catch (error) {
    console.error('Supabase Get Appointments Error:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '20');
    const search = searchParams.get('search') || '';
    const staff = searchParams.get('staff') || 'all';
    const slot = searchParams.get('slot') || 'all';

    const result = isDevelopment
      ? await getAppointmentsSupabase(page, perPage, search, staff, slot)
      : await getAppointmentsMySQL(page, perPage, search, staff, slot);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments', details: error.message },
      { status: 500 }
    );
  }
}
