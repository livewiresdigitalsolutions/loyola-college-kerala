// app/api/payment/verify/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';

const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3303'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'loyola',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, amount } = await request.json();

    console.log('Payment verification request:', {
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

    console.log('Signature verification:', {
      received: razorpay_signature,
      expected: expectedSign,
      match: razorpay_signature === expectedSign
    });

    if (razorpay_signature !== expectedSign) {
      console.error('Invalid signature - payment verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Update payment status in database
    if (isDevelopment) {
      console.log('Updating Supabase for email:', email);
      
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
        console.error('Supabase update error:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log('Supabase update successful:', data);
    } else {
      console.log('Updating MySQL for email:', email);
      
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

        console.log('MySQL update result:', result);

        // Check if any rows were updated
        const updateResult = result as mysql.ResultSetHeader;
        if (updateResult.affectedRows === 0) {
          console.error('No admission form found for email:', email);
          await connection.end();
          return NextResponse.json({ error: 'Admission form not found' }, { status: 404 });
        }

        console.log('MySQL update successful, rows affected:', updateResult.affectedRows);
      } catch (dbError) {
        console.error('MySQL update error:', dbError);
        await connection.end();
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      await connection.end();
    }

    console.log('Payment verified and database updated successfully');
    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified successfully' 
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ 
      error: 'Payment verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
