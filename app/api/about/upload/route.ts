// app/api/about/upload/route.ts
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
        const title = formData.get("title") as string;
        const display_order =
            parseInt(formData.get("display_order") as string) || 0;
        const is_active = formData.get("is_active") === "true";

        if (!file || !name) {
            return NextResponse.json(
                { success: false, error: "File and name are required" },
                { status: 400 }
            );
        }

        let imageUrl = "";

        if (isDevelopment) {
            // Upload to Supabase Storage
            const fileName = `${Date.now()}-${file.name}`;
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("eminent-visitors")
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

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("eminent-visitors")
                .getPublicUrl(fileName);

            imageUrl = urlData.publicUrl;

            // Save to database
            const { data, error } = await supabase
                .from("eminent_visitors")
                .insert([
                    {
                        name,
                        title: title || "",
                        image_url: imageUrl,
                        display_order,
                        is_active,
                    },
                ])
                .select();

            if (error) {
                return NextResponse.json(
                    { success: false, error: "Failed to save to database" },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Visitor uploaded successfully",
                data,
            });
        } else {
            // Upload to public/eminent-visitors folder
            const fileName = `${Date.now()}-${file.name}`;
            const uploadDir = path.join(
                process.cwd(),
                "public",
                "eminent-visitors"
            );

            // Ensure directory exists
            try {
                await fs.access(uploadDir);
            } catch {
                await fs.mkdir(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await fs.writeFile(filePath, buffer);

            imageUrl = `/eminent-visitors/${fileName}`;

            // Save to MySQL database
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                await connection.execute(
                    "INSERT INTO eminent_visitors (name, title, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)",
                    [name, title || "", imageUrl, display_order, is_active ? 1 : 0]
                );

                return NextResponse.json({
                    success: true,
                    message: "Visitor uploaded successfully",
                });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: "Failed to upload visitor",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
