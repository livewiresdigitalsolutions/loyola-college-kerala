// app/api/iqac/AQARs-Formats/upload/route.ts
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

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const category = formData.get("category") as string;
        const category_order = parseInt(formData.get("category_order") as string) || 0;
        const display_order = parseInt(formData.get("display_order") as string) || 0;
        const is_active = formData.get("is_active") !== "false";

        if (!file || !title || !category) {
            return NextResponse.json({ success: false, error: "File, title, and category are required" }, { status: 400 });
        }

        const isPdf = file.type === "application/pdf";
        const isImage = file.type.startsWith("image/");
        if (!isPdf && !isImage) {
            return NextResponse.json({ success: false, error: "Only PDF and image files are allowed" }, { status: 400 });
        }
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ success: false, error: "File size must be less than 20MB" }, { status: 400 });
        }

        const sanitized = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const fileName = `${Date.now()}-${sanitized}`;
        const uploadDir = path.join(process.cwd(), "public", "iqac", "aqar-formats");
        try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }

        const filePath = path.join(uploadDir, fileName);
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        const fileUrl = `/iqac/aqar-formats/${fileName}`;

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [result] = await connection.execute(
                `INSERT INTO aqar_format_documents (title, category, category_order, pdf_url, file_name, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [title, category, category_order, fileUrl, file.name, display_order, is_active ? 1 : 0]
            );
            return NextResponse.json({
                success: true,
                message: "Document uploaded successfully",
                data: { id: (result as any).insertId, pdf_url: fileUrl },
            });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error uploading document:", error);
        return NextResponse.json({ success: false, error: "Failed to upload document", details: error.message }, { status: 500 });
    }
}
