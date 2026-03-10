// app/api/iqac/About/upload/route.ts
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
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const name = formData.get("name") as string;
        const role = formData.get("role") as string || "";
        const display_order = parseInt(formData.get("display_order") as string) || 0;
        const is_active = formData.get("is_active") === "true";

        if (!file || !name) {
            return NextResponse.json({ success: false, error: "Image file and name are required" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ success: false, error: "Only image files (JPG, PNG, WebP) are allowed" }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ success: false, error: "File size must be less than 5MB" }, { status: 400 });
        }

        // Save to public/iqac/coordinators/
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9]/g, "_")}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "iqac", "coordinators");

        try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }

        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(arrayBuffer));

        const imageUrl = `/iqac/coordinators/${fileName}`;

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [result] = await connection.execute(
                "INSERT INTO iqac_coordinators (name, role, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)",
                [name, role, imageUrl, display_order, is_active ? 1 : 0]
            );
            return NextResponse.json({
                success: true,
                message: "Coordinator photo uploaded successfully",
                data: { id: (result as any).insertId, name, image_url: imageUrl },
            });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Upload failed", details: error.message }, { status: 500 });
    }
}
