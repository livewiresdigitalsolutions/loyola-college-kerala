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
        const { committee_id, name, designation, image, sort_order } = body;
        const { id } = await params;
        const idNum = parseInt(id);

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('academic_committee_members')
                .update({ committee_id, name, designation, image, sort_order })
                .eq('id', idNum)
                .select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute(
                'UPDATE academic_committee_members SET committee_id = ?, name = ?, designation = ?, image = ?, sort_order = ? WHERE id = ?',
                [committee_id, name, designation, image, sort_order, idNum]
            );
            await connection.end();
            return NextResponse.json({ id: idNum, committee_id, name, designation, image, sort_order });
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to update committee member', details: error.message },
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
            const { error } = await supabase.from('academic_committee_members').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM academic_committee_members WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Committee member deleted successfully' });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to delete committee member', details: error.message },
            { status: 500 }
        );
    }
}
