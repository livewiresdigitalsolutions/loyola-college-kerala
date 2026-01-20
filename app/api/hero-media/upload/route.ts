// app/api/hero-media/upload/route.ts
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const display_order = parseInt(formData.get("display_order") as string) || 0;
    const is_active = formData.get("is_active") === "true";

    if (!file || !title) {
      return NextResponse.json(
        { success: false, error: "File and title are required" },
        { status: 400 }
      );
    }

    let fileUrl = "";

    if (isDevelopment) {
      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("hero-media")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json(
          { success: false, error: "Failed to upload file to storage" },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("hero-media")
        .getPublicUrl(fileName);

      fileUrl = urlData.publicUrl;

      // Save to database
      const { data, error } = await supabase
        .from("hero_media")
        .insert([
          {
            type,
            url: fileUrl,
            title,
            display_order,
            is_active,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase DB error:", error);
        return NextResponse.json(
          { success: false, error: "Failed to save to database" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Media uploaded successfully",
        data,
      });
    } else {
      // Upload to public/hero folder
      const fileName = `${Date.now()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), "public", "hero");
      
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

      fileUrl = `/hero/${fileName}`;

      // Save to MySQL database
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        await connection.execute(
          "INSERT INTO hero_media (type, url, title, display_order, is_active) VALUES (?, ?, ?, ?, ?)",
          [type, fileUrl, title, display_order, is_active ? 1 : 0]
        );

        return NextResponse.json({
          success: true,
          message: "Media uploaded successfully",
        });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to upload media",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
