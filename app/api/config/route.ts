// app/api/config/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';

console.log('[DB ENV]', {
  DB_TYPE: process.env.DB_TYPE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_PASSWORD: process.env.DB_PASSWORD ? '***loaded***' : 'missing',
});



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

// GET: Fetch configuration value(s)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (isDevelopment) {
      if (key) {
        // Fetch single config by key
        const { data, error } = await supabase
          .from('configuration_values')
          .select('id, key, value, description, data_type, updated_at')
          .eq('key', key)
          .single();

        if (error) throw error;
        return NextResponse.json(data);
      } else {
        // Fetch all configs
        const { data, error } = await supabase
          .from('configuration_values')
          .select('id, key, value, description, data_type, updated_at')
          .order('key', { ascending: true });

        if (error) throw error;
        return NextResponse.json(data);
      }
    } else {
      let connection;

try {
  console.log(mysqlConfig);
  connection = await mysql.createConnection(mysqlConfig);
  console.log('MySQL connected successfully');
} catch (err) {
  console.error('MySQL connection failed', err);
  throw err;
}

      
      const query = key
        ? 'SELECT id, `key`, `value`, description, data_type, updated_at FROM configuration_values WHERE `key` = ?'
        : 'SELECT id, `key`, `value`, description, data_type, updated_at FROM configuration_values ORDER BY `key`';
      
      const params = key ? [key] : [];
      console.log('[MYSQL QUERY]', query, params);
      const [rows] = await connection.execute(query, params);
      await connection.end();
      
      const result = key ? (rows as any[])[0] : rows;
      return NextResponse.json(result);
    }
  } catch (error: any) {
    console.error('Error fetching configuration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new configuration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, description, data_type } = body;

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const { data, error } = await supabase
        .from('configuration_values')
        .insert([{ 
          key, 
          value, 
          description: description || null, 
          data_type: data_type || 'string' 
        }])
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      const [result] = await connection.execute(
        'INSERT INTO configuration_values (`key`, `value`, description, data_type) VALUES (?, ?, ?, ?)',
        [key, value, description || null, data_type || 'string']
      );
      await connection.end();
      
      return NextResponse.json({
        id: (result as any).insertId,
        key,
        value,
        description: description || null,
        data_type: data_type || 'string',
      });
    }
  } catch (error: any) {
    console.error('Error creating configuration:', error);
    
    // Check for duplicate key error
    if (error.code === '23505' || error.message?.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Configuration key already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create configuration', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update configuration
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const body = await request.json();
    const { value, description, data_type } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Key parameter is required' },
        { status: 400 }
      );
    }

    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const updateData: any = { value };
      if (description !== undefined) updateData.description = description;
      if (data_type !== undefined) updateData.data_type = data_type;

      const { data, error } = await supabase
        .from('configuration_values')
        .update(updateData)
        .eq('key', key)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return NextResponse.json(
          { error: 'Configuration key not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(data[0]);
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      
      const updates: string[] = ['`value` = ?'];
      const params: any[] = [value];
      
      if (description !== undefined) {
        updates.push('description = ?');
        params.push(description);
      }
      
      if (data_type !== undefined) {
        updates.push('data_type = ?');
        params.push(data_type);
      }
      
      params.push(key);
      
      const [result] = await connection.execute(
        `UPDATE configuration_values SET ${updates.join(', ')} WHERE \`key\` = ?`,
        params
      );
      
      await connection.end();
      
      if ((result as any).affectedRows === 0) {
        return NextResponse.json(
          { error: 'Configuration key not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        key, 
        value, 
        description, 
        data_type 
      });
    }
  } catch (error: any) {
    console.error('Error updating configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete configuration
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Key parameter is required' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      const { data, error } = await supabase
        .from('configuration_values')
        .delete()
        .eq('key', key)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return NextResponse.json(
          { error: 'Configuration key not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        message: 'Configuration deleted successfully',
        deleted: data[0]
      });
    } else {
      const connection = await mysql.createConnection(mysqlConfig);
      const [result] = await connection.execute(
        'DELETE FROM configuration_values WHERE `key` = ?',
        [key]
      );
      await connection.end();
      
      if ((result as any).affectedRows === 0) {
        return NextResponse.json(
          { error: 'Configuration key not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        message: 'Configuration deleted successfully' 
      });
    }
  } catch (error: any) {
    console.error('Error deleting configuration:', error);
    return NextResponse.json(
      { error: 'Failed to delete configuration', details: error.message },
      { status: 500 }
    );
  }
}
