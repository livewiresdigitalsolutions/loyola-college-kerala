// app/api/students/students-progression/upload/route.ts
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

// POST — upload image and insert rank-holder or qualifier
export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type"); // "rank-holders" | "qualifiers"

        if (type !== "rank-holders" && type !== "qualifiers") {
            return NextResponse.json(
                { success: false, error: "type must be rank-holders or qualifiers" },
                { status: 400 }
            );
        }

        const table = type === "rank-holders" ? "sp_rank_holders" : "sp_qualifiers";

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const name = formData.get("name") as string;
        const department = formData.get("department") as string;
        const rank = (formData.get("rank") as string) || "FIRST";
        const display_order = parseInt(formData.get("display_order") as string) || 0;
        const is_active = formData.get("is_active") !== "false";
        // qualifiers-specific
        const qualifier_type = (formData.get("qualifier_type") as string) || "NET";
        const year_range = (formData.get("year_range") as string) || "";
        // rank-holders-specific
        const batch_year = (formData.get("batch_year") as string) || "";

        if (!file || !name || !department) {
            return NextResponse.json(
                { success: false, error: "file, name, and department are required" },
                { status: 400 }
            );
        }

        let imageUrl = "";

        if (isDevelopment) {
            const fileName = `${Date.now()}-${file.name}`;
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { error: uploadError } = await supabase.storage
                .from("students-progression")
                .upload(fileName, buffer, { contentType: file.type, upsert: false });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("students-progression")
                .getPublicUrl(fileName);

            imageUrl = urlData.publicUrl;
        } else {
            const fileName = `${Date.now()}-${file.name}`;
            const uploadDir = path.join(process.cwd(), "public", "students-progression");
            try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
            const filePath = path.join(uploadDir, fileName);
            const arrayBuffer = await file.arrayBuffer();
            await fs.writeFile(filePath, Buffer.from(arrayBuffer));
            imageUrl = `/students-progression/${fileName}`;
        }

        // Build insert record
        const baseRecord: Record<string, any> = {
            name, department, rank, image_url: imageUrl, display_order,
            is_active: isDevelopment ? is_active : (is_active ? 1 : 0),
        };

        if (type === "qualifiers") {
            baseRecord.qualifier_type = qualifier_type;
            baseRecord.year_range = year_range;
        } else {
            baseRecord.batch_year = batch_year;
        }

        if (isDevelopment) {
            const { data, error } = await supabase.from(table).insert([baseRecord]).select();
            if (error) throw error;
            return NextResponse.json({ success: true, message: "Uploaded successfully", data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const keys = Object.keys(baseRecord);
                const values = Object.values(baseRecord);
                await connection.execute(
                    `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
                    values
                );
                return NextResponse.json({ success: true, message: "Uploaded successfully" });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        console.error("Error uploading:", error);
        return NextResponse.json(
            { success: false, error: "Upload failed", details: error.message },
            { status: 500 }
        );
    }
}
