// app/api/iqac/Documents/upload/route.ts
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
const MAX = 20 * 1024 * 1024;

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string || "";
        const category = formData.get("category") as string || "";
        const display_order = parseInt(formData.get("display_order") as string) || 0;
        const category_order = parseInt(formData.get("category_order") as string) || 0;
        const is_active = formData.get("is_active") !== "false";

        if (!file || !title || !category) return NextResponse.json({ success: false, error: "File, title and category required" }, { status: 400 });
        const ok = file.type === "application/pdf" || file.type.startsWith("image/");
        if (!ok) return NextResponse.json({ success: false, error: "PDF or image only" }, { status: 400 });
        if (file.size > MAX) return NextResponse.json({ success: false, error: "Max 20MB" }, { status: 400 });

        const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const fileName = `${Date.now()}-${safe}`;
        const dir = path.join(process.cwd(), "public", "iqac", "documents");
        try { await fs.access(dir); } catch { await fs.mkdir(dir, { recursive: true }); }
        await fs.writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));
        const fileUrl = `/iqac/documents/${fileName}`;

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [result] = await connection.execute(
                "INSERT INTO iqac_documents (title, category, pdf_url, file_name, display_order, category_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [title, category, fileUrl, file.name, display_order, category_order, is_active ? 1 : 0]
            );
            return NextResponse.json({ success: true, data: { id: (result as any).insertId, pdf_url: fileUrl } });
        } finally { await connection.end(); }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: "Upload failed", details: e.message }, { status: 500 });
    }
}
