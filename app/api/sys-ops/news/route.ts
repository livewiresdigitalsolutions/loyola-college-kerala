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
      'SELECT * FROM college_news ORDER BY sort_order ASC, date DESC'
    );
    await connection.end();
    return NextResponse.json({ success: true, news: rows });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch news', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { category, date, title, excerpt, image, lead_text, body, section_title, section_body, sort_order } = data;

    const connection = await mysql.createConnection(mysqlConfig);
    const [result]: any = await connection.execute(
      `INSERT INTO college_news (category, date, title, excerpt, image, lead_text, body, section_title, section_body, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        sort_order || 0
      ]
    );
    await connection.end();

    return NextResponse.json({ success: true, message: 'News added successfully', id: result.insertId });
  } catch (error: any) {
    console.error('Error adding news:', error);
    return NextResponse.json({ success: false, error: 'Failed to add news', details: error.message }, { status: 500 });
  }
}
