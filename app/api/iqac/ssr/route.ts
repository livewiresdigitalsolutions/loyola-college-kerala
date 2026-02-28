// app/api/iqac/ssr/route.ts
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

// GET — fetch all SSR documents
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let sql = "SELECT * FROM ssr_documents WHERE 1=1";
            if (!includeInactive) sql += " AND is_active = 1";
            sql += " ORDER BY display_order ASC, cycle ASC";
            const [rows] = await connection.execute(sql);
            return NextResponse.json({ success: true, data: rows });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error fetching SSR documents:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch SSR documents" },
            { status: 500 }
        );
    }
}

// POST — create a new SSR document entry
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, cycle, academic_year, description, pdf_url, display_order, is_active } = body;

        if (!title || !cycle) {
            return NextResponse.json(
                { success: false, error: "Title and cycle are required" },
                { status: 400 }
            );
        }

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [result] = await connection.execute(
                `INSERT INTO ssr_documents 
                 (title, cycle, academic_year, description, pdf_url, display_order, is_active) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    title,
                    cycle,
                    academic_year || "",
                    description || "",
                    pdf_url || "",
                    display_order || 0,
                    is_active !== false ? 1 : 0,
                ]
            );
            return NextResponse.json({
                success: true,
                message: "SSR document created successfully",
                data: { id: (result as any).insertId },
            });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error creating SSR document:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create SSR document" },
            { status: 500 }
        );
    }
}

// PUT — update an existing SSR document
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, cycle, academic_year, description, pdf_url, display_order, is_active } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const updates: string[] = [];
            const params: any[] = [];

            if (title !== undefined) { updates.push("title = ?"); params.push(title); }
            if (cycle !== undefined) { updates.push("cycle = ?"); params.push(cycle); }
            if (academic_year !== undefined) { updates.push("academic_year = ?"); params.push(academic_year); }
            if (description !== undefined) { updates.push("description = ?"); params.push(description); }
            if (pdf_url !== undefined) { updates.push("pdf_url = ?"); params.push(pdf_url); }
            if (display_order !== undefined) { updates.push("display_order = ?"); params.push(display_order); }
            if (is_active !== undefined) { updates.push("is_active = ?"); params.push(is_active ? 1 : 0); }

            updates.push("updated_at = CURRENT_TIMESTAMP");
            params.push(id);

            await connection.execute(
                `UPDATE ssr_documents SET ${updates.join(", ")} WHERE id = ?`,
                params
            );
            return NextResponse.json({ success: true, message: "SSR document updated" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error updating SSR document:", error);
        return NextResponse.json({ success: false, error: "Failed to update SSR document" }, { status: 500 });
    }
}

// DELETE — remove an SSR document and its file
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute("SELECT pdf_url FROM ssr_documents WHERE id = ?", [id]);
            const record = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
            if (record?.pdf_url && !record.pdf_url.startsWith("http")) {
                const filePath = path.join(process.cwd(), "public", record.pdf_url);
                try { await fs.unlink(filePath); } catch { /* file may not exist */ }
            }
            await connection.execute("DELETE FROM ssr_documents WHERE id = ?", [id]);
            return NextResponse.json({ success: true, message: "SSR document deleted" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error deleting SSR document:", error);
        return NextResponse.json({ success: false, error: "Failed to delete SSR document" }, { status: 500 });
    }
}
