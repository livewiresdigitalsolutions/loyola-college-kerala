import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';
const SALT_ROUNDS = 10; // Number of bcrypt salt rounds

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3303'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'loyola',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function createAdminMySQL(username: string, passwordHash: string, role: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    await connection.execute(
      'INSERT INTO admin_users (username, password_hash, role, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
      [username, passwordHash, role]
    );

    return { success: true };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Username already exists');
    }
    throw error;
  } finally {
    await connection.end();
  }
}

async function createAdminSupabase(username: string, passwordHash: string, role: string) {
  try {
    const { error } = await supabase
      .from('admin_users')
      .insert({
        username,
        password_hash: passwordHash,
        role,
        created_at: new Date().toISOString(),
      });

    if (error) {
      if (error.code === '23505') {
        throw new Error('Username already exists');
      }
      throw error;
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, role, masterKey } = await request.json();

    // Validate master key (add this to your .env.local)
    const MASTER_KEY = process.env.ADMIN_MASTER_KEY || 'LoyolaMasterKey2025';
    
    if (masterKey !== MASTER_KEY) {
      return NextResponse.json(
        { success: false, error: 'Invalid master key' },
        { status: 403 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = isDevelopment
      ? await createAdminSupabase(username, passwordHash, role || 'admin')
      : await createAdminMySQL(username, passwordHash, role || 'admin');

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
    });
  } catch (error: any) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
