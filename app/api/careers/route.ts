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

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchOpeningsWithDetails(showAll = false) {
    if (isDevelopment) {
        let query = supabase.from('career_openings').select('*').order('sort_order', { ascending: true });
        if (!showAll) query = query.eq('is_active', true);
        const { data: openings, error } = await query;
        if (error) throw error;

        // Attach nested sub-records for each opening
        const enriched = await Promise.all(openings.map(async (o: any) => {
            const [positions, requirements, downloads] = await Promise.all([
                supabase.from('career_positions').select('*').eq('opening_id', o.id).order('sort_order'),
                supabase.from('career_requirements').select('*').eq('opening_id', o.id).order('sort_order'),
                supabase.from('career_downloads').select('*').eq('opening_id', o.id).order('sort_order'),
            ]);
            return buildOpening(o, positions.data || [], requirements.data || [], downloads.data || []);
        }));
        return enriched;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const sql = showAll
                ? 'SELECT * FROM career_openings ORDER BY sort_order ASC'
                : 'SELECT * FROM career_openings WHERE is_active = 1 ORDER BY sort_order ASC';
            const [rows]: any = await connection.execute(sql);
            const enriched = await Promise.all(rows.map(async (o: any) => {
                const [pos]: any = await connection.execute(
                    'SELECT * FROM career_positions WHERE opening_id = ? ORDER BY sort_order ASC', [o.id]
                );
                const [req]: any = await connection.execute(
                    'SELECT * FROM career_requirements WHERE opening_id = ? ORDER BY sort_order ASC', [o.id]
                );
                const [dl]: any = await connection.execute(
                    'SELECT * FROM career_downloads WHERE opening_id = ? ORDER BY sort_order ASC', [o.id]
                );
                return buildOpening(o, pos, req, dl);
            }));
            return enriched;
        } finally {
            await connection.end();
        }
    }
}

function buildOpening(o: any, positions: any[], requirements: any[], downloads: any[]) {
    const base = {
        id: o.id,
        category: o.category,
        title: o.title,
        description: o.description,
        deadline: o.deadline,
        deadlineOpen: Boolean(o.deadline_open),
        variant: o.variant,
        isActive: Boolean(o.is_active),
        sortOrder: o.sort_order,
    };

    if (o.variant === 'positions') {
        return {
            ...base,
            detail: {
                variant: 'positions',
                applicationOpenTill: o.application_open_till || '',
                applyLink: o.apply_link || '#',
                positions: positions.map((p: any) => ({ id: p.id, discipline: p.discipline, count: p.count })),
                requirements: requirements.map((r: any) => ({ id: r.id, text: r.text })),
            },
        };
    } else {
        return {
            ...base,
            detail: {
                variant: 'download',
                extendedTill: o.extended_till || '',
                description: o.body_description || '',
                note: o.note || undefined,
                downloads: downloads.map((d: any) => ({ id: d.id, label: d.label, href: d.href })),
            },
        };
    }
}

// ─── GET openings (all for admin ?all=1, active-only for public) ──────────────
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const showAll = searchParams.get('all') === '1';
        const data = await fetchOpeningsWithDetails(showAll);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch career openings', details: error.message }, { status: 500 });
    }
}

// ─── POST create a new opening ────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            category, title, description, deadline, deadline_open, variant,
            application_open_till, apply_link, extended_till, body_description, note,
            sort_order = 0,
        } = body;

        if (!title || !category || !variant) {
            return NextResponse.json({ error: 'title, category, and variant are required' }, { status: 400 });
        }

        if (isDevelopment) {
            const { data, error } = await supabase.from('career_openings').insert({
                category, title, description, deadline,
                deadline_open: deadline_open ?? false,
                variant, is_active: true, sort_order,
                application_open_till, apply_link,
                extended_till, body_description, note,
            }).select();
            if (error) throw error;
            return NextResponse.json(data[0], { status: 201 });
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                `INSERT INTO career_openings
                 (category, title, description, deadline, deadline_open, variant, is_active, sort_order,
                  application_open_till, apply_link, extended_till, body_description, note)
                 VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)`,
                [category, title, description, deadline, deadline_open ? 1 : 0, variant, sort_order,
                    application_open_till || null, apply_link || null,
                    extended_till || null, body_description || null, note || null]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, category, title, variant }, { status: 201 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create career opening', details: error.message }, { status: 500 });
    }
}
