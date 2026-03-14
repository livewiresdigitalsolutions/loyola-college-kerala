import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'loyola',
};

// GET all submissions for sys-ops
export async function GET() {
  try {
    const connection = await mysql.createConnection(mysqlConfig);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS college_contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        inquiry_type VARCHAR(100),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM college_contact_submissions ORDER BY created_at DESC');
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch contact submissions' }, { status: 500 });
  }
}

// POST a new submission from the public frontend
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, inquiry_type, message } = body;

    if (!first_name || !last_name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const connection = await mysql.createConnection(mysqlConfig);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS college_contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        inquiry_type VARCHAR(100),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.execute(
      `INSERT INTO college_contact_submissions (first_name, last_name, email, phone, inquiry_type, message) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone || null, inquiry_type || 'general', message]
    );
    await connection.end();

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
