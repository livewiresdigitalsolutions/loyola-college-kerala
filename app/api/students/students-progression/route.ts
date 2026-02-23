// app/api/students/students-progression/route.ts
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

type SpType = "rank-holders" | "qualifiers" | "placements" | "initiatives";

const tableMap: Record<SpType, string> = {
    "rank-holders": "sp_rank_holders",
    "qualifiers": "sp_qualifiers",
    "placements": "sp_placements",
    "initiatives": "sp_initiatives",
};

// ──────────────────────────────────────────────
// GET
// ──────────────────────────────────────────────
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as SpType;
        const all = searchParams.get("all") === "true";

        if (!type || !tableMap[type]) {
            return NextResponse.json(
                { success: false, error: "Invalid or missing type param. Use rank-holders | qualifiers | placements | initiatives" },
                { status: 400 }
            );
        }

        const table = tableMap[type];

        if (isDevelopment) {
            let query = supabase.from(table).select("*").order("display_order", { ascending: true });
            if (!all) query = query.eq("is_active", true);
            const { data, error } = await query;
            if (error) throw error;
            return NextResponse.json({ success: true, data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                let sql = `SELECT * FROM ${table} WHERE 1=1`;
                if (!all) sql += " AND is_active = 1";
                sql += " ORDER BY display_order ASC";
                const [rows] = await connection.execute(sql);
                return NextResponse.json({ success: true, data: rows });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        console.error("Error fetching student progression data:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch data" },
            { status: 500 }
        );
    }
}

// ──────────────────────────────────────────────
// POST (create without image — placements & initiatives)
// ──────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as SpType;
        const body = await request.json();

        if (!type || !tableMap[type]) {
            return NextResponse.json(
                { success: false, error: "Invalid type" },
                { status: 400 }
            );
        }

        const table = tableMap[type];

        if (isDevelopment) {
            const { data, error } = await supabase.from(table).insert([body]).select();
            if (error) throw error;
            return NextResponse.json({ success: true, data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const keys = Object.keys(body);
                const values = Object.values(body);
                const placeholders = keys.map(() => "?").join(", ");
                const columns = keys.join(", ");

                const [result] = await connection.execute(
                    `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
                    values
                ) as any;

                return NextResponse.json({
                    success: true,
                    message: "Record created successfully",
                    insertId: result.insertId,
                });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        console.error("Error creating record:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create record" },
            { status: 500 }
        );
    }
}

// ──────────────────────────────────────────────
// PUT (update)
// ──────────────────────────────────────────────
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as SpType;
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!type || !tableMap[type]) {
            return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        }
        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
        }

        const table = tableMap[type];

        if (isDevelopment) {
            const { error } = await supabase.from(table).update(updateData).eq("id", id);
            if (error) throw error;
            return NextResponse.json({ success: true, message: "Updated successfully" });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const setClauses: string[] = [];
                const values: any[] = [];

                for (const [key, value] of Object.entries(updateData)) {
                    setClauses.push(`${key} = ?`);
                    values.push(value);
                }
                values.push(id);

                await connection.execute(
                    `UPDATE ${table} SET ${setClauses.join(", ")} WHERE id = ?`,
                    values
                );
                return NextResponse.json({ success: true, message: "Updated successfully" });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        console.error("Error updating record:", error);
        return NextResponse.json({ success: false, error: "Failed to update record" }, { status: 500 });
    }
}

// ──────────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────────
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as SpType;
        const id = searchParams.get("id");

        if (!type || !tableMap[type]) {
            return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        }
        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const table = tableMap[type];

        if (isDevelopment) {
            // For rank-holders and qualifiers, delete image from storage too
            if (type === "rank-holders" || type === "qualifiers") {
                const { data: record } = await supabase.from(table).select("image_url").eq("id", id).single();
                if (record?.image_url) {
                    const fileName = record.image_url.split("/").pop();
                    if (fileName) await supabase.storage.from("students-progression").remove([fileName]);
                }
            }
            const { error } = await supabase.from(table).delete().eq("id", id);
            if (error) throw error;
            return NextResponse.json({ success: true, message: "Deleted successfully" });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                // Delete image file for image-backed types
                if (type === "rank-holders" || type === "qualifiers") {
                    const [rows] = await connection.execute(
                        `SELECT image_url FROM ${table} WHERE id = ?`,
                        [id]
                    );
                    const record = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
                    if (record?.image_url) {
                        const filePath = path.join(process.cwd(), "public", record.image_url);
                        try { await fs.unlink(filePath); } catch { /* file may not exist */ }
                    }
                }
                await connection.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
                return NextResponse.json({ success: true, message: "Deleted successfully" });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        console.error("Error deleting record:", error);
        return NextResponse.json({ success: false, error: "Failed to delete record" }, { status: 500 });
    }
}
