// app/api/iqac/Contact-us/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const mysqlConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3303"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "loyola",
};

// GET — fetch the single contact record
export async function GET() {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute(
                "SELECT * FROM iqac_contact ORDER BY id ASC LIMIT 1"
            );
            const data = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
            return NextResponse.json({ success: true, data });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error fetching contact info:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch contact info" }, { status: 500 });
    }
}

// POST — create the contact record (initial setup)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            coordinator_name, coordinator_role,
            asst_coordinator_name, asst_coordinator_role,
            support_staff_name, support_staff_role,
            email, phone,
        } = body;

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [result] = await connection.execute(
                `INSERT INTO iqac_contact 
                 (coordinator_name, coordinator_role, asst_coordinator_name, asst_coordinator_role,
                  support_staff_name, support_staff_role, email, phone)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    coordinator_name || "",
                    coordinator_role || "IQAC Coordinator",
                    asst_coordinator_name || "",
                    asst_coordinator_role || "IQAC Assistant Coordinator",
                    support_staff_name || "",
                    support_staff_role || "IQAC Support Staff",
                    email || "",
                    phone || "",
                ]
            );
            return NextResponse.json({ success: true, data: { id: (result as any).insertId } });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to create contact info" }, { status: 500 });
    }
}

// PUT — update the contact record (upsert by id or update first row)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const {
            id,
            coordinator_name, coordinator_role,
            asst_coordinator_name, asst_coordinator_role,
            support_staff_name, support_staff_role,
            email, phone,
        } = body;

        const connection = await mysql.createConnection(mysqlConfig);
        try {
            if (id) {
                await connection.execute(
                    `UPDATE iqac_contact SET
                     coordinator_name = ?, coordinator_role = ?,
                     asst_coordinator_name = ?, asst_coordinator_role = ?,
                     support_staff_name = ?, support_staff_role = ?,
                     email = ?, phone = ?,
                     updated_at = CURRENT_TIMESTAMP
                     WHERE id = ?`,
                    [
                        coordinator_name, coordinator_role,
                        asst_coordinator_name, asst_coordinator_role,
                        support_staff_name, support_staff_role,
                        email, phone, id,
                    ]
                );
            } else {
                // Upsert: update first row or insert
                const [rows] = await connection.execute("SELECT id FROM iqac_contact LIMIT 1");
                if (Array.isArray(rows) && rows.length > 0) {
                    const existingId = (rows[0] as any).id;
                    await connection.execute(
                        `UPDATE iqac_contact SET
                         coordinator_name = ?, coordinator_role = ?,
                         asst_coordinator_name = ?, asst_coordinator_role = ?,
                         support_staff_name = ?, support_staff_role = ?,
                         email = ?, phone = ?,
                         updated_at = CURRENT_TIMESTAMP
                         WHERE id = ?`,
                        [
                            coordinator_name, coordinator_role,
                            asst_coordinator_name, asst_coordinator_role,
                            support_staff_name, support_staff_role,
                            email, phone, existingId,
                        ]
                    );
                } else {
                    await connection.execute(
                        `INSERT INTO iqac_contact 
                         (coordinator_name, coordinator_role, asst_coordinator_name, asst_coordinator_role,
                          support_staff_name, support_staff_role, email, phone)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            coordinator_name, coordinator_role,
                            asst_coordinator_name, asst_coordinator_role,
                            support_staff_name, support_staff_role,
                            email, phone,
                        ]
                    );
                }
            }
            return NextResponse.json({ success: true, message: "Contact info updated" });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to update contact info" }, { status: 500 });
    }
}
