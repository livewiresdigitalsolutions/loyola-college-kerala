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

// PUT — update activity
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        const idNum = parseInt(id);
        const { association_id, title, date, location, description, type, sort_order } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        if (isDevelopment) {
            const { data, error } = await supabase
                .from('association_activities')
                .update({ association_id, title, date, location, description, type, sort_order })
                .eq('id', idNum)
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute(
                'UPDATE association_activities SET association_id=?, title=?, date=?, location=?, description=?, type=?, sort_order=? WHERE id=?',
                [association_id, title, date, location, description, type, sort_order, idNum]
            );
            await connection.end();
            return NextResponse.json({ id: idNum, ...body });
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update activity', details: error.message }, { status: 500 });
    }
}

// DELETE — delete activity
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);

        if (isDevelopment) {
            const { error } = await supabase.from('association_activities').delete().eq('id', idNum);
            if (error) throw error;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);
            await connection.execute('DELETE FROM association_activities WHERE id = ?', [idNum]);
            await connection.end();
        }
        return NextResponse.json({ message: 'Activity deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete activity', details: error.message }, { status: 500 });
    }
}
