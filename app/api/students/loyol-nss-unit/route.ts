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

type NssType =
    | "organizing-team"
    | "regular-activities"
    | "activities"
    | "blood-connect"
    | "special-camp"
    | "special-camp-aims"
    | "gallery"
    | "contact";

// Types that map to nss_text_items (section discriminator)
const TEXT_ITEM_TYPES: NssType[] = ["regular-activities", "blood-connect", "special-camp", "special-camp-aims"];
const ALL_TYPES: NssType[] = ["organizing-team", "regular-activities", "activities", "blood-connect", "special-camp", "special-camp-aims", "gallery", "contact"];

function getTable(type: NssType): string {
    if (TEXT_ITEM_TYPES.includes(type)) return "nss_text_items";
    switch (type) {
        case "organizing-team": return "nss_team";
        case "activities": return "nss_activities";
        case "gallery": return "nss_gallery";
        case "contact": return "nss_contact";
        default: throw new Error(`Unhandled NssType: ${type}`);
    }
}

function getFileField(type: NssType): string | null {
    if (type === "organizing-team" || type === "activities" || type === "gallery") return "image_url";
    return null;
}

function isValid(type: string): type is NssType {
    return ALL_TYPES.includes(type as NssType);
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as string;
        const all = searchParams.get("all") === "true";
        if (!type || !isValid(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let sql: string;
            const params: (string | number)[] = [];

            if (TEXT_ITEM_TYPES.includes(type as NssType)) {
                // Alias content AS text so BulletItemsTab (uses item.text) keeps working
                sql = `SELECT id, section, content, content AS text, display_order, is_active, created_at, updated_at FROM nss_text_items WHERE section = ?`;
                params.push(type);
                if (!all) { sql += " AND is_active = 1"; }
                sql += " ORDER BY display_order ASC";
            } else {
                sql = `SELECT * FROM ${getTable(type as NssType)} WHERE 1=1`;
                if (!all) { sql += " AND is_active = 1"; }
                if (!["contact"].includes(type)) { sql += " ORDER BY display_order ASC"; }
            }

            const [rows] = await connection.execute(sql, params);
            return NextResponse.json({ success: true, data: rows });
        } finally { await connection.end(); }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as string;
        let body = await request.json();
        if (!type || !isValid(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            if (TEXT_ITEM_TYPES.includes(type as NssType)) {
                // Normalize: BulletItemsTab sends 'text', TextBlockTab sends 'content' — store both as 'content'
                const content = body.content ?? body.text ?? "";
                const display_order = body.display_order ?? 0;
                const is_active = body.is_active ?? 1;
                const [result] = await connection.execute(
                    "INSERT INTO nss_text_items (section, content, display_order, is_active) VALUES (?, ?, ?, ?)",
                    [type, content, display_order, is_active]
                ) as any;
                return NextResponse.json({ success: true, insertId: result.insertId });
            }

            // Standard INSERT for other tables
            const keys = Object.keys(body);
            const values = Object.values(body);
            const [result] = await connection.execute(
                `INSERT INTO ${getTable(type as NssType)} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
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
        const type = searchParams.get("type") as string;
        let body = await request.json();
        const { id, ...data } = body;
        if (!type || !isValid(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            if (TEXT_ITEM_TYPES.includes(type as NssType)) {
                // Normalize 'text' → 'content' for bullet items, strip 'section' from updates
                const updateData: Record<string, any> = {};
                if (data.content !== undefined) updateData.content = data.content;
                if (data.text !== undefined) updateData.content = data.text; // 'text' from BulletItemsTab
                if (data.display_order !== undefined) updateData.display_order = data.display_order;
                if (data.is_active !== undefined) updateData.is_active = data.is_active;

                if (Object.keys(updateData).length === 0) {
                    return NextResponse.json({ success: false, error: "Nothing to update" }, { status: 400 });
                }
                const sets = Object.keys(updateData).map(k => `${k} = ?`);
                sets.push("updated_at = CURRENT_TIMESTAMP");
                await connection.execute(
                    `UPDATE nss_text_items SET ${sets.join(", ")} WHERE id = ? AND section = ?`,
                    [...Object.values(updateData), id, type]
                );
                return NextResponse.json({ success: true });
            }

            // Standard UPDATE for other tables
            const sets = Object.keys(data).map(k => `${k} = ?`);
            sets.push("updated_at = CURRENT_TIMESTAMP");
            await connection.execute(
                `UPDATE ${getTable(type as NssType)} SET ${sets.join(", ")} WHERE id = ?`,
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
        const type = searchParams.get("type") as string;
        const id = searchParams.get("id");
        if (!type || !isValid(type)) return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

        const fileField = getFileField(type as NssType);
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            if (fileField) {
                const table = getTable(type as NssType);
                const [rows] = await connection.execute(`SELECT ${fileField} AS file_url FROM ${table} WHERE id = ?`, [id]);
                const rec = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
                if (rec?.file_url && !rec.file_url.startsWith("http")) {
                    try { await fs.unlink(path.join(process.cwd(), "public", rec.file_url)); } catch { /* ignore */ }
                }
            }

            if (TEXT_ITEM_TYPES.includes(type as NssType)) {
                // Scope the delete to the correct section for safety
                await connection.execute("DELETE FROM nss_text_items WHERE id = ? AND section = ?", [id, type]);
            } else {
                await connection.execute(`DELETE FROM ${getTable(type as NssType)} WHERE id = ?`, [id]);
            }
            return NextResponse.json({ success: true });
        } finally { await connection.end(); }
    } catch {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
