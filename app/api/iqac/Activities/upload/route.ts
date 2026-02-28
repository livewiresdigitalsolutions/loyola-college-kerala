// app/api/iqac/Activities/upload/route.ts
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

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type"); // "reports" or "minutes"

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string || "";
        const year = formData.get("year") as string || "";
        const display_order = parseInt(formData.get("display_order") as string) || 0;
        const is_active = formData.get("is_active") !== "false";

        if (!file) return NextResponse.json({ success: false, error: "File is required" }, { status: 400 });
        if (type === "reports" && !title) return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
        if (type === "minutes" && !year) return NextResponse.json({ success: false, error: "Year is required" }, { status: 400 });

        const isPdf = file.type === "application/pdf";
        const isImage = file.type.startsWith("image/");
        if (!isPdf && !isImage) return NextResponse.json({ success: false, error: "PDF or image files only" }, { status: 400 });
        if (file.size > MAX_FILE_SIZE) return NextResponse.json({ success: false, error: "File too large (max 20MB)" }, { status: 400 });

        const sanitized = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const fileName = `${Date.now()}-${sanitized}`;
        const uploadDir = path.join(process.cwd(), "public", "iqac", "activities");
        try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }

        await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
        const fileUrl = `/iqac/activities/${fileName}`;

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let result: any;
            if (type === "reports") {
                [result] = await connection.execute(
                    "INSERT INTO iqac_reports (title, pdf_url, file_name, display_order, is_active) VALUES (?, ?, ?, ?, ?)",
                    [title, fileUrl, file.name, display_order, is_active ? 1 : 0]
                );
            } else if (type === "minutes") {
                [result] = await connection.execute(
                    "INSERT INTO iqac_minutes (year, pdf_url, file_name, display_order, is_active) VALUES (?, ?, ?, ?, ?)",
                    [year, fileUrl, file.name, display_order, is_active ? 1 : 0]
                );
            } else {
                return NextResponse.json({ success: false, error: "Invalid upload type" }, { status: 400 });
            }
            return NextResponse.json({
                success: true,
                message: "Uploaded successfully",
                data: { id: result.insertId, pdf_url: fileUrl },
            });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Upload failed", details: error.message }, { status: 500 });
    }
}
