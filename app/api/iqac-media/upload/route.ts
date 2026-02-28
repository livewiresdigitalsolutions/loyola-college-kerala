// app/api/iqac-media/upload/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

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

// PDF file validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['application/pdf'];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string || "";
    const category = formData.get("category") as string || "general";
    const display_order = parseInt(formData.get("display_order") as string) || 0;
    const is_active = formData.get("is_active") === "true";

    // Validation
    if (!file || !title) {
      return NextResponse.json(
        { success: false, error: "File and title are required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    let fileUrl = "";
    let fileSize = file.size;

    if (isDevelopment) {
      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("iqac-media")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { success: false, error: "Failed to upload file to storage" },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("iqac-media")
        .getPublicUrl(fileName);

      fileUrl = urlData.publicUrl;

      // Save to database
      const { data, error } = await supabase
        .from("iqac_media")
        .insert([
          {
            title,
            description,
            category,
            url: fileUrl,
            file_name: file.name,
            file_size: fileSize,
            mime_type: file.type,
            display_order,
            is_active,
          },
        ])
        .select();

      if (error) {
        return NextResponse.json(
          { success: false, error: "Failed to save to database" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "PDF uploaded successfully",
        data,
      });
    } else {
      // Upload to public/iqac folder
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${sanitizedFileName}`;
      const uploadDir = path.join(process.cwd(), "public", "iqac");
      
      // Ensure directory exists
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      fileUrl = `/iqac/${fileName}`;

      // Save to MySQL database
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        const [result] = await connection.execute(
          `INSERT INTO iqac_media 
          (title, description, category, url, file_name, file_size, mime_type, display_order, is_active) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [title, description, category, fileUrl, file.name, fileSize, file.type, display_order, is_active ? 1 : 0]
        );

        return NextResponse.json({
          success: true,
          message: "PDF uploaded successfully",
          data: {
            id: (result as any).insertId,
            title,
            url: fileUrl,
          }
        });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to upload PDF",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
