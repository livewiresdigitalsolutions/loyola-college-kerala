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

// GET /api/associations/:slug — full detail for one association
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        let association;
        let teamMembers;
        let activities;

        if (isDevelopment) {
            // Get association
            const { data: assocData, error: assocError } = await supabase
                .from('associations')
                .select('*')
                .eq('slug', slug)
                .eq('is_active', true)
                .single();
            if (assocError) {
                if (assocError.code === 'PGRST116') {
                    return NextResponse.json({ error: 'Association not found' }, { status: 404 });
                }
                throw assocError;
            }
            association = assocData;

            // Get team members
            const { data: teamData, error: teamError } = await supabase
                .from('association_team_members')
                .select('*')
                .eq('association_id', association.id)
                .order('sort_order');
            if (teamError) throw teamError;
            teamMembers = teamData;

            // Get activities
            const { data: actData, error: actError } = await supabase
                .from('association_activities')
                .select('*')
                .eq('association_id', association.id)
                .order('sort_order');
            if (actError) throw actError;
            activities = actData;
        } else {
            const connection = await mysql.createConnection(mysqlConfig);

            // Get association
            const [assocRows] = await connection.execute(
                'SELECT * FROM associations WHERE slug = ? AND is_active = true',
                [slug]
            );
            const assocArr = assocRows as any[];
            if (assocArr.length === 0) {
                await connection.end();
                return NextResponse.json({ error: 'Association not found' }, { status: 404 });
            }
            association = assocArr[0];
            // Parse JSON field if stored as string
            if (typeof association.about_paragraphs === 'string') {
                association.about_paragraphs = JSON.parse(association.about_paragraphs);
            }

            // Get team members
            const [teamRows] = await connection.execute(
                'SELECT * FROM association_team_members WHERE association_id = ? ORDER BY sort_order',
                [association.id]
            );
            teamMembers = teamRows;

            // Get activities
            const [actRows] = await connection.execute(
                'SELECT * FROM association_activities WHERE association_id = ? ORDER BY sort_order',
                [association.id]
            );
            activities = actRows;

            await connection.end();
        }

        return NextResponse.json({
            ...association,
            teamMembers: teamMembers || [],
            activities: activities || [],
        });
    } catch (error: any) {
        console.error('Error fetching association detail:', error);
        return NextResponse.json(
            { error: 'Failed to fetch association', details: error.message },
            { status: 500 }
        );
    }
}
