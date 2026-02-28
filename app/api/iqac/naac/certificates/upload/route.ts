// app/api/iqac/naac/certificates/upload/route.ts
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const display_order = parseInt(formData.get("display_order") as string) || 0;
        const is_active = formData.get("is_active") !== "false";

        if (!file || !title) {
            return NextResponse.json({ success: false, error: "File and title are required" }, { status: 400 });
        }
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ success: false, error: "Only image files are allowed" }, { status: 400 });
        }
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ success: false, error: "File size must be less than 5MB" }, { status: 400 });
        }

        const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${Date.now()}-${sanitized}`;
        const uploadDir = path.join(process.cwd(), "public", "iqac", "naac-certs");
        try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }

        const filePath = path.join(uploadDir, fileName);
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        const imageUrl = `/iqac/naac-certs/${fileName}`;

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [result] = await connection.execute(
                `INSERT INTO naac_certificates (title, image_url, file_name, display_order, is_active) VALUES (?, ?, ?, ?, ?)`,
                [title, imageUrl, file.name, display_order, is_active ? 1 : 0]
            );
            return NextResponse.json({
                success: true,
                message: "Certificate uploaded successfully",
                data: { id: (result as any).insertId, image_url: imageUrl },
            });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error uploading certificate:", error);
        return NextResponse.json({ success: false, error: "Failed to upload certificate", details: error.message }, { status: 500 });
    }
}
