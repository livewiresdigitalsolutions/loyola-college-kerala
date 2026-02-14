// api/les-forms/volunteers/route.ts
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

interface VolunteerRow extends RowDataPacket {
  id: number;
  user_email: string;
  name: string;
  gender: string;
  contact_number: string;
  address: string;
  email: string;
  age: string;
  educational_qualification: string;
  institute_name: string;
  institute_address: string;
  program_preference: string;
  duration: string;
  updated_at: string;
  created_at: string;
}

async function getVolunteersMySQL(
  page: number,
  perPage: number,
  search: string,
  program: string,
  qualification: string
) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const offset = (page - 1) * perPage;
    let whereClause = '1=1';
    const safePerPage = Math.max(1, Number(perPage));
    const safeOffset = Math.max(0, Number(offset));
    const params: any[] = [];

    // Program filter
    if (program && program !== 'all') {
      whereClause += ' AND v.program_preference = ?';
      params.push(program);
    }

    // Qualification filter
    if (qualification && qualification !== 'all') {
      whereClause += ' AND v.educational_qualification = ?';
      params.push(qualification);
    }

    // Search filter
    const applySearch = process.env.SEARCH_ON_SERVER !== 'false';
    if (search && applySearch) {
      whereClause += ' AND (v.name LIKE ? OR v.user_email LIKE ? OR v.contact_number LIKE ? OR v.institute_name LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Get total count
    const [countResult] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as total FROM volunteers v WHERE ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Get paginated data
    const [rows] = await connection.execute<VolunteerRow[]>(
      `SELECT id, user_email, name, gender, contact_number, address, email, 
              age, educational_qualification, institute_name, institute_address, 
              program_preference, updated_at, created_at
       FROM volunteers v 
       WHERE ${whereClause}
       ORDER BY v.updated_at DESC
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
    console.error('MySQL Get Volunteers Error:', error);
    await connection.end();
    throw error;
  }
}

async function getVolunteersSupabase(
  page: number,
  perPage: number,
  search: string,
  program: string,
  qualification: string
) {
  try {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('volunteers')
      .select('id, user_email, name, gender, contact_number, address, email, age, educational_qualification, institute_name, institute_address, program_preference, updated_at, created_at', { count: 'exact' });

    // Program filter
    if (program && program !== 'all') {
      query = query.eq('program_preference', program);
    }

    // Qualification filter
    if (qualification && qualification !== 'all') {
      query = query.eq('educational_qualification', qualification);
    }

    // Search filter
    const applySearch = process.env.SEARCH_ON_SERVER !== 'false';
    if (search && applySearch) {
      query = query.or(`name.ilike.%${search}%,user_email.ilike.%${search}%,contact_number.ilike.%${search}%,institute_name.ilike.%${search}%`);
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
    console.error('Supabase Get Volunteers Error:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '20');
    const search = searchParams.get('search') || '';
    const program = searchParams.get('program') || 'all';
    const qualification = searchParams.get('qualification') || 'all';

    const result = isDevelopment
      ? await getVolunteersSupabase(page, perPage, search, program, qualification)
      : await getVolunteersMySQL(page, perPage, search, program, qualification);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteers', details: error.message },
      { status: 500 }
    );
  }
}
