// app/api/iqac/About/route.ts
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

// type query param: "coordinators" | "members"

// ─── GET ─────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "coordinators";
        const includeInactive = searchParams.get("includeInactive") === "true";

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let sql = "";
            if (type === "coordinators") {
                sql = `SELECT * FROM iqac_coordinators WHERE 1=1${!includeInactive ? " AND is_active = 1" : ""} ORDER BY display_order ASC`;
            } else if (type === "members") {
                sql = `SELECT * FROM iqac_members WHERE 1=1${!includeInactive ? " AND is_active = 1" : ""} ORDER BY display_order ASC`;
            } else {
                return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
            }
            const [rows] = await connection.execute(sql);
            return NextResponse.json({ success: true, data: rows });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to fetch data", details: error.message }, { status: 500 });
    }
}

// ─── POST ────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "members";
        const body = await request.json();
        const connection = await mysql.createConnection(mysqlConfig);

        try {
            let result: any;
            if (type === "members") {
                if (!body.name) return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
                [result] = await connection.execute(
                    "INSERT INTO iqac_members (role, name, department, category, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)",
                    [body.role, body.name, body.department || "", body.category || "general", body.display_order || 0, body.is_active !== false ? 1 : 0]
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
        const type = searchParams.get("type") || "members";
        const body = await request.json();
        const { id, ...fields } = body;
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        const table = type === "coordinators" ? "iqac_coordinators" : type === "members" ? "iqac_members" : null;
        if (!table) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const updates: string[] = [];
            const params: any[] = [];
            for (const [key, value] of Object.entries(fields)) {
                if (key === "is_active") { updates.push("is_active = ?"); params.push(value ? 1 : 0); }
                else { updates.push(`${key} = ?`); params.push(value); }
            }
            if (updates.length === 0) return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
            updates.push("updated_at = CURRENT_TIMESTAMP");
            params.push(id);
            await connection.execute(`UPDATE ${table} SET ${updates.join(", ")} WHERE id = ?`, params);
            return NextResponse.json({ success: true, message: "Updated successfully" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to update", details: error.message }, { status: 500 });
    }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "members";
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        const table = type === "coordinators" ? "iqac_coordinators" : type === "members" ? "iqac_members" : null;
        if (!table) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            // Delete image file for coordinators
            if (type === "coordinators") {
                const [rows] = await connection.execute("SELECT image_url FROM iqac_coordinators WHERE id = ?", [id]);
                const rec = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
                if (rec?.image_url && !rec.image_url.startsWith("http")) {
                    try { await fs.unlink(path.join(process.cwd(), "public", rec.image_url)); } catch { }
                }
            }
            await connection.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
            return NextResponse.json({ success: true, message: "Deleted successfully" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to delete", details: error.message }, { status: 500 });
    }
}
