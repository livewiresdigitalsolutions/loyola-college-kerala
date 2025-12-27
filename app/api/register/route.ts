// app/api/register/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const isDevelopment = process.env.NODE_ENV === 'development';
const SALT_ROUNDS = 10;

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

interface RegistrationData {
  name: string;
  email: string;
  mobileNumber: string;
  state: string;
  city: string;
  programId: number;
  degreeId: number;
  courseId: number;
  consent: boolean;
}

async function registerWithMySQL(data: RegistrationData) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    await connection.beginTransaction();

    // Check if email already exists
    const [existing] = await connection.execute(
      'SELECT email FROM user_credentials WHERE email = ?',
      [data.email]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password (mobile number)
    const passwordHash = await bcrypt.hash(data.mobileNumber, SALT_ROUNDS);

    // Insert into user_credentials with is_admission_enquiry set to TRUE
    await connection.execute(
      'INSERT INTO user_credentials (email, password_hash, is_admission_enquiry) VALUES (?, ?, ?)',
      [data.email, passwordHash, true]
    );

    // Insert into admission_enquiry
    await connection.execute(
      `INSERT INTO admission_enquiry 
       (name, email, mobile_number, state, city, program_level_id, degree_id, course_id, consent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.email,
        data.mobileNumber,
        data.state,
        data.city,
        data.programId,
        data.degreeId,
        data.courseId,
        data.consent,
      ]
    );

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

async function registerWithSupabase(data: RegistrationData) {
  // Check if email already exists
  const { data: existing } = await supabase
    .from('user_credentials')
    .select('email')
    .eq('email', data.email)
    .single();

  if (existing) {
    throw new Error('Email already registered');
  }

  // Hash password (mobile number)
  const passwordHash = await bcrypt.hash(data.mobileNumber, SALT_ROUNDS);

  // Insert into user_credentials with is_admission_enquiry set to TRUE
  const { error: credError } = await supabase
    .from('user_credentials')
    .insert({ 
      email: data.email, 
      password_hash: passwordHash,
      is_admission_enquiry: true
    });

  if (credError) throw credError;

  // Insert into admission_enquiry
  const { error: enquiryError } = await supabase
    .from('admission_enquiry')
    .insert({
      name: data.name,
      email: data.email,
      mobile_number: data.mobileNumber,
      state: data.state,
      city: data.city,
      program_level_id: data.programId,
      degree_id: data.degreeId,
      course_id: data.courseId,
      consent: data.consent,
    });

  if (enquiryError) throw enquiryError;

  return { success: true };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const registrationData: RegistrationData = {
      name: body.name,
      email: body.email,
      mobileNumber: body.mobileNumber,
      state: body.state,
      city: body.city,
      programId: parseInt(body.programId),
      degreeId: parseInt(body.degreeId),
      courseId: parseInt(body.courseId),
      consent: body.consent,
    };

    // Validate required fields
    if (!registrationData.name || !registrationData.email || !registrationData.mobileNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await registerWithSupabase(registrationData)
      :  await registerWithMySQL(registrationData);

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please login with your email and mobile number.',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'Email already registered') {
      return NextResponse.json(
        { error: 'This email is already registered. Please login.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
