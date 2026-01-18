// // "use client";

// // interface PaymentTabProps {
// //   isFormLocked: boolean;
// //   isSubmitting: boolean;
// //   handlePayment: () => void;
// //   handleViewApplication: () => void;
// // }

// // export default function PaymentTab({
// //   isFormLocked,
// //   isSubmitting,
// //   handlePayment,
// //   handleViewApplication,
// // }: PaymentTabProps) {
// //   if (isFormLocked) {
// //     return (
// //       <div className="space-y-6 animate-fadeIn">
// //         <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
// //           <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
// //             <svg
// //               className="w-10 h-10 text-white"
// //               fill="none"
// //               stroke="currentColor"
// //               viewBox="0 0 24 24"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth={3}
// //                 d="M5 13l4 4L19 7"
// //               />
// //             </svg>
// //           </div>
// //           <h2 className="text-2xl font-bold text-green-700 mb-2">
// //             Application Submitted Successfully!
// //           </h2>
// //           <p className="text-green-600 mb-6">
// //             Your admission application has been successfully submitted and payment has been completed.
// //           </p>
// //           <button
// //             onClick={handleViewApplication}
// //             className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
// //           >
// //             Download Application
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6 animate-fadeIn">
// //       <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-8">
// //         <h2 className="text-2xl font-bold text-blue-900 mb-4">
// //           Payment Information
// //         </h2>
// //         <div className="space-y-3 mb-6">
// //           <div className="flex justify-between items-center">
// //             <span className="text-gray-700">Application Fee:</span>
// //             <span className="text-xl font-bold text-blue-600">₹1,000</span>
// //           </div>
// //           <div className="flex justify-between items-center text-sm text-gray-600">
// //             <span>Processing Fee:</span>
// //             <span>Included</span>
// //           </div>
// //           <hr className="my-4" />
// //           <div className="flex justify-between items-center">
// //             <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
// //             <span className="text-2xl font-bold text-blue-600">₹1,000</span>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-lg p-4 mb-6">
// //           <h3 className="font-semibold text-gray-800 mb-2">Payment Methods Accepted:</h3>
// //           <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
// //             <li>Credit/Debit Cards (Visa, Mastercard, RuPay)</li>
// //             <li>Net Banking</li>
// //             <li>UPI (Google Pay, PhonePe, Paytm)</li>
// //             <li>Wallets</li>
// //           </ul>
// //         </div>

// //         <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
// //           <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
// //           <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
// //             <li>Application fee is non-refundable</li>
// //             <li>Payment is processed securely through Razorpay</li>
// //             <li>You will receive a payment confirmation email</li>
// //             <li>Save your payment receipt for future reference</li>
// //           </ul>
// //         </div>

// //         <button
// //           onClick={handlePayment}
// //           disabled={isSubmitting}
// //           className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
// //         >
// //           {isSubmitting ? (
// //             <>
// //               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
// //               Processing...
// //             </>
// //           ) : (
// //             <>
// //               <svg
// //                 className="w-6 h-6 mr-2"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
// //                 />
// //               </svg>
// //               Proceed to Payment
// //             </>
// //           )}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


















// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { toast } from "react-hot-toast";

// interface PaymentTabProps {
//   isFormLocked: boolean;
//   isSubmitting: boolean;
//   handlePayment: () => void;
//   handleViewApplication: () => void;
// }

// export default function PaymentTab({
//   isFormLocked,
//   isSubmitting,
//   handlePayment,
//   handleViewApplication,
// }: PaymentTabProps) {
//   const searchParams = useSearchParams();
//   const userEmail = searchParams.get("email") || "";
  
//   const [hallTicketStatus, setHallTicketStatus] = useState<string | null>(null);
//   const [loadingHallTicket, setLoadingHallTicket] = useState(false);
//   const [downloadingHallTicket, setDownloadingHallTicket] = useState(false);

//   useEffect(() => {
//     if (isFormLocked && userEmail) {
//       checkHallTicketStatus();
//     }
//   }, [isFormLocked, userEmail]);

//   const checkHallTicketStatus = async () => {
//     setLoadingHallTicket(true);
//     try {
//       const response = await fetch(`/api/hall-ticket?email=${encodeURIComponent(userEmail)}`);
      
//       if (response.ok) {
//         const result = await response.json();
//         setHallTicketStatus(result.data?.status || null);
//       } else {
//         setHallTicketStatus(null);
//       }
//     } catch (error) {
//       console.error('Error checking hall ticket:', error);
//       setHallTicketStatus(null);
//     } finally {
//       setLoadingHallTicket(false);
//     }
//   };

//   const handleDownloadHallTicket = () => {
//     setDownloadingHallTicket(true);
    
//     // Open the hall ticket preview page in a new tab
//     // The page will handle the PDF generation
//     const hallTicketWindow = window.open(
//       `/hall-ticket-preview?email=${encodeURIComponent(userEmail)}`,
//       '_blank'
//     );
    
//     if (hallTicketWindow) {
//       toast.success('Opening hall ticket preview...');
//     } else {
//       toast.error('Please allow popups to download hall ticket');
//     }
    
//     setDownloadingHallTicket(false);
//   };

//   if (isFormLocked) {
//     return (
//       <div className="space-y-6 animate-fadeIn">
//         <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
//           <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg
//               className="w-10 h-10 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={3}
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-green-700 mb-2">
//             Application Submitted Successfully!
//           </h2>
//           <p className="text-green-600 mb-6">
//             Your admission application has been successfully submitted and payment has been completed.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             {/* Download Application Button */}
//             <button
//               onClick={handleViewApplication}
//               className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//               Download Application
//             </button>

//             {/* Download Hall Ticket Button - Show if allocated */}
//             {loadingHallTicket ? (
//               <div className="px-8 py-3 bg-gray-200 text-gray-500 rounded-lg font-semibold flex items-center gap-2">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
//                 Checking...
//               </div>
//             ) : hallTicketStatus === 'allocated' ? (
//               <button
//                 onClick={handleDownloadHallTicket}
//                 disabled={downloadingHallTicket}
//                 className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {downloadingHallTicket ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Opening...
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
//                       />
//                     </svg>
//                     Download Hall Ticket
//                   </>
//                 )}
//               </button>
//             ) : (
//               <div className="px-8 py-3 bg-yellow-50 border-2 border-yellow-400 text-yellow-700 rounded-lg font-semibold flex items-center gap-2">
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 Hall Ticket Pending
//               </div>
//             )}
//           </div>

//           {/* Hall Ticket Status Message */}
//           {hallTicketStatus === 'allocated' && (
//             <div className="mt-6 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-4">
//               <p className="text-green-800 font-semibold flex items-center justify-center gap-2">
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 Your Hall Ticket has been allocated! Click the button above to view and download.
//               </p>
//             </div>
//           )}

//           {!hallTicketStatus && !loadingHallTicket && (
//             <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-4">
//               <p className="text-blue-700 text-sm">
//                 <strong>Note:</strong> Your hall ticket will be available for download once the exam schedule is announced. Please check back later.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fadeIn">
//       <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-8">
//         <h2 className="text-2xl font-bold text-blue-900 mb-4">
//           Payment Information
//         </h2>
//         <div className="space-y-3 mb-6">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-700">Application Fee:</span>
//             <span className="text-xl font-bold text-blue-600">₹1,000</span>
//           </div>
//           <div className="flex justify-between items-center text-sm text-gray-600">
//             <span>Processing Fee:</span>
//             <span>Included</span>
//           </div>
//           <hr className="my-4" />
//           <div className="flex justify-between items-center">
//             <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
//             <span className="text-2xl font-bold text-blue-600">₹1,000</span>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg p-4 mb-6">
//           <h3 className="font-semibold text-gray-800 mb-2">Payment Methods Accepted:</h3>
//           <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
//             <li>Credit/Debit Cards (Visa, Mastercard, RuPay)</li>
//             <li>Net Banking</li>
//             <li>UPI (Google Pay, PhonePe, Paytm)</li>
//             <li>Wallets</li>
//           </ul>
//         </div>

//         <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
//           <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
//           <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
//             <li>Application fee is non-refundable</li>
//             <li>Payment is processed securely through Razorpay</li>
//             <li>You will receive a payment confirmation email</li>
//             <li>Save your payment receipt for future reference</li>
//           </ul>
//         </div>

//         <button
//           onClick={handlePayment}
//           disabled={isSubmitting}
//           className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
//         >
//           {isSubmitting ? (
//             <>
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//               Processing...
//             </>
//           ) : (
//             <>
//               <svg
//                 className="w-6 h-6 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                 />
//               </svg>
//               Proceed to Payment
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }












"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface PaymentTabProps {
  isFormLocked: boolean;
  isSubmitting: boolean;
  handlePayment: () => void;
  handleViewApplication: () => void;
  userName: string;
  userPhone: string;
}

export default function PaymentTab({
  isFormLocked,
  isSubmitting,
  handlePayment,
  handleViewApplication,
  userName,
  userPhone,
}: PaymentTabProps) {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email") || "";
  
  const [hallTicketStatus, setHallTicketStatus] = useState<string | null>(null);
  const [loadingHallTicket, setLoadingHallTicket] = useState(false);
  const [downloadingHallTicket, setDownloadingHallTicket] = useState(false);

  useEffect(() => {
    if (isFormLocked && userEmail) {
      checkHallTicketStatus();
    }
  }, [isFormLocked, userEmail]);

  const checkHallTicketStatus = async () => {
    setLoadingHallTicket(true);
    try {
      const response = await fetch(`/api/hall-ticket?email=${encodeURIComponent(userEmail)}`);
      
      if (response.ok) {
        const result = await response.json();
        setHallTicketStatus(result.data?.status || null);
      } else {
        setHallTicketStatus(null);
      }
    } catch (error) {
      console.error('Error checking hall ticket:', error);
      setHallTicketStatus(null);
    } finally {
      setLoadingHallTicket(false);
    }
  };

  const handleDownloadHallTicket = () => {
    setDownloadingHallTicket(true);
    
    const hallTicketWindow = window.open(
      `/hall-ticket-preview?email=${encodeURIComponent(userEmail)}`,
      '_blank'
    );
    
    if (hallTicketWindow) {
      toast.success('Opening hall ticket preview...');
    } else {
      toast.error('Please allow popups to download hall ticket');
    }
    
    setDownloadingHallTicket(false);
  };

  if (isFormLocked) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-white"
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
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-green-600 mb-6">
            Your admission application has been successfully submitted and payment has been completed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleViewApplication}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Application
            </button>

            {loadingHallTicket ? (
              <div className="px-8 py-3 bg-gray-200 text-gray-500 rounded-lg font-semibold flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                Checking...
              </div>
            ) : hallTicketStatus === 'allocated' ? (
              <button
                onClick={handleDownloadHallTicket}
                disabled={downloadingHallTicket}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloadingHallTicket ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Opening...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                    Download Hall Ticket
                  </>
                )}
              </button>
            ) : (
              <div className="px-8 py-3 bg-yellow-50 border-2 border-yellow-400 text-yellow-700 rounded-lg font-semibold flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Hall Ticket Pending
              </div>
            )}
          </div>

          {hallTicketStatus === 'allocated' && (
            <div className="mt-6 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-4">
              <p className="text-green-800 font-semibold flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Your Hall Ticket has been allocated! Click the button above to view and download.
              </p>
            </div>
          )}

          {!hallTicketStatus && !loadingHallTicket && (
            <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-4">
              <p className="text-blue-700 text-sm">
                <strong>Note:</strong> Your hall ticket will be available for download once the exam schedule is announced. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">
          Payment Information
        </h2>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Application Fee:</span>
            <span className="text-xl font-bold text-blue-600">₹1,000</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Processing Fee:</span>
            <span>Included</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">₹1,000</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Payment Methods Accepted:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Credit/Debit Cards (Visa, Mastercard, RuPay)</li>
            <li>Net Banking (50+ banks)</li>
            <li>UPI (Google Pay, PhonePe, Paytm)</li>
            <li>Wallets & EMI Options</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
          <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
            <li>Application fee is non-refundable</li>
            <li>Payment is processed securely through Easebuzz</li>
            <li>You will receive a payment confirmation email</li>
            <li>Save your payment receipt for future reference</li>
          </ul>
        </div>

        <button
          onClick={handlePayment}
          disabled={isSubmitting}
          className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processing...
            </>
          ) : (
            <>
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Proceed to Payment
            </>
          )}
        </button>
      </div>
    </div>
  );
}
