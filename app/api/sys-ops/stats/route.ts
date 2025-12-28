import { NextResponse } from 'next/server';
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

interface CountResult extends RowDataPacket {
  count: number;
}

async function getStatsMySQL() {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const [totalResult] = await connection.execute<CountResult[]>(
      'SELECT COUNT(*) as count FROM admission_form'
    );
    
    const [submittedResult] = await connection.execute<CountResult[]>(
      'SELECT COUNT(*) as count FROM admission_form WHERE payment_status = ?',
      ['completed']
    );
    
    const [draftResult] = await connection.execute<CountResult[]>(
      'SELECT COUNT(*) as count FROM admission_form WHERE form_status = ? OR form_status IS NULL',
      ['draft']
    );
    
    const [rejectedResult] = await connection.execute<CountResult[]>(
      'SELECT COUNT(*) as count FROM admission_form WHERE form_status = ?',
      ['rejected']
    );

    const total = totalResult[0]?.count || 0;
    const submitted = submittedResult[0]?.count || 0;
    const draft = draftResult[0]?.count || 0;
    const rejected = rejectedResult[0]?.count || 0;

    return { total, submitted, draft, rejected };
  } catch (error) {
    console.error('MySQL Stats Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getStatsSupabase() {
  try {
    const { count: total } = await supabase
      .from('admission_form')
      .select('*', { count: 'exact', head: true });

    const { count: submitted } = await supabase
      .from('admission_form')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'completed');

    const { count: draft } = await supabase
      .from('admission_form')
      .select('*', { count: 'exact', head: true })
      .or('form_status.eq.draft,form_status.is.null');

    const { count: rejected } = await supabase
      .from('admission_form')
      .select('*', { count: 'exact', head: true })
      .eq('form_status', 'rejected');

    return {
      total: total || 0,
      submitted: submitted || 0,
      draft: draft || 0,
      rejected: rejected || 0,
    };
  } catch (error) {
    console.error('Supabase Stats Error:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const stats = isDevelopment
      ? await getStatsSupabase()
      : await getStatsMySQL();

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error.message },
      { status: 500 }
    );
  }
}
