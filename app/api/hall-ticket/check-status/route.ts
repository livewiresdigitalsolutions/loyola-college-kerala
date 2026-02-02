import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3303'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'loyola',
};

interface HallTicketStatusRow extends RowDataPacket {
  id: number;
  admission_id: number;
  status: string;
}

// MySQL function - check hall ticket status by email
async function checkHallTicketStatusMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    // First, get admission_id from basic info table
    const [admissionRows] = await connection.execute<RowDataPacket[]>(
      `SELECT id FROM admission_basic_info WHERE user_email = ?`,
      [email]
    );

    if (admissionRows.length === 0) {
      await connection.end();
      return {
        hasHallTicket: false,
        status: null,
        isAllocated: false,
        message: 'No admission found for this email'
      };
    }

    const admissionId = admissionRows[0].id;

    // Check if hall ticket exists for this admission
    const [hallTicketRows] = await connection.execute<HallTicketStatusRow[]>(
      `SELECT 
        id,
        admission_id,
        status
       FROM hall_ticket 
       WHERE admission_id = ?`,
      [admissionId]
    );

    await connection.end();

    if (hallTicketRows.length === 0) {
      return {
        hasHallTicket: false,
        status: null,
        isAllocated: false,
        message: 'Hall ticket not yet generated'
      };
    }

    const hallTicket = hallTicketRows[0];
    const hallTicketStatus = hallTicket.status?.toLowerCase();

    return {
      hasHallTicket: true,
      status: hallTicket.status,
      isAllocated: hallTicketStatus === 'allocated',
      message: hallTicketStatus === 'allocated' 
        ? 'Hall ticket available for download' 
        : hallTicketStatus === 'pending'
        ? 'Hall ticket generated, allocation pending'
        : 'Hall ticket status: ' + hallTicket.status
    };
  } catch (error) {
    console.error('MySQL Check Hall Ticket Status Error:', error);
    await connection.end();
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Checking hall ticket status for:', email);

    const statusData = await checkHallTicketStatusMySQL(email);

    console.log('Hall ticket status result:', statusData);

    return NextResponse.json(statusData, { status: 200 });
  } catch (error: any) {
    console.error('Error checking hall ticket status:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check hall ticket status', 
        details: error.message,
        hasHallTicket: false,
        status: null,
        isAllocated: false
      },
      { status: 500 }
    );
  }
}
