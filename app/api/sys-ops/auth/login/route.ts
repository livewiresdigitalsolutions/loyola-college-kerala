import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { RowDataPacket } from 'mysql2';

const isDevelopment = process.env.DB_TYPE === 'supabase';

const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3303'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'loyola',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define interface for admin user
interface AdminUser extends RowDataPacket {
  username: string;
  password_hash: string;
  role: string;
}

// Fetch admin credentials from database
async function getAdminCredentialsMySQL(username: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const [rows] = await connection.execute<AdminUser[]>(
      'SELECT username, password_hash, role FROM admin_users WHERE username = ?',
      [username]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('MySQL Get Admin Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getAdminCredentialsSupabase(username: string) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('username, password_hash, role')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Supabase Get Admin Error:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // For development/testing: hardcoded admin credentials
    // IMPORTANT: Generate this hash using the script below
    const HARDCODED_ADMIN = {
      username: 'admin',
      // To generate: run node scripts/generate-hash.js "Loyola@Admin2025"
      // Or temporarily use the password directly (first login only)
      useDirectPassword: true, // Set to false after setting up database
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // bcrypt hash placeholder
      role: 'super_admin'
    };

    // Check hardcoded credentials first (for initial setup)
    if (username === HARDCODED_ADMIN.username) {
      let isValidPassword = false;

      if (HARDCODED_ADMIN.useDirectPassword) {
        // Direct comparison for first-time setup
        isValidPassword = password === 'Loyola@Admin2025';
      } else {
        // Use bcrypt comparison
        isValidPassword = await bcrypt.compare(password, HARDCODED_ADMIN.password_hash);
      }

      if (isValidPassword) {
        // Generate session token
        const sessionToken = await bcrypt.hash(
          `${username}_${Date.now()}`,
          10
        );

        return NextResponse.json({
          success: true,
          message: 'Login successful',
          token: sessionToken,
          user: {
            username: username,
            role: HARDCODED_ADMIN.role,
          },
        });
      }
    }

    // Check database credentials
    const adminUser = isDevelopment
      ? await getAdminCredentialsSupabase(username)
      : await getAdminCredentialsMySQL(username);

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      adminUser.password_hash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = await bcrypt.hash(
      `${username}_${Date.now()}`,
      10
    );

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token: sessionToken,
      user: {
        username: adminUser.username,
        role: adminUser.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed', details: error.message },
      { status: 500 }
    );
  }
}
