import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';

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

// UPDATE admin (toggle active status, etc.)
async function updateAdminMySQL(id: string, updates: any) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    // Whitelist allowed fields for security
    const allowedFields = ['username', 'role', 'is_active', 'can_edit', 'last_login'];
    const filteredUpdates: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error('No valid fields to update');
    }

    const fields = Object.keys(filteredUpdates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(filteredUpdates);

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
    // Whitelist allowed fields for security
    const allowedFields = ['username', 'role', 'is_active', 'can_edit', 'last_login'];
    const filteredUpdates: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error('No valid fields to update');
    }

    const { error } = await supabase
      .from('admin_users')
      .update(filteredUpdates)
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
