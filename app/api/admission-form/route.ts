// app/api/admission-form/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { getAcademicYearConfig } from '@/app/lib/academicYearConfig';

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

async function saveFormMySQL(email: string, formData: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.beginTransaction();

    const academicYear = getAcademicYearConfig();

    // Check if form already exists
    const [existing] = await connection.execute(
      'SELECT id FROM admission_form WHERE user_email = ?',
      [email]
    );

    let admissionFormId: number;

    if (Array.isArray(existing) && existing.length > 0) {
      admissionFormId = (existing[0] as any).id;

      // Update existing form with all new fields
      await connection.execute(
        `UPDATE admission_form SET
          program_level_id = ?, degree_id = ?, course_id = ?, 
          second_preference_course_id = ?, third_preference_course_id = ?,
          exam_center_id = ?,
          full_name = ?, gender = ?, dob = ?, mobile = ?, email = ?,
          aadhaar = ?, nationality = ?, religion = ?, category = ?, 
          seat_reservation_quota = ?, caste = ?, mother_tongue = ?, nativity = ?,
          blood_group = ?,
          father_name = ?, father_mobile = ?, father_education = ?, father_occupation = ?,
          mother_name = ?, mother_mobile = ?, mother_education = ?, mother_occupation = ?,
          annual_family_income = ?, parent_mobile = ?, parent_email = ?,
          address = ?,
          communication_address = ?, communication_city = ?, communication_state = ?, 
          communication_district = ?, communication_pincode = ?, communication_country = ?,
          permanent_address = ?, permanent_city = ?, permanent_state = ?, 
          permanent_district = ?, permanent_pincode = ?, permanent_country = ?,
          city = ?, state = ?, pincode = ?,
          is_disabled = ?, disability_type = ?, disability_percentage = ?,
          dependent_of = ?, seeking_admission_under_quota = ?, 
          scholarship_or_fee_concession = ?, hostel_accommodation_required = ?,
          emergency_contact_name = ?, emergency_contact_relation = ?, emergency_contact_mobile = ?,
          previous_gap = ?, extracurricular = ?, achievements = ?,
          academic_year = ?, form_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_email = ?`,
        [
          formData.program_level_id || null,
          formData.degree_id || null,
          formData.course_id || null,
          formData.second_preference_course_id || null,
          formData.third_preference_course_id || null,
          formData.exam_center_id || null,
          formData.full_name || null,
          formData.gender || null,
          formData.dob || null,
          formData.mobile || null,
          formData.email || null,
          formData.aadhaar || null,
          formData.nationality || null,
          formData.religion || null,
          formData.category || null,
          formData.seat_reservation_quota || null,
          formData.caste || null,
          formData.mother_tongue || null,
          formData.nativity || null,
          formData.blood_group || null,
          formData.father_name || null,
          formData.father_mobile || null,
          formData.father_education || null,
          formData.father_occupation || null,
          formData.mother_name || null,
          formData.mother_mobile || null,
          formData.mother_education || null,
          formData.mother_occupation || null,
          formData.annual_family_income || null,
          formData.parent_mobile || null,
          formData.parent_email || null,
          formData.address || null,
          formData.communication_address || null,
          formData.communication_city || null,
          formData.communication_state || null,
          formData.communication_district || null,
          formData.communication_pincode || null,
          formData.communication_country || null,
          formData.permanent_address || null,
          formData.permanent_city || null,
          formData.permanent_state || null,
          formData.permanent_district || null,
          formData.permanent_pincode || null,
          formData.permanent_country || null,
          formData.city || null,
          formData.state || null,
          formData.pincode || null,
          formData.is_disabled || 'no',
          formData.disability_type || null,
          formData.disability_percentage || null,
          formData.dependent_of || 'none',
          formData.seeking_admission_under_quota || 'no',
          formData.scholarship_or_fee_concession || 'no',
          formData.hostel_accommodation_required || 'no',
          formData.emergency_contact_name || null,
          formData.emergency_contact_relation || null,
          formData.emergency_contact_mobile || null,
          formData.previous_gap || null,
          formData.extracurricular || null,
          formData.achievements || null,
          academicYear.start,
          formData.form_status || 'draft',
          email
        ]
      );
    } else {
      // Insert new form
      const [insertResult] = await connection.execute(
  `INSERT INTO admission_form (
    user_email, program_level_id, degree_id, course_id,
    second_preference_course_id, third_preference_course_id,
    exam_center_id,
    full_name, gender, dob, mobile, email,
    aadhaar, nationality, religion, category,
    seat_reservation_quota, caste, mother_tongue, nativity,
    blood_group,
    father_name, father_mobile, father_education, father_occupation,
    mother_name, mother_mobile, mother_education, mother_occupation,
    annual_family_income, parent_mobile, parent_email,
    address,
    communication_address, communication_city, communication_state,
    communication_district, communication_pincode, communication_country,
    permanent_address, permanent_city, permanent_state,
    permanent_district, permanent_pincode, permanent_country,
    city, state, pincode,
    is_disabled, disability_type, disability_percentage,
    dependent_of, seeking_admission_under_quota,
    scholarship_or_fee_concession, hostel_accommodation_required,
    emergency_contact_name, emergency_contact_relation, emergency_contact_mobile,
    previous_gap, extracurricular, achievements,
    academic_year, form_status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    // Line 1-7: Program & Course Selection
    formData.user_email || email,
    formData.program_level_id,
    formData.degree_id,
    formData.course_id,
    formData.second_preference_course_id || null,
    formData.third_preference_course_id || null,
    formData.exam_center_id,

    // Line 8-21: Personal Information
    formData.full_name,
    formData.gender,
    formData.dob,
    formData.mobile,
    formData.email,
    formData.aadhaar,
    formData.nationality,
    formData.religion || null,
    formData.category,
    formData.seat_reservation_quota,
    formData.caste,
    formData.mother_tongue,
    formData.nativity,
    formData.blood_group || null,

    // Line 22-32: Parent Information
    formData.father_name,
    formData.father_mobile,
    formData.father_education,
    formData.father_occupation,
    formData.mother_name,
    formData.mother_mobile,
    formData.mother_education,
    formData.mother_occupation,
    formData.annual_family_income,
    formData.parent_mobile || null,
    formData.parent_email || null,

    // Line 33: Legacy address (can be null)
    formData.address || null,

    // Line 34-39: Communication Address
    formData.communication_address,
    formData.communication_city,
    formData.communication_state,
    formData.communication_district,
    formData.communication_pincode,
    formData.communication_country,

    // Line 40-45: Permanent Address
    formData.permanent_address,
    formData.permanent_city,
    formData.permanent_state,
    formData.permanent_district,
    formData.permanent_pincode,
    formData.permanent_country,

    // Line 46-48: Legacy location fields (can be null)
    formData.city || null,
    formData.state || null,
    formData.pincode || null,

    // Line 49-51: Disability Information
    formData.is_disabled || 'no',
    formData.disability_type || null,
    formData.disability_percentage || null,

    // Line 52-55: Additional Information
    formData.dependent_of || 'none',
    formData.seeking_admission_under_quota || 'no',
    formData.scholarship_or_fee_concession || 'no',
    formData.hostel_accommodation_required || 'no',

    // Line 56-58: Emergency Contact
    formData.emergency_contact_name,
    formData.emergency_contact_relation,
    formData.emergency_contact_mobile,

    // Line 59-61: Optional Additional Info
    formData.previous_gap || null,
    formData.extracurricular || null,
    formData.achievements || null,

    // Line 62-63: System fields
    academicYear.start,
    formData.form_status || 'draft'
  ]
);
      admissionFormId = (insertResult as any).insertId;
    }

    // Handle academic marks
    if (formData.academicMarks && Array.isArray(formData.academicMarks)) {
      // Delete existing academic marks for this form
      await connection.execute(
        'DELETE FROM academic_marks WHERE admission_form_id = ?',
        [admissionFormId]
      );

      // Insert new academic marks
      for (const mark of formData.academicMarks) {
        const [markResult] = await connection.execute(
          `INSERT INTO academic_marks (
            admission_form_id, qualification_level, register_number,
            board_or_university, school_or_college, year_of_passing,
            percentage_or_cgpa, stream_or_degree
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            admissionFormId,
            mark.qualification_level,
            mark.register_number || null,
            mark.board_or_university || null,
            mark.school_or_college || null,
            mark.year_of_passing || null,
            mark.percentage_or_cgpa || null,
            mark.stream_or_degree || null
          ]
        );

        const academicMarkId = (markResult as any).insertId;

        // Handle subject-wise marks for 12th standard
        if (mark.qualification_level === '12th' && mark.subjects && Array.isArray(mark.subjects)) {
          for (let i = 0; i < mark.subjects.length && i < 10; i++) {
            const subject = mark.subjects[i];
            await connection.execute(
              `INSERT INTO subject_wise_marks (
                academic_marks_id, subject_name, marks_obtained,
                max_marks, grade, percentage, subject_order
              ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                academicMarkId,
                subject.subject_name || null,
                subject.marks_obtained || null,
                subject.max_marks || null,
                subject.grade || null,
                subject.percentage || null,
                i + 1
              ]
            );
          }
        }
      }
    }

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error('MySQL Save Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function saveFormSupabase(email: string, formData: any) {
  try {
    const academicYear = getAcademicYearConfig();

    const { data: existing, error: fetchError } = await supabase
      .from('admission_form')
      .select('id')
      .eq('user_email', email)
      .single();

    const formDataWithEmail = {
      user_email: email,
      program_level_id: formData.program_level_id || null,
      degree_id: formData.degree_id || null,
      course_id: formData.course_id || null,
      second_preference_course_id: formData.second_preference_course_id || null,
      third_preference_course_id: formData.third_preference_course_id || null,
      exam_center_id: formData.exam_center_id || null,
      full_name: formData.full_name || null,
      gender: formData.gender || null,
      dob: formData.dob || null,
      mobile: formData.mobile || null,
      email: formData.email || null,
      aadhaar: formData.aadhaar || null,
      nationality: formData.nationality || null,
      religion: formData.religion || null,
      category: formData.category || null,
      seat_reservation_quota: formData.seat_reservation_quota || null,
      caste: formData.caste || null,
      mother_tongue: formData.mother_tongue || null,
      nativity: formData.nativity || null,
      blood_group: formData.blood_group || null,
      father_name: formData.father_name || null,
      father_mobile: formData.father_mobile || null,
      father_education: formData.father_education || null,
      father_occupation: formData.father_occupation || null,
      mother_name: formData.mother_name || null,
      mother_mobile: formData.mother_mobile || null,
      mother_education: formData.mother_education || null,
      mother_occupation: formData.mother_occupation || null,
      annual_family_income: formData.annual_family_income || null,
      parent_mobile: formData.parent_mobile || null,
      parent_email: formData.parent_email || null,
      address: formData.address || null,
      communication_address: formData.communication_address || null,
      communication_city: formData.communication_city || null,
      communication_state: formData.communication_state || null,
      communication_district: formData.communication_district || null,
      communication_pincode: formData.communication_pincode || null,
      communication_country: formData.communication_country || null,
      permanent_address: formData.permanent_address || null,
      permanent_city: formData.permanent_city || null,
      permanent_state: formData.permanent_state || null,
      permanent_district: formData.permanent_district || null,
      permanent_pincode: formData.permanent_pincode || null,
      permanent_country: formData.permanent_country || null,
      city: formData.city || null,
      state: formData.state || null,
      pincode: formData.pincode || null,
      is_disabled: formData.is_disabled || 'no',
      disability_type: formData.disability_type || null,
      disability_percentage: formData.disability_percentage || null,
      dependent_of: formData.dependent_of || 'none',
      seeking_admission_under_quota: formData.seeking_admission_under_quota || 'no',
      scholarship_or_fee_concession: formData.scholarship_or_fee_concession || 'no',
      hostel_accommodation_required: formData.hostel_accommodation_required || 'no',
      emergency_contact_name: formData.emergency_contact_name || null,
      emergency_contact_relation: formData.emergency_contact_relation || null,
      emergency_contact_mobile: formData.emergency_contact_mobile || null,
      previous_gap: formData.previous_gap || null,
      extracurricular: formData.extracurricular || null,
      achievements: formData.achievements || null,
      academic_year: academicYear.start,
      form_status: formData.form_status || 'draft',
      updated_at: new Date().toISOString()
    };

    let admissionFormId: number;

    if (existing && !fetchError) {
      admissionFormId = existing.id;
      const { error } = await supabase
        .from('admission_form')
        .update(formDataWithEmail)
        .eq('user_email', email);

      if (error) throw error;
    } else {
      const { data: insertData, error } = await supabase
        .from('admission_form')
        .insert(formDataWithEmail)
        .select('id')
        .single();

      if (error) throw error;
      admissionFormId = insertData.id;
    }

    // Handle academic marks for Supabase
    if (formData.academicMarks && Array.isArray(formData.academicMarks)) {
      await supabase
        .from('academic_marks')
        .delete()
        .eq('admission_form_id', admissionFormId);

      for (const mark of formData.academicMarks) {
        const { data: markData, error: markError } = await supabase
          .from('academic_marks')
          .insert({
            admission_form_id: admissionFormId,
            qualification_level: mark.qualification_level,
            register_number: mark.register_number || null,
            board_or_university: mark.board_or_university || null,
            school_or_college: mark.school_or_college || null,
            year_of_passing: mark.year_of_passing || null,
            percentage_or_cgpa: mark.percentage_or_cgpa || null,
            stream_or_degree: mark.stream_or_degree || null
          })
          .select('id')
          .single();

        if (markError) throw markError;

        if (mark.qualification_level === '12th' && mark.subjects && Array.isArray(mark.subjects)) {
          const subjectInserts = mark.subjects.slice(0, 10).map((subject: any, index: number) => ({
            academic_marks_id: markData.id,
            subject_name: subject.subject_name || null,
            marks_obtained: subject.marks_obtained || null,
            max_marks: subject.max_marks || null,
            grade: subject.grade || null,
            percentage: subject.percentage || null,
            subject_order: index + 1
          }));

          const { error: subjectError } = await supabase
            .from('subject_wise_marks')
            .insert(subjectInserts);

          if (subjectError) throw subjectError;
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Supabase Save Error:', error);
    throw error;
  }
}

async function getFormMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM admission_form WHERE user_email = ?',
      [email]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const formData = rows[0] as any;

      // Fetch academic marks
      const [academicMarks] = await connection.execute(
        'SELECT * FROM academic_marks WHERE admission_form_id = ? ORDER BY qualification_level',
        [formData.id]
      );

      // Fetch subject-wise marks for each academic record
      for (const mark of academicMarks as any[]) {
        const [subjects] = await connection.execute(
          'SELECT * FROM subject_wise_marks WHERE academic_marks_id = ? ORDER BY subject_order',
          [mark.id]
        );
        mark.subjects = subjects;
      }

      formData.academicMarks = academicMarks;
      return formData;
    }

    return null;
  } catch (error) {
    console.error('MySQL Get Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getFormSupabase(email: string) {
  try {
    const { data, error } = await supabase
      .from('admission_form')
      .select('*')
      .eq('user_email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (data) {
      const { data: academicMarks, error: marksError } = await supabase
        .from('academic_marks')
        .select('*, subject_wise_marks(*)')
        .eq('admission_form_id', data.id)
        .order('qualification_level');

      if (marksError) throw marksError;

      data.academicMarks = academicMarks;
    }

    return data;
  } catch (error) {
    console.error('Supabase Get Error:', error);
    return null;
  }
}

// POST - Save form
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, formData } = body;

    console.log('POST Request received:', { email, hasFormData: !!formData });

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!formData) {
      return NextResponse.json(
        { error: 'Form data is required' },
        { status: 400 }
      );
    }

    // Check if admissions are open
    const academicYear = getAcademicYearConfig();
    if (!academicYear.isOpen) {
      return NextResponse.json(
        { error: 'Admissions are currently closed for the academic year' },
        { status: 403 }
      );
    }

    const result = isDevelopment
      ? await saveFormSupabase(email, formData)
      : await saveFormMySQL(email, formData);

    return NextResponse.json({ 
      success: true, 
      message: 'Form saved successfully',
      academicYear: academicYear.start
    });
  } catch (error: any) {
    console.error('Error saving form:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save form',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve form
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const data = isDevelopment
      ? await getFormSupabase(email)
      : await getFormMySQL(email);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching form:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch form',
        details: error.message 
      },
      { status: 500 }
    );
  }
}