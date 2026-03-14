import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'loyola',
};

// GET a specific event report
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const connection = await mysql.createConnection(mysqlConfig);
    const [rows]: any = await connection.execute(
      'SELECT * FROM college_event_reports WHERE id = ?',
      [id]
    );
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Event report not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT to update an event report
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { category, date, month_year, title, description, image, lead_text, body, gallery, sort_order } = data;

    const connection = await mysql.createConnection(mysqlConfig);
    await connection.execute(
      `UPDATE college_event_reports SET 
        category = ?, date = ?, month_year = ?, title = ?, description = ?, image = ?, 
        lead_text = ?, body = ?, gallery = ?, sort_order = ?
       WHERE id = ?`,
      [
        category,
        date,
        month_year,
        title,
        description,
        image,
        lead_text,
        JSON.stringify(body || []),
        JSON.stringify(gallery || []),
        sort_order || 0,
        id
      ]
    );
    await connection.end();

    return NextResponse.json({ message: 'Event report updated successfully' });
  } catch (error) {
    console.error('Error updating event report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE an event report
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const connection = await mysql.createConnection(mysqlConfig);
    await connection.execute(
      'DELETE FROM college_event_reports WHERE id = ?',
      [id]
    );
    await connection.end();

    return NextResponse.json({ message: 'Event report deleted successfully' });
  } catch (error) {
    console.error('Error deleting event report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
