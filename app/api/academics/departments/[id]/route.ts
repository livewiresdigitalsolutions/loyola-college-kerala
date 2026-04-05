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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { name, slug, short_description, category, image, introduction, goals, eligibility, programmes, syllabus, faculty_list, sort_order, syllabus_links, publications } = body;
        const { id } = await params;
        const idNum = parseInt(id);

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        const record = {
            name,
            slug,
            short_description,
            category,
            image,
            introduction: introduction ? (typeof introduction === 'string' ? introduction : JSON.stringify(introduction)) : null,
            goals: goals ? (typeof goals === 'string' ? goals : JSON.stringify(goals)) : null,
            eligibility: eligibility ? (typeof eligibility === 'string' ? eligibility : JSON.stringify(eligibility)) : null,
            programmes: programmes ? (typeof programmes === 'string' ? programmes : JSON.stringify(programmes)) : null,
            syllabus: syllabus ? (typeof syllabus === 'string' ? syllabus : JSON.stringify(syllabus)) : null,
            faculty_list: faculty_list ? (typeof faculty_list === 'string' ? faculty_list : JSON.stringify(faculty_list)) : null,
            syllabus_links: syllabus_links ? (typeof syllabus_links === 'string' ? syllabus_links : JSON.stringify(syllabus_links)) : null,
            publications: publications ? (typeof publications === 'string' ? publications : JSON.stringify(publications)) : null,
            sort_order,
        };

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('academic_departments')
                .update(record)
                .eq('id', idNum)
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute(
                'UPDATE academic_departments SET name = ?, slug = ?, short_description = ?, category = ?, image = ?, introduction = ?, goals = ?, eligibility = ?, programmes = ?, syllabus = ?, faculty_list = ?, sort_order = ?, syllabus_links = ?, publications = ? WHERE id = ?',
                [record.name, record.slug, record.short_description, record.category, record.image, record.introduction, record.goals, record.eligibility, record.programmes, record.syllabus, record.faculty_list, record.sort_order, record.syllabus_links, record.publications, idNum]
            );
            await connection.end();
            return NextResponse.json({ id: idNum, ...record });
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to update department', details: error.message },
            { status: 500 }
        );
    }
}

import { deleteRecordFiles } from '@/lib/delete-uploads';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);

        let department;
        if (isDevelopment) {
            const { data } = await supabase.from('academic_departments').select('*').eq('id', idNum).single();
            department = data;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows]: any = await connection.execute('SELECT * FROM academic_departments WHERE id = ?', [idNum]);
            department = rows[0];
            await connection.end();
        }

        if (department) {
            // Collect all top-level image URLs
            const topLevelImages = [department.image];

            // Collect arrays that may contain image fields (faculty_list, publications)
            const jsonArrays: any[] = [];
            try {
                const facultyList = typeof department.faculty_list === 'string' ? JSON.parse(department.faculty_list) : department.faculty_list;
                if (Array.isArray(facultyList)) jsonArrays.push(facultyList);
            } catch {}
            try {
                const publications = typeof department.publications === 'string' ? JSON.parse(department.publications) : department.publications;
                if (Array.isArray(publications)) jsonArrays.push(publications);
            } catch {}
            // Syllabus links contain PDF urls, also pick those up
            try {
                const syllabusLinks = typeof department.syllabus_links === 'string' ? JSON.parse(department.syllabus_links) : department.syllabus_links;
                if (Array.isArray(syllabusLinks)) jsonArrays.push(syllabusLinks);
            } catch {}

            await deleteRecordFiles(topLevelImages, jsonArrays);
        }

        if (isDevelopment) {
            const { error } = await supabase.from('academic_departments').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM academic_departments WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Department and associated files deleted successfully' });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to delete department', details: error.message },
            { status: 500 }
        );
    }
}
