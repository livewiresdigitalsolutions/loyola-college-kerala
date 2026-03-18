import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

const isDevelopment = process.env.DB_TYPE === "supabase";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "File is required" }, { status: 400 });
    }

    let fileUrl = "";

    if (isDevelopment && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("news-media")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json({ success: false, error: "Failed to upload file to storage" }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from("news-media").getPublicUrl(fileName);
      fileUrl = urlData.publicUrl;
    } else {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

      const isProduction = process.env.NODE_ENV === 'production';
      const baseUploadDir = isProduction 
        ? path.join(process.cwd(), '..', 'loyola-uploads') 
        : path.join(process.cwd(), 'uploads');
        
      const uploadDir = path.join(baseUploadDir, "news");
      
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      fileUrl = `/api/media/news/${fileName}`;
    }

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to upload media", details: error.message }, { status: 500 });
  }
}
