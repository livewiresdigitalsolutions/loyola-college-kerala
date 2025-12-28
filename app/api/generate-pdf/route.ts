import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { createClient } from "@supabase/supabase-js";

const isDevelopment = process.env.DB_TYPE === 'supabase';

const mysqlConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3303"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "loyola",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// MySQL functions
async function getApplicationMySQL(email: string) {
  const connection = await mysql.createConnection(mysqlConfig);
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM admission_form WHERE user_email = ?",
      [email]
    );
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("MySQL Get Error:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getProgramDetailsMySQL(
  programLevelId: number,
  degreeId: number,
  courseId: number,
  examCenterId: number | null
) {
  const connection = await mysql.createConnection(mysqlConfig);
  try {
    const [programRows] = await connection.execute(
      "SELECT * FROM program_level WHERE id = ?",
      [programLevelId]
    );
    const [degreeRows] = await connection.execute(
      "SELECT * FROM degree WHERE id = ?",
      [degreeId]
    );
    const [courseRows] = await connection.execute(
      "SELECT * FROM course WHERE id = ?",
      [courseId]
    );

    let examCenter: any = null;
    if (examCenterId) {
      const [centerRows] = await connection.execute(
        "SELECT * FROM exam_centers WHERE id = ?",
        [examCenterId]
      );
      const centers = centerRows as any[];
      examCenter = centers && centers.length > 0 ? centers[0] : null;
    }

    const programs = programRows as any[];
    const degrees = degreeRows as any[];
    const courses = courseRows as any[];

    const program = programs && programs.length > 0 ? programs[0] : null;
    const degree = degrees && degrees.length > 0 ? degrees[0] : null;
    const course = courses && courses.length > 0 ? courses[0] : null;

    return {
      program: program?.discipline || "N/A",
      degree: degree?.degree_name || "N/A",
      course: course?.course_name || "N/A",
      examCenter: examCenter?.centre_name || "N/A",
    };
  } catch (error) {
    console.error("MySQL Program Details Error:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Supabase functions
async function getApplicationSupabase(email: string) {
  try {
    const { data, error } = await supabase
      .from("admission_form")
      .select("*")
      .eq("user_email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  } catch (error) {
    console.error("Supabase Get Error:", error);
    return null;
  }
}

async function getProgramDetailsSupabase(
  programLevelId: number,
  degreeId: number,
  courseId: number,
  examCenterId: number | null
) {
  const { data: programs } = await supabase
    .from("program_level")
    .select("*")
    .eq("id", programLevelId);

  const { data: degrees } = await supabase
    .from("degree")
    .select("*")
    .eq("id", degreeId);

  const { data: courses } = await supabase
    .from("course")
    .select("*")
    .eq("id", courseId);

  const { data: examCenters } = examCenterId
    ? await supabase.from("exam_centers").select("*").eq("id", examCenterId)
    : { data: [] };

  const program = programs && programs.length > 0 ? programs[0] : null;
  const degree = degrees && degrees.length > 0 ? degrees[0] : null;
  const course = courses && courses.length > 0 ? courses[0] : null;
  const examCenter =
    examCenters && examCenters.length > 0 ? examCenters[0] : null;

  return {
    program: program?.discipline || "N/A",
    degree: degree?.degree_name || "N/A",
    course: course?.course_name || "N/A",
    examCenter: examCenter?.centre_name || "N/A",
  };
}

function generateApplicationId(
  programLevelId: number,
  degreeId: number,
  courseId: number,
  dbId: number
): string {
  const paddedId = String(dbId).padStart(2, "0");
  return `LC${programLevelId}${degreeId}${courseId}20265${paddedId}`;
}

export async function POST(req: NextRequest) {
  let browser = null;

  try {
    console.log("=== PDF Generation Started ===");

    const { email } = await req.json();
    console.log("Email received:", email);

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Fetch application data
    const applicationData = isDevelopment
      ? await getApplicationSupabase(email)
      : await getApplicationMySQL(email);

    if (!applicationData) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (applicationData.payment_status !== "completed") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Fetch program details
    const programDetails = isDevelopment
      ? await getProgramDetailsSupabase(
          applicationData.program_level_id,
          applicationData.degree_id,
          applicationData.course_id,
          applicationData.exam_center_id
        )
      : await getProgramDetailsMySQL(
          applicationData.program_level_id,
          applicationData.degree_id,
          applicationData.course_id,
          applicationData.exam_center_id
        );

    const applicationId = generateApplicationId(
      applicationData.program_level_id,
      applicationData.degree_id,
      applicationData.course_id,
      applicationData.id
    );

    const formattedDob = applicationData.dob
      ? new Date(applicationData.dob).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "N/A";

    // Load and compile template
    console.log("Loading template...");
    const templatePath = path.resolve(
      process.cwd(),
      "public",
      "application-template.html"
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error("Template file not found at " + templatePath);
    }

    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = handlebars.compile(templateSource);

    // Prepare logo as base64 for embedding
    const logoPath = path.resolve(process.cwd(), "public", "loyola-logo.png");
    let logoUrl = "";
    
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      const logoBase64 = logoBuffer.toString("base64");
      logoUrl = `data:image/png;base64,${logoBase64}`;
    }

    // Prepare data
    const data = {
      logo_url: logoUrl,
      application_id: applicationId,
      full_name: applicationData.full_name || "N/A",
      dob: formattedDob,
      gender: applicationData.gender || "N/A",
      mobile: applicationData.mobile || "N/A",
      email: applicationData.email || "N/A",
      address: applicationData.address || "N/A",
      city: applicationData.city || "N/A",
      state: applicationData.state || "N/A",
      pincode: applicationData.pincode || "N/A",
      father_name: applicationData.father_name || "N/A",
      mother_name: applicationData.mother_name || "N/A",
      parent_mobile: applicationData.parent_mobile || "N/A",
      parent_email: applicationData.parent_email || "N/A",
      emergency_contact_name: applicationData.emergency_contact_name || "N/A",
      emergency_contact_relation:
        applicationData.emergency_contact_relation || "N/A",
      emergency_contact_mobile:
        applicationData.emergency_contact_mobile || "N/A",
      program: programDetails.program,
      degree: programDetails.degree,
      course: programDetails.course,
      exam_center: programDetails.examCenter,
      payment_id: applicationData.payment_id || "N/A",
      payment_amount: `₹${applicationData.payment_amount || 0}`,
      payment_status:
        (applicationData.payment_status || "pending").toUpperCase(),
    };

    // Compile HTML
    const html = template(data);

    // Launch browser
    console.log("Launching Puppeteer...");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    // Generate PDF
console.log("Generating PDF...");
const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: {
    top: "0mm",
    right: "0mm",
    bottom: "0mm",
    left: "0mm",
  },
});

await browser.close();

console.log("=== PDF Generation Completed Successfully ===");

// FIX: Return directly without conversion
return new NextResponse(pdfBuffer as BodyInit, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=Application-${applicationId}.pdf`,
  },
});


  } catch (error) {
    console.error("=== PDF Generation Error ===");
    console.error("Error details:", error);

    if (browser) {
      await browser.close();
    }

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
