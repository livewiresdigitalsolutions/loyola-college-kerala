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
        const { name, designation, qualification, specialization, email, phone, image, department, category, sort_order } = body;
        const { id } = await params;
        const idNum = parseInt(id);

        if (!name || !designation) {
            return NextResponse.json({ error: 'Name and designation are required' }, { status: 400 });
        }

        const record = { name, designation, qualification, specialization, email, phone, image, department, category, sort_order };

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('academic_faculty')
                .update(record)
                .eq('id', idNum)
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute(
                'UPDATE academic_faculty SET name = ?, designation = ?, qualification = ?, specialization = ?, email = ?, phone = ?, image = ?, department = ?, category = ?, sort_order = ? WHERE id = ?',
                [name, designation, qualification, specialization, email, phone, image, department, category, sort_order, idNum]
            );
            await connection.end();
            return NextResponse.json({ id: idNum, ...record });
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to update faculty member', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);

        if (isDevelopment) {
            const { error } = await supabase.from('academic_faculty').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM academic_faculty WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Faculty member deleted successfully' });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to delete faculty member', details: error.message },
            { status: 500 }
        );
    }
}
