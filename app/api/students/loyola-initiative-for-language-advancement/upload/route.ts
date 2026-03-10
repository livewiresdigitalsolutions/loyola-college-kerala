// app/api/students/loyola-initiative-for-language-advancement/upload/route.ts
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

type UploadType = "organizing-team" | "gallery";

async function saveFile(file: File, folder: string): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    if (isDevelopment) {
        const storagePath = `${folder}/${fileName}`;
        const bytes = await file.arrayBuffer();
        const { error } = await supabase.storage
            .from("lila")
            .upload(storagePath, Buffer.from(bytes), { contentType: file.type, upsert: true });
        if (error) throw new Error(`Storage error: ${error.message}`);
        return supabase.storage.from("lila").getPublicUrl(storagePath).data.publicUrl;
    } else {
        const uploadDir = path.join(process.cwd(), "public", "assets", "lila", folder);
        try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
        await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
        return `/assets/lila/${folder}/${fileName}`;
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as UploadType;

        if (!file) return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        if (type !== "organizing-team" && type !== "gallery") {
            return NextResponse.json({ success: false, error: "Invalid upload type — must be organizing-team or gallery" }, { status: 400 });
        }

        const folder = type === "organizing-team" ? "team" : "gallery";
        const image_url = await saveFile(file, folder);

        const display_order = parseInt((formData.get("display_order") as string) || "0");
        const is_active_raw = formData.get("is_active") !== "false";
        const is_active = isDevelopment ? is_active_raw : (is_active_raw ? 1 : 0);

        let record: Record<string, any>;

        if (type === "organizing-team") {
            const name = formData.get("name") as string;
            const role = formData.get("role") as string;
            if (!name || !role) return NextResponse.json({ success: false, error: "name and role are required" }, { status: 400 });
            record = { name, role, image_url, display_order, is_active };
        } else {
            const alt_text = (formData.get("alt_text") as string) || "LILA Gallery";
            record = { image_url, alt_text, display_order, is_active };
        }

        const table = type === "organizing-team" ? "lila_organizing_team" : "lila_gallery";

        if (isDevelopment) {
            const { data, error } = await supabase.from(table).insert([record]).select();
            if (error) throw new Error(`DB insert error: ${error.message}`);
            return NextResponse.json({ success: true, data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const keys = Object.keys(record), values = Object.values(record);
                await connection.execute(
                    `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
                    values
                );
                return NextResponse.json({ success: true });
            } finally { await connection.end(); }
        }
    } catch (error: any) {
        console.error("LILA upload error:", error);
        return NextResponse.json({ success: false, error: error.message || "Upload failed" }, { status: 500 });
    }
}
