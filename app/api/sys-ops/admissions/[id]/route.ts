import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { RowDataPacket } from 'mysql2';

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

interface AdmissionFormRow extends RowDataPacket {
  [key: string]: any;
}

// GET single admission by ID
async function getAdmissionMySQL(id: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    const [rows] = await connection.execute<AdmissionFormRow[]>(
      'SELECT * FROM admission_form WHERE id = ?',
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('MySQL Get Admission Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getAdmissionSupabase(id: string) {
  try {
    const { data, error } = await supabase
      .from('admission_form')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Supabase Get Admission Error:', error);
    throw error;
  }
}

// DELETE admission by ID
async function deleteAdmissionMySQL(id: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    await connection.execute('DELETE FROM admission_form WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('MySQL Delete Admission Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function deleteAdmissionSupabase(id: string) {
  try {
    const { error } = await supabase
      .from('admission_form')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase Delete Admission Error:', error);
    throw error;
  }
}

// UPDATE admission by ID
async function updateAdmissionMySQL(id: string, formData: any) {
  const connection = await mysql.createConnection(mysqlConfig);
  
  try {
    await connection.execute(
      `UPDATE admission_form SET
        program_level_id = ?, degree_id = ?, course_id = ?, exam_center_id = ?,
        full_name = ?, gender = ?, dob = ?, mobile = ?, email = ?,
        aadhaar = ?, nationality = ?, religion = ?, category = ?, blood_group = ?,
        father_name = ?, mother_name = ?, parent_mobile = ?, parent_email = ?,
        address = ?, city = ?, state = ?, pincode = ?,
        emergency_contact_name = ?, emergency_contact_relation = ?, emergency_contact_mobile = ?,
        tenth_board = ?, tenth_school = ?, tenth_year = ?, tenth_percentage = ?, tenth_subjects = ?,
        twelfth_board = ?, twelfth_school = ?, twelfth_year = ?, twelfth_percentage = ?,
        twelfth_stream = ?, twelfth_subjects = ?,
        ug_university = ?, ug_college = ?, ug_degree = ?, ug_year = ?, ug_percentage = ?,
        pg_university = ?, pg_college = ?, pg_degree = ?, pg_year = ?, pg_percentage = ?,
        previous_gap = ?, extracurricular = ?, achievements = ?,
        form_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        formData.program_level_id, formData.degree_id, formData.course_id, formData.exam_center_id,
        formData.full_name, formData.gender, formData.dob, formData.mobile, formData.email,
        formData.aadhaar, formData.nationality, formData.religion, formData.category, formData.blood_group,
        formData.father_name, formData.mother_name, formData.parent_mobile, formData.parent_email,
        formData.address, formData.city, formData.state, formData.pincode,
        formData.emergency_contact_name, formData.emergency_contact_relation, formData.emergency_contact_mobile,
        formData.tenth_board, formData.tenth_school, formData.tenth_year, formData.tenth_percentage, formData.tenth_subjects,
        formData.twelfth_board, formData.twelfth_school, formData.twelfth_year, formData.twelfth_percentage,
        formData.twelfth_stream, formData.twelfth_subjects,
        formData.ug_university, formData.ug_college, formData.ug_degree, formData.ug_year, formData.ug_percentage,
        formData.pg_university, formData.pg_college, formData.pg_degree, formData.pg_year, formData.pg_percentage,
        formData.previous_gap, formData.extracurricular, formData.achievements,
        formData.form_status,
        id
      ]
    );

    return { success: true };
  } catch (error) {
    console.error('MySQL Update Admission Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function updateAdmissionSupabase(id: string, formData: any) {
  try {
    const { error } = await supabase
      .from('admission_form')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase Update Admission Error:', error);
    throw error;
  }
}

// GET handler
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const data = isDevelopment
      ? await getAdmissionSupabase(id)
      : await getAdmissionMySQL(id);

    if (!data) {
      return NextResponse.json(
        { error: 'Admission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching admission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admission', details: error.message },
      { status: 500 }
    );
  }
}

// PUT handler
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { formData } = body;

    if (!formData) {
      return NextResponse.json(
        { error: 'Form data is required' },
        { status: 400 }
      );
    }

    const result = isDevelopment
      ? await updateAdmissionSupabase(id, formData)
      : await updateAdmissionMySQL(id, formData);

    return NextResponse.json({
      success: true,
      message: 'Admission updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating admission:', error);
    return NextResponse.json(
      { error: 'Failed to update admission', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = isDevelopment
      ? await deleteAdmissionSupabase(id)
      : await deleteAdmissionMySQL(id);

    return NextResponse.json({
      success: true,
      message: 'Admission deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting admission:', error);
    return NextResponse.json(
      { error: 'Failed to delete admission', details: error.message },
      { status: 500 }
    );
  }
}
