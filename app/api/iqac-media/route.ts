// app/api/iqac-media/route.ts
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

// GET - Fetch all active IQAC media
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const includeInactive = searchParams.get("includeInactive") === "true";

    if (isDevelopment) {
      let query = supabase
        .from("iqac_media")
        .select("*");

      if (!includeInactive) {
        query = query.eq("is_active", true);
      }

      if (category) {
        query = query.eq("category", category);
      }

      query = query.order("display_order", { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        let sql = "SELECT * FROM iqac_media WHERE 1=1";
        const params: any[] = [];

        if (!includeInactive) {
          sql += " AND is_active = 1";
        }

        if (category) {
          sql += " AND category = ?";
          params.push(category);
        }

        sql += " ORDER BY display_order ASC";

        const [rows] = await connection.execute(sql, params);
        return NextResponse.json({ success: true, data: rows });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch IQAC media" },
      { status: 500 }
    );
  }
}

// PUT - Update IQAC media
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, is_active, title, description, category, display_order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const updateData: any = {};
      
      if (is_active !== undefined) updateData.is_active = is_active;
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (display_order !== undefined) updateData.display_order = display_order;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from("iqac_media")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: "IQAC media updated successfully",
      });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        const updates: string[] = [];
        const params: any[] = [];

        if (is_active !== undefined) {
          updates.push("is_active = ?");
          params.push(is_active ? 1 : 0);
        }
        if (title !== undefined) {
          updates.push("title = ?");
          params.push(title);
        }
        if (description !== undefined) {
          updates.push("description = ?");
          params.push(description);
        }
        if (category !== undefined) {
          updates.push("category = ?");
          params.push(category);
        }
        if (display_order !== undefined) {
          updates.push("display_order = ?");
          params.push(display_order);
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        params.push(id);

        const sql = `UPDATE iqac_media SET ${updates.join(", ")} WHERE id = ?`;
        await connection.execute(sql, params);

        return NextResponse.json({
          success: true,
          message: "IQAC media updated successfully",
        });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to update IQAC media" },
      { status: 500 }
    );
  }
}

// DELETE - Delete IQAC media and file
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
        .from("iqac_media")
        .select("url")
        .eq("id", id)
        .single();

      if (media?.url) {
        // Extract filename from URL
        const fileName = media.url.split("/").pop();
        if (fileName) {
          // Delete from storage
          await supabase.storage.from("iqac-media").remove([fileName]);
        }
      }

      // Delete from database
      const { error } = await supabase.from("iqac_media").delete().eq("id", id);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: "IQAC media deleted successfully",
      });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      try {
        // Get media info first
        const [rows] = await connection.execute(
          "SELECT url FROM iqac_media WHERE id = ?",
          [id]
        );

        const media = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

        if (media && (media as any).url) {
          // Delete file from public/iqac folder
          const filePath = path.join(process.cwd(), "public", (media as any).url);
          try {
            await fs.unlink(filePath);
          } catch (error) {
          }
        }

        // Delete from database
        await connection.execute("DELETE FROM iqac_media WHERE id = ?", [id]);

        return NextResponse.json({
          success: true,
          message: "IQAC media deleted successfully",
        });
      } finally {
        await connection.end();
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to delete IQAC media" },
      { status: 500 }
    );
  }
}
