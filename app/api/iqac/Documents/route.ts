// app/api/iqac/Documents/route.ts
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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let sql = "SELECT * FROM iqac_documents WHERE 1=1";
            if (!includeInactive) sql += " AND is_active = 1";
            sql += " ORDER BY category_order ASC, display_order ASC";
            const [rows] = await connection.execute(sql);
            return NextResponse.json({ success: true, data: rows });
        } finally { await connection.end(); }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.title || !body.category) return NextResponse.json({ success: false, error: "Title and category required" }, { status: 400 });
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [result] = await connection.execute(
                "INSERT INTO iqac_documents (title, category, pdf_url, display_order, category_order, is_active) VALUES (?, ?, ?, ?, ?, ?)",
                [body.title, body.category, body.pdf_url || "", body.display_order || 0, body.category_order || 0, body.is_active !== false ? 1 : 0]
            );
            return NextResponse.json({ success: true, data: { id: (result as any).insertId } });
        } finally { await connection.end(); }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: "Failed to create", details: e.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...fields } = body;
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const updates: string[] = [];
            const params: any[] = [];
            for (const [k, v] of Object.entries(fields)) {
                updates.push(`${k} = ?`);
                params.push(k === "is_active" ? (v ? 1 : 0) : v);
            }
            updates.push("updated_at = CURRENT_TIMESTAMP");
            params.push(id);
            await connection.execute(`UPDATE iqac_documents SET ${updates.join(", ")} WHERE id = ?`, params);
            return NextResponse.json({ success: true });
        } finally { await connection.end(); }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute("SELECT pdf_url FROM iqac_documents WHERE id = ?", [id]);
            const rec = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
            if (rec?.pdf_url && !rec.pdf_url.startsWith("http")) {
                try { await fs.unlink(path.join(process.cwd(), "public", rec.pdf_url)); } catch { }
            }
            await connection.execute("DELETE FROM iqac_documents WHERE id = ?", [id]);
            return NextResponse.json({ success: true });
        } finally { await connection.end(); }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
