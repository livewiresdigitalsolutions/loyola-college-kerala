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
      'SELECT * FROM les_donations ORDER BY created_at DESC'
    );
    await connection.end();
    return NextResponse.json({ success: true, donations: rows });
  } catch (error: any) {
    console.error('Error fetching LES donations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch donations', details: error.message }, { status: 500 });
  }
}
