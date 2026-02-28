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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        let data;
        if (isDevelopment) {
            let query = supabase
                .from('academic_departments')
                .select('*')
                .order('sort_order');
            if (slug) query = query.eq('slug', slug);
            const { data: rows, error } = await query;
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            if (slug) {
                const [rows] = await connection.execute(
                    'SELECT * FROM academic_departments WHERE slug = ?',
                    [slug]
                );
                data = rows;
            } else {
                const [rows] = await connection.execute(
                    'SELECT * FROM academic_departments ORDER BY sort_order, id'
                );
                data = rows;
            }
            await connection.end();
        }

        // Parse JSON fields if they're stored as strings (MySQL)
        if (Array.isArray(data)) {
            data = data.map((dept: any) => ({
                ...dept,
                introduction: typeof dept.introduction === 'string' ? JSON.parse(dept.introduction) : dept.introduction,
                goals: typeof dept.goals === 'string' ? JSON.parse(dept.goals) : dept.goals,
                eligibility: typeof dept.eligibility === 'string' ? JSON.parse(dept.eligibility) : dept.eligibility,
                programmes: typeof dept.programmes === 'string' ? JSON.parse(dept.programmes) : dept.programmes,
                syllabus: typeof dept.syllabus === 'string' ? JSON.parse(dept.syllabus) : dept.syllabus,
                faculty_list: typeof dept.faculty_list === 'string' ? JSON.parse(dept.faculty_list) : dept.faculty_list,
            }));
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch departments', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, slug, short_description, category, image, introduction, goals, eligibility, programmes, syllabus, faculty_list, sort_order } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        const record = {
            name,
            slug,
            short_description: short_description || null,
            category: category || null,
            image: image || '/departmentsCoverImage/default.png',
            introduction: introduction ? (typeof introduction === 'string' ? introduction : JSON.stringify(introduction)) : null,
            goals: goals ? (typeof goals === 'string' ? goals : JSON.stringify(goals)) : null,
            eligibility: eligibility ? (typeof eligibility === 'string' ? eligibility : JSON.stringify(eligibility)) : null,
            programmes: programmes ? (typeof programmes === 'string' ? programmes : JSON.stringify(programmes)) : null,
            syllabus: syllabus ? (typeof syllabus === 'string' ? syllabus : JSON.stringify(syllabus)) : null,
            faculty_list: faculty_list ? (typeof faculty_list === 'string' ? faculty_list : JSON.stringify(faculty_list)) : null,
            sort_order: sort_order || 0,
        };

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('academic_departments')
                .insert(record)
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO academic_departments (name, slug, short_description, category, image, introduction, goals, eligibility, programmes, syllabus, faculty_list, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [record.name, record.slug, record.short_description, record.category, record.image, record.introduction, record.goals, record.eligibility, record.programmes, record.syllabus, record.faculty_list, record.sort_order]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, ...record });
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to create department', details: error.message },
            { status: 500 }
        );
    }
}
