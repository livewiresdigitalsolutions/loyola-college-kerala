// app/api/about/pta/upload/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

const isDevelopment = process.env.DB_TYPE === "supabase";

const mysqlConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3303"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "loyola",
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;
        const display_order = parseInt(formData.get("display_order") as string) || 0;
        const is_active = formData.get("is_active") === "true";

        if (!file || !name) {
            return NextResponse.json(
                { success: false, error: "File and name are required" },
                { status: 400 }
            );
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { success: false, error: "Only image files are allowed" },
                { status: 400 }
            );
        }

        let imageUrl = "";

        if (isDevelopment) {
            const fileName = `${Date.now()}-${file.name}`;
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("pta-leaders")
                .upload(fileName, buffer, {
                    contentType: file.type,
                    upsert: false,
                });

            if (uploadError) {
                return NextResponse.json(
                    { success: false, error: "Failed to upload file to storage" },
                    { status: 500 }
                );
            }

            const { data: urlData } = supabase.storage
                .from("pta-leaders")
                .getPublicUrl(fileName);

            imageUrl = urlData.publicUrl;

            const { data, error } = await supabase
                .from("pta_leaders")
                .insert([{ name, role: role || "", image_url: imageUrl, display_order, is_active }])
                .select();

            if (error) {
                return NextResponse.json(
                    { success: false, error: "Failed to save to database" },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Leader uploaded successfully",
                data,
            });
        } else {
            const fileName = `${Date.now()}-${file.name}`;
            const uploadDir = path.join(process.cwd(), "public", "pta-leaders");

            try {
                await fs.access(uploadDir);
            } catch {
                await fs.mkdir(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await fs.writeFile(filePath, buffer);

            imageUrl = `/pta-leaders/${fileName}`;

            const connection = await mysql.createConnection(mysqlConfig);
            try {
                await connection.execute(
                    "INSERT INTO pta_leaders (name, role, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)",
                    [name, role || "", imageUrl, display_order, is_active ? 1 : 0]
                );

                return NextResponse.json({
                    success: true,
                    message: "Leader uploaded successfully",
                });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Failed to upload leader", details: error.message },
            { status: 500 }
        );
    }
}
