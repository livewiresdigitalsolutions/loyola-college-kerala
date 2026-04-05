import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import { deleteRecordFiles } from '@/lib/delete-uploads';

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

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);

        let data;
        if (isDevelopment) {
            const { data: row, error } = await supabase
                .from('academic_faculty')
                .select('*')
                .eq('id', idNum)
                .single();
            if (error) throw error;
            data = row;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows]: any = await connection.execute(
                'SELECT * FROM academic_faculty WHERE id = ?',
                [idNum]
            );
            await connection.end();
            if (!rows.length) {
                return NextResponse.json({ error: 'Faculty member not found' }, { status: 404 });
            }
            data = rows[0];
            if (data.profile_data && typeof data.profile_data === 'string') {
                try { data.profile_data = JSON.parse(data.profile_data); } catch {}
            }
        }

        if (!data) {
            return NextResponse.json({ error: 'Faculty member not found' }, { status: 404 });
        }

        if (data.profile_data && typeof data.profile_data === 'string') {
            try { data.profile_data = JSON.parse(data.profile_data); } catch {}
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch faculty member', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { name, designation, qualification, specialization, email, phone, image, department, category, sort_order, pen, date_of_joining, profile_data } = body;
        const { id } = await params;
        const idNum = parseInt(id);

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
            sort_order: sort_order ?? 0,
            pen: pen || null,
            date_of_joining: date_of_joining || null,
            profile_data: profile_data ? JSON.stringify(profile_data) : null,
        };

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
                `UPDATE academic_faculty 
                 SET name = ?, designation = ?, qualification = ?, specialization = ?, 
                     email = ?, phone = ?, image = ?, department = ?, category = ?, 
                     sort_order = ?, pen = ?, date_of_joining = ?, profile_data = ?
                 WHERE id = ?`,
                [record.name, record.designation, record.qualification, record.specialization,
                 record.email, record.phone, record.image, record.department, record.category,
                 record.sort_order, record.pen, record.date_of_joining, record.profile_data, idNum]
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

        // Step 1: Fetch the record to know which files to delete
        let member: any = null;
        if (isDevelopment) {
            const { data } = await supabase
                .from('academic_faculty')
                .select('image, profile_data')
                .eq('id', idNum)
                .single();
            member = data;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            const [rows]: any = await connection.execute(
                'SELECT image, profile_data FROM academic_faculty WHERE id = ?',
                [idNum]
            );
            await connection.end();
            member = rows[0] ?? null;
        }

        // Step 2: Delete associated uploaded files from disk
        if (member) {
            const topLevelImages = [member.image];

            // Scan profile_data for any embedded uploaded file URLs
            let profileDataObj: any = null;
            try {
                profileDataObj = typeof member.profile_data === 'string'
                    ? JSON.parse(member.profile_data)
                    : member.profile_data;
            } catch {}

            const jsonArrays: any[] = [];
            if (profileDataObj && typeof profileDataObj === 'object') {
                for (const val of Object.values(profileDataObj)) {
                    if (Array.isArray(val)) jsonArrays.push(val);
                }
            }

            await deleteRecordFiles(topLevelImages, jsonArrays);
        }

        // Step 3: Delete the DB record
        if (isDevelopment) {
            const { error } = await supabase.from('academic_faculty').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM academic_faculty WHERE id = ?', [idNum]);
            await connection.end();
        }

        return NextResponse.json({ message: 'Faculty member and associated files deleted successfully' });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to delete faculty member', details: error.message },
            { status: 500 }
        );
    }
}
