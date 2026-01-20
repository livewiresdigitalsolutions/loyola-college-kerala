// import { NextResponse } from 'next/server';
// import mysql from 'mysql2/promise';
// import { createClient } from '@supabase/supabase-js';
// import { RowDataPacket } from 'mysql2';

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

// interface CountResult extends RowDataPacket {
//   count: number;
// }

// async function getStatsMySQL() {
//   const connection = await mysql.createConnection(mysqlConfig);
  
//   try {
//     const [totalResult] = await connection.execute<CountResult[]>(
//       'SELECT COUNT(*) as count FROM admission_form'
//     );
    
//     const [submittedResult] = await connection.execute<CountResult[]>(
//       'SELECT COUNT(*) as count FROM admission_form WHERE payment_status = ?',
//       ['completed']
//     );
    
//     const [draftResult] = await connection.execute<CountResult[]>(
//       'SELECT COUNT(*) as count FROM admission_form WHERE form_status = ? OR form_status IS NULL',
//       ['draft']
//     );
    
//     const [paymentPendingResult] = await connection.execute<CountResult[]>(
//       'SELECT COUNT(*) as count FROM admission_form WHERE payment_status = ?',
//       ['pending']
//     );

//     const total = totalResult[0]?.count || 0;
//     const submitted = submittedResult[0]?.count || 0;
//     const draft = draftResult[0]?.count || 0;
//     const pending = paymentPendingResult[0]?.count || 0;

//     return { total, submitted, draft, pending };
//   } catch (error) {
//     console.error('MySQL Stats Error:', error);
//     throw error;
//   } finally {
//     await connection.end();
//   }
// }

// async function getStatsSupabase() {
//   try {
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

//     return {
//       total: total || 0,
//       submitted: submitted || 0,
//       draft: draft || 0,
//       pending: pending || 0,
//     };
//   } catch (error) {
//     console.error('Supabase Stats Error:', error);
//     throw error;
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const stats = isDevelopment
//       ? await getStatsSupabase()
//       : await getStatsMySQL();

//     return NextResponse.json(stats);
//   } catch (error: any) {
//     console.error('Error fetching stats:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch statistics', details: error.message },
//       { status: 500 }
//     );
//   }
// }






// app/api/sys-ops/dashboard-stats/route.ts
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

async function getDashboardStatsMySQL() {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    // Basic stats
    const [totalResult] = await connection.execute<any[]>(
      'SELECT COUNT(*) as count FROM admission_form'
    );
    
    const [submittedResult] = await connection.execute<any[]>(
      'SELECT COUNT(*) as count FROM admission_form WHERE payment_status = ?',
      ['completed']
    );
    
    const [draftResult] = await connection.execute<any[]>(
      'SELECT COUNT(*) as count FROM admission_form WHERE form_status = ? OR form_status IS NULL',
      ['draft']
    );
    
    const [pendingResult] = await connection.execute<any[]>(
      'SELECT COUNT(*) as count FROM admission_form WHERE payment_status = ?',
      ['pending']
    );

    // Applications by program
    const [programStats] = await connection.execute<any[]>(
      `SELECT 
        pl.discipline as program_name,
        COUNT(*) as count
      FROM admission_form af
      JOIN program_level pl ON af.program_level_id = pl.id
      GROUP BY af.program_level_id, pl.discipline
      ORDER BY count DESC`
    );

    // Applications by course (top 10)
    const [courseStats] = await connection.execute<any[]>(
      `SELECT 
        c.course_name,
        d.degree_name,
        COUNT(*) as count
      FROM admission_form af
      JOIN courses c ON af.course_id = c.id
      JOIN degrees d ON af.degree_id = d.id
      GROUP BY af.course_id, c.course_name, d.degree_name
      ORDER BY count DESC
      LIMIT 10`
    );

    // Gender distribution
    const [genderStats] = await connection.execute<any[]>(
      `SELECT 
        gender,
        COUNT(*) as count
      FROM admission_form
      WHERE gender IS NOT NULL
      GROUP BY gender`
    );

    // Category distribution
    const [categoryStats] = await connection.execute<any[]>(
      `SELECT 
        category,
        COUNT(*) as count
      FROM admission_form
      WHERE category IS NOT NULL
      GROUP BY category`
    );

    // Geographic distribution (top 10 cities)
    const [cityStats] = await connection.execute<any[]>(
      `SELECT 
        city,
        state,
        COUNT(*) as count
      FROM admission_form
      WHERE city IS NOT NULL
      GROUP BY city, state
      ORDER BY count DESC
      LIMIT 10`
    );

    // State distribution
    const [stateStats] = await connection.execute<any[]>(
      `SELECT 
        state,
        COUNT(*) as count
      FROM admission_form
      WHERE state IS NOT NULL
      GROUP BY state
      ORDER BY count DESC`
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

    // Academic performance distribution (10th percentage)
    const [tenthPercentageStats] = await connection.execute<any[]>(
      `SELECT 
        CASE 
          WHEN CAST(tenth_percentage AS DECIMAL) >= 90 THEN '90-100%'
          WHEN CAST(tenth_percentage AS DECIMAL) >= 80 THEN '80-89%'
          WHEN CAST(tenth_percentage AS DECIMAL) >= 70 THEN '70-79%'
          WHEN CAST(tenth_percentage AS DECIMAL) >= 60 THEN '60-69%'
          ELSE 'Below 60%'
        END as percentage_range,
        COUNT(*) as count
      FROM admission_form
      WHERE tenth_percentage IS NOT NULL AND tenth_percentage != ''
      GROUP BY percentage_range
      ORDER BY MIN(CAST(tenth_percentage AS DECIMAL)) DESC`
    );

    // 12th percentage distribution
    const [twelfthPercentageStats] = await connection.execute<any[]>(
      `SELECT 
        CASE 
          WHEN CAST(twelfth_percentage AS DECIMAL) >= 90 THEN '90-100%'
          WHEN CAST(twelfth_percentage AS DECIMAL) >= 80 THEN '80-89%'
          WHEN CAST(twelfth_percentage AS DECIMAL) >= 70 THEN '70-79%'
          WHEN CAST(twelfth_percentage AS DECIMAL) >= 60 THEN '60-69%'
          ELSE 'Below 60%'
        END as percentage_range,
        COUNT(*) as count
      FROM admission_form
      WHERE twelfth_percentage IS NOT NULL AND twelfth_percentage != ''
      GROUP BY percentage_range
      ORDER BY MIN(CAST(twelfth_percentage AS DECIMAL)) DESC`
    );

    // Nationality distribution
    const [nationalityStats] = await connection.execute<any[]>(
      `SELECT 
        nationality,
        COUNT(*) as count
      FROM admission_form
      WHERE nationality IS NOT NULL
      GROUP BY nationality
      ORDER BY count DESC
      LIMIT 10`
    );

    // Exam center distribution
    const [examCenterStats] = await connection.execute<any[]>(
      `SELECT 
        ec.centre_name,
        COUNT(*) as count
      FROM admission_form af
      JOIN exam_centers ec ON af.exam_center_id = ec.id
      GROUP BY af.exam_center_id, ec.centre_name
      ORDER BY count DESC`
    );

    // Recent applications (last 10)
    const [recentApplications] = await connection.execute<any[]>(
      `SELECT 
        af.full_name,
        af.email,
        pl.discipline as program,
        c.course_name as course,
        af.payment_status,
        af.form_status,
        af.created_at
      FROM admission_form af
      LEFT JOIN program_level pl ON af.program_level_id = pl.id
      LEFT JOIN courses c ON af.course_id = c.id
      ORDER BY af.created_at DESC
      LIMIT 10`
    );

    return {
      overview: {
        total: totalResult[0]?.count || 0,
        submitted: submittedResult[0]?.count || 0,
        draft: draftResult[0]?.count || 0,
        pending: pendingResult[0]?.count || 0,
      },
      programStats,
      courseStats,
      demographics: {
        gender: genderStats,
        category: categoryStats,
        nationality: nationalityStats,
      },
      geography: {
        cities: cityStats,
        states: stateStats,
      },
      academic: {
        tenthPercentage: tenthPercentageStats,
        twelfthPercentage: twelfthPercentageStats,
      },
      examCenters: examCenterStats,
      timeline: timelineStats,
      recentApplications,
    };
  } finally {
    await connection.end();
  }
}

async function getDashboardStatsSupabase() {
  try {
    // Basic stats
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

    const { count: pending } = await supabase
      .from('admission_form')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'pending');

    // Program stats
    const { data: programs } = await supabase
      .from('admission_form')
      .select('program_level_id, program_level(discipline)')
      .not('program_level_id', 'is', null);

    const programStats = programs?.reduce((acc: any[], curr: any) => {
      const program = curr.program_level?.discipline || 'Unknown';
      const existing = acc.find(p => p.program_name === program);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ program_name: program, count: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count) || [];

    // Course stats
    const { data: courses } = await supabase
      .from('admission_form')
      .select('course_id, courses(course_name), degrees(degree_name)')
      .not('course_id', 'is', null)
      .limit(1000);

    const courseStats = courses?.reduce((acc: any[], curr: any) => {
      const courseName = curr.courses?.course_name || 'Unknown';
      const degreeName = curr.degrees?.degree_name || '';
      const existing = acc.find(c => c.course_name === courseName);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ course_name: courseName, degree_name: degreeName, count: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count).slice(0, 10) || [];

    // Gender distribution
    const { data: genderData } = await supabase
      .from('admission_form')
      .select('gender')
      .not('gender', 'is', null);

    const genderStats = genderData?.reduce((acc: any[], curr: any) => {
      const existing = acc.find(g => g.gender === curr.gender);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ gender: curr.gender, count: 1 });
      }
      return acc;
    }, []) || [];

    // Category distribution
    const { data: categoryData } = await supabase
      .from('admission_form')
      .select('category')
      .not('category', 'is', null);

    const categoryStats = categoryData?.reduce((acc: any[], curr: any) => {
      const existing = acc.find(c => c.category === curr.category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ category: curr.category, count: 1 });
      }
      return acc;
    }, []) || [];

    // City distribution
    const { data: cityData } = await supabase
      .from('admission_form')
      .select('city, state')
      .not('city', 'is', null)
      .limit(1000);

    const cityStats = cityData?.reduce((acc: any[], curr: any) => {
      const existing = acc.find(c => c.city === curr.city && c.state === curr.state);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ city: curr.city, state: curr.state, count: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count).slice(0, 10) || [];

    // State distribution
    const { data: stateData } = await supabase
      .from('admission_form')
      .select('state')
      .not('state', 'is', null);

    const stateStats = stateData?.reduce((acc: any[], curr: any) => {
      const existing = acc.find(s => s.state === curr.state);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ state: curr.state, count: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count) || [];

    // Recent applications
    const { data: recentApplications } = await supabase
      .from('admission_form')
      .select(`
        full_name,
        email,
        payment_status,
        form_status,
        created_at,
        program_level(discipline),
        courses(course_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      overview: {
        total: total || 0,
        submitted: submitted || 0,
        draft: draft || 0,
        pending: pending || 0,
      },
      programStats,
      courseStats,
      demographics: {
        gender: genderStats,
        category: categoryStats,
        nationality: [],
      },
      geography: {
        cities: cityStats,
        states: stateStats,
      },
      academic: {
        tenthPercentage: [],
        twelfthPercentage: [],
      },
      examCenters: [],
      timeline: [],
      recentApplications: recentApplications?.map((app: any) => ({
        full_name: app.full_name,
        email: app.email,
        program: app.program_level?.discipline || 'N/A',
        course: app.courses?.course_name || 'N/A',
        payment_status: app.payment_status,
        form_status: app.form_status,
        created_at: app.created_at,
      })) || [],
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
