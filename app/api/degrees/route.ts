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

async function fetchFromMySQL(programId?: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const query = programId
      ? 'SELECT id, degree_name, program_level_id FROM degree WHERE program_level_id = ? ORDER BY id'
      : 'SELECT id, degree_name, program_level_id FROM degree ORDER BY id';
    
    const params = programId ? [programId] : [];
    const [degrees] = await connection.execute(query, params);
    return degrees;
  } finally {
    await connection.end();
  }
}

async function fetchFromSupabase(programId?: string) {
  let query = supabase
    .from('degree')
    .select('id, degree_name, program_level_id')
    .order('id');
  
  if (programId) {
    query = query.eq('program_level_id', programId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('program_id');
    
    const data = isDevelopment
      ? await fetchFromSupabase(programId || undefined)
      : await fetchFromMySQL(programId || undefined); 
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching degrees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch degrees' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { degree_name, program_level_id } = body;

    if (!degree_name || !program_level_id) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const { data, error } = await supabase
        .from('degree')
        .insert([{ degree_name, program_level_id }])
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      const [result] = await connection.execute(
        'INSERT INTO degree (degree_name, program_level_id) VALUES (?, ?)',
        [degree_name, program_level_id]
      );
      await connection.end();
      return NextResponse.json({ 
        id: (result as any).insertId, 
        degree_name, 
        program_level_id 
      });
    }
  } catch (error: any) {
    console.error('Error creating degree:', error);
    return NextResponse.json(
      { error: 'Failed to create degree', details: error.message },
      { status: 500 }
    );
  }
}
