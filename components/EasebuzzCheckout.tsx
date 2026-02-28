// "use client";

// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";

// interface EasebuzzCheckoutProps {
//   amount: number;
//   firstname: string;
//   email: string;
//   phone: string;
//   productinfo: string;
//   onClose: () => void;
// }

// export default function EasebuzzCheckout({
//   amount,
//   firstname,
//   email,
//   phone,
//   productinfo,
//   onClose,
// }: EasebuzzCheckoutProps) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Validate amount before proceeding
//     if (!amount || amount <= 0) {
//       setError("Invalid payment amount. Please select an admission quota.");
//       setLoading(false);
//       toast.error("Invalid payment amount");
//       setTimeout(() => {
//         onClose();
//       }, 3000);
//       return;
//     }

//     initiatePayment();
//   }, []);

//   const initiatePayment = async () => {
//     try {
//       // Validate all required fields
//       if (!firstname || !email || !phone) {
//         throw new Error("Missing required user information");
//       }

//       const transactionId = `TXN${Date.now()}`;

//       // Store txnid and email in localStorage for callback verification
//       localStorage.setItem("easebuzz_pending_txnid", transactionId);
//       localStorage.setItem("easebuzz_pending_email", email);
//       localStorage.setItem("easebuzz_pending_amount", amount.toString());

//       console.log("Initiating payment with:", {
//         txnid: transactionId,
//         amount: amount.toFixed(2),
//         firstname: firstname.trim(),
//         email: email.trim(),
//         phone: phone.trim(),
//         productinfo: productinfo,
//       });

//       // Call your backend to initiate Easebuzz payment
//       const response = await fetch("/api/payment/easebuzz-hash", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           txnid: transactionId,
//           amount: amount.toFixed(2),
//           firstname: firstname.trim(),
//           email: email.trim(),
//           phone: phone.trim(),
//           productinfo: productinfo,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || "Failed to initiate payment");
//       }

//       const data = await response.json();

//       if (!data.success || !data.paymentUrl) {
//         throw new Error(data.error || "Failed to get payment URL");
//       }

//       console.log("Payment URL received:", data.paymentUrl);
//       console.log("Stored txnid for callback:", transactionId);

//       // Show success toast before redirect
//       toast.success("Redirecting to payment gateway...");

//       // Small delay to ensure toast is visible
//       setTimeout(() => {
//         // Redirect to Easebuzz payment page
//         window.location.href = data.paymentUrl;
//       }, 1000);
//     } catch (error) {
//       console.error("Payment initiation error:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to initiate payment";
//       setError(errorMessage);
//       toast.error(errorMessage);
//       setLoading(false);

//       // Clear stored data on error
//       localStorage.removeItem("easebuzz_pending_txnid");
//       localStorage.removeItem("easebuzz_pending_email");
//       localStorage.removeItem("easebuzz_pending_amount");

//       setTimeout(() => {
//         onClose();
//       }, 3000);
//     }
//   };

//   if (error) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-fadeIn">
//           <div className="flex flex-col items-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//               <svg
//                 className="w-8 h-8 text-red-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">
//               Payment Initialization Failed
//             </h3>
//             <p className="text-gray-600 text-center text-sm mb-4">{error}</p>
//             <button
//               onClick={onClose}
//               className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-fadeIn">
//         <div className="flex flex-col items-center">
//           {/* Animated payment icon */}
//           <div className="relative mb-6">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <svg
//                 className="w-8 h-8 text-blue-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
//                 />
//               </svg>
//             </div>
//           </div>

//           <h3 className="text-xl font-semibold text-gray-800 mb-2">
//             Preparing Secure Payment
//           </h3>
          
//           <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 w-full rounded">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-gray-700">Payment Amount:</span>
//               <span className="text-xl font-bold text-blue-600">₹{amount}</span>
//             </div>
//           </div>

//           <p className="text-gray-600 text-center mb-2">
//             Please wait while we connect to Easebuzz payment gateway...
//           </p>
//           <p className="text-sm text-gray-500 text-center mb-4">
//             You will be redirected to the payment page shortly.
//           </p>

//           {/* Security notice */}
//           <div className="flex items-center text-xs text-gray-500 mb-4">
//             <svg
//               className="w-4 h-4 mr-1 text-green-500"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Secure encrypted payment
//           </div>

//           <button
//             onClick={onClose}
//             className="mt-2 w-full py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }











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
    // Validate amount before proceeding
    const numAmount = Number(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Invalid payment amount. Please select an admission quota.");
      setLoading(false);
      toast.error("Invalid payment amount");
      setTimeout(() => {
        onClose();
      }, 3000);
      return;
    }

    initiatePayment();
  }, []);

  const initiatePayment = async () => {
    try {
      // Validate all required fields
      if (!firstname || !email || !phone) {
        throw new Error("Missing required user information");
      }

      // Convert amount to number if it's a string
      const numAmount = Number(amount);
      
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error("Invalid payment amount");
      }

      const transactionId = `TXN${Date.now()}`;

      // Store txnid and email in localStorage for callback verification
      localStorage.setItem("easebuzz_pending_txnid", transactionId);
      localStorage.setItem("easebuzz_pending_email", email);
      localStorage.setItem("easebuzz_pending_amount", numAmount.toString());

        txnid: transactionId,
        amount: numAmount.toFixed(2),
        firstname: firstname.trim(),
        email: email.trim(),
        phone: phone.trim(),
        productinfo: productinfo,
      });

      // Call your backend to initiate Easebuzz payment
      const response = await fetch("/api/payment/easebuzz-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txnid: transactionId,
          amount: numAmount.toFixed(2),
          firstname: firstname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          productinfo: productinfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to initiate payment");
      }

      const data = await response.json();

      if (!data.success || !data.paymentUrl) {
        throw new Error(data.error || "Failed to get payment URL");
      }


      // Show success toast before redirect
      toast.success("Redirecting to payment gateway...");

      // Small delay to ensure toast is visible
      setTimeout(() => {
        // Redirect to Easebuzz payment page
        window.location.href = data.paymentUrl;
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initiate payment";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);

      // Clear stored data on error
      localStorage.removeItem("easebuzz_pending_txnid");
      localStorage.removeItem("easebuzz_pending_email");
      localStorage.removeItem("easebuzz_pending_amount");

      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-fadeIn">
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
            <p className="text-gray-600 text-center text-sm mb-4">{error}</p>
            <button
              onClick={onClose}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-fadeIn">
        <div className="flex flex-col items-center">
          {/* Animated payment icon */}
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Preparing Secure Payment
          </h3>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 w-full rounded">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Payment Amount:</span>
              <span className="text-xl font-bold text-blue-600">
                ₹{Number(amount).toFixed(0)}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-center mb-2">
            Please wait while we connect to Easebuzz payment gateway...
          </p>
          <p className="text-sm text-gray-500 text-center mb-4">
            You will be redirected to the payment page shortly.
          </p>

          {/* Security notice */}
          <div className="flex items-center text-xs text-gray-500 mb-4">
            <svg
              className="w-4 h-4 mr-1 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Secure encrypted payment
          </div>

          <button
            onClick={onClose}
            className="mt-2 w-full py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
