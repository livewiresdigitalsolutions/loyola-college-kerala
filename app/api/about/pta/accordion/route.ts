// app/api/about/pta/accordion/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { createClient } from "@supabase/supabase-js";

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

// GET - Fetch all accordion sections
export async function GET() {
    try {
        if (isDevelopment) {
            const { data, error } = await supabase
                .from("pta_accordion")
                .select("*")
                .order("sort_order", { ascending: true });

            if (error) throw error;

            return NextResponse.json({ success: true, data });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const [rows] = await connection.execute(
                    "SELECT * FROM pta_accordion ORDER BY sort_order ASC"
                );
                return NextResponse.json({ success: true, data: rows });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch accordion sections" },
            { status: 500 }
        );
    }
}

// PUT - Update accordion section
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, content } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "ID is required" },
                { status: 400 }
            );
        }

        const updateData: Record<string, any> = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, error: "No fields to update" },
                { status: 400 }
            );
        }

        if (isDevelopment) {
            const { error } = await supabase
                .from("pta_accordion")
                .update(updateData)
                .eq("id", id);

            if (error) throw error;

            return NextResponse.json({ success: true, message: "Section updated successfully" });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const setClauses: string[] = [];
                const values: any[] = [];

                if (title !== undefined) { setClauses.push("title = ?"); values.push(title); }
                if (content !== undefined) { setClauses.push("content = ?"); values.push(content); }

                values.push(id);

                await connection.execute(
                    `UPDATE pta_accordion SET ${setClauses.join(", ")} WHERE id = ?`,
                    values
                );

                return NextResponse.json({ success: true, message: "Section updated successfully" });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Failed to update accordion section" },
            { status: 500 }
        );
    }
}
