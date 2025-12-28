// import { dbFactory } from "../../lib/repository";

// export async function GET() {

//   try {
//     debugger;
//     const repo = dbFactory.enquireRepository();
//     const programs = await repo.getAllPrograms();

//     return Response.json(programs, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/programs error:", error);

//     return Response.json(
//       { message: "Failed to fetch programs" },
//       { status: 500 }
//     );
//   }
// }



// app/api/programs/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';

// MySQL connection config
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3303'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'loyola',
};

// Supabase config
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchFromMySQL() {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const [programs] = await connection.execute(
      'SELECT id, discipline FROM program_level ORDER BY id'
    );
    return programs;
  } finally {
    await connection.end();
  }
}

async function fetchFromSupabase() {
  const { data, error } = await supabase
    .from('program_level')
    .select('id, discipline')
    .order('id');
  
  if (error) throw error;
  return data;
}

export async function GET() {
  try {
    const data = isDevelopment 
      ?  await fetchFromSupabase()
      : await fetchFromMySQL();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
