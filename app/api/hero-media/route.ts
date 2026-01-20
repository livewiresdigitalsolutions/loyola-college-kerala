// app/api/hero-media/route.ts
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

// GET - Fetch all active hero media
export async function GET(request: Request) {
  try {
    if (isDevelopment) {
      const { data, error } = await supabase
        .from("hero_media")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        const [rows] = await connection.execute(
          "SELECT * FROM hero_media WHERE is_active = 1 ORDER BY display_order ASC"
        );
        return NextResponse.json({ success: true, data: rows });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    console.error("Error fetching hero media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero media" },
      { status: 500 }
    );
  }
}

// PUT - Update hero media status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const { error } = await supabase
        .from("hero_media")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: "Media updated successfully",
      });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        await connection.execute(
          "UPDATE hero_media SET is_active = ? WHERE id = ?",
          [is_active ? 1 : 0, id]
        );

        return NextResponse.json({
          success: true,
          message: "Media updated successfully",
        });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    console.error("Error updating hero media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update hero media" },
      { status: 500 }
    );
  }
}

// DELETE - Delete hero media and file
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      // Get media info first
      const { data: media } = await supabase
        .from("hero_media")
        .select("url")
        .eq("id", id)
        .single();

      if (media?.url) {
        // Extract filename from URL
        const fileName = media.url.split("/").pop();
        if (fileName) {
          // Delete from storage
          await supabase.storage.from("hero-media").remove([fileName]);
        }
      }

      // Delete from database
      const { error } = await supabase.from("hero_media").delete().eq("id", id);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: "Media deleted successfully",
      });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        // Get media info first
        const [rows] = await connection.execute(
          "SELECT url FROM hero_media WHERE id = ?",
          [id]
        );

        const media = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

        if (media && (media as any).url) {
          // Delete file from public/hero folder
          const filePath = path.join(process.cwd(), "public", (media as any).url);
          try {
            await fs.unlink(filePath);
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        }

        // Delete from database
        await connection.execute("DELETE FROM hero_media WHERE id = ?", [id]);

        return NextResponse.json({
          success: true,
          message: "Media deleted successfully",
        });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    console.error("Error deleting hero media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete hero media" },
      { status: 500 }
    );
  }
}
