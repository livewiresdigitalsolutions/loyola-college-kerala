// "use client";

// import React, { useEffect, useState } from 'react';

// interface PaymentTabProps {
//   isFormLocked: boolean;
//   isSubmitting: boolean;
//   handlePayment: () => void;
//   handleViewApplication: () => void;
//   userName: string;
//   userPhone: string;
//   form: any;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// export default function PaymentTab({
//   isFormLocked,
//   isSubmitting,
//   handlePayment,
//   handleViewApplication,
//   userName,
//   userPhone,
//   form,
//   handleChange
// }: PaymentTabProps) {
//   const [selectedQuota, setSelectedQuota] = useState(form.admission_quota || "");
//   const [subOption, setSubOption] = useState(form.category || "");
//   const [calculatedFee, setCalculatedFee] = useState(0);

//   // Calculate fee based on selection
//   useEffect(() => {
//     let fee = 0;
//     if (selectedQuota === "general_merit") {
//       if (subOption === "SC/ST") {
//         fee = 300;
//       } else if (subOption === "Others") {
//         fee = 550;
//       }
//     } else if (selectedQuota === "management") {
//       fee = 750;
//     }
//     setCalculatedFee(fee);
    
//     // Update form with calculated fee
//     const syntheticEvent = {
//       target: { name: 'application_fee', value: fee.toString() }
//     } as React.ChangeEvent<HTMLInputElement>;
//     handleChange(syntheticEvent);
//   }, [selectedQuota, subOption]);

//   const handleQuotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSelectedQuota(value);
    
//     // Reset sub-option when changing quota type
//     if (value === "management") {
//       setSubOption("");
//     }
    
//     // Update form state
//     const syntheticEvent = {
//       target: { name: 'admission_quota', value }
//     } as React.ChangeEvent<HTMLInputElement>;
//     handleChange(syntheticEvent);
//   };

//   const handleSubOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSubOption(value);
    
//     // Update form state
//     const syntheticEvent = {
//       target: { name: 'category', value }
//     } as React.ChangeEvent<HTMLInputElement>;
//     handleChange(syntheticEvent);
//   };

//   if (isFormLocked) {
//     return (
//       <div className="space-y-6">
//         <div className="text-center py-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//             <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Completed!</h3>
//           <p className="text-gray-600 mb-6">Your application has been submitted successfully.</p>
//           <button
//             onClick={handleViewApplication}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//           >
//             View Application
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Details</h2>
//         <p className="text-gray-600">Select your admission quota and complete the payment</p>
//       </div>

//       {/* Admission Quota Selection */}
//       <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//         <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Admission Quota</h3>
        
//         <div className="space-y-4">
//           {/* General Merit Option */}
//           <div className={`border-2 rounded-lg p-4 transition-all duration-200 ${
//             selectedQuota === "general_merit" 
//               ? "border-blue-500 bg-blue-50 shadow-md" 
//               : "border-gray-200 bg-white hover:border-blue-300"
//           }`}>
//             <label className="flex items-center cursor-pointer">
//               <input
//                 type="radio"
//                 name="admission_quota"
//                 value="general_merit"
//                 checked={selectedQuota === "general_merit"}
//                 onChange={handleQuotaChange}
//                 className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
//               />
//               <span className="ml-3 text-lg font-semibold text-gray-800">General Merit</span>
//             </label>
            
//             {/* Sub-options for General Merit */}
//             {selectedQuota === "general_merit" && (
//               <div className="ml-8 mt-4 space-y-3 animate-fadeIn">
//                 <label className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all ${
//                   subOption === "SC/ST" 
//                     ? "bg-blue-100 border-2 border-blue-400" 
//                     : "bg-white border-2 border-gray-200 hover:bg-blue-50"
//                 }`}>
//                   <div className="flex items-center">
//                     <input
//                       type="radio"
//                       name="category"
//                       value="SC/ST"
//                       checked={subOption === "SC/ST"}
//                       onChange={handleSubOptionChange}
//                       className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
//                     />
//                     <span className="ml-3 text-gray-700 font-medium">SC/ST</span>
//                   </div>
//                   <span className="font-bold text-blue-600 text-lg">₹300</span>
//                 </label>
                
//                 <label className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all ${
//                   subOption === "Others" 
//                     ? "bg-blue-100 border-2 border-blue-400" 
//                     : "bg-white border-2 border-gray-200 hover:bg-blue-50"
//                 }`}>
//                   <div className="flex items-center">
//                     <input
//                       type="radio"
//                       name="category"
//                       value="Others"
//                       checked={subOption === "Others"}
//                       onChange={handleSubOptionChange}
//                       className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
//                     />
//                     <span className="ml-3 text-gray-700 font-medium">Others</span>
//                   </div>
//                   <span className="font-bold text-blue-600 text-lg">₹550</span>
//                 </label>
//               </div>
//             )}
//           </div>

//           {/* Management Option */}
//           <div className={`border-2 rounded-lg p-4 transition-all duration-200 ${
//             selectedQuota === "management" 
//               ? "border-blue-500 bg-blue-50 shadow-md" 
//               : "border-gray-200 bg-white hover:border-blue-300"
//           }`}>
//             <label className="flex items-center justify-between cursor-pointer">
//               <div className="flex items-center">
//                 <input
//                   type="radio"
//                   name="admission_quota"
//                   value="management"
//                   checked={selectedQuota === "management"}
//                   onChange={handleQuotaChange}
//                   className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
//                 />
//                 <span className="ml-3 text-lg font-semibold text-gray-800">Management</span>
//               </div>
//               <span className="font-bold text-blue-600 text-lg">₹750</span>
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Fee Summary */}
//       {calculatedFee > 0 && (
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 shadow-sm">
//           <div className="flex justify-between items-center mb-3">
//             <span className="text-gray-700 font-semibold text-lg">Application Fee:</span>
//             <span className="text-3xl font-bold text-blue-600">₹{calculatedFee}</span>
//           </div>
//           <div className="flex items-center text-sm text-gray-600 bg-white/50 rounded px-3 py-2">
//             <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//             </svg>
//             <span>
//               Selected: <strong>{selectedQuota === "general_merit" ? `General Merit (${subOption})` : "Management"}</strong>
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Applicant Details */}
//       <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//         <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
//           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//           </svg>
//           Applicant Details
//         </h3>
//         <div className="space-y-3 text-sm">
//           <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
//             <span className="text-gray-600 font-medium">Name:</span>
//             <span className="font-semibold text-gray-800">{userName || "Not provided"}</span>
//           </div>
//           <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
//             <span className="text-gray-600 font-medium">Phone:</span>
//             <span className="font-semibold text-gray-800">{userPhone || "Not provided"}</span>
//           </div>
//         </div>
//       </div>

//       {/* Important Notice */}
//       <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
//         <div className="flex">
//           <div className="flex-shrink-0">
//             <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div className="ml-3">
//             <p className="text-sm text-yellow-700">
//               <strong>Important:</strong> Please verify your admission quota selection before proceeding to payment. This selection cannot be changed after payment.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Payment Button */}
//       <div className="pt-4">
//         <button
//           onClick={handlePayment}
//           disabled={isSubmitting || calculatedFee === 0}
//           className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-bold text-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//         >
//           {isSubmitting ? (
//             <>
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//               Processing Payment...
//             </>
//           ) : (
//             <>
//               <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//               </svg>
//               Proceed to Payment {calculatedFee > 0 && `(₹${calculatedFee})`}
//             </>
//           )}
//         </button>
//         {calculatedFee === 0 && (
//           <div className="mt-3 flex items-center justify-center text-sm text-red-600">
//             <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             Please select an admission quota to proceed
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }















"use client";

import React, { useEffect, useState } from 'react';

interface PaymentTabProps {
  isFormLocked: boolean;
  isSubmitting: boolean;
  handlePayment: () => void;
  handleViewApplication: () => void;
  userName: string;
  userPhone: string;
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PaymentTab({
  isFormLocked,
  isSubmitting,
  handlePayment,
  handleViewApplication,
  userName,
  userPhone,
  form,
  handleChange
}: PaymentTabProps) {
  const [selectedQuota, setSelectedQuota] = useState(form.admission_quota || "");
  const [subOption, setSubOption] = useState(form.category || "");
  const [calculatedFee, setCalculatedFee] = useState(0);

  // Calculate fee based on selection
  useEffect(() => {
    let fee = 0;
    if (selectedQuota === "general_merit") {
      if (subOption === "SC/ST") {
        fee = 300;
      } else if (subOption === "Others") {
        fee = 550;
      }
    } else if (selectedQuota === "management") {
      fee = 750;
    }
    setCalculatedFee(fee);
    
    // Update form with calculated fee
    const syntheticEvent = {
      target: { name: 'application_fee', value: fee.toString() }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(syntheticEvent);
  }, [selectedQuota, subOption]);

  const handleQuotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedQuota(value);
    
    // Reset sub-option when changing quota type
    if (value === "management") {
      setSubOption("");
    }
    
    // Update form state
    const syntheticEvent = {
      target: { name: 'admission_quota', value }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(syntheticEvent);
  };

  const handleSubOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubOption(value);
    
    // Update form state
    const syntheticEvent = {
      target: { name: 'category', value }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(syntheticEvent);
  };

  if (isFormLocked) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Completed!</h3>
          <p className="text-gray-600 mb-6">Your application has been submitted successfully.</p>
          <button
            onClick={handleViewApplication}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            View Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Details</h2>
        <p className="text-gray-600">Select your admission quota and complete the payment</p>
      </div>

      {/* Admission Quota Selection */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Admission Quota</h3>
        
        <div className="space-y-4">
          {/* General Merit Option */}
          <div className={`border-2 rounded-lg p-4 transition-all duration-200 ${
            selectedQuota === "general_merit" 
              ? "border-blue-500 bg-blue-50 shadow-md" 
              : "border-gray-200 bg-white hover:border-blue-300"
          }`}>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="admission_quota"
                value="general_merit"
                checked={selectedQuota === "general_merit"}
                onChange={handleQuotaChange}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-3 text-lg font-semibold text-gray-800">General Merit</span>
            </label>
            
            {/* Sub-options for General Merit */}
            {selectedQuota === "general_merit" && (
              <div className="ml-8 mt-4 space-y-3 animate-fadeIn">
                <label className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all ${
                  subOption === "SC/ST" 
                    ? "bg-blue-100 border-2 border-blue-400" 
                    : "bg-white border-2 border-gray-200 hover:bg-blue-50"
                }`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="SC/ST"
                      checked={subOption === "SC/ST"}
                      onChange={handleSubOptionChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-700 font-medium">SC/ST</span>
                  </div>
                  <span className="font-bold text-blue-600 text-lg">₹300</span>
                </label>
                
                <label className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all ${
                  subOption === "Others" 
                    ? "bg-blue-100 border-2 border-blue-400" 
                    : "bg-white border-2 border-gray-200 hover:bg-blue-50"
                }`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="Others"
                      checked={subOption === "Others"}
                      onChange={handleSubOptionChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Others</span>
                  </div>
                  <span className="font-bold text-blue-600 text-lg">₹550</span>
                </label>
              </div>
            )}
          </div>

          {/* Management Option */}
          <div className={`border-2 rounded-lg p-4 transition-all duration-200 ${
            selectedQuota === "management" 
              ? "border-blue-500 bg-blue-50 shadow-md" 
              : "border-gray-200 bg-white hover:border-blue-300"
          }`}>
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="admission_quota"
                  value="management"
                  checked={selectedQuota === "management"}
                  onChange={handleQuotaChange}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-3 text-lg font-semibold text-gray-800">Management</span>
              </div>
              <span className="font-bold text-blue-600 text-lg">₹750</span>
            </label>
          </div>
        </div>
      </div>

      {/* Fee Summary */}
      {calculatedFee > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-semibold text-lg">Application Fee:</span>
            <span className="text-3xl font-bold text-blue-600">₹{calculatedFee}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 bg-white/50 rounded px-3 py-2">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Selected: <strong>{selectedQuota === "general_merit" ? `General Merit (${subOption})` : "Management"}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Applicant Details */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Applicant Details
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
            <span className="text-gray-600 font-medium">Name:</span>
            <span className="font-semibold text-gray-800">{userName || "Not provided"}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
            <span className="text-gray-600 font-medium">Phone:</span>
            <span className="font-semibold text-gray-800">{userPhone || "Not provided"}</span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Important:</strong> Please verify your admission quota selection before proceeding to payment. This selection cannot be changed after payment.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="pt-4">
        <button
          onClick={handlePayment}
          disabled={isSubmitting || calculatedFee === 0}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-bold text-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Proceed to Payment {calculatedFee > 0 && `(₹${calculatedFee})`}
            </>
          )}
        </button>
        {calculatedFee === 0 && (
          <div className="mt-3 flex items-center justify-center text-sm text-red-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Please select an admission quota to proceed
          </div>
        )}
      </div>
    </div>
  );
}
