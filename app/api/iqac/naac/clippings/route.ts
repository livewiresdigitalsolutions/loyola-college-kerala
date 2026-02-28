// app/api/iqac/naac/clippings/route.ts
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
            let sql = "SELECT * FROM naac_newspaper_clippings WHERE 1=1";
            if (!includeInactive) sql += " AND is_active = 1";
            sql += " ORDER BY display_order ASC";
            const [rows] = await connection.execute(sql);
            return NextResponse.json({ success: true, data: rows });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error fetching clippings:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch clippings" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, display_order, is_active } = body;
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const updates: string[] = [];
            const params: any[] = [];
            if (title !== undefined) { updates.push("title = ?"); params.push(title); }
            if (display_order !== undefined) { updates.push("display_order = ?"); params.push(display_order); }
            if (is_active !== undefined) { updates.push("is_active = ?"); params.push(is_active ? 1 : 0); }
            updates.push("updated_at = CURRENT_TIMESTAMP");
            params.push(id);
            await connection.execute(`UPDATE naac_newspaper_clippings SET ${updates.join(", ")} WHERE id = ?`, params);
            return NextResponse.json({ success: true, message: "Clipping updated" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to update clipping" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute("SELECT image_url FROM naac_newspaper_clippings WHERE id = ?", [id]);
            const record = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
            if (record?.image_url) {
                const filePath = path.join(process.cwd(), "public", record.image_url);
                try { await fs.unlink(filePath); } catch { }
            }
            await connection.execute("DELETE FROM naac_newspaper_clippings WHERE id = ?", [id]);
            return NextResponse.json({ success: true, message: "Clipping deleted" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to delete clipping" }, { status: 500 });
    }
}
