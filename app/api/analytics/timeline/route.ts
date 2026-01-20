// // app/api/analytics/timeline/route.ts
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

// export async function GET() {
//   try {
//     if (isDevelopment) {
//       // Supabase query
//       const { data, error } = await supabase
//         .from('admission_form')
//         .select('submitted_at')
//         .not('submitted_at', 'is', null)
//         .order('submitted_at', { ascending: true });

//       if (error) throw error;

//       // Group by date and count
//       const timeline = data.reduce((acc: any, item: any) => {
//         const date = item.submitted_at.split(' ')[0]; // Get just the date part
//         if (!acc[date]) {
//           acc[date] = { date, count: 0 };
//         }
//         acc[date].count += 1;
//         return acc;
//       }, {});

//       const result = Object.values(timeline);
//       return NextResponse.json(result);
//     } else {
//       // MySQL query
//       const connection = await mysql.createConnection(mysqlConfig);
      
//       const [rows] = await connection.execute(`
//         SELECT 
//           DATE(submitted_at) as date,
//           COUNT(*) as count
//         FROM admission_form
//         WHERE submitted_at IS NOT NULL
//         GROUP BY DATE(submitted_at)
//         ORDER BY date ASC
//       `);
      
//       await connection.end();
//       return NextResponse.json(rows);
//     }
//   } catch (error: any) {
//     console.error('Error fetching timeline data:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch timeline data', details: error.message },
//       { status: 500 }
//     );
//   }
// }





// app/api/analytics/timeline/route.ts
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

export async function GET() {
  try {
    if (isDevelopment) {
      // Supabase query
      const { data, error } = await supabase
        .from('admission_form')
        .select('submitted_at')
        .not('submitted_at', 'is', null)
        .order('submitted_at', { ascending: true });

      if (error) throw error;

      // Group by date and count - FIXED VERSION
      const timeline = data.reduce((acc: Record<string, { date: string; count: number }>, item: any) => {
        const date = item.submitted_at.split(' ')[0]; // Get just the date part
        
        if (!acc[date]) {
          acc[date] = { date, count: 0 };
        }
        // This will properly sum all registrations for the same date
        acc[date].count += 1;
        
        return acc;
      }, {});

      const result = Object.values(timeline);
      return NextResponse.json(result);
    } else {
      // MySQL query
      const connection = await mysql.createConnection(mysqlConfig);
      
      const [rows] = await connection.execute(`
        SELECT 
          DATE(submitted_at) as date,
          COUNT(*) as count
        FROM admission_form
        WHERE submitted_at IS NOT NULL
        GROUP BY DATE(submitted_at)
        ORDER BY date ASC
      `);
      
      await connection.end();
      return NextResponse.json(rows);
    }
  } catch (error: any) {
    console.error('Error fetching timeline data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline data', details: error.message },
      { status: 500 }
    );
  }
}
