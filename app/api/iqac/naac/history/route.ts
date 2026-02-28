// app/api/iqac/naac/history/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const mysqlConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3303"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "loyola",
};

// GET — fetch all active history records
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let sql = "SELECT * FROM naac_accreditation_history WHERE 1=1";
            if (!includeInactive) sql += " AND is_active = 1";
            sql += " ORDER BY display_order ASC, cycle ASC";
            const [rows] = await connection.execute(sql);
            return NextResponse.json({ success: true, data: rows });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error fetching NAAC history:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch NAAC history" },
            { status: 500 }
        );
    }
}

// POST — create new record
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { cycle, period, naac_score, principal, director, naac_coordinator, core_team, display_order, is_active } = body;

        if (!cycle || !period || !naac_score || !principal) {
            return NextResponse.json(
                { success: false, error: "Cycle, period, NAAC score, and principal are required" },
                { status: 400 }
            );
        }

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [result] = await connection.execute(
                `INSERT INTO naac_accreditation_history 
        (cycle, period, naac_score, principal, director, naac_coordinator, core_team, display_order, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [cycle, period, naac_score, principal, director || "", naac_coordinator || "", core_team || "", display_order || 0, is_active !== false ? 1 : 0]
            );
            return NextResponse.json({
                success: true,
                message: "History record created successfully",
                data: { id: (result as any).insertId },
            });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error creating NAAC history:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create history record" },
            { status: 500 }
        );
    }
}

// PUT — update record
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, cycle, period, naac_score, principal, director, naac_coordinator, core_team, display_order, is_active } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const updates: string[] = [];
            const params: any[] = [];

            if (cycle !== undefined) { updates.push("cycle = ?"); params.push(cycle); }
            if (period !== undefined) { updates.push("period = ?"); params.push(period); }
            if (naac_score !== undefined) { updates.push("naac_score = ?"); params.push(naac_score); }
            if (principal !== undefined) { updates.push("principal = ?"); params.push(principal); }
            if (director !== undefined) { updates.push("director = ?"); params.push(director); }
            if (naac_coordinator !== undefined) { updates.push("naac_coordinator = ?"); params.push(naac_coordinator); }
            if (core_team !== undefined) { updates.push("core_team = ?"); params.push(core_team); }
            if (display_order !== undefined) { updates.push("display_order = ?"); params.push(display_order); }
            if (is_active !== undefined) { updates.push("is_active = ?"); params.push(is_active ? 1 : 0); }

            updates.push("updated_at = CURRENT_TIMESTAMP");
            params.push(id);

            await connection.execute(
                `UPDATE naac_accreditation_history SET ${updates.join(", ")} WHERE id = ?`,
                params
            );
            return NextResponse.json({ success: true, message: "History record updated" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error updating NAAC history:", error);
        return NextResponse.json({ success: false, error: "Failed to update record" }, { status: 500 });
    }
}

// DELETE
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            await connection.execute("DELETE FROM naac_accreditation_history WHERE id = ?", [id]);
            return NextResponse.json({ success: true, message: "Record deleted" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error deleting NAAC history:", error);
        return NextResponse.json({ success: false, error: "Failed to delete record" }, { status: 500 });
    }
}
