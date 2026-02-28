// app/api/iqac/Activities/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";

const mysqlConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3303"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "loyola",
};

const TABLE: Record<string, string> = {
    activities: "iqac_activity_items",
    reports: "iqac_reports",
    timelines: "iqac_timelines",
    minutes: "iqac_minutes",
};

// ─── GET ─────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "activities";
        const includeInactive = searchParams.get("includeInactive") === "true";
        const table = TABLE[type];
        if (!table) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let sql = `SELECT * FROM ${table} WHERE 1=1`;
            if (!includeInactive) sql += " AND is_active = 1";
            sql += " ORDER BY display_order ASC";
            const [rows] = await connection.execute(sql);
            return NextResponse.json({ success: true, data: rows });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 });
    }
}

// ─── POST ────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "activities";
        const body = await request.json();
        const connection = await mysql.createConnection(mysqlConfig);

        try {
            let result: any;
            if (type === "activities") {
                if (!body.text) return NextResponse.json({ success: false, error: "Text is required" }, { status: 400 });
                [result] = await connection.execute(
                    "INSERT INTO iqac_activity_items (text, display_order, is_active) VALUES (?, ?, ?)",
                    [body.text, body.display_order || 0, body.is_active !== false ? 1 : 0]
                );
            } else if (type === "reports") {
                if (!body.title) return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
                [result] = await connection.execute(
                    "INSERT INTO iqac_reports (title, pdf_url, display_order, is_active) VALUES (?, ?, ?, ?)",
                    [body.title, body.pdf_url || "", body.display_order || 0, body.is_active !== false ? 1 : 0]
                );
            } else if (type === "timelines") {
                if (!body.year) return NextResponse.json({ success: false, error: "Year is required" }, { status: 400 });
                [result] = await connection.execute(
                    "INSERT INTO iqac_timelines (year, view_url, display_order, is_active) VALUES (?, ?, ?, ?)",
                    [body.year, body.view_url || "", body.display_order || 0, body.is_active !== false ? 1 : 0]
                );
            } else if (type === "minutes") {
                if (!body.year) return NextResponse.json({ success: false, error: "Year is required" }, { status: 400 });
                [result] = await connection.execute(
                    "INSERT INTO iqac_minutes (year, pdf_url, display_order, is_active) VALUES (?, ?, ?, ?)",
                    [body.year, body.pdf_url || "", body.display_order || 0, body.is_active !== false ? 1 : 0]
                );
            } else {
                return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
            }
            return NextResponse.json({ success: true, data: { id: result.insertId } });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to create record", details: error.message }, { status: 500 });
    }
}

// ─── PUT ─────────────────────────────────────────────────────────────────────
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "activities";
        const body = await request.json();
        const { id, ...fields } = body;
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        const table = TABLE[type];
        if (!table) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const updates: string[] = [];
            const params: any[] = [];
            for (const [key, value] of Object.entries(fields)) {
                if (key === "is_active") { updates.push("is_active = ?"); params.push(value ? 1 : 0); }
                else { updates.push(`${key} = ?`); params.push(value); }
            }
            updates.push("updated_at = CURRENT_TIMESTAMP");
            params.push(id);
            await connection.execute(`UPDATE ${table} SET ${updates.join(", ")} WHERE id = ?`, params);
            return NextResponse.json({ success: true, message: "Updated" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
    }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "activities";
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        const table = TABLE[type];
        if (!table) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            // Try to delete associated file for reports and minutes
            if (type === "reports" || type === "minutes") {
                const [rows] = await connection.execute(`SELECT pdf_url FROM ${table} WHERE id = ?`, [id]);
                const rec = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
                if (rec?.pdf_url && !rec.pdf_url.startsWith("http")) {
                    try { await fs.unlink(path.join(process.cwd(), "public", rec.pdf_url)); } catch { }
                }
            }
            await connection.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
            return NextResponse.json({ success: true, message: "Deleted" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
