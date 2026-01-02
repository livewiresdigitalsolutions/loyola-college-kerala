// app/api/sys-ops/dashboard-stats/route.ts
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

async function getDashboardStatsMySQL() {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    // Applications by program
    const [programStats] = await connection.execute<any[]>(
      `SELECT 
        pl.discipline as program_name,
        COUNT(*) as count
      FROM admission_form af
      JOIN program_level pl ON af.program_level_id = pl.id
      WHERE af.program_level_id IS NOT NULL
      GROUP BY af.program_level_id, pl.discipline
      ORDER BY count DESC`
    );

    // Gender distribution
    const [genderStats] = await connection.execute<any[]>(
      `SELECT 
        gender,
        COUNT(*) as count
      FROM admission_form
      WHERE gender IS NOT NULL AND gender != ''
      GROUP BY gender`
    );

    // Category distribution
    const [categoryStats] = await connection.execute<any[]>(
      `SELECT 
        category,
        COUNT(*) as count
      FROM admission_form
      WHERE category IS NOT NULL AND category != ''
      GROUP BY category
      ORDER BY count DESC`
    );

    // Top 10 cities
    const [cityStats] = await connection.execute<any[]>(
      `SELECT 
        city,
        state,
        COUNT(*) as count
      FROM admission_form
      WHERE city IS NOT NULL AND city != ''
      GROUP BY city, state
      ORDER BY count DESC
      LIMIT 10`
    );

    // Applications over time (last 30 days)
    const [timelineStats] = await connection.execute<any[]>(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM admission_form
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC`
    );

    return {
      programStats: programStats || [],
      genderStats: genderStats || [],
      categoryStats: categoryStats || [],
      cityStats: cityStats || [],
      timelineStats: timelineStats || [],
    };
  } catch (error) {
    console.error('MySQL Dashboard Stats Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getDashboardStatsSupabase() {
  try {
    // Get all forms with relations
    const { data: forms } = await supabase
      .from('admission_form')
      .select(`
        *,
        program_level(discipline),
        created_at
      `);

    if (!forms) {
      return {
        programStats: [],
        genderStats: [],
        categoryStats: [],
        cityStats: [],
        timelineStats: [],
      };
    }

    // Program stats
    const programStats = forms
      .filter(f => f.program_level?.discipline)
      .reduce((acc: any[], curr: any) => {
        const program = curr.program_level?.discipline;
        const existing = acc.find(p => p.program_name === program);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ program_name: program, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count);

    // Gender stats
    const genderStats = forms
      .filter(f => f.gender)
      .reduce((acc: any[], curr: any) => {
        const existing = acc.find(g => g.gender === curr.gender);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ gender: curr.gender, count: 1 });
        }
        return acc;
      }, []);

    // Category stats
    const categoryStats = forms
      .filter(f => f.category)
      .reduce((acc: any[], curr: any) => {
        const existing = acc.find(c => c.category === curr.category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ category: curr.category, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count);

    // City stats
    const cityStats = forms
      .filter(f => f.city)
      .reduce((acc: any[], curr: any) => {
        const existing = acc.find(c => c.city === curr.city && c.state === curr.state);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ city: curr.city, state: curr.state, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Timeline stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timelineStats = forms
      .filter(f => f.created_at && new Date(f.created_at) >= thirtyDaysAgo)
      .reduce((acc: any[], curr: any) => {
        const date = new Date(curr.created_at).toISOString().split('T')[0];
        const existing = acc.find(t => t.date === date);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ date, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      programStats,
      genderStats,
      categoryStats,
      cityStats,
      timelineStats,
    };
  } catch (error) {
    console.error('Supabase Dashboard Stats Error:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const stats = isDevelopment
      ? await getDashboardStatsSupabase()
      : await getDashboardStatsMySQL();

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics', details: error.message },
      { status: 500 }
    );
  }
}
