// app/api/les/donate/verify/route.ts
// Razorpay signature verification for LES Donations
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            donorName,
            donorEmail,
            donorPhone,
            amount,
            fund,
            donationType,
        } = await request.json();

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, error: 'Missing required payment fields' },
                { status: 400 }
            );
        }

        if (!process.env.LES_RAZORPAY_KEY_SECRET) {
            return NextResponse.json(
                { success: false, error: 'Payment gateway not configured' },
                { status: 503 }
            );
        }

        // Verify signature using LES-specific secret
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.LES_RAZORPAY_KEY_SECRET!)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return NextResponse.json(
                { success: false, error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // TODO: Store donation record in database when donations table is created
        // For now, just log the successful donation
        console.log('✅ LES Donation verified successfully:', {
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            donorName,
            donorEmail,
            donorPhone,
            amount,
            fund,
            donationType,
            gateway: 'razorpay',
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            message: 'Donation payment verified successfully',
            transaction: {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                amount,
                fund,
                donationType,
                gateway: 'razorpay',
            },
        });
    } catch (error) {
        console.error('LES Donate - Razorpay verification failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Payment verification failed',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
