// app/api/students/loyola-ethnographic-theatre/upload/route.ts
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
        const type = formData.get("type") as string; // "organizing-team" or "gallery"

        if (!file) return NextResponse.json({ success: false, error: "file required" }, { status: 400 });
        if (!type || !["organizing-team", "gallery"].includes(type)) {
            return NextResponse.json({ success: false, error: "Invalid upload type" }, { status: 400 });
        }

        // ── Organizing Team upload ──────────────────────────────────────────────
        if (type === "organizing-team") {
            const name = formData.get("name") as string;
            const role = formData.get("role") as string;
            if (!name || !role) return NextResponse.json({ success: false, error: "name and role required" }, { status: 400 });

            const display_order = parseInt((formData.get("display_order") as string) || "0");
            const is_active = formData.get("is_active") !== "false";

            let image_url = "";
            if (isDevelopment) {
                const fileName = `team/${Date.now()}-${file.name}`;
                const { error } = await supabase.storage
                    .from("let")
                    .upload(fileName, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
                if (error) throw error;
                image_url = supabase.storage.from("let").getPublicUrl(fileName).data.publicUrl;
            } else {
                const fileName = `${Date.now()}-${file.name}`;
                const uploadDir = path.join(process.cwd(), "public", "assets", "let", "team");
                try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
                await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
                image_url = `/assets/let/team/${fileName}`;
            }

            const record = {
                name, role, image_url,
                display_order,
                is_active: isDevelopment ? is_active : (is_active ? 1 : 0),
            };

            if (isDevelopment) {
                const { data, error } = await supabase.from("let_organizing_team").insert([record]).select();
                if (error) throw error;
                return NextResponse.json({ success: true, data });
            } else {
                const connection = await mysql.createConnection(mysqlConfig);
                try {
                    const keys = Object.keys(record), values = Object.values(record);
                    await connection.execute(
                        `INSERT INTO let_organizing_team (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
                        values
                    );
                    return NextResponse.json({ success: true });
                } finally { await connection.end(); }
            }
        }

        // ── Gallery upload ──────────────────────────────────────────────────────
        if (type === "gallery") {
            const alt_text = (formData.get("alt_text") as string) || "LET Gallery";
            const display_order = parseInt((formData.get("display_order") as string) || "0");
            const is_active = formData.get("is_active") !== "false";

            let image_url = "";
            if (isDevelopment) {
                const fileName = `gallery/${Date.now()}-${file.name}`;
                const { error } = await supabase.storage
                    .from("let")
                    .upload(fileName, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
                if (error) throw error;
                image_url = supabase.storage.from("let").getPublicUrl(fileName).data.publicUrl;
            } else {
                const fileName = `${Date.now()}-${file.name}`;
                const uploadDir = path.join(process.cwd(), "public", "assets", "let", "gallery");
                try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
                await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
                image_url = `/assets/let/gallery/${fileName}`;
            }

            const record = {
                image_url, alt_text,
                display_order,
                is_active: isDevelopment ? is_active : (is_active ? 1 : 0),
            };

            if (isDevelopment) {
                const { data, error } = await supabase.from("let_gallery").insert([record]).select();
                if (error) throw error;
                return NextResponse.json({ success: true, data });
            } else {
                const connection = await mysql.createConnection(mysqlConfig);
                try {
                    const keys = Object.keys(record), values = Object.values(record);
                    await connection.execute(
                        `INSERT INTO let_gallery (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
                        values
                    );
                    return NextResponse.json({ success: true });
                } finally { await connection.end(); }
            }
        }

        return NextResponse.json({ success: false, error: "Unhandled type" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Upload failed", details: error.message }, { status: 500 });
    }
}
