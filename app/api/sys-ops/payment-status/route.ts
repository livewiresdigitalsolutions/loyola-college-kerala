import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { createClient } from "@supabase/supabase-js";
import { RowDataPacket } from "mysql2";

const isDevelopment = process.env.DB_TYPE === "supabase";

const mysqlConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3303"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "loyola",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PendingRow extends RowDataPacket {
  id: number;
  user_email: string;
  full_name: string;
  mobile: string;
  payment_status: string;
  payment_id: string | null;
  payment_amount: number | null;
  form_status: string;
  created_at: string;
  submitted_at: string | null;
  updated_at: string;
}

// Returns all applications that are not fully payment-completed
// (either form was submitted but payment pending, or payment_status != 'completed')
export async function GET() {
  try {
    if (isDevelopment) {
      const { data, error } = await supabase
        .from("admission_basic_info")
        .select(`
          id, user_email, payment_status, payment_id, payment_amount,
          form_status, created_at, submitted_at, updated_at,
          admission_personal_info ( full_name, mobile )
        `)
        .neq("payment_status", "completed")
        .in("form_status", ["submitted", "draft"])
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const transformed = (data || []).map((item: any) => ({
        id: item.id,
        user_email: item.user_email,
        full_name: item.admission_personal_info?.full_name || null,
        mobile: item.admission_personal_info?.mobile || null,
        payment_status: item.payment_status,
        payment_id: item.payment_id,
        payment_amount: item.payment_amount,
        form_status: item.form_status,
        created_at: item.created_at,
        submitted_at: item.submitted_at,
        updated_at: item.updated_at,
      }));

      return NextResponse.json({ data: transformed, total: transformed.length });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        const [rows] = await connection.execute<PendingRow[]>(
          `SELECT
            bi.id, bi.user_email, bi.payment_status, bi.payment_id, bi.payment_amount,
            bi.form_status, bi.created_at, bi.submitted_at, bi.updated_at,
            pi.full_name, pi.mobile
           FROM admission_basic_info bi
           LEFT JOIN admission_personal_info pi ON bi.id = pi.admission_id
           WHERE bi.payment_status != 'completed'
             AND (bi.form_status = 'submitted' OR bi.form_status = 'draft')
           ORDER BY bi.updated_at DESC`
        );
        await connection.end();
        return NextResponse.json({ data: rows, total: rows.length });
      } catch (err) {
        await connection.end();
        throw err;
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch pending payments", details: error.message },
      { status: 500 }
    );
  }
}
