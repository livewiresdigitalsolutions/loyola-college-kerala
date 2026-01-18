// import { NextResponse } from 'next/server';
// import crypto from 'crypto';

// const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY!;
// const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT!;
// const EASEBUZZ_BASE_URL = process.env.EASEBUZZ_BASE_URL || 'https://testpay.easebuzz.in';

// export async function POST(request: Request) {
//   try {
//     const { txnid, amount, firstname, email, phone, productinfo } = await request.json();

//     if (!EASEBUZZ_KEY || !EASEBUZZ_SALT) {
//       return NextResponse.json(
//         { error: 'Easebuzz credentials not configured' },
//         { status: 500 }
//       );
//     }

//     // Generate hash sequence: key|txnid|amount|productinfo|firstname|email|||||||||||salt
//     const hashString = `${EASEBUZZ_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${EASEBUZZ_SALT}`;
    
//     const hash = crypto
//       .createHash('sha512')
//       .update(hashString)
//       .digest('hex');

//     console.log('Generated hash for txnid:', txnid);

//     // Prepare form data for Easebuzz API
//     const formData = new URLSearchParams({
//       key: EASEBUZZ_KEY,
//       txnid: txnid,
//       amount: amount,
//       productinfo: productinfo,
//       firstname: firstname,
//       email: email,
//       phone: phone,
//       surl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
//       furl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failure`,
//       hash: hash,
//       // UDF fields (optional) - leaving empty as per documentation
//       udf1: '',
//       udf2: '',
//       udf3: '',
//       udf4: '',
//       udf5: '',
//       udf6: '',
//       udf7: '',
//     });

//     console.log('Calling Easebuzz API with data:', {
//       key: EASEBUZZ_KEY,
//       txnid,
//       amount,
//       firstname,
//       email,
//       phone,
//     });

//     // Call Easebuzz Initiate Payment API
//     const response = await fetch(`${EASEBUZZ_BASE_URL}/payment/initiateLink`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Accept': 'application/json',
//       },
//       body: formData.toString(),
//     });

//     const result = await response.json();

//     console.log('Easebuzz API Response:', result);

//     if (result.status === 1 && result.data) {
//       // FIX: Easebuzz returns relative path, we need to construct full URL
//       let paymentUrl = result.data;
      
//       // Check if the response is a relative path
//       if (paymentUrl.startsWith('/')) {
//         paymentUrl = `${EASEBUZZ_BASE_URL}/pay${paymentUrl}`;
//       } else if (!paymentUrl.startsWith('http')) {
//         // If it's just a hash/token without leading slash
//         paymentUrl = `${EASEBUZZ_BASE_URL}/pay/${paymentUrl}`;
//       }

//       console.log('Constructed payment URL:', paymentUrl);

//       return NextResponse.json({
//         success: true,
//         paymentUrl: paymentUrl,
//         txnid: txnid,
//       });
//     } else {
//       // Failed to initiate payment
//       console.error('Easebuzz initiation failed:', result);
//       return NextResponse.json(
//         { 
//           error: 'Failed to initiate payment',
//           details: result.error || result.data || 'Unknown error',
//           fullResponse: result
//         },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error('Payment initiation error:', error);
//     return NextResponse.json(
//       { 
//         error: 'Payment initiation failed',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }














import { NextResponse } from 'next/server';
import crypto from 'crypto';

const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY!;
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT!;
const EASEBUZZ_BASE_URL = process.env.EASEBUZZ_BASE_URL || 'https://testpay.easebuzz.in';
const EASEBUZZ_PAYMENT_URL = process.env.EASEBUZZ_PAYMENT_URL || 'https://testpay.easebuzz.in/pay';

export async function POST(request: Request) {
  try {
    const { txnid, amount, firstname, email, phone, productinfo } = await request.json();

    if (!EASEBUZZ_KEY || !EASEBUZZ_SALT) {
      return NextResponse.json(
        { error: 'Easebuzz credentials not configured' },
        { status: 500 }
      );
    }

    // Trim all input values
    const cleanTxnid = txnid.trim();
    const cleanAmount = parseFloat(amount).toFixed(2);
    const cleanProductinfo = productinfo.trim();
    const cleanFirstname = firstname.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    // UDF fields - all empty
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

    // CORRECT Hash sequence with ALL 10 UDF fields
    // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
    const hashString = `${EASEBUZZ_KEY}|${cleanTxnid}|${cleanAmount}|${cleanProductinfo}|${cleanFirstname}|${cleanEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|${udf7}|${udf8}|${udf9}|${udf10}|${EASEBUZZ_SALT}`;
    
    const hash = crypto
      .createHash('sha512')
      .update(hashString)
      .digest('hex');

    console.log('=== HASH GENERATION DEBUG ===');
    console.log('Key:', EASEBUZZ_KEY);
    console.log('Txnid:', cleanTxnid);
    console.log('Amount:', cleanAmount);
    console.log('Productinfo:', cleanProductinfo);
    console.log('Firstname:', cleanFirstname);
    console.log('Email:', cleanEmail);
    console.log('Hash String:', hashString);
    console.log('Pipe count:', (hashString.match(/\|/g) || []).length);
    console.log('Generated Hash:', hash);
    console.log('=== END DEBUG ===');

    // Prepare callback URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const successUrl = `${baseUrl}/payment-success?txnid=${encodeURIComponent(cleanTxnid)}&email=${encodeURIComponent(cleanEmail)}`;
    const failureUrl = `${baseUrl}/payment-failure?txnid=${encodeURIComponent(cleanTxnid)}&email=${encodeURIComponent(cleanEmail)}`;

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append('key', EASEBUZZ_KEY);
    formData.append('txnid', cleanTxnid);
    formData.append('amount', cleanAmount);
    formData.append('productinfo', cleanProductinfo);
    formData.append('firstname', cleanFirstname);
    formData.append('email', cleanEmail);
    formData.append('phone', cleanPhone);
    formData.append('surl', successUrl);
    formData.append('furl', failureUrl);
    formData.append('hash', hash);
    
    // UDF fields - ALL 10 must be present (even if empty)
    formData.append('udf1', udf1);
    formData.append('udf2', udf2);
    formData.append('udf3', udf3);
    formData.append('udf4', udf4);
    formData.append('udf5', udf5);
    formData.append('udf6', udf6);
    formData.append('udf7', udf7);
    // Note: udf8, udf9, udf10 should NOT be sent in form data per Easebuzz docs
    // But they MUST be in the hash

    console.log('Form Data:', Object.fromEntries(formData.entries()));

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

    console.log('Easebuzz API Response:', JSON.stringify(result, null, 2));

    if (result.status === 1 && result.data) {
      // Construct full payment URL
      let paymentUrl = result.data;
      
      if (paymentUrl.startsWith('/')) {
        paymentUrl = `${EASEBUZZ_PAYMENT_URL}${paymentUrl}`;
      } else if (!paymentUrl.startsWith('http')) {
        paymentUrl = `${EASEBUZZ_PAYMENT_URL}/${paymentUrl}`;
      }

      console.log('Payment initiated successfully!');
      console.log('Final payment URL:', paymentUrl);

      return NextResponse.json({
        success: true,
        paymentUrl: paymentUrl,
        txnid: cleanTxnid,
      });
    } else {
      console.error('Easebuzz initiation failed:', result);
      return NextResponse.json(
        { 
          error: 'Failed to initiate payment',
          details: result.data || result.error || 'Unknown error',
          error_desc: result.error_desc,
          fullResponse: result
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { 
        error: 'Payment initiation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
