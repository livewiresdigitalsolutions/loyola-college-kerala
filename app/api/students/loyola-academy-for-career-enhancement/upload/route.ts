// app/api/students/loyola-academy-for-career-enhancement/upload/route.ts
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

type UploadType = "organizing-team" | "achievements" | "gallery";

const folderMap: Record<UploadType, string> = {
    "organizing-team": "team",
    "achievements": "achievements",
    "gallery": "gallery",
};

const tableMap: Record<UploadType, string> = {
    "organizing-team": "lace_organizing_team",
    "achievements": "lace_achievements",
    "gallery": "lace_gallery",
};

async function saveFile(file: File, folder: string): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    if (isDevelopment) {
        const storagePath = `${folder}/${fileName}`;
        const { error } = await supabase.storage
            .from("lace")
            .upload(storagePath, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
        if (error) throw error;
        return supabase.storage.from("lace").getPublicUrl(storagePath).data.publicUrl;
    } else {
        const uploadDir = path.join(process.cwd(), "public", "assets", "lace", folder);
        try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
        await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
        return `/assets/lace/${folder}/${fileName}`;
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as UploadType;

        if (!file) return NextResponse.json({ success: false, error: "file required" }, { status: 400 });
        if (!type || !tableMap[type]) return NextResponse.json({ success: false, error: "Invalid upload type" }, { status: 400 });

        const image_url = await saveFile(file, folderMap[type]);
        const display_order = parseInt((formData.get("display_order") as string) || "0");
        const is_active_raw = formData.get("is_active") !== "false";
        const is_active = isDevelopment ? is_active_raw : (is_active_raw ? 1 : 0);

        let record: Record<string, any>;

        if (type === "organizing-team") {
            const name = formData.get("name") as string;
            const role = formData.get("role") as string;
            if (!name || !role) return NextResponse.json({ success: false, error: "name and role required" }, { status: 400 });
            record = { name, role, image_url, display_order, is_active };

        } else if (type === "achievements") {
            const title = formData.get("title") as string;
            const date = formData.get("date") as string;
            const description = formData.get("description") as string;
            if (!title) return NextResponse.json({ success: false, error: "title required" }, { status: 400 });
            record = { title, date: date || "", description: description || "", image_url, display_order, is_active };

        } else {
            // gallery
            const alt_text = (formData.get("alt_text") as string) || "LACE Gallery";
            record = { image_url, alt_text, display_order, is_active };
        }

        if (isDevelopment) {
            const { data, error } = await supabase.from(tableMap[type]).insert([record]).select();
            if (error) throw error;
            return NextResponse.json({ success: true, data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const keys = Object.keys(record), values = Object.values(record);
                await connection.execute(
                    `INSERT INTO ${tableMap[type]} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
                    values
                );
                return NextResponse.json({ success: true });
            } finally { await connection.end(); }
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Upload failed", details: error.message }, { status: 500 });
    }
}
