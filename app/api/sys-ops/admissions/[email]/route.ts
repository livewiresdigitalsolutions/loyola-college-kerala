// import { NextRequest, NextResponse } from "next/server";
// import mysql from "mysql2/promise";
// import { createClient } from "@supabase/supabase-js";
// import { RowDataPacket, ResultSetHeader } from "mysql2";

// const isDevelopment = process.env.DB_TYPE === "supabase";

// const mysqlConfig = {
//   host: process.env.MYSQL_HOST || "localhost",
//   port: parseInt(process.env.MYSQL_PORT || "3303"),
//   user: process.env.MYSQL_USER || "root",
//   password: process.env.MYSQL_PASSWORD || "",
//   database: process.env.MYSQL_DATABASE || "loyola",
// };

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// interface AdmissionDetailRow extends RowDataPacket {
//   [key: string]: any;
// }

// async function getAdmissionMySQL(email: string) {
//   const connection = await mysql.createConnection(mysqlConfig);

//   try {
//     // Fetch main admission form data
//     const [rows] = await connection.execute<AdmissionDetailRow[]>(
//       "SELECT * FROM admission_form WHERE user_email = ?",
//       [email]
//     );

//     if (!Array.isArray(rows) || rows.length === 0) {
//       return null;
//     }

//     const formData = rows[0];

//     // Fetch academic marks
//     const [academicMarks] = await connection.execute<AdmissionDetailRow[]>(
//       "SELECT * FROM academic_marks WHERE admission_form_id = ? ORDER BY qualification_level",
//       [formData.id]
//     );

//     // Fetch subject-wise marks for each academic record
//     for (const mark of academicMarks as any[]) {
//       const [subjects] = await connection.execute<AdmissionDetailRow[]>(
//         "SELECT * FROM subject_wise_marks WHERE academic_marks_id = ? ORDER BY subject_order",
//         [mark.id]
//       );
//       mark.subjects = subjects;
//     }

//     formData.academicMarks = academicMarks;

//     return formData;
//   } catch (error) {
//     console.error("MySQL Get Admission Error:", error);
//     throw error;
//   } finally {
//     await connection.end();
//   }
// }

// async function getAdmissionSupabase(email: string) {
//   try {
//     const { data, error } = await supabase
//       .from("admission_form")
//       .select("*")
//       .eq("user_email", email)
//       .single();

//     if (error) {
//       if (error.code === "PGRST116") {
//         return null;
//       }
//       throw error;
//     }

//     // Fetch academic marks with subjects
//     const { data: academicMarks, error: marksError } = await supabase
//       .from("academic_marks")
//       .select("*, subject_wise_marks(*)")
//       .eq("admission_form_id", data.id)
//       .order("qualification_level");

//     if (marksError) throw marksError;

//     data.academicMarks = academicMarks;

//     return data;
//   } catch (error) {
//     console.error("Supabase Get Admission Error:", error);
//     throw error;
//   }
// }

// async function deleteAdmissionMySQL(email: string) {
//   const connection = await mysql.createConnection(mysqlConfig);

//   try {
//     const [result] = await connection.execute<ResultSetHeader>(
//       "DELETE FROM admission_form WHERE user_email = ?",
//       [email]
//     );

//     return result.affectedRows > 0;
//   } catch (error) {
//     console.error("MySQL Delete Admission Error:", error);
//     throw error;
//   } finally {
//     await connection.end();
//   }
// }

// async function deleteAdmissionSupabase(email: string) {
//   try {
//     const { error } = await supabase
//       .from("admission_form")
//       .delete()
//       .eq("user_email", email);

//     if (error) throw error;

//     return true;
//   } catch (error) {
//     console.error("Supabase Delete Admission Error:", error);
//     throw error;
//   }
// }

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ email: string }> }
// ) {
//   try {
//     const { email } = await params;
//     const decodedEmail = decodeURIComponent(email);

//     const data = isDevelopment
//       ? await getAdmissionSupabase(decodedEmail)
//       : await getAdmissionMySQL(decodedEmail);

//     if (!data) {
//       return NextResponse.json(
//         { error: "Admission not found", data: null },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ data });
//   } catch (error: any) {
//     console.error("Error fetching admission:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch admission", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ email: string }> }
// ) {
//   try {
//     const { email } = await params;
//     const decodedEmail = decodeURIComponent(email);

//     const success = isDevelopment
//       ? await deleteAdmissionSupabase(decodedEmail)
//       : await deleteAdmissionMySQL(decodedEmail);

//     if (!success) {
//       return NextResponse.json(
//         { error: "Admission not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ message: "Admission deleted successfully" });
//   } catch (error: any) {
//     console.error("Error deleting admission:", error);
//     return NextResponse.json(
//       { error: "Failed to delete admission", details: error.message },
//       { status: 500 }
//     );
//   }
// }






//============================================================================================//


import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { createClient } from "@supabase/supabase-js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const isDevelopment = process.env.DB_TYPE === "supabase";

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

interface AdmissionDetailRow extends RowDataPacket {
  [key: string]: any;
}

async function getAdmissionMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [rows] = await connection.execute<AdmissionDetailRow[]>(
      `SELECT 
        bi.*,
        pi.full_name, pi.gender, pi.dob, pi.mobile, pi.email,
        pi.aadhaar, pi.nationality, pi.religion, pi.category,
        pi.seat_reservation_quota, pi.caste, pi.mother_tongue, pi.nativity,
        pi.blood_group, pi.is_disabled, pi.disability_type, pi.disability_percentage,
        pi.dependent_of, pi.seeking_admission_under_quota,
        pi.scholarship_or_fee_concession, pi.hostel_accommodation_required,
        pi.previous_gap, pi.extracurricular, pi.achievements,
        fi.father_name, fi.father_mobile, fi.father_education, fi.father_occupation,
        fi.mother_name, fi.mother_mobile, fi.mother_education, fi.mother_occupation,
        fi.annual_family_income, fi.parent_mobile, fi.parent_email,
        fi.emergency_contact_name, fi.emergency_contact_relation, fi.emergency_contact_mobile,
        ai.communication_address, ai.communication_city, ai.communication_state,
        ai.communication_district, ai.communication_pincode, ai.communication_country,
        ai.permanent_address, ai.permanent_city, ai.permanent_state,
        ai.permanent_district, ai.permanent_pincode, ai.permanent_country
      FROM admission_basic_info bi
      LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
      LEFT JOIN admission_family_info fi ON bi.id = fi.admission_id
      LEFT JOIN admission_address_info ai ON bi.id = ai.admission_id
      WHERE bi.user_email = ?`,
      [email]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      await connection.end();
      return null;
    }

    const formData = rows[0];
    

    // Fetch academic marks
    const [academicMarks] = await connection.execute<AdmissionDetailRow[]>(
      `SELECT * FROM academic_marks 
       WHERE admission_form_id = ? 
       ORDER BY qualification_level`,
      [formData.id]
    );


    // Fetch subject-wise marks
    for (const mark of academicMarks as any[]) {
      const [subjects] = await connection.execute<AdmissionDetailRow[]>(
        `SELECT * FROM subject_wise_marks 
         WHERE academic_marks_id = ? 
         ORDER BY subject_order`,
        [mark.id]
      );
      mark.subjects = subjects;
    }

    formData.academicMarks = academicMarks;

    await connection.end();
    return formData;
  } catch (error) {
    await connection.end();
    throw error;
  }
}


async function getAdmissionSupabase(email: string) {
  try {
    const { data: basicInfo, error } = await supabase
      .from("admission_basic_info")
      .select(`
        *,
        admission_personal_info(*),
        admission_family_info(*),
        admission_address_info(*)
      `)
      .eq("user_email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    // Flatten the data for backward compatibility
    const flatData = {
      ...basicInfo,
      ...(basicInfo.admission_personal_info || {}),
      ...(basicInfo.admission_family_info || {}),
      ...(basicInfo.admission_address_info || {}),
    };

    // Fetch academic marks with subjects
    const { data: academicMarks, error: marksError } = await supabase
      .from("academic_marks")
      .select("*, subject_wise_marks(*)")
      .eq("admission_form_id", basicInfo.id)
      .order("qualification_level");

    if (marksError) throw marksError;

    flatData.academicMarks = academicMarks;

    return flatData;
  } catch (error) {
    throw error;
  }
}

async function deleteAdmissionMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    // Get admission ID first
    const [rows] = await connection.execute<AdmissionDetailRow[]>(
      "SELECT id FROM admission_basic_info WHERE user_email = ?",
      [email]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return false;
    }

    // Delete basic info (CASCADE will handle the rest)
    const [result] = await connection.execute<ResultSetHeader>(
      "DELETE FROM admission_basic_info WHERE user_email = ?",
      [email]
    );

    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  } finally {
    await connection.end();
  }
}

async function deleteAdmissionSupabase(email: string) {
  try {
    // Delete basic info (CASCADE will handle the rest)
    const { error } = await supabase
      .from("admission_basic_info")
      .delete()
      .eq("user_email", email);

    if (error) throw error;

    return true;
  } catch (error) {
    throw error;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    const data = isDevelopment
      ? await getAdmissionSupabase(decodedEmail)
      : await getAdmissionMySQL(decodedEmail);

    if (!data) {
      return NextResponse.json(
        { error: "Admission not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch admission", details: error.message },
      { status: 500 }
    );
  }
}

async function updateAdmissionMySQL(email: string, data: any) {
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    const [rows] = await connection.execute<AdmissionDetailRow[]>(
      "SELECT id FROM admission_basic_info WHERE user_email = ?",
      [email]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      await connection.end();
      return false;
    }

    const admissionId = rows[0].id;

    if (data.basicInfo && Object.keys(data.basicInfo).length > 0) {
      const fields = Object.keys(data.basicInfo)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(data.basicInfo);
      await connection.execute(
        `UPDATE admission_basic_info SET ${fields} WHERE id = ?`,
        [...values, admissionId]
      );
    }

    if (data.personalInfo && Object.keys(data.personalInfo).length > 0) {
      const fields = Object.keys(data.personalInfo)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(data.personalInfo);
      await connection.execute(
        `UPDATE admission_personal_info SET ${fields} WHERE admission_id = ?`,
        [...values, admissionId]
      );
    }

    if (data.familyInfo && Object.keys(data.familyInfo).length > 0) {
      const fields = Object.keys(data.familyInfo)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(data.familyInfo);
      await connection.execute(
        `UPDATE admission_family_info SET ${fields} WHERE admission_id = ?`,
        [...values, admissionId]
      );
    }

    if (data.addressInfo && Object.keys(data.addressInfo).length > 0) {
      const fields = Object.keys(data.addressInfo)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(data.addressInfo);
      await connection.execute(
        `UPDATE admission_address_info SET ${fields} WHERE admission_id = ?`,
        [...values, admissionId]
      );
    }

    await connection.end();
    return true;
  } catch (error) {
    await connection.end();
    throw error;
  }
}

async function updateAdmissionSupabase(email: string, data: any) {
  try {
    const { data: basicInfo, error: fetchError } = await supabase
      .from("admission_basic_info")
      .select("id")
      .eq("user_email", email)
      .single();

    if (fetchError || !basicInfo) return false;

    const admissionId = basicInfo.id;

    if (data.basicInfo && Object.keys(data.basicInfo).length > 0) {
      const { error } = await supabase
        .from("admission_basic_info")
        .update(data.basicInfo)
        .eq("id", admissionId);
      if (error) throw error;
    }

    if (data.personalInfo && Object.keys(data.personalInfo).length > 0) {
      const { error } = await supabase
        .from("admission_personal_info")
        .update(data.personalInfo)
        .eq("admission_id", admissionId);
      if (error) throw error;
    }

    if (data.familyInfo && Object.keys(data.familyInfo).length > 0) {
      const { error } = await supabase
        .from("admission_family_info")
        .update(data.familyInfo)
        .eq("admission_id", admissionId);
      if (error) throw error;
    }

    if (data.addressInfo && Object.keys(data.addressInfo).length > 0) {
      const { error } = await supabase
        .from("admission_address_info")
        .update(data.addressInfo)
        .eq("admission_id", admissionId);
      if (error) throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);
    const body = await request.json();

    const success = isDevelopment
      ? await updateAdmissionSupabase(decodedEmail, body)
      : await updateAdmissionMySQL(decodedEmail, body);

    if (!success) {
      return NextResponse.json(
        { error: "Admission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Admission updated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update admission", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    const success = isDevelopment
      ? await deleteAdmissionSupabase(decodedEmail)
      : await deleteAdmissionMySQL(decodedEmail);

    if (!success) {
      return NextResponse.json(
        { error: "Admission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Admission deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete admission", details: error.message },
      { status: 500 }
    );
  }
}
