// app/api/students/college-union/upload/route.ts
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

const MAX_IMG = 5 * 1024 * 1024;   // 5 MB
const MAX_PDF = 20 * 1024 * 1024;  // 20 MB

async function ensureDir(dir: string) {
    try { await fs.access(dir); } catch { await fs.mkdir(dir, { recursive: true }); }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string; // "organizing-team" | "gallery" | "union-reports"

        if (!file) return NextResponse.json({ success: false, error: "File required" }, { status: 400 });
        if (!["organizing-team", "gallery", "union-reports"].includes(type)) {
            return NextResponse.json({ success: false, error: "Invalid upload type" }, { status: 400 });
        }

        const connection = await mysql.createConnection(mysqlConfig);

        try {
            // ── Organizing Team image upload ───────────────────────────────────────
            if (type === "organizing-team") {
                if (!file.type.startsWith("image/")) return NextResponse.json({ success: false, error: "Image file required" }, { status: 400 });
                if (file.size > MAX_IMG) return NextResponse.json({ success: false, error: "Max 5 MB" }, { status: 400 });

                const name = formData.get("name") as string;
                const role = formData.get("role") as string;
                const subtitle = (formData.get("subtitle") as string) || "";
                const is_advisor = formData.get("is_advisor") === "true" ? 1 : 0;
                const display_order = parseInt((formData.get("display_order") as string) || "0");
                const is_active = formData.get("is_active") !== "false" ? 1 : 0;

                if (!name || !role) return NextResponse.json({ success: false, error: "Name and role required" }, { status: 400 });

                const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
                const fileName = `${Date.now()}-${safe}`;
                const uploadDir = path.join(process.cwd(), "public", "assets", "college-union", "team");
                await ensureDir(uploadDir);
                await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
                const image_url = `/assets/college-union/team/${fileName}`;

                const [result] = await connection.execute(
                    "INSERT INTO cu_organizing_team (name, role, subtitle, image_url, is_advisor, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [name, role, subtitle, image_url, is_advisor, display_order, is_active]
                ) as any;
                return NextResponse.json({ success: true, insertId: result.insertId, image_url });
            }

            // ── Gallery image upload ───────────────────────────────────────────────
            if (type === "gallery") {
                if (!file.type.startsWith("image/")) return NextResponse.json({ success: false, error: "Image file required" }, { status: 400 });
                if (file.size > MAX_IMG) return NextResponse.json({ success: false, error: "Max 5 MB" }, { status: 400 });

                const alt_text = (formData.get("alt_text") as string) || "College Union Gallery";
                const display_order = parseInt((formData.get("display_order") as string) || "0");
                const is_active = formData.get("is_active") !== "false" ? 1 : 0;

                const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
                const fileName = `${Date.now()}-${safe}`;
                const uploadDir = path.join(process.cwd(), "public", "assets", "college-union", "gallery");
                await ensureDir(uploadDir);
                await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
                const image_url = `/assets/college-union/gallery/${fileName}`;

                const [result] = await connection.execute(
                    "INSERT INTO cu_gallery (image_url, alt_text, display_order, is_active) VALUES (?, ?, ?, ?)",
                    [image_url, alt_text, display_order, is_active]
                ) as any;
                return NextResponse.json({ success: true, insertId: result.insertId, image_url });
            }

            // ── Union Report PDF upload ────────────────────────────────────────────
            if (type === "union-reports") {
                if (file.type !== "application/pdf") return NextResponse.json({ success: false, error: "PDF file required" }, { status: 400 });
                if (file.size > MAX_PDF) return NextResponse.json({ success: false, error: "Max 20 MB" }, { status: 400 });

                const title = formData.get("title") as string;
                const display_order = parseInt((formData.get("display_order") as string) || "0");
                const is_active = formData.get("is_active") !== "false" ? 1 : 0;

                if (!title) return NextResponse.json({ success: false, error: "Title required" }, { status: 400 });

                const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
                const fileName = `${Date.now()}-${safe}`;
                const uploadDir = path.join(process.cwd(), "public", "assets", "college-union", "reports");
                await ensureDir(uploadDir);
                await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
                const pdf_url = `/assets/college-union/reports/${fileName}`;

                const [result] = await connection.execute(
                    "INSERT INTO cu_union_reports (title, pdf_url, display_order, is_active) VALUES (?, ?, ?, ?)",
                    [title, pdf_url, display_order, is_active]
                ) as any;
                return NextResponse.json({ success: true, insertId: result.insertId, pdf_url });
            }

            return NextResponse.json({ success: false, error: "Unhandled type" }, { status: 400 });
        } finally { await connection.end(); }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: "Upload failed", details: e.message }, { status: 500 });
    }
}
