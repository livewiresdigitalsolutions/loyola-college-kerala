// // // app/api/sys-ops/dashboard-stats/route.ts
// import { NextResponse } from 'next/server';
// import mysql from 'mysql2/promise';
// import { createClient } from '@supabase/supabase-js';


// const isDevelopment = process.env.DB_TYPE === 'supabase';


// const mysqlConfig = {
//   host: process.env.MYSQL_HOST || 'localhost',
//   port: parseInt(process.env.MYSQL_PORT || '3303'),
//   user: process.env.MYSQL_USER || 'root',
//   password: process.env.MYSQL_PASSWORD || '',
//   database: process.env.MYSQL_DATABASE || 'loyola',
// };


// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );


// async function getDashboardStatsMySQL() {
//   const connection = await mysql.createConnection(mysqlConfig);
  
//   try {
//     // Overview stats
//     const [totalResult] = await connection.execute<any[]>(
//       'SELECT COUNT(*) as count FROM admission_form'
//     );
    
//     const [submittedResult] = await connection.execute<any[]>(
//       'SELECT COUNT(*) as count FROM admission_form WHERE payment_status = ?',
//       ['completed']
//     );
    
//     const [draftResult] = await connection.execute<any[]>(
//       'SELECT COUNT(*) as count FROM admission_form WHERE form_status = ? OR form_status IS NULL',
//       ['draft']
//     );
    
//     const [pendingResult] = await connection.execute<any[]>(
//       'SELECT COUNT(*) as count FROM admission_form WHERE payment_status = ?',
//       ['pending']
//     );

//     // DEBUG: Check what's actually in the database
//     const [sampleData] = await connection.execute<any[]>(
//       'SELECT program_level_id, gender, category, city, state, created_at, submitted_at FROM admission_form LIMIT 5'
//     );
//     console.log('=== SAMPLE DATABASE DATA ===', sampleData);

//     // Applications by program - MORE LENIENT
//     const [programStats] = await connection.execute<any[]>(
//       `SELECT 
//         COALESCE(pl.discipline, 'Unknown') as program_name,
//         COUNT(*) as count
//       FROM admission_form af
//       LEFT JOIN program_level pl ON af.program_level_id = pl.id
//       GROUP BY pl.discipline
//       ORDER BY count DESC`
//     );
//     console.log('=== PROGRAM STATS ===', programStats);

//     // Gender distribution - MORE LENIENT
//     const [genderStats] = await connection.execute<any[]>(
//       `SELECT 
//         gender,
//         COUNT(*) as count
//       FROM admission_form
//       WHERE gender IS NOT NULL AND gender != ''
//       GROUP BY gender`
//     );
//     console.log('=== GENDER STATS ===', genderStats);

//     // Category distribution - MORE LENIENT
//     const [categoryStats] = await connection.execute<any[]>(
//       `SELECT 
//         category,
//         COUNT(*) as count
//       FROM admission_form
//       WHERE category IS NOT NULL AND category != ''
//       GROUP BY category
//       ORDER BY count DESC`
//     );
//     console.log('=== CATEGORY STATS ===', categoryStats);

//     // Top 10 cities - MORE LENIENT
//     const [cityStats] = await connection.execute<any[]>(
//       `SELECT 
//         city,
//         state,
//         COUNT(*) as count
//       FROM admission_form
//       WHERE city IS NOT NULL AND city != ''
//       GROUP BY city, state
//       ORDER BY count DESC
//       LIMIT 10`
//     );
//     console.log('=== CITY STATS ===', cityStats);

//     // State distribution
//     const [stateStats] = await connection.execute<any[]>(
//       `SELECT 
//         state,
//         COUNT(*) as count
//       FROM admission_form
//       WHERE state IS NOT NULL AND state != ''
//       GROUP BY state
//       ORDER BY count DESC`
//     );

//     // Applications over time (last 6 months) - UPDATED to use submitted_at
//     const [timelineStats] = await connection.execute<any[]>(
//       `SELECT 
//         DATE(submitted_at) as date,
//         COUNT(*) as count
//       FROM admission_form
//       WHERE submitted_at IS NOT NULL 
//         AND submitted_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
//       GROUP BY DATE(submitted_at)
//       ORDER BY date ASC`
//     );
//     console.log('=== TIMELINE STATS (submitted_at) ===', timelineStats);

//     // Top 10 courses - MORE LENIENT
//     const [courseStats] = await connection.execute<any[]>(
//       `SELECT 
//         COALESCE(c.course_name, 'Unknown') as course_name,
//         COALESCE(d.degree_name, 'Unknown') as degree_name,
//         COUNT(*) as count
//       FROM admission_form af
//       LEFT JOIN courses c ON af.course_id = c.id
//       LEFT JOIN degrees d ON af.degree_id = d.id
//       GROUP BY c.course_name, d.degree_name
//       ORDER BY count DESC
//       LIMIT 10`
//     );
//     console.log('=== COURSE STATS ===', courseStats);

//     // Recent applications - MORE LENIENT
//     const [recentApplications] = await connection.execute<any[]>(
//       `SELECT 
//         af.full_name,
//         af.email,
//         COALESCE(pl.discipline, 'Not Selected') as program,
//         COALESCE(c.course_name, 'Not Selected') as course,
//         COALESCE(af.payment_status, 'draft') as payment_status,
//         COALESCE(af.form_status, 'draft') as form_status,
//         af.created_at
//       FROM admission_form af
//       LEFT JOIN program_level pl ON af.program_level_id = pl.id
//       LEFT JOIN courses c ON af.course_id = c.id
//       ORDER BY af.created_at DESC
//       LIMIT 10`
//     );
//     console.log('=== RECENT APPS ===', recentApplications);

//     return {
//       overview: {
//         total: totalResult[0]?.count || 0,
//         submitted: submittedResult[0]?.count || 0,
//         draft: draftResult[0]?.count || 0,
//         pending: pendingResult[0]?.count || 0,
//       },
//       programStats: programStats || [],
//       courseStats: courseStats || [],
//       demographics: {
//         gender: genderStats || [],
//         category: categoryStats || [],
//         nationality: [],
//       },
//       geography: {
//         cities: cityStats || [],
//         states: stateStats || [],
//       },
//       timeline: timelineStats || [],
//       recentApplications: recentApplications || [],
//     };
//   } catch (error) {
//     console.error('MySQL Dashboard Stats Error:', error);
//     throw error;
//   } finally {
//     await connection.end();
//   }
// }


// async function getDashboardStatsSupabase() {
//   try {
//     // Overview stats
//     const { count: total } = await supabase
//       .from('admission_form')
//       .select('*', { count: 'exact', head: true });

//     const { count: submitted } = await supabase
//       .from('admission_form')
//       .select('*', { count: 'exact', head: true })
//       .eq('payment_status', 'completed');

//     const { count: draft } = await supabase
//       .from('admission_form')
//       .select('*', { count: 'exact', head: true })
//       .or('form_status.eq.draft,form_status.is.null');

//     const { count: pending } = await supabase
//       .from('admission_form')
//       .select('*', { count: 'exact', head: true })
//       .eq('payment_status', 'pending');

//     // Get all forms - SIMPLIFIED to see what we get
//     const { data: forms, error: formsError } = await supabase
//       .from('admission_form')
//       .select('*');

//     console.log('=== SUPABASE FORMS COUNT ===', forms?.length);
//     console.log('=== SUPABASE FORMS ERROR ===', formsError);
//     console.log('=== SAMPLE FORM ===', forms?.[0]);

//     if (!forms || forms.length === 0) {
//       return {
//         overview: {
//           total: total || 0,
//           submitted: submitted || 0,
//           draft: draft || 0,
//           pending: pending || 0,
//         },
//         programStats: [],
//         courseStats: [],
//         demographics: {
//           gender: [],
//           category: [],
//           nationality: [],
//         },
//         geography: {
//           cities: [],
//           states: [],
//         },
//         timeline: [],
//         recentApplications: [],
//       };
//     }

//     // Gender stats - DIRECT from forms
//     const genderStats = forms
//       .filter(f => f.gender && f.gender !== '')
//       .reduce((acc: any[], curr: any) => {
//         const existing = acc.find(g => g.gender === curr.gender);
//         if (existing) {
//           existing.count++;
//         } else {
//           acc.push({ gender: curr.gender, count: 1 });
//         }
//         return acc;
//       }, []);
//     console.log('=== GENDER STATS ===', genderStats);

//     // Category stats - DIRECT from forms
//     const categoryStats = forms
//       .filter(f => f.category && f.category !== '')
//       .reduce((acc: any[], curr: any) => {
//         const existing = acc.find(c => c.category === curr.category);
//         if (existing) {
//           existing.count++;
//         } else {
//           acc.push({ category: curr.category, count: 1 });
//         }
//         return acc;
//       }, [])
//       .sort((a, b) => b.count - a.count);
//     console.log('=== CATEGORY STATS ===', categoryStats);

//     // City stats - DIRECT from forms
//     const cityStats = forms
//       .filter(f => f.city && f.city !== '')
//       .reduce((acc: any[], curr: any) => {
//         const existing = acc.find(c => c.city === curr.city && c.state === curr.state);
//         if (existing) {
//           existing.count++;
//         } else {
//           acc.push({ city: curr.city, state: curr.state || 'Unknown', count: 1 });
//         }
//         return acc;
//       }, [])
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 10);
//     console.log('=== CITY STATS ===', cityStats);

//     // Program stats with BETTER error handling
//     const programMap: { [key: number]: string } = {};
//     const { data: programLevels } = await supabase
//       .from('program_level')
//       .select('id, discipline');
    
//     programLevels?.forEach((pl: any) => {
//       programMap[pl.id] = pl.discipline;
//     });
//     console.log('=== PROGRAM MAP ===', programMap);

//     const programStats = forms
//       .filter(f => f.program_level_id)
//       .reduce((acc: any[], curr: any) => {
//         const program = programMap[curr.program_level_id] || 'Unknown';
//         const existing = acc.find(p => p.program_name === program);
//         if (existing) {
//           existing.count++;
//         } else {
//           acc.push({ program_name: program, count: 1 });
//         }
//         return acc;
//       }, [])
//       .sort((a, b) => b.count - a.count);
//     console.log('=== PROGRAM STATS ===', programStats);

//     // Timeline stats - UPDATED to use submitted_at for last 6 months
//     const sixMonthsAgo = new Date();
//     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//     const timelineStats = forms
//       .filter(f => f.submitted_at && new Date(f.submitted_at) >= sixMonthsAgo)
//       .reduce((acc: any[], curr: any) => {
//         // Extract date from timestamp format: "2026-01-01 09:21:55.444"
//         const dateStr = curr.submitted_at.split(' ')[0]; // Gets "2026-01-01"
//         const existing = acc.find(t => t.date === dateStr);
//         if (existing) {
//           existing.count++;
//         } else {
//           acc.push({ date: dateStr, count: 1 });
//         }
//         return acc;
//       }, [])
//       .sort((a, b) => a.date.localeCompare(b.date));
//     console.log('=== TIMELINE STATS (submitted_at) ===', timelineStats);

//     // Course stats with BETTER error handling
//     const courseMap: { [key: number]: string } = {};
//     const degreeMap: { [key: number]: string } = {};
    
//     const { data: courses } = await supabase
//       .from('courses')
//       .select('id, course_name');
    
//     const { data: degrees } = await supabase
//       .from('degrees')
//       .select('id, degree_name');
    
//     courses?.forEach((c: any) => {
//       courseMap[c.id] = c.course_name;
//     });
    
//     degrees?.forEach((d: any) => {
//       degreeMap[d.id] = d.degree_name;
//     });

//     const courseStats = forms
//       .filter(f => f.course_id)
//       .reduce((acc: any[], curr: any) => {
//         const courseName = courseMap[curr.course_id] || 'Unknown';
//         const degreeName = degreeMap[curr.degree_id] || '';
//         const existing = acc.find(c => c.course_name === courseName);
//         if (existing) {
//           existing.count++;
//         } else {
//           acc.push({ course_name: courseName, degree_name: degreeName, count: 1 });
//         }
//         return acc;
//       }, [])
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 10);
//     console.log('=== COURSE STATS ===', courseStats);

//     // Recent applications
//     const recentApplications = forms
//       .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//       .slice(0, 10)
//       .map(app => ({
//         full_name: app.full_name || 'N/A',
//         email: app.email || 'N/A',
//         program: programMap[app.program_level_id] || 'Not Selected',
//         course: courseMap[app.course_id] || 'Not Selected',
//         payment_status: app.payment_status || 'draft',
//         form_status: app.form_status || 'draft',
//         created_at: app.created_at,
//       }));

//     return {
//       overview: {
//         total: total || 0,
//         submitted: submitted || 0,
//         draft: draft || 0,
//         pending: pending || 0,
//       },
//       programStats,
//       courseStats,
//       demographics: {
//         gender: genderStats,
//         category: categoryStats,
//         nationality: [],
//       },
//       geography: {
//         cities: cityStats,
//         states: [],
//       },
//       timeline: timelineStats,
//       recentApplications,
//     };
//   } catch (error) {
//     console.error('Supabase Dashboard Stats Error:', error);
//     throw error;
//   }
// }


// export async function GET(request: Request) {
//   try {
//     const stats = isDevelopment
//       ? await getDashboardStatsSupabase()
//       : await getDashboardStatsMySQL();

//     console.log('=== FINAL STATS RESPONSE ===', JSON.stringify(stats, null, 2));
//     return NextResponse.json(stats);
//   } catch (error: any) {
//     console.error('Error fetching dashboard stats:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch dashboard statistics', details: error.message },
//       { status: 500 }
//     );
//   }
// }








// app/api/sys-ops/dashboard-stats/route.ts - Add year filtering
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

async function getDashboardStatsMySQL(year?: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  const yearFilter = year ? `WHERE academic_year = ?` : '';
  const yearParam = year ? [year] : [];
  
  try {
    // Overview stats with year filter
    const [totalResult] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM admission_form ${yearFilter}`,
      yearParam
    );
    
    const [submittedResult] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM admission_form ${yearFilter ? 'WHERE academic_year = ? AND' : 'WHERE'} payment_status = ?`,
      year ? [year, 'completed'] : ['completed']
    );
    
    const [draftResult] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM admission_form ${yearFilter ? 'WHERE academic_year = ? AND' : 'WHERE'} (form_status = ? OR form_status IS NULL)`,
      year ? [year, 'draft'] : ['draft']
    );
    
    const [pendingResult] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM admission_form ${yearFilter ? 'WHERE academic_year = ? AND' : 'WHERE'} payment_status = ?`,
      year ? [year, 'pending'] : ['pending']
    );

    // All other stats with year filter
    const [programStats] = await connection.execute<any[]>(
      `SELECT 
        COALESCE(pl.discipline, 'Unknown') as program_name,
        COUNT(*) as count
      FROM admission_form af
      LEFT JOIN program_level pl ON af.program_level_id = pl.id
      ${yearFilter}
      GROUP BY pl.discipline
      ORDER BY count DESC`,
      yearParam
    );

    const [genderStats] = await connection.execute<any[]>(
      `SELECT 
        gender,
        COUNT(*) as count
      FROM admission_form
      ${yearFilter ? 'WHERE academic_year = ? AND' : 'WHERE'} gender IS NOT NULL AND gender != ''
      GROUP BY gender`,
      year ? [year] : []
    );

    const [categoryStats] = await connection.execute<any[]>(
      `SELECT 
        category,
        COUNT(*) as count
      FROM admission_form
      ${yearFilter ? 'WHERE academic_year = ? AND' : 'WHERE'} category IS NOT NULL AND category != ''
      GROUP BY category
      ORDER BY count DESC`,
      year ? [year] : []
    );

    const [cityStats] = await connection.execute<any[]>(
      `SELECT 
        city,
        state,
        COUNT(*) as count
      FROM admission_form
      ${yearFilter ? 'WHERE academic_year = ? AND' : 'WHERE'} city IS NOT NULL AND city != ''
      GROUP BY city, state
      ORDER BY count DESC
      LIMIT 10`,
      year ? [year] : []
    );

    const [stateStats] = await connection.execute<any[]>(
      `SELECT 
        state,
        COUNT(*) as count
      FROM admission_form
      ${yearFilter ? 'WHERE academic_year = ? AND' : 'WHERE'} state IS NOT NULL AND state != ''
      GROUP BY state
      ORDER BY count DESC`,
      year ? [year] : []
    );

    const [timelineStats] = await connection.execute<any[]>(
      `SELECT 
        DATE(submitted_at) as date,
        COUNT(*) as count
      FROM admission_form
      WHERE submitted_at IS NOT NULL 
        AND submitted_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        ${year ? 'AND academic_year = ?' : ''}
      GROUP BY DATE(submitted_at)
      ORDER BY date ASC`,
      year ? [year] : []
    );

    const [courseStats] = await connection.execute<any[]>(
      `SELECT 
        COALESCE(c.course_name, 'Unknown') as course_name,
        COALESCE(d.degree_name, 'Unknown') as degree_name,
        COUNT(*) as count
      FROM admission_form af
      LEFT JOIN courses c ON af.course_id = c.id
      LEFT JOIN degrees d ON af.degree_id = d.id
      ${yearFilter}
      GROUP BY c.course_name, d.degree_name
      ORDER BY count DESC
      LIMIT 10`,
      yearParam
    );

    const [recentApplications] = await connection.execute<any[]>(
      `SELECT 
        af.full_name,
        af.email,
        COALESCE(pl.discipline, 'Not Selected') as program,
        COALESCE(c.course_name, 'Not Selected') as course,
        COALESCE(af.payment_status, 'draft') as payment_status,
        COALESCE(af.form_status, 'draft') as form_status,
        af.created_at
      FROM admission_form af
      LEFT JOIN program_level pl ON af.program_level_id = pl.id
      LEFT JOIN courses c ON af.course_id = c.id
      ${yearFilter}
      ORDER BY af.created_at DESC
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

async function getDashboardStatsSupabase(year?: string) {
  try {
    // Build query with optional year filter
    let query = supabase.from('admission_form').select('*');
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

    // Calculate overview stats
    const total = forms.length;
    const submitted = forms.filter(f => f.payment_status === 'completed').length;
    const draft = forms.filter(f => !f.form_status || f.form_status === 'draft').length;
    const pending = forms.filter(f => f.payment_status === 'pending').length;

    // Rest of the Supabase stats logic remains the same...
    // (Gender, category, city, program, timeline, etc.)
    
    const genderStats = forms
      .filter(f => f.gender && f.gender !== '')
      .reduce((acc: any[], curr: any) => {
        const existing = acc.find(g => g.gender === curr.gender);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ gender: curr.gender, count: 1 });
        }
        return acc;
      }, []);

    const categoryStats = forms
      .filter(f => f.category && f.category !== '')
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

    const cityStats = forms
      .filter(f => f.city && f.city !== '')
      .reduce((acc: any[], curr: any) => {
        const existing = acc.find(c => c.city === curr.city && c.state === curr.state);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ city: curr.city, state: curr.state || 'Unknown', count: 1 });
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
        const dateStr = curr.submitted_at.split(' ')[0];
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
      .from('courses')
      .select('id, course_name');
    
    const { data: degrees } = await supabase
      .from('degrees')
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
        full_name: app.full_name || 'N/A',
        email: app.email || 'N/A',
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
