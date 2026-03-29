// app/api/students/em-and-bio-diversity/route.ts
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

type EmType = "organizing-team" | "gallery" | "contact";

function getTable(type: EmType): string {
    switch (type) {
        case "organizing-team": return "embd_organizing_team";
        case "gallery": return "embd_gallery";
        case "contact": return "embd_contact";
    }
}

function getFileField(type: EmType): string | null {
    if (type === "organizing-team") return "image_url";
    if (type === "gallery") return "image_url";
    return null;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as EmType;
        const all = searchParams.get("all") === "true";
        if (!type || !getTable(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let sql = `SELECT * FROM ${getTable(type)} WHERE 1=1`;
            if (!all) sql += " AND is_active = 1";
            // contact doesn't need ordering; others do
            if (type !== "contact") sql += " ORDER BY display_order ASC";
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
        const type = searchParams.get("type") as EmType;
        const body = await request.json();
        if (!type || !getTable(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const keys = Object.keys(body);
            const values = Object.values(body);
            const [result] = await connection.execute(
                `INSERT INTO ${getTable(type)} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
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
        const type = searchParams.get("type") as EmType;
        const body = await request.json();
        const { id, ...data } = body;
        if (!type || !getTable(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const sets = Object.keys(data).map(k => `${k} = ?`);
            sets.push("updated_at = CURRENT_TIMESTAMP");
            await connection.execute(
                `UPDATE ${getTable(type)} SET ${sets.join(", ")} WHERE id = ?`,
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
        const type = searchParams.get("type") as EmType;
        const id = searchParams.get("id");
        if (!type || !getTable(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

        const fileField = getFileField(type);
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            if (fileField) {
                const [rows] = await connection.execute(`SELECT ${fileField} AS file_url FROM ${getTable(type)} WHERE id = ?`, [id]);
                const rec = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
                if (rec?.file_url && !rec.file_url.startsWith("http")) {
                    try { await fs.unlink(path.join(process.cwd(), "public", rec.file_url)); } catch { /* ignore */ }
                }
            }
            await connection.execute(`DELETE FROM ${getTable(type)} WHERE id = ?`, [id]);
            return NextResponse.json({ success: true });
        } finally { await connection.end(); }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
