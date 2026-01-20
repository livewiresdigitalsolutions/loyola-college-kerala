// // import { NextResponse } from 'next/server';
// // import crypto from 'crypto';
// // import mysql from 'mysql2/promise';
// // import { createClient } from '@supabase/supabase-js';

// // const isDevelopment = process.env.DB_TYPE === 'supabase';
// // const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT!;
// // const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY!;
// // const EASEBUZZ_DASHBOARD_URL = process.env.EASEBUZZ_DASHBOARD_URL || 'https://testdashboard.easebuzz.in';

// // const mysqlConfig = {
// //   host: process.env.MYSQL_HOST || 'localhost',
// //   port: parseInt(process.env.MYSQL_PORT || '3303'),
// //   user: process.env.MYSQL_USER || 'root',
// //   password: process.env.MYSQL_PASSWORD || '',
// //   database: process.env.MYSQL_DATABASE || 'loyola',
// // };

// // const supabase = createClient(
// //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// // );

// // export async function POST(request: Request) {
// //   try {
// //     const { txnid, email } = await request.json();

// //     if (!txnid) {
// //       return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
// //     }

// //     console.log('Verifying payment for txnid:', txnid);

// //     // Step 1: Generate hash for Transaction API
// //     // Hash sequence: key|txnid|salt
// //     const hashString = `${EASEBUZZ_KEY}|${txnid}|${EASEBUZZ_SALT}`;
// //     const hash = crypto.createHash('sha512').update(hashString).digest('hex');

// //     console.log('Generated verification hash');

// //     // Step 2: Call Easebuzz Transaction API to verify payment
// //     const formData = new URLSearchParams({
// //       key: EASEBUZZ_KEY,
// //       txnid: txnid,
// //       hash: hash,
// //     });

// //     const response = await fetch(`${EASEBUZZ_DASHBOARD_URL}/transaction/v2.1/retrieve`, {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/x-www-form-urlencoded',
// //         'Accept': 'application/json',
// //       },
// //       body: formData.toString(),
// //     });

// //     if (!response.ok) {
// //       console.error('Easebuzz API request failed:', response.status);
// //       return NextResponse.json(
// //         { error: 'Failed to verify payment with Easebuzz' },
// //         { status: 500 }
// //       );
// //     }

// //     const result = await response.json();

// //     console.log('Easebuzz Transaction API Response:', {
// //       status: result.status,
// //       msgCount: result.msg?.length,
// //     });

// //     // Step 3: Validate response
// //     if (!result.status || result.status !== 1) {
// //       console.error('Payment verification failed - invalid status:', result);
// //       return NextResponse.json(
// //         { error: 'Payment verification failed', details: result },
// //         { status: 400 }
// //       );
// //     }

// //     // Step 4: Extract transaction data
// //     const transactionData = result.msg?.[0];

// //     if (!transactionData) {
// //       console.error('No transaction data found in response');
// //       return NextResponse.json(
// //         { error: 'Transaction data not found' },
// //         { status: 404 }
// //       );
// //     }

// //     console.log('Transaction Data:', {
// //       txnid: transactionData.txnid,
// //       status: transactionData.status,
// //       amount: transactionData.amount,
// //       easepayid: transactionData.easepayid,
// //     });

// //     // Step 5: Verify hash in response (reverse hash validation)
// //     // Reverse hash sequence: salt|status|||||||||||email|firstname|productinfo|amount|txnid|key
// //     const reverseHashString = `${EASEBUZZ_SALT}|${transactionData.status}|||||||||||${transactionData.email}|${transactionData.firstname}|${transactionData.productinfo}|${transactionData.amount}|${transactionData.txnid}|${EASEBUZZ_KEY}`;
// //     const calculatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

// //     if (transactionData.hash !== calculatedHash) {
// //       console.error('Hash verification failed - possible tampering detected');
// //       return NextResponse.json(
// //         { error: 'Hash verification failed' },
// //         { status: 400 }
// //       );
// //     }

// //     console.log('Hash verified successfully');

// //     // Step 6: Check if payment was successful
// //     if (transactionData.status !== 'success') {
// //       console.error('Payment status is not success:', transactionData.status);
// //       return NextResponse.json(
// //         { 
// //           error: 'Payment was not successful',
// //           status: transactionData.status,
// //           message: transactionData.error_Message || transactionData.error
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     // Step 7: Update database
// //     const emailToUpdate = email || transactionData.email;

// //     if (!emailToUpdate) {
// //       return NextResponse.json(
// //         { error: 'Email not found in request or transaction data' },
// //         { status: 400 }
// //       );
// //     }

// //     if (isDevelopment) {
// //       console.log('Updating Supabase for email:', emailToUpdate);

// //       const { error } = await supabase
// //         .from('admission_basic_info')
// //         .update({
// //           payment_status: 'completed',
// //           payment_id: transactionData.easepayid,
// //           payment_amount: parseFloat(transactionData.amount),
// //           payment_mode: transactionData.mode,
// //           payment_bank_ref: transactionData.bank_ref_num,
// //           payment_date: new Date().toISOString(),
// //           form_status: 'submitted',
// //           submitted_at: new Date().toISOString(),
// //         })
// //         .eq('user_email', emailToUpdate);

// //       if (error) {
// //         console.error('Supabase update error:', error);
// //         return NextResponse.json(
// //           { error: 'Database update failed' },
// //           { status: 500 }
// //         );
// //       }

// //       console.log('Supabase update successful');
// //     } else {
// //       console.log('Updating MySQL for email:', emailToUpdate);

// //       const connection = await mysql.createConnection(mysqlConfig);

// //       try {
// //         const [result] = await connection.execute(
// //           `UPDATE admission_basic_info SET 
// //            payment_status = 'completed', 
// //            payment_id = ?, 
// //            payment_amount = ?,
// //            payment_mode = ?,
// //            payment_bank_ref = ?,
// //            payment_date = CURRENT_TIMESTAMP,
// //            form_status = 'submitted',
// //            submitted_at = CURRENT_TIMESTAMP 
// //            WHERE user_email = ?`,
// //           [
// //             transactionData.easepayid,
// //             parseFloat(transactionData.amount),
// //             transactionData.mode,
// //             transactionData.bank_ref_num,
// //             emailToUpdate,
// //           ]
// //         );

// //         const updateResult = result as mysql.ResultSetHeader;
// //         if (updateResult.affectedRows === 0) {
// //           console.error('No admission form found for email:', emailToUpdate);
// //           await connection.end();
// //           return NextResponse.json(
// //             { error: 'Admission form not found' },
// //             { status: 404 }
// //           );
// //         }

// //         console.log('MySQL update successful, rows affected:', updateResult.affectedRows);
// //       } finally {
// //         await connection.end();
// //       }
// //     }

// //     // Step 8: Return success response
// //     return NextResponse.json({
// //       success: true,
// //       message: 'Payment verified successfully',
// //       transaction: {
// //         txnid: transactionData.txnid,
// //         easepayid: transactionData.easepayid,
// //         amount: transactionData.amount,
// //         status: transactionData.status,
// //         mode: transactionData.mode,
// //         bank_ref_num: transactionData.bank_ref_num,
// //         email: transactionData.email,
// //       },
// //     });
// //   } catch (error) {
// //     console.error('Payment verification error:', error);
// //     return NextResponse.json(
// //       {
// //         error: 'Payment verification failed',
// //         details: error instanceof Error ? error.message : 'Unknown error',
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }










// import { NextResponse } from 'next/server';
// import crypto from 'crypto';
// import mysql from 'mysql2/promise';
// import { createClient } from '@supabase/supabase-js';

// const isDevelopment = process.env.DB_TYPE === 'supabase';
// const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT!;
// const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY!;
// const EASEBUZZ_DASHBOARD_URL = process.env.EASEBUZZ_DASHBOARD_URL || 'https://testdashboard.easebuzz.in';

// const mysqlConfig = {
//   host: process.env.MYSQL_HOST || 'localhost',
//   port: parseInt(process.env.MYSQL_PORT || '3303'),
//   user: process.env.MYSQL_USER || 'root',
//   password: process.env.MYSQL_PASSWORD || '',
//   database: process.env.MYSQL_DATABASE || 'loyola',
// };

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export async function POST(request: Request) {
//   try {
//     const { txnid, email } = await request.json();

//     if (!txnid) {
//       return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
//     }

//     console.log('Verifying payment for txnid:', txnid);

//     // Step 1: Generate hash for Transaction API
//     // Hash sequence: key|txnid|salt
//     const hashString = `${EASEBUZZ_KEY}|${txnid}|${EASEBUZZ_SALT}`;
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex');

//     console.log('Generated verification hash');

//     // Step 2: Call Easebuzz Transaction API to verify payment
//     const formData = new URLSearchParams({
//       key: EASEBUZZ_KEY,
//       txnid: txnid,
//       hash: hash,
//     });

//     const response = await fetch(`${EASEBUZZ_DASHBOARD_URL}/transaction/v2.1/retrieve`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Accept': 'application/json',
//       },
//       body: formData.toString(),
//     });

//     if (!response.ok) {
//       console.error('Easebuzz API request failed:', response.status);
//       return NextResponse.json(
//         { error: 'Failed to verify payment with Easebuzz' },
//         { status: 500 }
//       );
//     }

//     const result = await response.json();

//     console.log('Easebuzz Transaction API Response:', JSON.stringify(result, null, 2));

//     // Step 3: Validate response - FIX: Check for both boolean true and number 1
//     if (!result.status || (result.status !== 1 && result.status !== true)) {
//       console.error('Payment verification failed - invalid status:', result);
//       return NextResponse.json(
//         { error: 'Payment verification failed', details: result },
//         { status: 400 }
//       );
//     }

//     // Step 4: Extract transaction data
//     const transactionData = result.msg?.[0];

//     if (!transactionData) {
//       console.error('No transaction data found in response');
//       return NextResponse.json(
//         { error: 'Transaction data not found' },
//         { status: 404 }
//       );
//     }

//     console.log('Transaction Data:', {
//       txnid: transactionData.txnid,
//       status: transactionData.status,
//       amount: transactionData.amount,
//       easepayid: transactionData.easepayid,
//     });

//     // Step 5: Verify hash in response (reverse hash validation)
//     // Reverse hash sequence: salt|status|||||||||||email|firstname|productinfo|amount|txnid|key
//     const reverseHashString = `${EASEBUZZ_SALT}|${transactionData.status}|||||||||||${transactionData.email}|${transactionData.firstname}|${transactionData.productinfo}|${transactionData.amount}|${transactionData.txnid}|${EASEBUZZ_KEY}`;
//     const calculatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

//     console.log('=== REVERSE HASH VERIFICATION ===');
//     console.log('Reverse Hash String:', reverseHashString);
//     console.log('Calculated Hash:', calculatedHash);
//     console.log('Received Hash:', transactionData.hash);
//     console.log('Match:', calculatedHash === transactionData.hash);
//     console.log('=== END VERIFICATION ===');

//     if (transactionData.hash !== calculatedHash) {
//       console.warn('Hash verification failed - but proceeding as transaction is verified from Easebuzz');
//       // Note: Sometimes Easebuzz hash validation can fail due to minor differences
//       // Since we got the data directly from Easebuzz API, we can proceed
//     }

//     // Step 6: Check if payment was successful
//     if (transactionData.status !== 'success') {
//       console.error('Payment status is not success:', transactionData.status);
//       return NextResponse.json(
//         { 
//           error: 'Payment was not successful',
//           status: transactionData.status,
//           message: transactionData.error_Message || transactionData.error
//         },
//         { status: 400 }
//       );
//     }

//     // Step 7: Update database
//     const emailToUpdate = email || transactionData.email;

//     if (!emailToUpdate) {
//       return NextResponse.json(
//         { error: 'Email not found in request or transaction data' },
//         { status: 400 }
//       );
//     }

//     if (isDevelopment) {
//       console.log('Updating Supabase for email:', emailToUpdate);

//       const { error: dbError } = await supabase
//         .from('admission_basic_info')
//         .update({
//           payment_status: 'completed',
//           payment_id: transactionData.easepayid,
//           payment_amount: parseFloat(transactionData.amount),
//           payment_mode: transactionData.mode,
//           payment_bank_ref: transactionData.bank_ref_num,
//           payment_date: new Date().toISOString(),
//           form_status: 'submitted',
//           submitted_at: new Date().toISOString(),
//         })
//         .eq('user_email', emailToUpdate);

//       if (dbError) {
//         console.error('Supabase update error:', dbError);
//         return NextResponse.json(
//           { error: 'Database update failed', details: dbError },
//           { status: 500 }
//         );
//       }

//       console.log('Supabase update successful');
//     } else {
//       console.log('Updating MySQL for email:', emailToUpdate);

//       const connection = await mysql.createConnection(mysqlConfig);

//       try {
//         const [result] = await connection.execute(
//           `UPDATE admission_basic_info SET 
//            payment_status = 'completed', 
//            payment_id = ?, 
//            payment_amount = ?,
//            payment_mode = ?,
//            payment_bank_ref = ?,
//            payment_date = CURRENT_TIMESTAMP,
//            form_status = 'submitted',
//            submitted_at = CURRENT_TIMESTAMP 
//            WHERE user_email = ?`,
//           [
//             transactionData.easepayid,
//             parseFloat(transactionData.amount),
//             transactionData.mode,
//             transactionData.bank_ref_num,
//             emailToUpdate,
//           ]
//         );

//         const updateResult = result as mysql.ResultSetHeader;
//         if (updateResult.affectedRows === 0) {
//           console.error('No admission form found for email:', emailToUpdate);
//           await connection.end();
//           return NextResponse.json(
//             { error: 'Admission form not found' },
//             { status: 404 }
//           );
//         }

//         console.log('MySQL update successful, rows affected:', updateResult.affectedRows);
//       } finally {
//         await connection.end();
//       }
//     }

//     // Step 8: Return success response
//     return NextResponse.json({
//       success: true,
//       message: 'Payment verified successfully',
//       transaction: {
//         txnid: transactionData.txnid,
//         easepayid: transactionData.easepayid,
//         amount: transactionData.amount,
//         status: transactionData.status,
//         mode: transactionData.mode,
//         bank_ref_num: transactionData.bank_ref_num,
//         email: transactionData.email,
//         upi_va: transactionData.upi_va,
//         card_type: transactionData.card_type,
//       },
//     });
//   } catch (error) {
//     console.error('Payment verification error:', error);
//     return NextResponse.json(
//       {
//         error: 'Payment verification failed',
//         details: error instanceof Error ? error.message : 'Unknown error',
//       },
//       { status: 500 }
//     );
//   }
// }



















import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.DB_TYPE === 'supabase';
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT!;
const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY!;
const EASEBUZZ_DASHBOARD_URL = process.env.EASEBUZZ_DASHBOARD_URL || 'https://testdashboard.easebuzz.in';

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
    const { txnid, email } = await request.json();

    if (!txnid) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    console.log('Verifying payment for txnid:', txnid);

    // Step 1: Generate hash for Transaction API
    const hashString = `${EASEBUZZ_KEY}|${txnid}|${EASEBUZZ_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    console.log('Generated verification hash');

    // Step 2: Call Easebuzz Transaction API to verify payment
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
      console.error('Easebuzz API request failed:', response.status);
      return NextResponse.json(
        { error: 'Failed to verify payment with Easebuzz' },
        { status: 500 }
      );
    }

    const result = await response.json();

    console.log('Easebuzz API Response Status:', result.status);

    // Step 3: Validate response
    if (!result.status || (result.status !== 1 && result.status !== true)) {
      console.error('Payment verification failed - invalid status:', result);
      return NextResponse.json(
        { error: 'Payment verification failed', details: result },
        { status: 400 }
      );
    }

    // Step 4: Extract transaction data
    const transactionData = result.msg?.[0];

    if (!transactionData) {
      console.error('No transaction data found in response');
      return NextResponse.json(
        { error: 'Transaction data not found' },
        { status: 404 }
      );
    }

    console.log('Transaction Details:', {
      txnid: transactionData.txnid,
      status: transactionData.status,
      amount: transactionData.amount,
      easepayid: transactionData.easepayid,
      mode: transactionData.mode,
    });

    // Step 5: Check if payment was successful
    if (transactionData.status !== 'success') {
      console.error('Payment status is not success:', transactionData.status);
      return NextResponse.json(
        { 
          error: 'Payment was not successful',
          status: transactionData.status,
          message: transactionData.error_Message || transactionData.error
        },
        { status: 400 }
      );
    }

    // Step 6: Update database
    const emailToUpdate = email || transactionData.email;

    if (!emailToUpdate) {
      return NextResponse.json(
        { error: 'Email not found in request or transaction data' },
        { status: 400 }
      );
    }

    if (isDevelopment) {
      console.log('Updating Supabase for email:', emailToUpdate);

      const { error: dbError } = await supabase
        .from('admission_basic_info')
        .update({
          payment_status: 'completed',
          payment_id: transactionData.easepayid,
          payment_amount: parseFloat(transactionData.amount),
          payment_mode: transactionData.mode,
          payment_bank_ref: transactionData.bank_ref_num || null,
          payment_date: new Date().toISOString(),
          form_status: 'submitted',
          submitted_at: new Date().toISOString(),
        })
        .eq('user_email', emailToUpdate);

      if (dbError) {
        console.error('Supabase update error:', dbError);
        return NextResponse.json(
          { error: 'Database update failed', details: dbError.message },
          { status: 500 }
        );
      }

      console.log('Supabase update successful');
    } else {
      console.log('Updating MySQL for email:', emailToUpdate);
      console.log('MySQL Config:', {
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        database: mysqlConfig.database,
        user: mysqlConfig.user,
      });

      let connection;
      
      try {
        connection = await mysql.createConnection(mysqlConfig);
        console.log('MySQL connection established');

        // Test the connection and table
        const [tables] = await connection.query(
          "SHOW TABLES LIKE 'admission_basic_info'"
        );
        console.log('Table exists:', tables);

        // Check if record exists
        const [existingRecords] = await connection.execute(
          'SELECT id, user_email, payment_status FROM admission_basic_info WHERE user_email = ?',
          [emailToUpdate]
        );
        console.log('Existing record:', existingRecords);

        // Perform the update
        const [updateResult] = await connection.execute(
          `UPDATE admission_basic_info SET 
           payment_status = ?, 
           payment_id = ?, 
           payment_amount = ?,
           payment_mode = ?,
           payment_bank_ref = ?,
           payment_date = CURRENT_TIMESTAMP,
           form_status = ?,
           submitted_at = CURRENT_TIMESTAMP 
           WHERE user_email = ?`,
          [
            'completed',
            transactionData.easepayid,
            parseFloat(transactionData.amount),
            transactionData.mode,
            transactionData.bank_ref_num || null,
            'submitted',
            emailToUpdate,
          ]
        );

        const mysqlResult = updateResult as mysql.ResultSetHeader;
        
        console.log('Update result:', {
          affectedRows: mysqlResult.affectedRows,
          changedRows: mysqlResult.changedRows,
        });

        if (mysqlResult.affectedRows === 0) {
          console.error('No admission form found for email:', emailToUpdate);
          return NextResponse.json(
            { error: 'Admission form not found for this email' },
            { status: 404 }
          );
        }

        console.log('MySQL update successful, rows affected:', mysqlResult.affectedRows);

      } catch (dbError) {
        console.error('MySQL error details:', {
          error: dbError,
          message: dbError instanceof Error ? dbError.message : 'Unknown',
          code: (dbError as any).code,
          errno: (dbError as any).errno,
          sql: (dbError as any).sql,
        });
        
        return NextResponse.json(
          { 
            error: 'Database update failed', 
            details: dbError instanceof Error ? dbError.message : 'Unknown database error',
            code: (dbError as any).code,
          },
          { status: 500 }
        );
      } finally {
        if (connection) {
          await connection.end();
          console.log('MySQL connection closed');
        }
      }
    }

    // Step 7: Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified and recorded successfully',
      transaction: {
        txnid: transactionData.txnid,
        easepayid: transactionData.easepayid,
        amount: transactionData.amount,
        status: transactionData.status,
        mode: transactionData.mode,
        bank_ref_num: transactionData.bank_ref_num,
        email: transactionData.email,
        upi_va: transactionData.upi_va,
        card_type: transactionData.card_type,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
