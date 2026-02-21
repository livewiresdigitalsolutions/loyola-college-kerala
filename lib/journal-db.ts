import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';

const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3303'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'loyola',
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --------------- Journal Users ---------------

export async function findUserByEmail(email: string) {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('journal_users')
            .select('*')
            .eq('email', email)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM journal_users WHERE email = ?',
                [email]
            );
            const result = rows as any[];
            return result.length > 0 ? result[0] : null;
        } finally {
            await connection.end();
        }
    }
}

export async function findUserById(id: number) {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('journal_users')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM journal_users WHERE id = ?',
                [id]
            );
            const result = rows as any[];
            return result.length > 0 ? result[0] : null;
        } finally {
            await connection.end();
        }
    }
}

export async function createUser(userData: {
    salutation?: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    designation?: string;
    affiliation?: string;
    country?: string;
    state?: string;
    city?: string;
    email: string;
    phone?: string;
    address?: string;
    password_hash: string;
}) {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('journal_users')
            .insert(userData)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const fields = Object.keys(userData);
            const placeholders = fields.map(() => '?').join(', ');
            const values = Object.values(userData);
            const [result] = await connection.execute(
                `INSERT INTO journal_users (${fields.join(', ')}) VALUES (${placeholders})`,
                values
            );
            return { id: (result as any).insertId, ...userData };
        } finally {
            await connection.end();
        }
    }
}

export async function updateUser(id: number, userData: Record<string, any>) {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('journal_users')
            .update(userData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const fields = Object.keys(userData);
            const setClause = fields.map(f => `${f} = ?`).join(', ');
            const values = [...Object.values(userData), id];
            await connection.execute(
                `UPDATE journal_users SET ${setClause} WHERE id = ?`,
                values
            );
            return { id, ...userData };
        } finally {
            await connection.end();
        }
    }
}

// --------------- Journal Articles ---------------

export async function getArticlesByUser(userId: number) {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('journal_articles')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });
        if (error) throw error;
        return data || [];
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM journal_articles WHERE user_id = ? ORDER BY updated_at DESC',
                [userId]
            );
            return rows as any[];
        } finally {
            await connection.end();
        }
    }
}

export async function getArticleById(id: number) {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('journal_articles')
            .select('*, journal_users(first_name, last_name, email, affiliation)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute(
                `SELECT a.*, u.first_name, u.last_name, u.email as author_email, u.affiliation
         FROM journal_articles a
         JOIN journal_users u ON a.user_id = u.id
         WHERE a.id = ?`,
                [id]
            );
            const result = rows as any[];
            return result.length > 0 ? result[0] : null;
        } finally {
            await connection.end();
        }
    }
}

export async function createArticle(articleData: {
    user_id: number;
    title: string;
    abstract?: string;
    content: string;
    keywords?: string;
    category?: string;
    cover_image?: string;
}) {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('journal_articles')
            .insert(articleData)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const fields = Object.keys(articleData);
            const placeholders = fields.map(() => '?').join(', ');
            const values = Object.values(articleData);
            const [result] = await connection.execute(
                `INSERT INTO journal_articles (${fields.join(', ')}) VALUES (${placeholders})`,
                values
            );
            return { id: (result as any).insertId, ...articleData };
        } finally {
            await connection.end();
        }
    }
}

export async function updateArticle(id: number, articleData: Record<string, any>) {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('journal_articles')
            .update(articleData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const fields = Object.keys(articleData);
            const setClause = fields.map(f => `${f} = ?`).join(', ');
            const values = [...Object.values(articleData), id];
            await connection.execute(
                `UPDATE journal_articles SET ${setClause} WHERE id = ?`,
                values
            );
            return { id, ...articleData };
        } finally {
            await connection.end();
        }
    }
}

export async function deleteArticle(id: number) {
    if (isDevelopment) {
        const { error } = await supabase
            .from('journal_articles')
            .delete()
            .eq('id', id);
        if (error) throw error;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            await connection.execute('DELETE FROM journal_articles WHERE id = ?', [id]);
        } finally {
            await connection.end();
        }
    }
}

export async function getPublicArticles(limit: number = 3) {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('journal_articles')
            .select('id, title, abstract, keywords, category, published_at, journal_users(first_name, last_name, affiliation)')
            .eq('status', 'approved')
            .order('published_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute(
                `SELECT a.id, a.title, a.abstract, a.keywords, a.category, a.published_at,
                u.first_name, u.last_name, u.affiliation
         FROM journal_articles a
         JOIN journal_users u ON a.user_id = u.id
         WHERE a.status = 'approved'
         ORDER BY a.published_at DESC
         LIMIT ?`,
                [limit]
            );
            return rows as any[];
        } finally {
            await connection.end();
        }
    }
}

export async function getAllArticlesAdmin(status?: string) {
    if (isDevelopment) {
        let query = supabase
            .from('journal_articles')
            .select('*, journal_users(first_name, last_name, email, affiliation)')
            .order('updated_at', { ascending: false });
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            let sql = `SELECT a.*, u.first_name, u.last_name, u.email as author_email, u.affiliation
                  FROM journal_articles a
                  JOIN journal_users u ON a.user_id = u.id`;
            const params: any[] = [];
            if (status && status !== 'all') {
                sql += ' WHERE a.status = ?';
                params.push(status);
            }
            sql += ' ORDER BY a.updated_at DESC';
            const [rows] = await connection.execute(sql, params);
            return rows as any[];
        } finally {
            await connection.end();
        }
    }
}

export async function getAllUsersAdmin() {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('journal_users')
            .select('id, salutation, first_name, last_name, email, affiliation, is_active, created_at')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute(
                `SELECT id, salutation, first_name, last_name, email, affiliation, is_active, created_at
         FROM journal_users ORDER BY created_at DESC`
            );
            return rows as any[];
        } finally {
            await connection.end();
        }
    }
}

// --------------- Password Reset OTPs ---------------

export async function createOTP(email: string, otpHash: string, expiresAt: Date) {
    if (isDevelopment) {
        const { error } = await supabase
            .from('password_reset_otps')
            .insert({
                email,
                otp_hash: otpHash,
                expires_at: expiresAt.toISOString(),
            });
        if (error) throw error;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            await connection.execute(
                'INSERT INTO password_reset_otps (email, otp_hash, expires_at) VALUES (?, ?, ?)',
                [email, otpHash, expiresAt]
            );
        } finally {
            await connection.end();
        }
    }
}

export async function getLatestOTP(email: string) {
    if (isDevelopment) {
        const { data, error } = await supabase
            .from('password_reset_otps')
            .select('*')
            .eq('email', email)
            .eq('is_used', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            const [rows] = await connection.execute(
                `SELECT * FROM password_reset_otps
         WHERE email = ? AND is_used = FALSE
         ORDER BY created_at DESC LIMIT 1`,
                [email]
            );
            const result = rows as any[];
            return result.length > 0 ? result[0] : null;
        } finally {
            await connection.end();
        }
    }
}

export async function incrementOTPAttempts(id: number) {
    if (isDevelopment) {
        await supabase.rpc('increment_otp_attempts', { otp_id: id });
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            await connection.execute(
                'UPDATE password_reset_otps SET attempts = attempts + 1 WHERE id = ?',
                [id]
            );
        } finally {
            await connection.end();
        }
    }
}

export async function markOTPUsed(id: number) {
    if (isDevelopment) {
        await supabase
            .from('password_reset_otps')
            .update({ is_used: true })
            .eq('id', id);
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            await connection.execute(
                'UPDATE password_reset_otps SET is_used = TRUE WHERE id = ?',
                [id]
            );
        } finally {
            await connection.end();
        }
    }
}

export async function deleteOTPsByEmail(email: string) {
    if (isDevelopment) {
        await supabase
            .from('password_reset_otps')
            .delete()
            .eq('email', email);
    } else {
        const connection = await mysql.createConnection(mysqlConfig);
        try {
            await connection.execute(
                'DELETE FROM password_reset_otps WHERE email = ?',
                [email]
            );
        } finally {
            await connection.end();
        }
    }
}
