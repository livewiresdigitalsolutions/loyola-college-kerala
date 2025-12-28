import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';
const SALT_ROUNDS = 10;

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

// Create admin_users table if it doesn't exist
async function createTableMySQL(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('super_admin', 'admin', 'viewer') DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      last_login TIMESTAMP NULL,
      is_active BOOLEAN DEFAULT TRUE
    )
  `);
}

async function createTableSupabase() {
  // Run this SQL manually in Supabase SQL Editor if table doesn't exist
  const sqlScript = `
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'viewer')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN DEFAULT TRUE
    );
    CREATE INDEX IF NOT EXISTS idx_username ON admin_users(username);
  `;
  
  return sqlScript;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, password, role } = body;

    // Action 1: Generate hash only
    if (action === 'generate-hash') {
      const passwordToHash = password || 'Loyola@Admin2025';
      const hash = await bcrypt.hash(passwordToHash, SALT_ROUNDS);

      return NextResponse.json({
        success: true,
        action: 'hash-generated',
        password: passwordToHash,
        hash: hash,
        sql_mysql: `INSERT INTO admin_users (username, password_hash, role) VALUES ('${username || 'admin'}', '${hash}', '${role || 'super_admin'}');`,
        sql_supabase: `INSERT INTO admin_users (username, password_hash, role) VALUES ('${username || 'admin'}', '${hash}', '${role || 'super_admin'}');`,
        message: 'Copy the SQL above and run it in your database'
      });
    }

    // Action 2: Create table and insert admin
    if (action === 'create-admin') {
      const adminUsername = username || 'admin';
      const adminPassword = password || 'Loyola@Admin2025';
      const adminRole = role || 'super_admin';

      const hash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

      if (isDevelopment) {
        // Supabase
        const { error } = await supabase
          .from('admin_users')
          .insert({
            username: adminUsername,
            password_hash: hash,
            role: adminRole,
          });

        if (error) {
          return NextResponse.json({
            success: false,
            error: error.message,
            hint: 'Make sure the admin_users table exists in Supabase. Run the SQL from /api/sys-ops/auth/setup with action=get-table-sql'
          }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          message: 'Admin user created successfully in Supabase',
          username: adminUsername,
          password: adminPassword,
        });
      } else {
        // MySQL
        const connection = await mysql.createConnection(mysqlConfig);
        
        try {
          // Create table if not exists
          await createTableMySQL(connection);

          // Insert admin
          await connection.execute(
            'INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)',
            [adminUsername, hash, adminRole]
          );

          return NextResponse.json({
            success: true,
            message: 'Admin user created successfully in MySQL',
            username: adminUsername,
            password: adminPassword,
          });
        } catch (error: any) {
          if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({
              success: false,
              error: 'Username already exists'
            }, { status: 400 });
          }
          throw error;
        } finally {
          await connection.end();
        }
      }
    }

    // Action 3: Get table creation SQL
    if (action === 'get-table-sql') {
      return NextResponse.json({
        success: true,
        mysql_sql: `
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'viewer') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_username ON admin_users(username);
        `,
        supabase_sql: createTableSupabase(),
        message: 'Run the appropriate SQL in your database'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use: generate-hash, create-admin, or get-table-sql'
    }, { status: 400 });

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET method to show instructions
export async function GET() {
  return NextResponse.json({
    message: 'Admin Setup Endpoint',
    usage: {
      method: 'POST',
      actions: [
        {
          action: 'get-table-sql',
          description: 'Get SQL to create admin_users table',
          example: {
            action: 'get-table-sql'
          }
        },
        {
          action: 'generate-hash',
          description: 'Generate bcrypt hash for password',
          example: {
            action: 'generate-hash',
            username: 'admin',
            password: 'Loyola@Admin2025',
            role: 'super_admin'
          }
        },
        {
          action: 'create-admin',
          description: 'Create admin user directly in database',
          example: {
            action: 'create-admin',
            username: 'admin',
            password: 'Loyola@Admin2025',
            role: 'super_admin'
          }
        }
      ]
    },
    important: 'DELETE THIS FILE AFTER CREATING YOUR ADMIN USER!'
  });
}
