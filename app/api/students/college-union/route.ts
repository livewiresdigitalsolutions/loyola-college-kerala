// app/api/students/college-union/route.ts
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

type CuType = "organizing-team" | "union-reports" | "accordion-activities" | "accordion-other" | "accordion-arts" | "gallery";

function getTable(type: CuType): string {
    switch (type) {
        case "organizing-team": return "cu_organizing_team";
        case "union-reports": return "cu_union_reports";
        case "accordion-activities": return "cu_accordion_items";
        case "accordion-other": return "cu_other_activities";
        case "accordion-arts": return "cu_accordion_items";
        case "gallery": return "cu_gallery";
    }
}

// Image / file fields per type (used for filesystem cleanup on delete)
function getFileField(type: CuType): string | null {
    if (type === "organizing-team") return "image_url";
    if (type === "gallery") return "image_url";
    if (type === "union-reports") return "pdf_url";
    return null;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as CuType;
        const all = searchParams.get("all") === "true";
        if (!type || !getTable(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let sql = `SELECT * FROM ${getTable(type)} WHERE 1=1`;
            // For accordion types filter by section column
            if (type === "accordion-activities") sql += ` AND section = 'activities'`;
            if (type === "accordion-arts") sql += ` AND section = 'arts'`;
            if (!all) sql += " AND is_active = 1";
            sql += " ORDER BY display_order ASC";
            const [rows] = await connection.execute(sql);
            return NextResponse.json({ success: true, data: rows });
        } finally { await connection.end(); }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as CuType;
        const body = await request.json();
        if (!type || !getTable(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const table = getTable(type);
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            // Inject section for accordion types
            if (type === "accordion-activities") body.section = "activities";
            if (type === "accordion-arts") body.section = "arts";

            const keys = Object.keys(body);
            const values = Object.values(body);
            const [result] = await connection.execute(
                `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
                values
            ) as any;
            return NextResponse.json({ success: true, insertId: result.insertId });
        } finally { await connection.end(); }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: "Failed to create", details: e.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as CuType;
        const body = await request.json();
        const { id, ...data } = body;
        if (!type || !getTable(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

        const table = getTable(type);
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const sets = Object.keys(data).map(k => `${k} = ?`);
            sets.push("updated_at = CURRENT_TIMESTAMP");
            await connection.execute(
                `UPDATE ${table} SET ${sets.join(", ")} WHERE id = ?`,
                [...Object.values(data), id]
            );
            return NextResponse.json({ success: true });
        } finally { await connection.end(); }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as CuType;
        const id = searchParams.get("id");
        if (!type || !getTable(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

        const table = getTable(type);
        const fileField = getFileField(type);
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            // Delete associated file from filesystem
            if (fileField) {
                const [rows] = await connection.execute(`SELECT ${fileField} AS file_url FROM ${table} WHERE id = ?`, [id]);
                const rec = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
                if (rec?.file_url && !rec.file_url.startsWith("http")) {
                    try { await fs.unlink(path.join(process.cwd(), "public", rec.file_url)); } catch { /* ignore */ }
                }
            }
            await connection.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
            return NextResponse.json({ success: true });
        } finally { await connection.end(); }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
