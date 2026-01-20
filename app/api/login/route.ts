// // app/api/login/route.ts
// import { NextResponse } from 'next/server';
// import mysql from 'mysql2/promise';
// import { createClient } from '@supabase/supabase-js';
// import bcrypt from 'bcrypt';

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

// async function loginWithMySQL(email: string, password: string) {
//   const connection = await mysql.createConnection(mysqlConfig);
  
//   try {
//     const [rows] = await connection.execute(
//       'SELECT email, password_hash FROM user_credentials WHERE email = ?',
//       [email]
//     );

//     if (!Array.isArray(rows) || rows.length === 0) {
//       return { success: false, error: 'Invalid email or password' };
//     }

//     const user = rows[0] as { email: string; password_hash: string };
//     const isMatch = await bcrypt.compare(password, user.password_hash);

//     if (!isMatch) {
//       return { success: false, error: 'Invalid email or password' };
//     }

//     return { success: true, email: user.email };
//   } finally {
//     await connection.end();
//   }
// }

// async function loginWithSupabase(email: string, password: string) {
//   const { data: user, error } = await supabase
//     .from('user_credentials')
//     .select('email, password_hash')
//     .eq('email', email)
//     .single();

//   if (error || !user) {
//     return { success: false, error: 'Invalid email or password' };
//   }

//   const isMatch = await bcrypt.compare(password, user.password_hash);

//   if (!isMatch) {
//     return { success: false, error: 'Invalid email or password' };
//   }

//   return { success: true, email: user.email };
// }

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     const result = isDevelopment
//       ? await loginWithSupabase(email, password)
//       : await loginWithMySQL(email, password);

//     if (!result.success) {
//       return NextResponse.json(
//         { error: result.error },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Login successful!',
//       email: result.email,
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'Login failed. Please try again.' },
//       { status: 500 }
//     );
//   }
// }












import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

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

// JWT secret - must be at least 32 characters
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-change-in-production'
);

async function loginWithMySQL(email: string, password: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const [rows] = await connection.execute(
      'SELECT id, email, password_hash FROM user_credentials WHERE email = ?',
      [email]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return { success: false, error: 'Invalid email or password' };
    }

    const user = rows[0] as { id: number; email: string; password_hash: string };
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return { success: false, error: 'Invalid email or password' };
    }

    return { success: true, email: user.email, id: user.id };
  } finally {
    await connection.end();
  }
}

async function loginWithSupabase(email: string, password: string) {
  const { data: user, error } = await supabase
    .from('user_credentials')
    .select('id, email, password_hash')
    .eq('email', email)
    .single();

  if (error || !user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    return { success: false, error: 'Invalid email or password' };
  }

  return { success: true, email: user.email, id: user.id };
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await loginWithSupabase(email, password)
      : await loginWithMySQL(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    // Create JWT token with user information
    const token = await new SignJWT({ 
      email: result.email,
      id: result.id,
      loginTime: Date.now()
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h') // Token expires in 8 hours
      .sign(JWT_SECRET);

    // Create response with success message
    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      email: result.email,
    });

    // Set HTTP-only cookie with the JWT token
    response.cookies.set('auth_token', token, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 60 * 60 * 8, // 8 hours in seconds
      path: '/', // Cookie available for all routes
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
