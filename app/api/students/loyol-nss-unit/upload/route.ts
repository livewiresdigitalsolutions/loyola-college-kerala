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

async function ensureDir(dir: string) {
    try { await fs.access(dir); } catch { await fs.mkdir(dir, { recursive: true }); }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string; // "organizing-team" | "activities" | "gallery"

        if (!file) return NextResponse.json({ success: false, error: "File required" }, { status: 400 });
        if (!["organizing-team", "activities", "gallery"].includes(type)) {
            return NextResponse.json({ success: false, error: "Invalid upload type" }, { status: 400 });
        }
        if (!file.type.startsWith("image/")) return NextResponse.json({ success: false, error: "Image file required" }, { status: 400 });
        if (file.size > MAX_IMG) return NextResponse.json({ success: false, error: "Max 5 MB" }, { status: 400 });

        const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const fileName = `${Date.now()}-${safe}`;
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            // ── Organizing Team → nss_team ─────────────────────────────────────────
            if (type === "organizing-team") {
                const name = formData.get("name") as string;
                const role = formData.get("role") as string;
                const display_order = parseInt((formData.get("display_order") as string) || "0");
                const is_active = formData.get("is_active") !== "false" ? 1 : 0;
                if (!name || !role) return NextResponse.json({ success: false, error: "Name and role required" }, { status: 400 });

                const uploadDir = path.join(process.cwd(), "public", "assets", "nss", "team");
                await ensureDir(uploadDir);
                await fs.writeFile(path.join(uploadDir, fileName), fileBuffer);
                const image_url = `/assets/nss/team/${fileName}`;

                const [result] = await connection.execute(
                    "INSERT INTO nss_team (name, role, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)",
                    [name, role, image_url, display_order, is_active]
                ) as any;
                return NextResponse.json({ success: true, insertId: result.insertId, image_url });
            }

            // ── Activity → nss_activities ──────────────────────────────────────────
            if (type === "activities") {
                const title = formData.get("title") as string;
                const date = (formData.get("date") as string) || "";
                const description = (formData.get("description") as string) || "";
                const display_order = parseInt((formData.get("display_order") as string) || "0");
                const is_active = formData.get("is_active") !== "false" ? 1 : 0;
                if (!title) return NextResponse.json({ success: false, error: "Title required" }, { status: 400 });

                const uploadDir = path.join(process.cwd(), "public", "assets", "nss", "activities");
                await ensureDir(uploadDir);
                await fs.writeFile(path.join(uploadDir, fileName), fileBuffer);
                const image_url = `/assets/nss/activities/${fileName}`;

                const [result] = await connection.execute(
                    "INSERT INTO nss_activities (title, date, description, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)",
                    [title, date, description, image_url, display_order, is_active]
                ) as any;
                return NextResponse.json({ success: true, insertId: result.insertId, image_url });
            }

            // ── Gallery → nss_gallery ──────────────────────────────────────────────
            if (type === "gallery") {
                const alt_text = (formData.get("alt_text") as string) || "NSS Gallery";
                const display_order = parseInt((formData.get("display_order") as string) || "0");
                const is_active = formData.get("is_active") !== "false" ? 1 : 0;

                const uploadDir = path.join(process.cwd(), "public", "assets", "nss", "gallery");
                await ensureDir(uploadDir);
                await fs.writeFile(path.join(uploadDir, fileName), fileBuffer);
                const image_url = `/assets/nss/gallery/${fileName}`;

                const [result] = await connection.execute(
                    "INSERT INTO nss_gallery (image_url, alt_text, display_order, is_active) VALUES (?, ?, ?, ?)",
                    [image_url, alt_text, display_order, is_active]
                ) as any;
                return NextResponse.json({ success: true, insertId: result.insertId, image_url });
            }

            return NextResponse.json({ success: false, error: "Unhandled type" }, { status: 400 });
        } finally { await connection.end(); }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: "Upload failed", details: e.message }, { status: 500 });
    }
}
