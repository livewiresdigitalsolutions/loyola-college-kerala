// app/api/payment/verify/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.NODE_ENV === 'development';

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

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update payment status in database
      if (isDevelopment) {
       await supabase
          .from('admission_form')
          .update({
            payment_status: 'completed',
            payment_id: razorpay_payment_id,
            payment_amount: amount,
            form_status: 'submitted',
            submitted_at: new Date().toISOString(),
          })
          .eq('user_email', email);
      } else {
        const connection = await mysql.createConnection(mysqlConfig);
         await connection.execute(
          `UPDATE admission_form SET 
           payment_status = 'completed', 
           payment_id = ?, 
           payment_amount = ?,
           form_status = 'submitted',
           submitted_at = CURRENT_TIMESTAMP 
           WHERE user_email = ?`,
          [razorpay_payment_id, amount, email]
        );
        await connection.end();
      }

      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
