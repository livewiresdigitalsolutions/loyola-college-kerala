import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'loyola',
};

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const connection = await mysql.createConnection(mysqlConfig);
    const [rows]: any = await connection.execute('SELECT * FROM college_events WHERE id = ?', [id]);
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, event: rows[0] });
  } catch (error: any) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch event', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const { month, day, title, time, venue, sort_order } = data;

    const connection = await mysql.createConnection(mysqlConfig);
    await connection.execute(
      `UPDATE college_events 
       SET month=?, day=?, title=?, time=?, venue=?, sort_order=? 
       WHERE id=?`,
      [month, day, title, time, venue, sort_order || 0, id]
    );
    await connection.end();

    return NextResponse.json({ success: true, message: 'Event updated successfully' });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, error: 'Failed to update event', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const connection = await mysql.createConnection(mysqlConfig);
    await connection.execute('DELETE FROM college_events WHERE id = ?', [id]);
    await connection.end();

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete event', details: error.message }, { status: 500 });
  }
}
