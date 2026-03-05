// app/api/students/loyola-in-the-company-of-friends/upload/route.ts
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

type ImageType = "organizing-team" | "achievements" | "events" | "gallery";

const tableMap: Record<ImageType, string> = {
    "organizing-team": "litcof_organizing_team",
    "achievements": "litcof_achievements",
    "events": "litcof_events",
    "gallery": "litcof_gallery",
};

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as ImageType;

        if (!tableMap[type]) {
            return NextResponse.json(
                { success: false, error: "type must be: organizing-team | achievements | events | gallery" },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) return NextResponse.json({ success: false, error: "file is required" }, { status: 400 });

        // ── Upload image ─────────────────────────────────────────────────────
        let imageUrl = "";

        if (isDevelopment) {
            const fileName = `${Date.now()}-${file.name}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            const { error: uploadError } = await supabase.storage
                .from("litcof")
                .upload(fileName, buffer, { contentType: file.type, upsert: false });
            if (uploadError) throw uploadError;
            imageUrl = supabase.storage.from("litcof").getPublicUrl(fileName).data.publicUrl;
        } else {
            const fileName = `${Date.now()}-${file.name}`;
            const uploadDir = path.join(process.cwd(), "public", "assets", "associations", "litcof");
            try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
            await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
            imageUrl = `/assets/associations/litcof/${fileName}`;
        }

        // ── Build record ─────────────────────────────────────────────────────
        const display_order = parseInt((formData.get("display_order") as string) || "0");
        const is_active = formData.get("is_active") !== "false";

        let record: Record<string, any> = {
            image_url: imageUrl,
            display_order,
            is_active: isDevelopment ? is_active : (is_active ? 1 : 0),
        };

        if (type === "organizing-team") {
            const name = formData.get("name") as string;
            const role = formData.get("role") as string;
            if (!name || !role) return NextResponse.json({ success: false, error: "name and role required" }, { status: 400 });
            record = { ...record, name, role };
        } else if (type === "achievements" || type === "events") {
            const title = formData.get("title") as string;
            const date = (formData.get("date") as string) || "";
            const description = (formData.get("description") as string) || "";
            if (!title) return NextResponse.json({ success: false, error: "title required" }, { status: 400 });
            record = { ...record, title, date, description };
        } else if (type === "gallery") {
            record = { ...record, alt_text: (formData.get("alt_text") as string) || "LITCOF Gallery" };
        }

        // ── Insert ───────────────────────────────────────────────────────────
        if (isDevelopment) {
            const { data, error } = await supabase.from(tableMap[type]).insert([record]).select();
            if (error) throw error;
            return NextResponse.json({ success: true, data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const keys = Object.keys(record);
                const values = Object.values(record);
                await connection.execute(
                    `INSERT INTO ${tableMap[type]} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
                    values
                );
                return NextResponse.json({ success: true });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Upload failed", details: error.message }, { status: 500 });
    }
}
