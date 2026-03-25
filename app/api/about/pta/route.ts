// app/api/about/pta/route.ts
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

// GET - Fetch all PTA leaders
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get("all") === "true";

        if (isDevelopment) {
            let query = supabase
                .from("pta_leaders")
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
                let sql = "SELECT * FROM pta_leaders WHERE 1=1";
                if (!all) sql += " AND is_active = 1";
                sql += " ORDER BY display_order ASC";
                const [rows] = await connection.execute(sql);
                return NextResponse.json({ success: true, data: rows });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch PTA leaders" },
            { status: 500 }
        );
    }
}

// PUT - Update PTA leader
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, role, display_order, is_active } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "ID is required" },
                { status: 400 }
            );
        }

        const updateData: Record<string, any> = {};
        if (name !== undefined) updateData.name = name;
        if (role !== undefined) updateData.role = role;
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
                .from("pta_leaders")
                .update(updateData)
                .eq("id", id);

            if (error) throw error;

            return NextResponse.json({ success: true, message: "Leader updated successfully" });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const setClauses: string[] = [];
                const values: any[] = [];

                if (name !== undefined) { setClauses.push("name = ?"); values.push(name); }
                if (role !== undefined) { setClauses.push("role = ?"); values.push(role); }
                if (display_order !== undefined) { setClauses.push("display_order = ?"); values.push(display_order); }
                if (is_active !== undefined) { setClauses.push("is_active = ?"); values.push(is_active ? 1 : 0); }

                values.push(id);

                await connection.execute(
                    `UPDATE pta_leaders SET ${setClauses.join(", ")} WHERE id = ?`,
                    values
                );

                return NextResponse.json({ success: true, message: "Leader updated successfully" });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Failed to update PTA leader" },
            { status: 500 }
        );
    }
}

// DELETE - Delete PTA leader and image
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
            const { data: leader } = await supabase
                .from("pta_leaders")
                .select("image_url")
                .eq("id", id)
                .single();

            if (leader?.image_url) {
                const fileName = leader.image_url.split("/").pop();
                if (fileName) {
                    await supabase.storage.from("pta-leaders").remove([fileName]);
                }
            }

            const { error } = await supabase.from("pta_leaders").delete().eq("id", id);
            if (error) throw error;

            return NextResponse.json({ success: true, message: "Leader deleted successfully" });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const [rows] = await connection.execute(
                    "SELECT image_url FROM pta_leaders WHERE id = ?",
                    [id]
                );

                const leader = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

                if (leader && (leader as any).image_url) {
                    const filePath = path.join(
                        process.cwd(),
                        "public",
                        (leader as any).image_url
                    );
                    try { await fs.unlink(filePath); } catch { }
                }

                await connection.execute("DELETE FROM pta_leaders WHERE id = ?", [id]);

                return NextResponse.json({ success: true, message: "Leader deleted successfully" });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Failed to delete PTA leader" },
            { status: 500 }
        );
    }
}
