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

async function saveAcademicMarksMySQL(admissionFormId: number, marks: any[]) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.beginTransaction();

    // Delete existing marks
    await connection.execute(
      'DELETE FROM academic_marks WHERE admission_form_id = ?',
      [admissionFormId]
    );

    // Insert new marks
    for (const mark of marks) {
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

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error('MySQL Academic Marks Save Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function saveAcademicMarksSupabase(admissionFormId: number, marks: any[]) {
  try {
    // Delete existing marks
    await supabase
      .from('academic_marks')
      .delete()
      .eq('admission_form_id', admissionFormId);

    // Insert new marks
    for (const mark of marks) {
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

      // Handle subject-wise marks for 12th standard
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

    return { success: true };
  } catch (error) {
    console.error('Supabase Academic Marks Save Error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { admission_form_id, marks } = await request.json();

    if (!admission_form_id) {
      return NextResponse.json(
        { success: false, error: 'Admission form ID is required' },
        { status: 400 }
      );
    }

    if (!marks || !Array.isArray(marks)) {
      return NextResponse.json(
        { success: false, error: 'Marks array is required' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await saveAcademicMarksSupabase(admission_form_id, marks)
      : await saveAcademicMarksMySQL(admission_form_id, marks);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Academic Marks API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
