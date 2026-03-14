import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'loyola',
};

// GET all event reports
export async function GET() {
  try {
    const connection = await mysql.createConnection(mysqlConfig);
    
    // Auto-create table if it doesn't exist (to avoid needing .sql files)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS college_event_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        date VARCHAR(100) NOT NULL,
        month_year VARCHAR(100) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        image VARCHAR(500) DEFAULT '/assets/loyola-building.png',
        lead_text TEXT,
        body JSON,
        gallery JSON,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.execute(
      'SELECT * FROM college_event_reports ORDER BY id DESC'
    );
    await connection.end();

    return NextResponse.json({ reports: rows });
  } catch (error) {
    console.error('Error fetching event reports:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST new event report
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { category, date, month_year, title, description, image, lead_text, body, gallery, sort_order } = data;

    const connection = await mysql.createConnection(mysqlConfig);
    const [result] = await connection.execute(
      `INSERT INTO college_event_reports 
        (category, date, month_year, title, description, image, lead_text, body, gallery, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category,
        date,
        month_year || 'Unknown Month',
        title,
        description || '',
        image || '/assets/loyola-building.png',
        lead_text || '',
        JSON.stringify(body || []),
        JSON.stringify(gallery || []),
        sort_order || 0
      ]
    );
    await connection.end();

    return NextResponse.json({ message: 'Event report created successfully', id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    console.error('Error creating event report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
