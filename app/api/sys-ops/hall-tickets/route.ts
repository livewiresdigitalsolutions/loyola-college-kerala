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
  exam_date: string;
  exam_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Fields from JOINs
  academic_year?: string;
  program_level_id?: number;
  degree_id?: number;
  course_id?: number;
  exam_center_id?: number;
  full_name?: string;
  father_name?: string;
  mobile?: string;
  email?: string;
  dob?: string;
  gender?: string;
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
  date: string,
  year: string
) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const offset = (page - 1) * perPage;
    let whereClause = '1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      whereClause += ' AND ht.status = ?';
      params.push(status);
    }

    if (program && program !== 'all') {
      whereClause += ' AND bi.program_level_id = ?';
      params.push(parseInt(program));
    }

    if (degree && degree !== 'all') {
      whereClause += ' AND bi.degree_id = ?';
      params.push(parseInt(degree));
    }

    if (course && course !== 'all') {
      whereClause += ' AND bi.course_id = ?';
      params.push(parseInt(course));
    }

    if (date && date !== 'all') {
      whereClause += ' AND ht.exam_date = ?';
      params.push(date);
    }

    if (year && year !== 'all') {
      whereClause += ' AND bi.academic_year = ?';
      params.push(year);
    }

    if (search) {
      whereClause += ' AND (pi.full_name LIKE ? OR pi.mobile LIKE ? OR pi.email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Get count
    const [countResult] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as total 
       FROM hall_ticket ht
       INNER JOIN admission_basic_info bi ON ht.admission_id = bi.id
       LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
       WHERE ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Get hall tickets with all details from JOINs
    const [rows] = await connection.execute<HallTicketRow[]>(
      `SELECT 
        ht.id,
        ht.admission_id,
        ht.exam_date,
        ht.exam_time,
        ht.status,
        ht.created_at,
        ht.updated_at,
        bi.academic_year,
        bi.program_level_id,
        bi.degree_id,
        bi.course_id,
        bi.exam_center_id,
        pi.full_name,
        pi.dob,
        pi.gender,
        pi.mobile,
        pi.email,
        fi.father_name
       FROM hall_ticket ht
       INNER JOIN admission_basic_info bi ON ht.admission_id = bi.id
       LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
       LEFT JOIN admission_family_info fi ON bi.id = fi.admission_id
       WHERE ${whereClause} 
       ORDER BY ht.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, perPage, offset]
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
    console.error('MySQL Get Hall Tickets Error:', error);
    await connection.end();
    throw error;
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
  date: string,
  year: string
) {
  try {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('hall_ticket')
      .select(`
        *,
        admission_basic_info!inner(
          academic_year,
          program_level_id,
          degree_id,
          course_id,
          exam_center_id
        ),
        admission_personal_info(
          full_name,
          dob,
          gender,
          mobile,
          email
        ),
        admission_family_info(
          father_name
        )
      `, { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (program && program !== 'all') {
      query = query.eq('admission_basic_info.program_level_id', parseInt(program));
    }

    if (degree && degree !== 'all') {
      query = query.eq('admission_basic_info.degree_id', parseInt(degree));
    }

    if (course && course !== 'all') {
      query = query.eq('admission_basic_info.course_id', parseInt(course));
    }

    if (date && date !== 'all') {
      query = query.eq('exam_date', date);
    }

    if (year && year !== 'all') {
      query = query.eq('admission_basic_info.academic_year', year);
    }

    if (search) {
      query = query.or(`admission_personal_info.full_name.ilike.%${search}%,admission_personal_info.mobile.ilike.%${search}%,admission_personal_info.email.ilike.%${search}%`);
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
    console.log('Starting transaction...');
    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO hall_ticket 
      (admission_id, exam_date, exam_time, status)
      VALUES (?, ?, ?, ?)
    `;

    for (const ticket of tickets) {
      console.log('Inserting ticket:', ticket);
      
      try {
        await connection.execute(insertQuery, [
          ticket.admission_id,
          ticket.exam_date,
          ticket.exam_time,
          'allocated',
        ]);
        console.log('✅ Successfully inserted ticket for admission_id:', ticket.admission_id);
      } catch (insertError: any) {
        console.error('❌ Failed to insert ticket:', insertError);
        console.error('Error code:', insertError.code);
        console.error('Error errno:', insertError.errno);
        console.error('Error message:', insertError.message);
        throw insertError; // Re-throw to trigger rollback
      }
    }

    console.log('Committing transaction...');
    await connection.commit();
    await connection.end();
    console.log('✅ Transaction committed successfully');
    return { success: true, count: tickets.length };
  } catch (error: any) {
    console.error('❌ Transaction failed, rolling back...');
    await connection.rollback();
    await connection.end();
    console.error('MySQL Create Hall Tickets Error:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      message: error.message,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}

async function createHallTicketsSupabase(tickets: any[]) {
  try {
    const ticketsData = tickets.map(ticket => ({
      admission_id: ticket.admission_id,
      exam_date: ticket.exam_date,
      exam_time: ticket.exam_time,
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
    const year = searchParams.get('year') || 'all';

    const result = isDevelopment
      ? await getHallTicketsSupabase(page, perPage, search, status, program, degree, course, date, year)
      : await getHallTicketsMySQL(page, perPage, search, status, program, degree, course, date, year);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching hall tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hall tickets', details: error.message, data: [], total: 0, pages: 0, page: 1, perPage: 10 },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tickets } = body;

    console.log('📥 Received POST request with tickets:', tickets);

    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      console.error('Invalid request: tickets is not an array');
      return NextResponse.json(
        { error: 'Invalid tickets data - expected array of tickets' },
        { status: 400 }
      );
    }

    // Validate each ticket has required fields
    const invalidTickets = tickets.filter(ticket => 
      !ticket.admission_id || 
      !ticket.exam_date ||
      !ticket.exam_time
    );

    if (invalidTickets.length > 0) {
      console.error('Invalid tickets found:', invalidTickets);
      return NextResponse.json(
        { 
          error: 'Some tickets have missing required fields',
          details: 'Required: admission_id, exam_date, exam_time',
          invalidTickets: invalidTickets
        },
        { status: 400 }
      );
    }

    console.log('✅ All tickets validated, proceeding to create...');

    const result = isDevelopment
      ? await createHallTicketsSupabase(tickets)
      : await createHallTicketsMySQL(tickets);

    console.log('✅ Hall tickets created successfully:', result);

    return NextResponse.json({
      success: true,
      message: `${result.count} hall ticket(s) allocated successfully`,
    }, { status: 200 }); // Explicitly set 200 status
  } catch (error: any) {
    console.error('❌ Error in POST handler:', error);
    console.error('Error type:', typeof error);
    console.error('Error keys:', Object.keys(error));
    console.error('Error stack:', error.stack);
    
    // Check for duplicate entry error
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return NextResponse.json(
        { 
          error: 'Duplicate hall ticket',
          details: 'One or more students already have hall tickets allocated',
          code: 'ER_DUP_ENTRY'
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to allocate hall tickets', 
        details: error.message || String(error),
        code: error.code || 'UNKNOWN_ERROR',
        errno: error.errno,
        sqlMessage: error.sqlMessage
      },
      { status: 500 }
    );
  }
}
