// app/api/les/donate/easebuzz-hash/route.ts
// Easebuzz hash generation for LES Donations (separate account from admissions)
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Uses LES-specific Easebuzz credentials (separate merchant account)
const EASEBUZZ_KEY = process.env.LES_EASEBUZZ_KEY!;           // TODO: Replace with actual LES key
const EASEBUZZ_SALT = process.env.LES_EASEBUZZ_SALT!;         // TODO: Replace with actual LES salt
const EASEBUZZ_BASE_URL = process.env.LES_EASEBUZZ_BASE_URL || 'https://testpay.easebuzz.in';
const EASEBUZZ_PAYMENT_URL = process.env.LES_EASEBUZZ_PAYMENT_URL || 'https://testpay.easebuzz.in/pay';

export async function POST(request: Request) {
    try {
        const { amount, fund, donationType, donorName, donorEmail, donorPhone } = await request.json();

        // Validate Easebuzz credentials
        if (!EASEBUZZ_KEY || !EASEBUZZ_SALT) {
            return NextResponse.json(
                { success: false, error: 'Easebuzz credentials not configured. Please contact administrator.' },
                { status: 503 }
            );
        }

        // Validate required fields
        if (!amount || !donorName || !donorEmail || !donorPhone) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields (amount, name, email, phone)' },
                { status: 400 }
            );
        }

        // Validate and clean input values
        const txnid = `LESDON${Date.now()}`;
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            return NextResponse.json(
                { success: false, error: 'Invalid amount. Amount must be greater than 0' },
                { status: 400 }
            );
        }

        const cleanAmount = numAmount.toFixed(2);
        const cleanProductinfo = 'LES Donation';
        const cleanFirstname = String(donorName).trim();
        const cleanEmail = String(donorEmail).trim().toLowerCase();
        const cleanPhone = String(donorPhone).trim();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate phone format (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(cleanPhone)) {
            return NextResponse.json(
                { success: false, error: 'Invalid phone number. Must be 10 digits' },
                { status: 400 }
            );
        }

        // UDF fields - clear them to prevent special character validation issues
        const udf1 = '';
        const udf2 = '';
        const udf3 = '';
        const udf4 = '';
        const udf5 = '';
        const udf6 = '';
        const udf7 = '';
        const udf8 = '';
        const udf9 = '';
        const udf10 = '';

        // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|...|udf10|salt
        const hashString = `${EASEBUZZ_KEY}|${txnid}|${cleanAmount}|${cleanProductinfo}|${cleanFirstname}|${cleanEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|${udf7}|${udf8}|${udf9}|${udf10}|${EASEBUZZ_SALT}`;

        const hash = crypto
            .createHash('sha512')
            .update(hashString)
            .digest('hex');

        // Prepare callback URLs (redirect back to donate page with status and txnid)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const successUrl = `${baseUrl}/les/donate?status=success&txnid=${encodeURIComponent(txnid)}&email=${encodeURIComponent(cleanEmail)}`;
        const failureUrl = `${baseUrl}/les/donate?status=failure&txnid=${encodeURIComponent(txnid)}&email=${encodeURIComponent(cleanEmail)}`;

        // Prepare form data for Easebuzz API
        const formData = new URLSearchParams();
        formData.append('key', EASEBUZZ_KEY);
        formData.append('txnid', txnid);
        formData.append('amount', cleanAmount);
        formData.append('productinfo', cleanProductinfo);
        formData.append('firstname', cleanFirstname);
        formData.append('email', cleanEmail);
        formData.append('phone', cleanPhone);
        formData.append('surl', successUrl);
        formData.append('furl', failureUrl);
        formData.append('hash', hash);
        formData.append('udf1', udf1);
        formData.append('udf2', udf2);
        formData.append('udf3', udf3);
        formData.append('udf4', udf4);
        formData.append('udf5', udf5);
        formData.append('udf6', udf6);
        formData.append('udf7', udf7);

        // Call Easebuzz Initiate Payment API
        const response = await fetch(`${EASEBUZZ_BASE_URL}/payment/initiateLink`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: formData.toString(),
        });

        const result = await response.json();

        if (result.status === 1 && result.data) {
            let paymentUrl = result.data;

            if (paymentUrl.startsWith('/')) {
                paymentUrl = `${EASEBUZZ_PAYMENT_URL}${paymentUrl}`;
            } else if (!paymentUrl.startsWith('http')) {
                paymentUrl = `${EASEBUZZ_PAYMENT_URL}/${paymentUrl}`;
            }

            return NextResponse.json({
                success: true,
                paymentUrl,
                txnid,
                amount: cleanAmount,
                message: 'Payment link generated successfully',
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to initiate payment',
                    message: result.data || result.error || 'Unknown error from payment gateway',
                    error_desc: result.error_desc || 'No description provided',
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('LES Donate - Easebuzz hash generation failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Payment initiation failed',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            },
            { status: 500 }
        );
    }
}
