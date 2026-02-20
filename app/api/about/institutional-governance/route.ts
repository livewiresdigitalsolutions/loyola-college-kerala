// app/api/about/institutional-governance/route.ts
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

// GET - Fetch active members, optionally filtered by category
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const all = searchParams.get("all") === "true";

        if (isDevelopment) {
            let query = supabase
                .from("ig_members")
                .select("*")
                .order("display_order", { ascending: true });

            if (!all) {
                query = query.eq("is_active", true);
            }

            if (category) {
                query = query.eq("category", category);
            }

            const { data, error } = await query;

            if (error) throw error;

            return NextResponse.json({ success: true, data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                let sql = "SELECT * FROM ig_members WHERE 1=1";
                if (!all) {
                    sql += " AND is_active = 1";
                }
                const params: any[] = [];

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
        console.error("Error fetching IG members:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch members" },
            { status: 500 }
        );
    }
}

// PUT - Update member fields
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, role, category, display_order, is_active } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "ID is required" },
                { status: 400 }
            );
        }

        // Build update object with only provided fields
        const updateFields: Record<string, any> = {};
        if (name !== undefined) updateFields.name = name;
        if (role !== undefined) updateFields.role = role;
        if (category !== undefined) updateFields.category = category;
        if (display_order !== undefined) updateFields.display_order = display_order;
        if (is_active !== undefined) updateFields.is_active = is_active;

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json(
                { success: false, error: "No fields to update" },
                { status: 400 }
            );
        }

        if (isDevelopment) {
            const { error } = await supabase
                .from("ig_members")
                .update(updateFields)
                .eq("id", id);

            if (error) throw error;

            return NextResponse.json({
                success: true,
                message: "Member updated successfully",
            });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                // Convert is_active boolean to int for MySQL
                if (updateFields.is_active !== undefined) {
                    updateFields.is_active = updateFields.is_active ? 1 : 0;
                }

                const setClauses = Object.keys(updateFields).map(key => `${key} = ?`).join(", ");
                const values = [...Object.values(updateFields), id];

                await connection.execute(
                    `UPDATE ig_members SET ${setClauses} WHERE id = ?`,
                    values
                );

                return NextResponse.json({
                    success: true,
                    message: "Member updated successfully",
                });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        console.error("Error updating IG member:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update member" },
            { status: 500 }
        );
    }
}

// DELETE - Delete member and image file
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
            const { data: member } = await supabase
                .from("ig_members")
                .select("image_url")
                .eq("id", id)
                .single();

            if (member?.image_url) {
                const fileName = member.image_url.split("/").pop();
                if (fileName) {
                    await supabase.storage.from("ig-members").remove([fileName]);
                }
            }

            const { error } = await supabase
                .from("ig_members")
                .delete()
                .eq("id", id);

            if (error) throw error;

            return NextResponse.json({
                success: true,
                message: "Member deleted successfully",
            });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const [rows] = await connection.execute(
                    "SELECT image_url FROM ig_members WHERE id = ?",
                    [id]
                );

                const member =
                    Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

                if (member && (member as any).image_url) {
                    const filePath = path.join(
                        process.cwd(),
                        "public",
                        (member as any).image_url
                    );
                    try {
                        await fs.unlink(filePath);
                    } catch (error) {
                        console.error("Error deleting file:", error);
                    }
                }

                await connection.execute("DELETE FROM ig_members WHERE id = ?", [id]);

                return NextResponse.json({
                    success: true,
                    message: "Member deleted successfully",
                });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        console.error("Error deleting IG member:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete member" },
            { status: 500 }
        );
    }
}
