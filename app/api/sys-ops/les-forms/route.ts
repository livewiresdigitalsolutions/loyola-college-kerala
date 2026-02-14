// api/les-forms/route.ts
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

interface LESFormRow extends RowDataPacket {
  id: number;
  user_email: string;
  name: string;
  form_type: string;
  form_status: string;
  updated_at: string;
  created_at: string;
}

async function getLESFormsMySQL(
  page: number,
  perPage: number,
  search: string,
  type: string,
  status: string
) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const offset = (page - 1) * perPage;
    let whereClause = '1=1';
    const safePerPage = Math.max(1, Number(perPage));
    const safeOffset = Math.max(0, Number(offset));
    const params: any[] = [];

    // Type filter
    if (type && type !== 'all') {
      whereClause += ' AND form_type = ?';
      params.push(type);
    }

    // Status filter
    if (status && status !== 'all') {
      whereClause += ' AND form_status = ?';
      params.push(status);
    }

    // Search filter
    const applySearch = process.env.SEARCH_ON_SERVER !== 'false';
    if (search && applySearch) {
      whereClause += ' AND (name LIKE ? OR user_email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    // Get total count
    const [countResult] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as total FROM les_forms WHERE ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Get paginated data
    const [rows] = await connection.execute<LESFormRow[]>(
      `SELECT * FROM les_forms 
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
    console.error('MySQL Get LES Forms Error:', error);
    await connection.end();
    throw error;
  }
}

async function getLESFormsSupabase(
  page: number,
  perPage: number,
  search: string,
  type: string,
  status: string
) {
  try {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('les_forms')
      .select('*', { count: 'exact' });

    // Type filter
    if (type && type !== 'all') {
      query = query.eq('form_type', type);
    }

    // Status filter
    if (status && status !== 'all') {
      query = query.eq('form_status', status);
    }

    // Search filter
    const applySearch = process.env.SEARCH_ON_SERVER !== 'false';
    if (search && applySearch) {
      query = query.or(`name.ilike.%${search}%,user_email.ilike.%${search}%`);
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
    console.error('Supabase Get LES Forms Error:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';

    const result = isDevelopment
      ? await getLESFormsSupabase(page, perPage, search, type, status)
      : await getLESFormsMySQL(page, perPage, search, type, status);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching LES forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LES forms', details: error.message },
      { status: 500 }
    );
  }
}
