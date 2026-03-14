import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';
const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'loyola',
};
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// ─── GET single opening with nested data ─────────────────────────────────────
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);

        if (isDevelopment) {
            const { data, error } = await supabase.from('career_openings').select('*').eq('id', idNum).single();
            if (error) throw error;
            const [positions, requirements, downloads] = await Promise.all([
                supabase.from('career_positions').select('*').eq('opening_id', idNum).order('sort_order'),
                supabase.from('career_requirements').select('*').eq('opening_id', idNum).order('sort_order'),
                supabase.from('career_downloads').select('*').eq('opening_id', idNum).order('sort_order'),
            ]);
            return NextResponse.json({
                ...data,
                positions: positions.data || [],
                requirements: requirements.data || [],
                downloads: downloads.data || [],
            });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            try {
                const [[opening]]: any = await connection.execute('SELECT * FROM career_openings WHERE id = ?', [idNum]);
                if (!opening) return NextResponse.json({ error: 'Not found' }, { status: 404 });
                const [pos]: any = await connection.execute('SELECT * FROM career_positions WHERE opening_id = ? ORDER BY sort_order', [idNum]);
                const [req]: any = await connection.execute('SELECT * FROM career_requirements WHERE opening_id = ? ORDER BY sort_order', [idNum]);
                const [dl]: any = await connection.execute('SELECT * FROM career_downloads WHERE opening_id = ? ORDER BY sort_order', [idNum]);
                return NextResponse.json({ ...opening, positions: pos, requirements: req, downloads: dl });
            } finally {
                await connection.end();
            }
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch opening', details: error.message }, { status: 500 });
    }
}

// ─── PUT update opening ───────────────────────────────────────────────────────
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);
        const body = await request.json();
        const {
            category, title, description, deadline, deadline_open, variant, is_active, sort_order,
            application_open_till, apply_link, extended_till, body_description, note,
        } = body;

        if (isDevelopment) {
            const { data, error } = await supabase.from('career_openings').update({
                category, title, description, deadline, deadline_open, variant, is_active, sort_order,
                application_open_till, apply_link, extended_till, body_description, note,
            }).eq('id', idNum).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute(
                `UPDATE career_openings SET
                 category=?, title=?, description=?, deadline=?, deadline_open=?, variant=?,
                 is_active=?, sort_order=?, application_open_till=?, apply_link=?,
                 extended_till=?, body_description=?, note=?
                 WHERE id=?`,
                [category, title, description, deadline, deadline_open ? 1 : 0, variant,
                    is_active ? 1 : 0, sort_order ?? 0,
                    application_open_till || null, apply_link || null,
                    extended_till || null, body_description || null, note || null, idNum]
            );
            await connection.end();
            return NextResponse.json({ id: idNum, ...body });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update opening', details: error.message }, { status: 500 });
    }
}

// ─── DELETE opening + cascaded sub-records ────────────────────────────────────
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);

        if (isDevelopment) {
            await supabase.from('career_positions').delete().eq('opening_id', idNum);
            await supabase.from('career_requirements').delete().eq('opening_id', idNum);
            await supabase.from('career_downloads').delete().eq('opening_id', idNum);
            const { error } = await supabase.from('career_openings').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM career_positions WHERE opening_id = ?', [idNum]);
            await connection.execute('DELETE FROM career_requirements WHERE opening_id = ?', [idNum]);
            await connection.execute('DELETE FROM career_downloads WHERE opening_id = ?', [idNum]);
            await connection.execute('DELETE FROM career_openings WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Opening deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete opening', details: error.message }, { status: 500 });
    }
}
