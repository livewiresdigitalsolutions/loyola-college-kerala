import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import { sendDonationAcknowledgment } from '@/lib/lesDonationEmail';

const EASEBUZZ_SALT = process.env.LES_EASEBUZZ_SALT!;
const EASEBUZZ_KEY = process.env.LES_EASEBUZZ_KEY!;
const EASEBUZZ_DASHBOARD_URL = process.env.LES_EASEBUZZ_DASHBOARD_URL || 'https://testdashboard.easebuzz.in';

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'loyola',
};

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

        // Store donation record in database
        try {
            const connection = await mysql.createConnection(dbConfig);
            await connection.execute(
                `INSERT INTO les_donations 
                (txnid, easepayid, amount, status, name, email, phone, fund, donation_type, gateway) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE status = VALUES(status)`,
                [
                    transactionData.txnid,
                    transactionData.easepayid,
                    transactionData.amount,
                    transactionData.status,
                    transactionData.firstname || '',
                    transactionData.email || email || '',
                    transactionData.phone || '',
                    transactionData.udf1 || 'general',
                    transactionData.udf2 || 'one-time',
                    'easebuzz'
                ]
            );
            await connection.end();
            console.log('✅ LES Donation verified and saved to database successfully');

            // Send acknowledgment email with PDF invoice (non-blocking)
            sendDonationAcknowledgment({
                txnid: transactionData.txnid,
                easepayid: transactionData.easepayid,
                amount: transactionData.amount,
                name: transactionData.firstname || '',
                email: transactionData.email || email || '',
                phone: transactionData.phone || '',
                fund: transactionData.udf1 || 'general',
                donationType: transactionData.udf2 || 'one-time',
            }).then(() => {
                console.log('📧 Donation acknowledgment email sent successfully');
            }).catch((emailErr) => {
                console.error('Failed to send donation acknowledgment email:', emailErr);
            });
        } catch (dbError) {
            console.error('Database insertion error for donation:', dbError);
            // We still return success since payment was verified, but log the DB error
        }

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
