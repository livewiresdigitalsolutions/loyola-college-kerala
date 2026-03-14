import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'loyola',
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(mysqlConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM college_events ORDER BY sort_order ASC, id DESC'
    );
    await connection.end();
    return NextResponse.json({ success: true, events: rows });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { month, day, title, time, venue, sort_order } = data;

    const connection = await mysql.createConnection(mysqlConfig);
    const [result]: any = await connection.execute(
      `INSERT INTO college_events (month, day, title, time, venue, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [month, day, title, time, venue, sort_order || 0]
    );
    await connection.end();

    return NextResponse.json({ success: true, message: 'Event added successfully', id: result.insertId });
  } catch (error: any) {
    console.error('Error adding event:', error);
    return NextResponse.json({ success: false, error: 'Failed to add event', details: error.message }, { status: 500 });
  }
}
