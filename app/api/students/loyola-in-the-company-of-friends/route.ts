// app/api/students/loyola-in-the-company-of-friends/route.ts
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

type LitcofType = "organizing-team" | "activities" | "achievements" | "events" | "gallery";

const tableMap: Record<LitcofType, string> = {
    "organizing-team": "litcof_organizing_team",
    "activities": "litcof_activities",
    "achievements": "litcof_achievements",
    "events": "litcof_events",
    "gallery": "litcof_gallery",
};

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as LitcofType;
        const all = searchParams.get("all") === "true";

        if (!type || !tableMap[type]) {
            return NextResponse.json(
                { success: false, error: "Invalid type. Use: organizing-team | activities | achievements | events | gallery" },
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
    } catch {
        return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 });
    }
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as LitcofType;
        const body = await request.json();

        if (!type || !tableMap[type]) {
            return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
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
                const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
                const [result] = await connection.execute(sql, values) as any;
                return NextResponse.json({ success: true, insertId: result.insertId });
            } finally {
                await connection.end();
            }
        }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to create record" }, { status: 500 });
    }
}

// ── PUT ───────────────────────────────────────────────────────────────────────
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as LitcofType;
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!type || !tableMap[type]) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
        if (Object.keys(updateData).length === 0) return NextResponse.json({ success: false, error: "Nothing to update" }, { status: 400 });

        const table = tableMap[type];

        if (isDevelopment) {
            const { error } = await supabase.from(table).update(updateData).eq("id", id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const setClauses = Object.keys(updateData).map(k => `${k} = ?`);
                const values = [...Object.values(updateData), id];
                await connection.execute(`UPDATE ${table} SET ${setClauses.join(", ")} WHERE id = ?`, values);
                return NextResponse.json({ success: true });
            } finally {
                await connection.end();
            }
        }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
    }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as LitcofType;
        const id = searchParams.get("id");

        if (!type || !tableMap[type]) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

        const table = tableMap[type];
        const imageTypes: LitcofType[] = ["organizing-team", "achievements", "events", "gallery"];

        if (isDevelopment) {
            if (imageTypes.includes(type)) {
                const { data: rec } = await supabase.from(table).select("image_url").eq("id", id).single();
                if (rec?.image_url) {
                    const fileName = rec.image_url.split("/").pop();
                    if (fileName) await supabase.storage.from("litcof").remove([fileName]);
                }
            }
            const { error } = await supabase.from(table).delete().eq("id", id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                if (imageTypes.includes(type)) {
                    const [rows] = await connection.execute(`SELECT image_url FROM ${table} WHERE id = ?`, [id]);
                    const rec = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
                    if (rec?.image_url) {
                        const filePath = path.join(process.cwd(), "public", rec.image_url);
                        try { await fs.unlink(filePath); } catch { /* ignore */ }
                    }
                }
                await connection.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
                return NextResponse.json({ success: true });
            } finally {
                await connection.end();
            }
        }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
