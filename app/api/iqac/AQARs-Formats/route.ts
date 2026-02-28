// app/api/iqac/AQARs-Formats/route.ts
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
            let sql = "SELECT * FROM aqar_format_documents WHERE 1=1";
            if (!includeInactive) sql += " AND is_active = 1";
            sql += " ORDER BY category_order ASC, category ASC, display_order ASC";
            const [rows] = await connection.execute(sql);
            return NextResponse.json({ success: true, data: rows });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error fetching AQAR format documents:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch documents" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, category, category_order, pdf_url, display_order, is_active } = body;

        if (!title || !category) {
            return NextResponse.json({ success: false, error: "Title and category are required" }, { status: 400 });
        }

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [result] = await connection.execute(
                `INSERT INTO aqar_format_documents (title, category, category_order, pdf_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
                [title, category, category_order || 0, pdf_url || "", display_order || 0, is_active !== false ? 1 : 0]
            );
            return NextResponse.json({
                success: true,
                message: "Document created successfully",
                data: { id: (result as any).insertId },
            });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error creating document:", error);
        return NextResponse.json({ success: false, error: "Failed to create document" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, category, category_order, pdf_url, display_order, is_active } = body;

        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const updates: string[] = [];
            const params: any[] = [];

            if (title !== undefined) { updates.push("title = ?"); params.push(title); }
            if (category !== undefined) { updates.push("category = ?"); params.push(category); }
            if (category_order !== undefined) { updates.push("category_order = ?"); params.push(category_order); }
            if (pdf_url !== undefined) { updates.push("pdf_url = ?"); params.push(pdf_url); }
            if (display_order !== undefined) { updates.push("display_order = ?"); params.push(display_order); }
            if (is_active !== undefined) { updates.push("is_active = ?"); params.push(is_active ? 1 : 0); }

            updates.push("updated_at = CURRENT_TIMESTAMP");
            params.push(id);

            await connection.execute(`UPDATE aqar_format_documents SET ${updates.join(", ")} WHERE id = ?`, params);
            return NextResponse.json({ success: true, message: "Document updated" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to update document" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute("SELECT pdf_url FROM aqar_format_documents WHERE id = ?", [id]);
            const record = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
            if (record?.pdf_url && !record.pdf_url.startsWith("http")) {
                const filePath = path.join(process.cwd(), "public", record.pdf_url);
                try { await fs.unlink(filePath); } catch { }
            }
            await connection.execute("DELETE FROM aqar_format_documents WHERE id = ?", [id]);
            return NextResponse.json({ success: true, message: "Document deleted" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to delete document" }, { status: 500 });
    }
}
