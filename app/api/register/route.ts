// app/api/register/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const isDevelopment = process.env.DB_TYPE === 'supabase';
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
  academicYear: string;
}

// Fetch configuration value
async function fetchConfigValue(key: string): Promise<string | null> {
  try {
    if (isDevelopment) {
      const { data, error } = await supabase
        .from('configuration_values')
        .select('value')
        .eq('key', key)
        .single();

      if (error) throw error;
      return data?.value || null;
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      const [rows] = await connection.execute(
        'SELECT `value` FROM configuration_values WHERE `key` = ?',
        [key]
      );
      await connection.end();
      
      const result = rows as any[];
      return result.length > 0 ? result[0].value : null;
    }
  } catch (error) {
    console.error(`Error fetching config ${key}:`, error);
    return null;
  }
}

async function registerWithMySQL(data: RegistrationData) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    await connection.beginTransaction();

    // Check if email already exists for this academic year
    const [existingEnquiry] = await connection.execute(
      'SELECT email FROM admission_enquiry WHERE email = ? AND academic_year = ?',
      [data.email, data.academicYear]
    );

    if (Array.isArray(existingEnquiry) && existingEnquiry.length > 0) {
      throw new Error('Already registered for this academic year');
    }

    // Check if email exists in user_credentials
    const [existingCred] = await connection.execute(
      'SELECT email, is_admission_enquiry FROM user_credentials WHERE email = ?',
      [data.email]
    );

    let isNewCredential = false;

    if (Array.isArray(existingCred) && existingCred.length > 0) {
      const existingUser = existingCred[0] as any;
      
      // If user exists but not as admission enquiry, update the flag
      if (!existingUser.is_admission_enquiry) {
        await connection.execute(
          'UPDATE user_credentials SET is_admission_enquiry = ? WHERE email = ?',
          [true, data.email]
        );
      }
    } else {
      // New user - create credentials
      isNewCredential = true;
      const passwordHash = await bcrypt.hash(data.mobileNumber, SALT_ROUNDS);

      await connection.execute(
        'INSERT INTO user_credentials (email, password_hash, is_admission_enquiry) VALUES (?, ?, ?)',
        [data.email, passwordHash, true]
      );
    }

    // Insert into admission_enquiry with academic year
    await connection.execute(
      `INSERT INTO admission_enquiry 
       (name, email, mobile_number, state, city, program_level_id, degree_id, course_id, consent, academic_year) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        data.academicYear,
      ]
    );

    await connection.commit();
    return { success: true, isNewCredential };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

async function registerWithSupabase(data: RegistrationData) {
  // Check if email already exists for this academic year
  const { data: existingEnquiry } = await supabase
    .from('admission_enquiry')
    .select('email')
    .eq('email', data.email)
    .eq('academic_year', data.academicYear)
    .single();

  if (existingEnquiry) {
    throw new Error('Already registered for this academic year');
  }

  // Check if email exists in user_credentials
  const { data: existingCred } = await supabase
    .from('user_credentials')
    .select('email, is_admission_enquiry')
    .eq('email', data.email)
    .single();

  let isNewCredential = false;

  if (existingCred) {
    // If user exists but not as admission enquiry, update the flag
    if (!existingCred.is_admission_enquiry) {
      const { error: updateError } = await supabase
        .from('user_credentials')
        .update({ is_admission_enquiry: true })
        .eq('email', data.email);

      if (updateError) throw updateError;
    }
  } else {
    // New user - create credentials
    isNewCredential = true;
    const passwordHash = await bcrypt.hash(data.mobileNumber, SALT_ROUNDS);

    const { error: credError } = await supabase
      .from('user_credentials')
      .insert({ 
        email: data.email, 
        password_hash: passwordHash,
        is_admission_enquiry: true
      });

    if (credError) throw credError;
  }

  // Insert into admission_enquiry with academic year
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
      academic_year: data.academicYear,
    });

  if (enquiryError) throw enquiryError;

  return { success: true, isNewCredential };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Fetch academic year configuration
    const admissionsOpen = await fetchConfigValue('admissions_open');
    const academicYearLabel = await fetchConfigValue('academic_year_label');

    // Check if admissions are open
    if (admissionsOpen !== 'true') {
      return NextResponse.json(
        { error: 'Admissions are currently closed. Please check back later.' },
        { status: 400 }
      );
    }

    // Check if academic year is configured
    if (!academicYearLabel) {
      return NextResponse.json(
        { error: 'Academic year not configured. Please contact administration.' },
        { status: 400 }
      );
    }

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
      academicYear: academicYearLabel,
    };

    // Validate required fields
    if (!registrationData.name || !registrationData.email || !registrationData.mobileNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate mobile number format
    if (!/^\d{10}$/.test(registrationData.mobileNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await registerWithSupabase(registrationData)
      : await registerWithMySQL(registrationData);

    return NextResponse.json({
      success: true,
      message: result.isNewCredential 
        ? `Registration successful for ${academicYearLabel}! Please login with your email and mobile number.`
        : `Registration successful for ${academicYearLabel}! You can login with your existing credentials.`,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'Already registered for this academic year') {
      return NextResponse.json(
        { error: 'You have already registered for this academic year. Please login to continue.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
