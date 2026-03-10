// app/api/les/donate/create-order/route.ts
// Razorpay order creation for LES Donations (separate account from admissions)
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Uses LES-specific Razorpay credentials (separate merchant account)
const razorpay = new Razorpay({
    key_id: process.env.LES_RAZORPAY_KEY_ID!,       // TODO: Replace with actual LES Razorpay key
    key_secret: process.env.LES_RAZORPAY_KEY_SECRET!, // TODO: Replace with actual LES Razorpay secret
});

export async function POST(request: Request) {
    try {
        const { amount, fund, donationType, donorName, donorEmail, donorPhone } = await request.json();

        // Validate required fields
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { success: false, error: 'Invalid donation amount' },
                { status: 400 }
            );
        }

        if (!donorName || !donorEmail) {
            return NextResponse.json(
                { success: false, error: 'Donor name and email are required' },
                { status: 400 }
            );
        }

        // Check if credentials are configured
        if (!process.env.LES_RAZORPAY_KEY_ID || !process.env.LES_RAZORPAY_KEY_SECRET) {
            return NextResponse.json(
                { success: false, error: 'Payment gateway not configured. Please contact administrator.' },
                { status: 503 }
            );
        }

        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: `les_don_${Date.now()}`,
            notes: {
                fund: fund || 'general',
                donationType: donationType || 'one-time',
                donorName,
                donorEmail,
                donorPhone: donorPhone || '',
                source: 'les-donate-page',
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.LES_RAZORPAY_KEY_ID, // Client needs this for checkout
        });
    } catch (error) {
        console.error('LES Donate - Razorpay order creation failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create donation order',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
