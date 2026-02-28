// app/api/payment/verify/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
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

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, amount } = await request.json();

      razorpay_order_id,
      razorpay_payment_id,
      email,
      amount
    });

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

      received: razorpay_signature,
      expected: expectedSign,
      match: razorpay_signature === expectedSign
    });

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Update payment status in database
    if (isDevelopment) {
      
      const { data, error } = await supabase
        .from('admission_basic_info') // FIXED: Changed from 'admission_form' to 'admission_basic_info'
        .update({
          payment_status: 'completed',
          payment_id: razorpay_payment_id,
          payment_amount: amount,
          form_status: 'submitted',
          submitted_at: new Date().toISOString(),
        })
        .eq('user_email', email);

      if (error) {
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

    } else {
      
      const connection = await mysql.createConnection(mysqlConfig);
      
      try {
        const [result] = await connection.execute(
          `UPDATE admission_basic_info SET 
           payment_status = 'completed', 
           payment_id = ?, 
           payment_amount = ?,
           form_status = 'submitted',
           submitted_at = CURRENT_TIMESTAMP 
           WHERE user_email = ?`,
          [razorpay_payment_id, amount, email]
        );


        // Check if any rows were updated
        const updateResult = result as mysql.ResultSetHeader;
        if (updateResult.affectedRows === 0) {
          await connection.end();
          return NextResponse.json({ error: 'Admission form not found' }, { status: 404 });
        }

      } catch (dbError) {
        await connection.end();
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      await connection.end();
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified successfully' 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Payment verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
