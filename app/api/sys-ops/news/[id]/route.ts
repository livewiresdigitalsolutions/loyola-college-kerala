import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'loyola',
};

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const connection = await mysql.createConnection(mysqlConfig);
    const [rows]: any = await connection.execute('SELECT * FROM college_news WHERE id = ?', [id]);
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'News article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, news: rows[0] });
  } catch (error: any) {
    console.error('Error fetching news article:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch news', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const { category, date, title, excerpt, image, lead_text, body, section_title, section_body, sort_order } = data;

    const connection = await mysql.createConnection(mysqlConfig);
    await connection.execute(
      `UPDATE college_news 
       SET category=?, date=?, title=?, excerpt=?, image=?, lead_text=?, body=?, section_title=?, section_body=?, sort_order=? 
       WHERE id=?`,
      [
        category, 
        date, 
        title, 
        excerpt || null, 
        image || '/assets/loyola-building.png', 
        lead_text || null, 
        JSON.stringify(body || []), 
        section_title || null, 
        section_body || null, 
        sort_order || 0,
        id
      ]
    );
    await connection.end();

    return NextResponse.json({ success: true, message: 'News updated successfully' });
  } catch (error: any) {
    console.error('Error updating news:', error);
    return NextResponse.json({ success: false, error: 'Failed to update news', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const connection = await mysql.createConnection(mysqlConfig);
    await connection.execute('DELETE FROM college_news WHERE id = ?', [id]);
    await connection.end();

    return NextResponse.json({ success: true, message: 'News deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete news', details: error.message }, { status: 500 });
  }
}
