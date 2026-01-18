"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface EasebuzzCheckoutProps {
  amount: number;
  firstname: string;
  email: string;
  phone: string;
  productinfo: string;
  onClose: () => void;
}

export default function EasebuzzCheckout({
  amount,
  firstname,
  email,
  phone,
  productinfo,
  onClose,
}: EasebuzzCheckoutProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initiatePayment();
  }, []);

  const initiatePayment = async () => {
    try {
      const transactionId = `TXN${Date.now()}`;
      
      // Store txnid and email in localStorage for callback verification
      localStorage.setItem('easebuzz_pending_txnid', transactionId);
      localStorage.setItem('easebuzz_pending_email', email);
      
      // Call your backend to initiate Easebuzz payment
      const response = await fetch("/api/payment/easebuzz-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txnid: transactionId,
          amount: amount.toFixed(2),
          firstname: firstname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          productinfo: productinfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const data = await response.json();
      
      if (!data.success || !data.paymentUrl) {
        throw new Error(data.error || 'Failed to get payment URL');
      }

      console.log('Redirecting to payment URL:', data.paymentUrl);
      console.log('Stored txnid for callback:', transactionId);
      
      // Redirect to Easebuzz payment page
      window.location.href = data.paymentUrl;
      
    } catch (error) {
      console.error("Payment initiation error:", error);
      setError(error instanceof Error ? error.message : 'Failed to initiate payment');
      toast.error("Failed to initialize payment. Please try again.");
      setLoading(false);
      
      // Clear stored data on error
      localStorage.removeItem('easebuzz_pending_txnid');
      localStorage.removeItem('easebuzz_pending_email');
      
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Payment Initialization Failed
            </h3>
            <p className="text-gray-600 text-center text-sm mb-4">
              {error}
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Preparing Secure Payment
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Please wait while we connect to Easebuzz payment gateway...
          </p>
          <p className="text-sm text-gray-500 text-center">
            You will be redirected to the payment page shortly.
          </p>
          
          <button
            onClick={onClose}
            className="mt-6 w-full py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
