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

const MAX_IMG = 5 * 1024 * 1024;
const MAX_PDF = 20 * 1024 * 1024;

async function ensureDir(d: string) { try { await fs.access(d); } catch { await fs.mkdir(d, { recursive: true }); } }

export async function POST(request: Request) {
    try {
        const fd = await request.formData();
        const file = fd.get("file") as File;
        const type = fd.get("type") as string;
        if (!file) return NextResponse.json({ success: false, error: "File required" }, { status: 400 });

        const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const fileName = `${Date.now()}-${safe}`;
        const buf = Buffer.from(await file.arrayBuffer());

        const conn = await mysql.createConnection(mysqlConfig);
        try {
            // ── Team photo ─────────────────────────────────────────────────────
            if (type === "team") {
                if (!file.type.startsWith("image/")) return NextResponse.json({ success: false, error: "Image required" }, { status: 400 });
                if (file.size > MAX_IMG) return NextResponse.json({ success: false, error: "Max 5 MB" }, { status: 400 });
                const name = fd.get("name") as string, role = fd.get("role") as string;
                const display_order = parseInt((fd.get("display_order") as string) || "0");
                if (!name || !role) return NextResponse.json({ success: false, error: "Name and role required" }, { status: 400 });
                const dir = path.join(process.cwd(), "public", "assets", "womens-cell", "team");
                await ensureDir(dir); await fs.writeFile(path.join(dir, fileName), buf);
                const image_url = `/assets/womens-cell/team/${fileName}`;
                const [r] = await conn.execute("INSERT INTO wc_team (name, role, image_url, display_order, is_active) VALUES (?, ?, ?, ?, 1)", [name, role, image_url, display_order]) as any;
                return NextResponse.json({ success: true, insertId: r.insertId, image_url });
            }

            // ── Content section image (activities / events / gallery / admin-structure) ──
            if (["activities", "events", "gallery", "admin-structure"].includes(type)) {
                if (!file.type.startsWith("image/")) return NextResponse.json({ success: false, error: "Image required" }, { status: 400 });
                if (file.size > MAX_IMG) return NextResponse.json({ success: false, error: "Max 5 MB" }, { status: 400 });
                const dir = path.join(process.cwd(), "public", "assets", "womens-cell", type);
                await ensureDir(dir); await fs.writeFile(path.join(dir, fileName), buf);
                const image_url = `/assets/womens-cell/${type}/${fileName}`;

                if (type === "admin-structure") {
                    // Replace existing row or insert new one
                    const existingId = fd.get("id") as string;
                    if (existingId) {
                        await conn.execute("UPDATE wc_content SET image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND section = 'admin-structure'", [image_url, existingId]);
                    } else {
                        await conn.execute("INSERT INTO wc_content (section, image_url, display_order, is_active) VALUES ('admin-structure', ?, 0, 1)", [image_url]);
                    }
                    return NextResponse.json({ success: true, image_url });
                }

                if (type === "gallery") {
                    const alt_text = (fd.get("alt_text") as string) || "Women Cell Gallery";
                    const display_order = parseInt((fd.get("display_order") as string) || "0");
                    const [r] = await conn.execute("INSERT INTO wc_content (section, image_url, alt_text, display_order, is_active) VALUES ('gallery', ?, ?, ?, 1)", [image_url, alt_text, display_order]) as any;
                    return NextResponse.json({ success: true, insertId: r.insertId, image_url });
                }

                if (type === "activities") {
                    const title = fd.get("title") as string;
                    if (!title) return NextResponse.json({ success: false, error: "Title required" }, { status: 400 });
                    const date = (fd.get("date") as string) || "", description = (fd.get("description") as string) || "";
                    const display_order = parseInt((fd.get("display_order") as string) || "0");
                    const [r] = await conn.execute("INSERT INTO wc_content (section, title, date, description, image_url, display_order, is_active) VALUES ('activities', ?, ?, ?, ?, ?, 1)", [title, date, description, image_url, display_order]) as any;
                    return NextResponse.json({ success: true, insertId: r.insertId, image_url });
                }

                if (type === "events") {
                    const title = fd.get("title") as string;
                    if (!title) return NextResponse.json({ success: false, error: "Title required" }, { status: 400 });
                    const subtitle = (fd.get("subtitle") as string) || "";
                    const display_order = parseInt((fd.get("display_order") as string) || "0");
                    const [r] = await conn.execute("INSERT INTO wc_content (section, title, subtitle, image_url, display_order, is_active) VALUES ('events', ?, ?, ?, ?, 1)", [title, subtitle, image_url, display_order]) as any;
                    return NextResponse.json({ success: true, insertId: r.insertId, image_url });
                }
            }

            // ── PDF Report ─────────────────────────────────────────────────────
            if (type === "reports") {
                if (file.type !== "application/pdf") return NextResponse.json({ success: false, error: "PDF required" }, { status: 400 });
                if (file.size > MAX_PDF) return NextResponse.json({ success: false, error: "Max 20 MB" }, { status: 400 });
                const title = fd.get("title") as string;
                if (!title) return NextResponse.json({ success: false, error: "Title required" }, { status: 400 });
                const display_order = parseInt((fd.get("display_order") as string) || "0");
                const dir = path.join(process.cwd(), "public", "assets", "womens-cell", "reports");
                await ensureDir(dir); await fs.writeFile(path.join(dir, fileName), buf);
                const file_url = `/assets/womens-cell/reports/${fileName}`;
                const [r] = await conn.execute("INSERT INTO wc_content (section, title, file_url, display_order, is_active) VALUES ('reports', ?, ?, ?, 1)", [title, file_url, display_order]) as any;
                return NextResponse.json({ success: true, insertId: r.insertId, file_url });
            }

            return NextResponse.json({ success: false, error: "Invalid upload type" }, { status: 400 });
        } finally { await conn.end(); }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: "Upload failed", details: e.message }, { status: 500 });
    }
}
