import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

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

// UPDATE admin (toggle active status, etc.)
async function updateAdminMySQL(id: string, updates: any) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    await connection.execute(
      `UPDATE admin_users SET ${fields} WHERE id = ?`,
      [...values, id]
    );

    return { success: true };
  } catch (error) {
    console.error('MySQL Update Admin Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function updateAdminSupabase(id: string, updates: any) {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase Update Admin Error:', error);
    throw error;
  }
}

// DELETE admin
async function deleteAdminMySQL(id: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    await connection.execute('DELETE FROM admin_users WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('MySQL Delete Admin Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function deleteAdminSupabase(id: string) {
  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase Delete Admin Error:', error);
    throw error;
  }
}

// PUT handler
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = isDevelopment
      ? await updateAdminSupabase(id, body)
      : await updateAdminMySQL(id, body);

    return NextResponse.json({
      success: true,
      message: 'Admin updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating admin:', error);
    return NextResponse.json(
      { error: 'Failed to update admin', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = isDevelopment
      ? await deleteAdminSupabase(id)
      : await deleteAdminMySQL(id);

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin', details: error.message },
      { status: 500 }
    );
  }
}
