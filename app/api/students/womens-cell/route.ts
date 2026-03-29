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

// All content sections stored in wc_content with a section discriminator
const CONTENT_SECTIONS = ["admin-structure", "complaint-response", "news", "activities", "events", "gallery", "reports"];
const ALL_TYPES = [...CONTENT_SECTIONS, "team", "contact"];

function isValid(t: string): boolean { return ALL_TYPES.includes(t); }

function getTable(type: string): string {
    if (type === "team") return "wc_team";
    if (type === "contact") return "wc_contact";
    if (CONTENT_SECTIONS.includes(type)) return "wc_content";
    throw new Error(`Unknown type: ${type}`);
}

// Which file field to look up before deletion
function getFileField(type: string): string | null {
    if (["team", "activities", "events", "gallery", "admin-structure"].includes(type)) return "image_url";
    if (type === "reports") return "file_url";
    return null;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "";
        const all = searchParams.get("all") === "true";
        if (!isValid(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let sql: string;
            const params: any[] = [];

            if (CONTENT_SECTIONS.includes(type)) {
                sql = "SELECT * FROM wc_content WHERE section = ?";
                params.push(type);
                if (!all) sql += " AND is_active = 1";
                sql += " ORDER BY display_order ASC, id ASC";
            } else if (type === "team") {
                sql = `SELECT * FROM wc_team WHERE 1=1${all ? "" : " AND is_active = 1"} ORDER BY display_order ASC, id ASC`;
            } else {
                // contact
                sql = `SELECT * FROM wc_contact WHERE 1=1${all ? "" : " AND is_active = 1"} ORDER BY id ASC`;
            }

            const [rows] = await connection.execute(sql, params);
            return NextResponse.json({ success: true, data: rows });
        } finally { await connection.end(); }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: "Failed to fetch", details: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "";
        const body = await request.json();
        if (!isValid(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            if (CONTENT_SECTIONS.includes(type)) {
                // Always inject section; let caller pass any subset of columns
                const data: Record<string, any> = { section: type, ...body };
                // Remove any accidental id/created_at fields
                delete data.id; delete data.created_at; delete data.updated_at;
                const keys = Object.keys(data);
                const values = Object.values(data);
                const [result] = await connection.execute(
                    `INSERT INTO wc_content (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
                    values
                ) as any;
                return NextResponse.json({ success: true, insertId: result.insertId });
            }

            // team / contact — direct insert
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
        const type = searchParams.get("type") || "";
        const body = await request.json();
        const { id, ...data } = body;
        if (!isValid(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
        // Strip section from updates — section never changes
        delete data.section; delete data.created_at; delete data.updated_at;

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const table = getTable(type);
            const sets = Object.keys(data).map(k => `${k} = ?`);
            sets.push("updated_at = CURRENT_TIMESTAMP");
            const whereExtra = CONTENT_SECTIONS.includes(type) ? " AND section = ?" : "";
            const extraParams = CONTENT_SECTIONS.includes(type) ? [type] : [];
            await connection.execute(
                `UPDATE ${table} SET ${sets.join(", ")} WHERE id = ?${whereExtra}`,
                [...Object.values(data), id, ...extraParams]
            );
            return NextResponse.json({ success: true });
        } finally { await connection.end(); }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: "Failed to update", details: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "";
        const id = searchParams.get("id");
        if (!isValid(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const table = getTable(type);
            const fileField = getFileField(type);

            // Remove file from filesystem if needed
            if (fileField) {
                const [rows] = await connection.execute(`SELECT ${fileField} AS fp FROM ${table} WHERE id = ?`, [id]);
                const rec = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
                if (rec?.fp && !rec.fp.startsWith("http")) {
                    try { await fs.unlink(path.join(process.cwd(), "public", rec.fp)); } catch { /* ignore */ }
                }
            }

            if (CONTENT_SECTIONS.includes(type)) {
                await connection.execute("DELETE FROM wc_content WHERE id = ? AND section = ?", [id, type]);
            } else {
                await connection.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
            }
            return NextResponse.json({ success: true });
        } finally { await connection.end(); }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: "Failed to delete", details: e.message }, { status: 500 });
    }
}
