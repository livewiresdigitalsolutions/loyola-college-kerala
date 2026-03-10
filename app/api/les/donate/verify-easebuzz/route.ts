// app/api/les/donate/verify-easebuzz/route.ts
// Easebuzz transaction verification for LES Donations
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const EASEBUZZ_SALT = process.env.LES_EASEBUZZ_SALT!;
const EASEBUZZ_KEY = process.env.LES_EASEBUZZ_KEY!;
const EASEBUZZ_DASHBOARD_URL = process.env.LES_EASEBUZZ_DASHBOARD_URL || 'https://testdashboard.easebuzz.in';

export async function POST(request: Request) {
    try {
        const { txnid, email } = await request.json();

        if (!txnid) {
            return NextResponse.json(
                { success: false, error: 'Transaction ID is required' },
                { status: 400 }
            );
        }

        if (!EASEBUZZ_KEY || !EASEBUZZ_SALT) {
            return NextResponse.json(
                { success: false, error: 'Payment gateway not configured' },
                { status: 503 }
            );
        }

        // Generate hash for Transaction API: key|txnid|salt
        const hashString = `${EASEBUZZ_KEY}|${txnid}|${EASEBUZZ_SALT}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        // Call Easebuzz Transaction API to verify payment
        const formData = new URLSearchParams({
            key: EASEBUZZ_KEY,
            txnid: txnid,
            hash: hash,
        });

        const response = await fetch(`${EASEBUZZ_DASHBOARD_URL}/transaction/v2.1/retrieve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: 'Failed to verify payment with Easebuzz' },
                { status: 500 }
            );
        }

        const result = await response.json();

        // Validate response
        if (!result.status || (result.status !== 1 && result.status !== true)) {
            return NextResponse.json(
                { success: false, error: 'Payment verification failed', details: result },
                { status: 400 }
            );
        }

        // Extract transaction data
        const transactionData = result.msg?.[0];

        if (!transactionData) {
            return NextResponse.json(
                { success: false, error: 'Transaction data not found' },
                { status: 404 }
            );
        }

        // Check if payment was successful
        if (transactionData.status !== 'success') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Payment was not successful',
                    status: transactionData.status,
                    message: transactionData.error_Message || transactionData.error,
                },
                { status: 400 }
            );
        }

        // TODO: Store donation record in database when donations table is created
        console.log('✅ LES Donation (Easebuzz) verified successfully:', {
            txnid: transactionData.txnid,
            easepayid: transactionData.easepayid,
            amount: transactionData.amount,
            status: transactionData.status,
            mode: transactionData.mode,
            email: transactionData.email,
            fund: transactionData.udf1,
            donationType: transactionData.udf2,
            gateway: 'easebuzz',
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            message: 'Donation payment verified successfully',
            transaction: {
                txnid: transactionData.txnid,
                easepayid: transactionData.easepayid,
                amount: transactionData.amount,
                status: transactionData.status,
                mode: transactionData.mode,
                bank_ref_num: transactionData.bank_ref_num,
                email: transactionData.email,
                fund: transactionData.udf1,
                donationType: transactionData.udf2,
            },
        });
    } catch (error) {
        console.error('LES Donate - Easebuzz verification failed:', error);
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
