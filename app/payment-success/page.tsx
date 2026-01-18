"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Try to get txnid from URL params first
      let txnid = searchParams.get("txnid");
      let email = searchParams.get("email");

      // If not in URL, try localStorage (fallback)
      if (!txnid) {
        txnid = localStorage.getItem('easebuzz_pending_txnid');
        console.log('Retrieved txnid from localStorage:', txnid);
      }

      if (!email) {
        email = localStorage.getItem('easebuzz_pending_email');
        console.log('Retrieved email from localStorage:', email);
      }

      if (!txnid) {
        toast.error('Transaction ID not found. Please contact support.');
        setVerifying(false);
        return;
      }

      console.log('Verifying payment for txnid:', txnid);

      // Call your backend to verify with Easebuzz Transaction API
      const response = await fetch("/api/payment/verify-easebuzz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txnid, email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setVerified(true);
        setTransactionData(result.transaction);
        toast.success('Payment verified successfully!');
        
        // Clear stored data after successful verification
        localStorage.removeItem('easebuzz_pending_txnid');
        localStorage.removeItem('easebuzz_pending_email');
      } else {
        toast.error(result.error || 'Payment verification failed');
        setVerified(false);
        console.error('Verification failed:', result);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error('An error occurred during verification');
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Verifying your payment...</p>
          <p className="text-sm text-gray-500 mt-2">Please do not close this window</p>
        </div>
      </div>
    );
  }

  const email = searchParams.get("email") || transactionData?.email || localStorage.getItem('easebuzz_pending_email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {verified && transactionData ? (
          <>
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-green-700 mb-3">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your admission application fee has been paid successfully. Your application is now complete.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  <span className="font-mono">{transactionData.txnid}</span>
                </p>
                {transactionData.easepayid && (
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Payment ID:</span>{" "}
                    <span className="font-mono">{transactionData.easepayid}</span>
                  </p>
                )}
                {transactionData.bank_ref_num && (
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Bank Reference:</span>{" "}
                    <span className="font-mono">{transactionData.bank_ref_num}</span>
                  </p>
                )}
                {transactionData.mode && (
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Payment Mode:</span>{" "}
                    <span className="uppercase">{transactionData.mode}</span>
                  </p>
                )}
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Amount Paid:</span>{" "}
                  <span className="font-semibold">₹{transactionData.amount}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push(`/admission-form?email=${encodeURIComponent(email || '')}`)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                View Application
              </button>
              
              <button
                onClick={() => router.push(`/application-preview?email=${encodeURIComponent(email || '')}`)}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Download Application
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-red-700 mb-3">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please contact support if payment was deducted.
            </p>

            <button
              onClick={() => router.push(`/admission-form?email=${encodeURIComponent(email || '')}`)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Back to Application
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
