// app/api/students/loyola-mentoring-programme/route.ts
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

type LmpType = "organizing-team" | "sessions";

const tableMap: Record<LmpType, string> = {
    "organizing-team": "lmp_organizing_team",
    "sessions": "lmp_sessions",
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as LmpType;
        const all = searchParams.get("all") === "true";
        if (!type || !tableMap[type]) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (isDevelopment) {
            let q = supabase.from(tableMap[type]).select("*").order("display_order", { ascending: true });
            if (!all) q = q.eq("is_active", true);
            const { data, error } = await q;
            if (error) throw error;
            return NextResponse.json({ success: true, data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                let sql = `SELECT * FROM ${tableMap[type]} WHERE 1=1`;
                if (!all) sql += " AND is_active = 1";
                sql += " ORDER BY display_order ASC";
                const [rows] = await connection.execute(sql);
                return NextResponse.json({ success: true, data: rows });
            } finally { await connection.end(); }
        }
    } catch { return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 }); }
}

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as LmpType;
        const body = await request.json();
        if (!type || !tableMap[type]) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (isDevelopment) {
            const { data, error } = await supabase.from(tableMap[type]).insert([body]).select();
            if (error) throw error;
            return NextResponse.json({ success: true, data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const keys = Object.keys(body), values = Object.values(body);
                const [result] = await connection.execute(
                    `INSERT INTO ${tableMap[type]} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
                    values
                ) as any;
                return NextResponse.json({ success: true, insertId: result.insertId });
            } finally { await connection.end(); }
        }
    } catch { return NextResponse.json({ success: false, error: "Failed to create" }, { status: 500 }); }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as LmpType;
        const body = await request.json();
        const { id, ...data } = body;
        if (!type || !tableMap[type]) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
        if (isDevelopment) {
            const { error } = await supabase.from(tableMap[type]).update(data).eq("id", id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const sets = Object.keys(data).map(k => `${k} = ?`);
                await connection.execute(`UPDATE ${tableMap[type]} SET ${sets.join(", ")} WHERE id = ?`, [...Object.values(data), id]);
                return NextResponse.json({ success: true });
            } finally { await connection.end(); }
        }
    } catch { return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 }); }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as LmpType;
        const id = searchParams.get("id");
        if (!type || !tableMap[type]) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
        if (isDevelopment) {
            if (type === "organizing-team") {
                const { data: rec } = await supabase.from(tableMap[type]).select("image_url").eq("id", id).single();
                if (rec?.image_url) {
                    const fn = rec.image_url.split("/").pop();
                    if (fn) await supabase.storage.from("lmp").remove([fn]);
                }
            }
            const { error } = await supabase.from(tableMap[type]).delete().eq("id", id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                if (type === "organizing-team") {
                    const [rows] = await connection.execute(`SELECT image_url FROM ${tableMap[type]} WHERE id = ?`, [id]);
                    const rec = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
                    if (rec?.image_url) {
                        try { await fs.unlink(path.join(process.cwd(), "public", rec.image_url)); } catch { /* ignore */ }
                    }
                }
                await connection.execute(`DELETE FROM ${tableMap[type]} WHERE id = ?`, [id]);
                return NextResponse.json({ success: true });
            } finally { await connection.end(); }
        }
    } catch { return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 }); }
}
