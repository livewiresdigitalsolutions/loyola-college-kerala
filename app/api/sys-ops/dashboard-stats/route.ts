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

async function getDashboardStatsMySQL(year?: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  // ✅ FIXED: Different filters for different queries
  const simpleYearFilter = year ? `WHERE academic_year = ?` : '';
  const yearFilterWithAlias = year ? `WHERE bi.academic_year = ?` : '';
  const yearParam = year ? [year] : [];
  
  try {
    // Overview stats - NO ALIAS
    const [totalResult] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM admission_basic_info ${simpleYearFilter}`,
      yearParam
    );
    
    const [submittedResult] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM admission_basic_info 
       ${year ? 'WHERE academic_year = ? AND' : 'WHERE'} payment_status = ?`,
      year ? [year, 'completed'] : ['completed']
    );
    
    const [draftResult] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM admission_basic_info 
       ${year ? 'WHERE academic_year = ? AND' : 'WHERE'} (form_status = ? OR form_status IS NULL)`,
      year ? [year, 'draft'] : ['draft']
    );
    
    const [pendingResult] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM admission_basic_info 
       ${year ? 'WHERE academic_year = ? AND' : 'WHERE'} payment_status = ?`,
      year ? [year, 'pending'] : ['pending']
    );

    // Program stats - WITH ALIAS
    const [programStats] = await connection.execute<any[]>(
      `SELECT 
        COALESCE(pl.discipline, 'Unknown') as program_name,
        COUNT(*) as count
      FROM admission_basic_info bi
      LEFT JOIN program_level pl ON bi.program_level_id = pl.id
      ${yearFilterWithAlias}
      GROUP BY pl.discipline
      ORDER BY count DESC`,
      yearParam
    );

    // Gender stats - WITH ALIAS
    const [genderStats] = await connection.execute<any[]>(
      `SELECT 
        pi.gender,
        COUNT(*) as count
      FROM admission_basic_info bi
      JOIN admission_personal_info pi ON bi.id = pi.admission_id
      ${year ? 'WHERE bi.academic_year = ? AND' : 'WHERE'} pi.gender IS NOT NULL AND pi.gender != ''
      GROUP BY pi.gender`,
      year ? [year] : []
    );

    // Category stats - WITH ALIAS
    const [categoryStats] = await connection.execute<any[]>(
      `SELECT 
        pi.category,
        COUNT(*) as count
      FROM admission_basic_info bi
      JOIN admission_personal_info pi ON bi.id = pi.admission_id
      ${year ? 'WHERE bi.academic_year = ? AND' : 'WHERE'} pi.category IS NOT NULL AND pi.category != ''
      GROUP BY pi.category
      ORDER BY count DESC`,
      year ? [year] : []
    );

    // City stats - WITH ALIAS
    const [cityStats] = await connection.execute<any[]>(
      `SELECT 
        ai.communication_city as city,
        ai.communication_state as state,
        COUNT(*) as count
      FROM admission_basic_info bi
      JOIN admission_address_info ai ON bi.id = ai.admission_id
      ${year ? 'WHERE bi.academic_year = ? AND' : 'WHERE'} ai.communication_city IS NOT NULL AND ai.communication_city != ''
      GROUP BY ai.communication_city, ai.communication_state
      ORDER BY count DESC
      LIMIT 10`,
      year ? [year] : []
    );

    // State stats - WITH ALIAS
    const [stateStats] = await connection.execute<any[]>(
      `SELECT 
        ai.communication_state as state,
        COUNT(*) as count
      FROM admission_basic_info bi
      JOIN admission_address_info ai ON bi.id = ai.admission_id
      ${year ? 'WHERE bi.academic_year = ? AND' : 'WHERE'} ai.communication_state IS NOT NULL AND ai.communication_state != ''
      GROUP BY ai.communication_state
      ORDER BY count DESC`,
      year ? [year] : []
    );

    // Timeline stats - NO ALIAS
    const [timelineStats] = await connection.execute<any[]>(
      `SELECT 
        DATE(submitted_at) as date,
        COUNT(*) as count
      FROM admission_basic_info
      WHERE submitted_at IS NOT NULL 
        AND submitted_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        ${year ? 'AND academic_year = ?' : ''}
      GROUP BY DATE(submitted_at)
      ORDER BY date ASC`,
      year ? [year] : []
    );

    // Course stats - WITH ALIAS
    const [courseStats] = await connection.execute<any[]>(
      `SELECT 
        COALESCE(c.course_name, 'Unknown') as course_name,
        COALESCE(d.degree_name, 'Unknown') as degree_name,
        COUNT(*) as count
      FROM admission_basic_info bi
      LEFT JOIN course c ON bi.course_id = c.id
      LEFT JOIN degree d ON bi.degree_id = d.id
      ${yearFilterWithAlias}
      GROUP BY c.course_name, d.degree_name
      ORDER BY count DESC
      LIMIT 10`,
      yearParam
    );

    // Recent applications - WITH ALIAS
    const [recentApplications] = await connection.execute<any[]>(
      `SELECT 
        pi.full_name,
        pi.email,
        COALESCE(pl.discipline, 'Not Selected') as program,
        COALESCE(c.course_name, 'Not Selected') as course,
        COALESCE(bi.payment_status, 'draft') as payment_status,
        COALESCE(bi.form_status, 'draft') as form_status,
        bi.created_at
      FROM admission_basic_info bi
      LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
      LEFT JOIN program_level pl ON bi.program_level_id = pl.id
      LEFT JOIN course c ON bi.course_id = c.id
      ${yearFilterWithAlias}
      ORDER BY bi.created_at DESC
      LIMIT 10`,
      yearParam
    );

    return {
      overview: {
        total: totalResult[0]?.count || 0,
        submitted: submittedResult[0]?.count || 0,
        draft: draftResult[0]?.count || 0,
        pending: pendingResult[0]?.count || 0,
      },
      programStats: programStats || [],
      courseStats: courseStats || [],
      demographics: {
        gender: genderStats || [],
        category: categoryStats || [],
        nationality: [],
      },
      geography: {
        cities: cityStats || [],
        states: stateStats || [],
      },
      timeline: timelineStats || [],
      recentApplications: recentApplications || [],
    };
  } catch (error) {
    console.error('MySQL Dashboard Stats Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Supabase function remains the same...
async function getDashboardStatsSupabase(year?: string) {
  try {
    let query = supabase.from('admission_basic_info').select(`
      *,
      admission_personal_info(*),
      admission_address_info(*)
    `);
    
    if (year) {
      query = query.eq('academic_year', year);
    }

    const { data: forms, error: formsError } = await query;

    if (formsError) throw formsError;

    if (!forms || forms.length === 0) {
      return {
        overview: { total: 0, submitted: 0, draft: 0, pending: 0 },
        programStats: [],
        courseStats: [],
        demographics: { gender: [], category: [], nationality: [] },
        geography: { cities: [], states: [] },
        timeline: [],
        recentApplications: [],
      };
    }

    const total = forms.length;
    const submitted = forms.filter(f => f.payment_status === 'completed').length;
    const draft = forms.filter(f => !f.form_status || f.form_status === 'draft').length;
    const pending = forms.filter(f => f.payment_status === 'pending').length;

    const genderStats = forms
      .filter(f => f.admission_personal_info?.gender && f.admission_personal_info.gender !== '')
      .reduce((acc: any[], curr: any) => {
        const gender = curr.admission_personal_info.gender;
        const existing = acc.find(g => g.gender === gender);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ gender, count: 1 });
        }
        return acc;
      }, []);

    const categoryStats = forms
      .filter(f => f.admission_personal_info?.category && f.admission_personal_info.category !== '')
      .reduce((acc: any[], curr: any) => {
        const category = curr.admission_personal_info.category;
        const existing = acc.find(c => c.category === category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ category, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count);

    const cityStats = forms
      .filter(f => f.admission_address_info?.communication_city && f.admission_address_info.communication_city !== '')
      .reduce((acc: any[], curr: any) => {
        const city = curr.admission_address_info.communication_city;
        const state = curr.admission_address_info.communication_state || 'Unknown';
        const existing = acc.find(c => c.city === city && c.state === state);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ city, state, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const programMap: { [key: number]: string } = {};
    const { data: programLevels } = await supabase
      .from('program_level')
      .select('id, discipline');
    
    programLevels?.forEach((pl: any) => {
      programMap[pl.id] = pl.discipline;
    });

    const programStats = forms
      .filter(f => f.program_level_id)
      .reduce((acc: any[], curr: any) => {
        const program = programMap[curr.program_level_id] || 'Unknown';
        const existing = acc.find(p => p.program_name === program);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ program_name: program, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const timelineStats = forms
      .filter(f => f.submitted_at && new Date(f.submitted_at) >= sixMonthsAgo)
      .reduce((acc: any[], curr: any) => {
        const dateStr = curr.submitted_at.split('T')[0];
        const existing = acc.find(t => t.date === dateStr);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ date: dateStr, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => a.date.localeCompare(b.date));

    const courseMap: { [key: number]: string } = {};
    const degreeMap: { [key: number]: string } = {};
    
    const { data: courses } = await supabase
      .from('course')
      .select('id, course_name');
    
    const { data: degrees } = await supabase
      .from('degree')
      .select('id, degree_name');
    
    courses?.forEach((c: any) => {
      courseMap[c.id] = c.course_name;
    });
    
    degrees?.forEach((d: any) => {
      degreeMap[d.id] = d.degree_name;
    });

    const courseStats = forms
      .filter(f => f.course_id)
      .reduce((acc: any[], curr: any) => {
        const courseName = courseMap[curr.course_id] || 'Unknown';
        const degreeName = degreeMap[curr.degree_id] || '';
        const existing = acc.find(c => c.course_name === courseName);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ course_name: courseName, degree_name: degreeName, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recentApplications = forms
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map(app => ({
        full_name: app.admission_personal_info?.full_name || 'N/A',
        email: app.admission_personal_info?.email || 'N/A',
        program: programMap[app.program_level_id] || 'Not Selected',
        course: courseMap[app.course_id] || 'Not Selected',
        payment_status: app.payment_status || 'draft',
        form_status: app.form_status || 'draft',
        created_at: app.created_at,
      }));

    return {
      overview: { total, submitted, draft, pending },
      programStats,
      courseStats,
      demographics: { gender: genderStats, category: categoryStats, nationality: [] },
      geography: { cities: cityStats, states: [] },
      timeline: timelineStats,
      recentApplications,
    };
  } catch (error) {
    console.error('Supabase Dashboard Stats Error:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || undefined;

    const stats = isDevelopment
      ? await getDashboardStatsSupabase(year)
      : await getDashboardStatsMySQL(year);

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics', details: error.message },
      { status: 500 }
    );
  }
}
