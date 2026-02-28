// app/api/about/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

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

// GET - Fetch all active eminent visitors
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get("all") === "true";

        if (isDevelopment) {
            let query = supabase
                .from("eminent_visitors")
                .select("*")
                .order("display_order", { ascending: true });

            if (!all) {
                query = query.eq("is_active", true);
            }

            const { data, error } = await query;

            if (error) throw error;

            return NextResponse.json({ success: true, data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                let sql = "SELECT * FROM eminent_visitors WHERE 1=1";
                if (!all) {
                    sql += " AND is_active = 1";
                }
                sql += " ORDER BY display_order ASC";
                const [rows] = await connection.execute(sql);
                return NextResponse.json({ success: true, data: rows });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch eminent visitors" },
            { status: 500 }
        );
    }
}

// PUT - Update eminent visitor
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, title, display_order, is_active } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "ID is required" },
                { status: 400 }
            );
        }

        // Build dynamic update object from provided fields
        const updateData: Record<string, any> = {};
        if (name !== undefined) updateData.name = name;
        if (title !== undefined) updateData.title = title;
        if (display_order !== undefined) updateData.display_order = display_order;
        if (is_active !== undefined) updateData.is_active = is_active;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, error: "No fields to update" },
                { status: 400 }
            );
        }

        if (isDevelopment) {
            const { error } = await supabase
                .from("eminent_visitors")
                .update(updateData)
                .eq("id", id);

            if (error) throw error;

            return NextResponse.json({
                success: true,
                message: "Visitor updated successfully",
            });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const setClauses: string[] = [];
                const values: any[] = [];

                if (name !== undefined) { setClauses.push("name = ?"); values.push(name); }
                if (title !== undefined) { setClauses.push("title = ?"); values.push(title); }
                if (display_order !== undefined) { setClauses.push("display_order = ?"); values.push(display_order); }
                if (is_active !== undefined) { setClauses.push("is_active = ?"); values.push(is_active ? 1 : 0); }

                values.push(id);

                await connection.execute(
                    `UPDATE eminent_visitors SET ${setClauses.join(", ")} WHERE id = ?`,
                    values
                );

                return NextResponse.json({
                    success: true,
                    message: "Visitor updated successfully",
                });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Failed to update eminent visitor" },
            { status: 500 }
        );
    }
}

// DELETE - Delete eminent visitor and image file
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
            // Get visitor info first
            const { data: visitor } = await supabase
                .from("eminent_visitors")
                .select("image_url")
                .eq("id", id)
                .single();

            if (visitor?.image_url) {
                // Extract filename from URL
                const fileName = visitor.image_url.split("/").pop();
                if (fileName) {
                    // Delete from storage
                    await supabase.storage.from("eminent-visitors").remove([fileName]);
                }
            }

            // Delete from database
            const { error } = await supabase
                .from("eminent_visitors")
                .delete()
                .eq("id", id);

            if (error) throw error;

            return NextResponse.json({
                success: true,
                message: "Visitor deleted successfully",
            });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                // Get visitor info first
                const [rows] = await connection.execute(
                    "SELECT image_url FROM eminent_visitors WHERE id = ?",
                    [id]
                );

                const visitor =
                    Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

                if (visitor && (visitor as any).image_url) {
                    // Delete file from public folder
                    const filePath = path.join(
                        process.cwd(),
                        "public",
                        (visitor as any).image_url
                    );
                    try {
                        await fs.unlink(filePath);
                    } catch (error) {
                    }
                }

                // Delete from database
                await connection.execute(
                    "DELETE FROM eminent_visitors WHERE id = ?",
                    [id]
                );

                return NextResponse.json({
                    success: true,
                    message: "Visitor deleted successfully",
                });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Failed to delete eminent visitor" },
            { status: 500 }
        );
    }
}
