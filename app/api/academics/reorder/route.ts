import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const dbType = process.env.DB_TYPE || 'mysql';

const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'loyola',
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Valid table names to prevent SQL injection
const VALID_TABLES: Record<string, string> = {
    'committees': 'academic_committees',
    'committee-members': 'academic_committee_members',
    'faculty': 'academic_faculty',
    'academic-calendar': 'academic_calendar',
    'departments': 'academic_departments',
};

// POST: Batch update sort_order for items
// Body: { table: string, items: { id: number, sort_order: number }[] }
export async function POST(request: Request) {
    try {
        const { table, items } = await request.json();

        if (!table || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'table and items[] required' }, { status: 400 });
        }

        const tableName = VALID_TABLES[table];
        if (!tableName) {
            return NextResponse.json({ error: 'Invalid table name' }, { status: 400 });
        }

        if (dbType === 'supabase') {
            const supabase = createClient(supabaseUrl, supabaseKey);
            for (const item of items) {
                await supabase
                    .from(tableName)
                    .update({ sort_order: item.sort_order })
                    .eq('id', item.id);
            }
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            for (const item of items) {
                await connection.execute(
                    `UPDATE ${tableName} SET sort_order = ? WHERE id = ?`,
                    [item.sort_order, item.id]
                );
            }
            await connection.end();
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reorder error:', error);
        return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
    }
}
