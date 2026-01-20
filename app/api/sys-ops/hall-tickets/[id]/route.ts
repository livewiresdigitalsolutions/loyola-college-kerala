import { NextResponse } from 'next/server';
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

// GET single hall ticket by ID with all details via JOINs
async function getHallTicketMySQL(id: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
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
       WHERE ht.id = ?`,
      [id]
    );

    await connection.end();
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('MySQL Get Hall Ticket Error:', error);
    await connection.end();
    throw error;
  }
}

async function getHallTicketSupabase(id: string) {
  try {
    const { data, error } = await supabase
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
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Supabase Get Hall Ticket Error:', error);
    throw error;
  }
}

// DELETE hall ticket by ID
async function deleteHallTicketMySQL(id: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.execute('DELETE FROM hall_ticket WHERE id = ?', [id]);
    await connection.end();
    return { success: true };
  } catch (error) {
    console.error('MySQL Delete Hall Ticket Error:', error);
    await connection.end();
    throw error;
  }
}

async function deleteHallTicketSupabase(id: string) {
  try {
    const { error } = await supabase
      .from('hall_ticket')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase Delete Hall Ticket Error:', error);
    throw error;
  }
}

// UPDATE hall ticket by ID (only fields that exist in hall_ticket table)
async function updateHallTicketMySQL(id: string, data: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.execute(
      `UPDATE hall_ticket SET
        exam_date = ?, 
        exam_time = ?, 
        status = ?, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [data.exam_date, data.exam_time, data.status, id]
    );

    await connection.end();
    return { success: true };
  } catch (error) {
    console.error('MySQL Update Hall Ticket Error:', error);
    await connection.end();
    throw error;
  }
}

async function updateHallTicketSupabase(id: string, data: any) {
  try {
    const { error } = await supabase
      .from('hall_ticket')
      .update({
        exam_date: data.exam_date,
        exam_time: data.exam_time,
        status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase Update Hall Ticket Error:', error);
    throw error;
  }
}

// GET handler
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = isDevelopment
      ? await getHallTicketSupabase(id)
      : await getHallTicketMySQL(id);

    if (!data) {
      return NextResponse.json(
        { error: 'Hall ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching hall ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hall ticket', details: error.message },
      { status: 500 }
    );
  }
}

// PUT handler
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.exam_date || !body.exam_time || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields: exam_date, exam_time, status' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await updateHallTicketSupabase(id, body)
      : await updateHallTicketMySQL(id, body);

    return NextResponse.json({
      success: true,
      message: 'Hall ticket updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating hall ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update hall ticket', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = isDevelopment
      ? await deleteHallTicketSupabase(id)
      : await deleteHallTicketMySQL(id);

    return NextResponse.json({
      success: true,
      message: 'Hall ticket deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting hall ticket:', error);
    return NextResponse.json(
      { error: 'Failed to delete hall ticket', details: error.message },
      { status: 500 }
    );
  }
}
