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
  [key: string]: any;
}

// GET single hall ticket by ID
async function getHallTicketMySQL(id: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [rows] = await connection.execute<HallTicketRow[]>(
      'SELECT * FROM hall_ticket WHERE id = ?',
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('MySQL Get Hall Ticket Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getHallTicketSupabase(id: string) {
  try {
    const { data, error } = await supabase
      .from('hall_ticket')
      .select('*')
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
    return { success: true };
  } catch (error) {
    console.error('MySQL Delete Hall Ticket Error:', error);
    throw error;
  } finally {
    await connection.end();
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

// UPDATE hall ticket by ID
async function updateHallTicketMySQL(id: string, data: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.execute(
      `UPDATE hall_ticket SET
        exam_date = ?, exam_time = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [data.exam_date, data.exam_time, data.status, id]
    );

    return { success: true };
  } catch (error) {
    console.error('MySQL Update Hall Ticket Error:', error);
    throw error;
  } finally {
    await connection.end();
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
        { error: 'Missing required fields' },
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
