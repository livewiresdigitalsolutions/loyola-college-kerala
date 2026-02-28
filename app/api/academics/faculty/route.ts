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
        const department = searchParams.get('department');
        const category = searchParams.get('category');

        let data;
        if (isDevelopment) {
            let query = supabase
                .from('academic_faculty')
                .select('*')
                .order('sort_order');
            if (department) query = query.eq('department', department);
            if (category) query = query.eq('category', category);
            const { data: rows, error } = await query;
            if (error) throw error;
            data = rows;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            let sql = 'SELECT * FROM academic_faculty';
            const conditions: string[] = [];
            const values: any[] = [];

            if (department) { conditions.push('department = ?'); values.push(department); }
            if (category) { conditions.push('category = ?'); values.push(category); }

            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }
            sql += ' ORDER BY sort_order, id';

            const [rows] = await connection.execute(sql, values);
            await connection.end();
            data = rows;
        }
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch faculty', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, designation, qualification, specialization, email, phone, image, department, category, sort_order } = body;

        if (!name || !designation) {
            return NextResponse.json({ error: 'Name and designation are required' }, { status: 400 });
        }

        const record = {
            name,
            designation,
            qualification: qualification || null,
            specialization: specialization || null,
            email: email || null,
            phone: phone || null,
            image: image || '/assets/defaultprofile.png',
            department: department || null,
            category: category || 'Teaching',
            sort_order: sort_order || 0,
        };

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('academic_faculty')
                .insert(record)
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [result]: any = await connection.execute(
                'INSERT INTO academic_faculty (name, designation, qualification, specialization, email, phone, image, department, category, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [record.name, record.designation, record.qualification, record.specialization, record.email, record.phone, record.image, record.department, record.category, record.sort_order]
            );
            await connection.end();
            return NextResponse.json({ id: result.insertId, ...record });
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to create faculty member', details: error.message },
            { status: 500 }
        );
    }
}
