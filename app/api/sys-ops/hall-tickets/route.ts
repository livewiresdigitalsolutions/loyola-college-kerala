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

interface HallTicketRow extends RowDataPacket {
  id: number;
  admission_id: number;
  application_id: string;
  full_name: string;
  father_name: string;
  mobile: string;
  email: string;
  program_level_id: number;
  degree_id: number;
  course_id: number;
  exam_center_id: number;
  exam_date: string;
  exam_time: string;
  passport_photo_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CountResult extends RowDataPacket {
  total: number;
}

// GET - Fetch hall tickets with filters
async function getHallTicketsMySQL(
  page: number,
  perPage: number,
  search: string,
  status: string,
  program: string,
  degree: string,
  course: string,
  date: string
) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const offset = (page - 1) * perPage;
    let whereClause = '1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (program && program !== 'all') {
      whereClause += ' AND program_level_id = ?';
      params.push(parseInt(program));
    }

    if (degree && degree !== 'all') {
      whereClause += ' AND degree_id = ?';
      params.push(parseInt(degree));
    }

    if (course && course !== 'all') {
      whereClause += ' AND course_id = ?';
      params.push(parseInt(course));
    }

    if (date && date !== 'all') {
      whereClause += ' AND exam_date = ?';
      params.push(date);
    }

    if (search) {
      whereClause += ' AND (full_name LIKE ? OR application_id LIKE ? OR mobile LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const [countResult] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as total FROM hall_ticket WHERE ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const [rows] = await connection.execute<HallTicketRow[]>(
      `SELECT * FROM hall_ticket WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, perPage, offset]
    );

    const pages = Math.ceil(total / perPage);

    return {
      data: rows,
      total,
      pages,
      page,
      perPage,
    };
  } catch (error) {
    console.error('MySQL Get Hall Tickets Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getHallTicketsSupabase(
  page: number,
  perPage: number,
  search: string,
  status: string,
  program: string,
  degree: string,
  course: string,
  date: string
) {
  try {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('hall_ticket')
      .select('*', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (program && program !== 'all') {
      query = query.eq('program_level_id', parseInt(program));
    }

    if (degree && degree !== 'all') {
      query = query.eq('degree_id', parseInt(degree));
    }

    if (course && course !== 'all') {
      query = query.eq('course_id', parseInt(course));
    }

    if (date && date !== 'all') {
      query = query.eq('exam_date', date);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,application_id.ilike.%${search}%,mobile.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
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
    console.error('Supabase Get Hall Tickets Error:', error);
    throw error;
  }
}

// POST - Create hall tickets (bulk allocation)
async function createHallTicketsMySQL(tickets: any[]) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO hall_ticket 
      (admission_id, application_id, full_name, father_name, mobile, email,
       program_level_id, degree_id, course_id, exam_center_id, 
       exam_date, exam_time, passport_photo_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const ticket of tickets) {
      await connection.execute(insertQuery, [
        ticket.admission_id,
        ticket.application_id,
        ticket.full_name,
        ticket.father_name,
        ticket.mobile,
        ticket.email,
        ticket.program_level_id,
        ticket.degree_id,
        ticket.course_id,
        ticket.exam_center_id,
        ticket.exam_date,
        ticket.exam_time,
        ticket.passport_photo_url || null,
        'allocated',
      ]);
    }

    await connection.commit();
    return { success: true, count: tickets.length };
  } catch (error) {
    await connection.rollback();
    console.error('MySQL Create Hall Tickets Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function createHallTicketsSupabase(tickets: any[]) {
  try {
    const ticketsData = tickets.map(ticket => ({
      admission_id: ticket.admission_id,
      application_id: ticket.application_id,
      full_name: ticket.full_name,
      father_name: ticket.father_name,
      mobile: ticket.mobile,
      email: ticket.email,
      program_level_id: ticket.program_level_id,
      degree_id: ticket.degree_id,
      course_id: ticket.course_id,
      exam_center_id: ticket.exam_center_id,
      exam_date: ticket.exam_date,
      exam_time: ticket.exam_time,
      passport_photo_url: ticket.passport_photo_url || null,
      status: 'allocated',
    }));

    const { data, error } = await supabase
      .from('hall_ticket')
      .insert(ticketsData);

    if (error) throw error;

    return { success: true, count: tickets.length };
  } catch (error) {
    console.error('Supabase Create Hall Tickets Error:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const program = searchParams.get('program') || 'all';
    const degree = searchParams.get('degree') || 'all';
    const course = searchParams.get('course') || 'all';
    const date = searchParams.get('date') || 'all';

    const result = isDevelopment
      ? await getHallTicketsSupabase(page, perPage, search, status, program, degree, course, date)
      : await getHallTicketsMySQL(page, perPage, search, status, program, degree, course, date);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching hall tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hall tickets', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tickets } = body;

    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return NextResponse.json(
        { error: 'Invalid tickets data' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await createHallTicketsSupabase(tickets)
      : await createHallTicketsMySQL(tickets);

    return NextResponse.json({
      success: true,
      message: `${result.count} hall ticket(s) allocated successfully`,
    });
  } catch (error: any) {
    console.error('Error creating hall tickets:', error);
    return NextResponse.json(
      { error: 'Failed to allocate hall tickets', details: error.message },
      { status: 500 }
    );
  }
}
