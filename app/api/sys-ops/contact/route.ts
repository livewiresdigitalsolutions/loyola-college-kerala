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

// GET global contact info
export async function GET() {
  try {
    const connection = await mysql.createConnection(mysqlConfig);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS college_contact_info (
        id INT PRIMARY KEY,
        address TEXT,
        emails JSON,
        phones JSON,
        office_hours_weekdays VARCHAR(255),
        office_hours_saturday VARCHAR(255),
        office_hours_sunday VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM college_contact_info WHERE id = 1');
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Contact info not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 });
  }
}

// PUT to update global contact info
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { address, emails, phones, office_hours_weekdays, office_hours_saturday, office_hours_sunday } = body;

    const connection = await mysql.createConnection(mysqlConfig);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS college_contact_info (
        id INT PRIMARY KEY,
        address TEXT,
        emails JSON,
        phones JSON,
        office_hours_weekdays VARCHAR(255),
        office_hours_saturday VARCHAR(255),
        office_hours_sunday VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    await connection.execute(
      `INSERT INTO college_contact_info (id, address, emails, phones, office_hours_weekdays, office_hours_saturday, office_hours_sunday) 
       VALUES (1, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       address = VALUES(address), emails = VALUES(emails), phones = VALUES(phones), 
       office_hours_weekdays = VALUES(office_hours_weekdays), 
       office_hours_saturday = VALUES(office_hours_saturday), 
       office_hours_sunday = VALUES(office_hours_sunday)`,
      [
        address || '',
        JSON.stringify(emails || {}),
        JSON.stringify(phones || {}),
        office_hours_weekdays || '',
        office_hours_saturday || '',
        office_hours_sunday || ''
      ]
    );
    await connection.end();

    return NextResponse.json({ success: true, message: 'Contact info updated successfully' });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}
