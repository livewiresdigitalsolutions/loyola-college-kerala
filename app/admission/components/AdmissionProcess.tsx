
// // "use client";
// // import React from "react";
// // import { CheckCircle2, FileText, UserCheck, Send, Upload, Calendar } from "lucide-react";

// // export default function AdmissionProcess() {
// //   return (
// //     <>
// //       {/* APPLICATION PROCESS SECTION */}
// //       <section className="w-full bg-white py-16">
// //         <div className="max-w-7xl mx-auto px-6">
// //           {/* SECTION HEADER */}
// //           <div className="text-center mb-20">
// //             <div className="inline-block">
// //               <div className="flex items-center gap-3 mb-4 justify-center">
// //                 <div className="w-12 h-[2px] bg-green-600"></div>
// //                 <span className="text-green-600 font-semibold tracking-wider text-sm">
// //                   SIMPLE & STREAMLINED
// //                 </span>
// //                 <div className="w-12 h-[2px] bg-green-600"></div>
// //               </div>
// //             </div>
// //             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
// //               Your Application Journey
// //             </h2>
// //             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
// //               Four easy steps to begin your academic excellence
// //             </p>
// //           </div>

// //           {/* STEPS GRID */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
// //             {/* STEP 1 */}
// //             <div className="group relative overflow-hidden rounded-2xl">
// //               {/* CARD */}
// //               <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 h-full transition-all duration-300">
// //                 {/* EXPANDING BACKGROUND CIRCLE - STARTS FROM NUMBER POSITION */}
// //                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-600/5 rounded-full group-hover:scale-[20] transition-transform duration-1000 ease-in-out"></div>

// //                 {/* STEP NUMBER - PART OF THE EXPANDING CIRCLE */}
// //                 <div className="absolute -top-12 -right-12 w-24 h-24 flex items-end justify-start pl-3 pb-3 z-20">
// //                   <span className="text-xl font-bold text-green-600">01</span>
// //                 </div>

// //                 {/* ICON - TOP LEFT */}
// //                 <div className="relative z-10 mb-8">
// //                   <div className="w-14 h-14 bg-green-600/10 rounded-xl flex items-center justify-center">
// //                     <UserCheck className="w-7 h-7 text-green-600" />
// //                   </div>
// //                 </div>

// //                 {/* CONTENT */}
// //                 <div className="relative z-10">
// //                   <h3 className="text-xl font-bold text-gray-800 mb-3">
// //                     Create Account
// //                   </h3>
// //                   <p className="text-gray-600 leading-relaxed mb-4 text-sm">
// //                     Register with your email and verify to access your personal
// //                     application portal instantly.
// //                   </p>

// //                   {/* DURATION TAG */}
// //                   <div className="inline-flex items-center gap-2 text-xs text-gray-500">
// //                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
// //                     <span>2 minutes</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* STEP 2 */}
// //             <div className="group relative overflow-hidden rounded-2xl">
// //               <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 h-full transition-all duration-300">
// //                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-600/5 rounded-full group-hover:scale-[20] transition-transform duration-1000 ease-in-out"></div>

// //                 <div className="absolute -top-12 -right-12 w-24 h-24 flex items-end justify-start pl-3 pb-3 z-20">
// //                   <span className="text-xl font-bold text-green-600">02</span>
// //                 </div>

// //                 <div className="relative z-10 mb-8">
// //                   <div className="w-14 h-14 bg-green-600/10 rounded-xl flex items-center justify-center">
// //                     <FileText className="w-7 h-7 text-green-600" />
// //                   </div>
// //                 </div>

// //                 <div className="relative z-10">
// //                   <h3 className="text-xl font-bold text-gray-800 mb-3">
// //                     Fill Application
// //                   </h3>
// //                   <p className="text-gray-600 leading-relaxed mb-4 text-sm">
// //                     Complete your personal and academic details. Save progress and
// //                     return anytime before submission.
// //                   </p>

// //                   <div className="inline-flex items-center gap-2 text-xs text-gray-500">
// //                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
// //                     <span>15 minutes</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* STEP 3 */}
// //             <div className="group relative overflow-hidden rounded-2xl">
// //               <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 h-full transition-all duration-300">
// //                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-600/5 rounded-full group-hover:scale-[20] transition-transform duration-1000 ease-in-out"></div>

// //                 <div className="absolute -top-12 -right-12 w-24 h-24 flex items-end justify-start pl-3 pb-3 z-20">
// //                   <span className="text-xl font-bold text-green-600">03</span>
// //                 </div>

// //                 <div className="relative z-10 mb-8">
// //                   <div className="w-14 h-14 bg-green-600/10 rounded-xl flex items-center justify-center">
// //                     <Upload className="w-7 h-7 text-green-600" />
// //                   </div>
// //                 </div>

// //                 <div className="relative z-10">
// //                   <h3 className="text-xl font-bold text-gray-800 mb-3">
// //                     Upload Documents
// //                   </h3>
// //                   <p className="text-gray-600 leading-relaxed mb-4 text-sm">
// //                     Submit required certificates, mark sheets, and photographs in
// //                     supported formats (PDF/JPG).
// //                   </p>

// //                   <div className="inline-flex items-center gap-2 text-xs text-gray-500">
// //                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
// //                     <span>5 minutes</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* STEP 4 */}
// //             <div className="group relative overflow-hidden rounded-2xl">
// //               <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 h-full transition-all duration-300">
// //                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-600/5 rounded-full group-hover:scale-[20] transition-transform duration-1000 ease-in-out"></div>

// //                 <div className="absolute -top-12 -right-12 w-24 h-24 flex items-end justify-start pl-3 pb-3 z-20">
// //                   <span className="text-xl font-bold text-green-600">04</span>
// //                 </div>

// //                 <div className="relative z-10 mb-8">
// //                   <div className="w-14 h-14 bg-green-600/10 rounded-xl flex items-center justify-center">
// //                     <Send className="w-7 h-7 text-green-600" />
// //                   </div>
// //                 </div>

// //                 <div className="relative z-10">
// //                   <h3 className="text-xl font-bold text-gray-800 mb-3">
// //                     Submit & Pay
// //                   </h3>
// //                   <p className="text-gray-600 leading-relaxed mb-4 text-sm">
// //                     Review your application, pay the fee securely, and receive
// //                     instant confirmation via email.
// //                   </p>

// //                   <div className="inline-flex items-center gap-2 text-xs text-gray-500">
// //                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
// //                     <span>3 minutes</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* BOTTOM NOTE
// //           <div className="mt-16 text-center">
// //             <div className="inline-flex items-center gap-3 bg-gray-50 px-8 py-4 rounded-full">
// //               <CheckCircle2 className="w-6 h-6 text-green-600" />
// //               <span className="text-gray-700 font-medium">
// //                 Total Time: Approximately 25 minutes to complete your entire
// //                 application
// //               </span>
// //             </div>
// //           </div> */}
// //         </div>
// //       </section>

// //       {/* <section className="w-full bg-green-600/5 py-20">
// //         <div className="max-w-7xl mx-auto px-6">
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
// //             <div>
// //               <h2 className="text-3xl font-bold text-green-600 mb-8">
// //                 Eligibility Criteria
// //               </h2>
// //               <div className="space-y-4">
// //                 <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
// //                   <h3 className="font-bold text-lg text-gray-800 mb-2">
// //                     Undergraduate Programs
// //                   </h3>
// //                   <p className="text-gray-600">
// //                     Passed 10+2 or equivalent examination from a recognized board
// //                     with minimum 60% aggregate marks in relevant subjects.
// //                   </p>
// //                 </div>
// //                 <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
// //                   <h3 className="font-bold text-lg text-gray-800 mb-2">
// //                     Postgraduate Programs
// //                   </h3>
// //                   <p className="text-gray-600">
// //                     Completed Bachelor's degree in relevant discipline with
// //                     minimum 55% marks from a recognized university.
// //                   </p>
// //                 </div>
// //                 <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
// //                   <h3 className="font-bold text-lg text-gray-800 mb-2">
// //                     Reserved Categories
// //                   </h3>
// //                   <p className="text-gray-600">
// //                     Relaxation of 5% in minimum marks for SC/ST/OBC candidates as
// //                     per government regulations.
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

           
// //             <div>
// //               <h2 className="text-3xl font-bold text-green-600 mb-8">
// //                 Documents Required
// //               </h2>
// //               <div className="bg-white rounded-xl p-8 shadow-sm">
// //                 <ul className="space-y-4">
// //                   <li className="flex items-start gap-3">
// //                     <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
// //                     <span className="text-gray-700">
// //                       Recent passport-size photographs (2 copies)
// //                     </span>
// //                   </li>
// //                   <li className="flex items-start gap-3">
// //                     <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
// //                     <span className="text-gray-700">
// //                       10th and 12th mark sheets and certificates
// //                     </span>
// //                   </li>
// //                   <li className="flex items-start gap-3">
// //                     <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
// //                     <span className="text-gray-700">
// //                       Transfer certificate from last institution attended
// //                     </span>
// //                   </li>
// //                   <li className="flex items-start gap-3">
// //                     <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
// //                     <span className="text-gray-700">
// //                       Character certificate from school/college
// //                     </span>
// //                   </li>
// //                   <li className="flex items-start gap-3">
// //                     <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
// //                     <span className="text-gray-700">
// //                       Aadhar card and birth certificate
// //                     </span>
// //                   </li>
// //                   <li className="flex items-start gap-3">
// //                     <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
// //                     <span className="text-gray-700">
// //                       Caste certificate (if applicable for reserved categories)
// //                     </span>
// //                   </li>
// //                 </ul>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section> */}

// //       {/* <section className="w-full bg-white py-20">
// //         <div className="max-w-7xl mx-auto px-6">
// //           <h2 className="text-4xl font-bold text-center text-gray-700 mb-16">
// //             Important Dates
// //           </h2>

// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //             <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
// //               <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
// //                 <Calendar className="w-8 h-8 text-green-600" />
// //               </div>
// //               <h3 className="text-xl font-bold text-gray-800 mb-2">
// //                 Application Opens
// //               </h3>
// //               <p className="text-3xl font-bold text-green-600 mb-2">March 1</p>
// //               <p className="text-gray-600">2026</p>
// //             </div>

// //             <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
// //               <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
// //                 <Calendar className="w-8 h-8 text-green-600" />
// //               </div>
// //               <h3 className="text-xl font-bold text-gray-800 mb-2">
// //                 Last Date to Apply
// //               </h3>
// //               <p className="text-3xl font-bold text-green-600 mb-2">May 31</p>
// //               <p className="text-gray-600">2026</p>
// //             </div>

// //             <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
// //               <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
// //                 <Calendar className="w-8 h-8 text-green-600" />
// //               </div>
// //               <h3 className="text-xl font-bold text-gray-800 mb-2">
// //                 Admission Begins
// //               </h3>
// //               <p className="text-3xl font-bold text-green-600 mb-2">July 15</p>
// //               <p className="text-gray-600">2026</p>
// //             </div>
// //           </div>
// //         </div>
// //       </section> */}
// //     </>
// //   );
// // }











// "use client";
// import React from "react";
// import { CheckCircle2, FileText, UserCheck, Send, Upload, Calendar } from "lucide-react";

// export default function AdmissionProcess() {
//   return (
//     <>
//       {/* APPLICATION PROCESS SECTION */}
//       <section className="w-full bg-white py-16">
//         <div className="max-w-7xl mx-auto px-6">
//           {/* SECTION HEADER */}
//           <div className="text-center mb-20">
//             <div className="inline-block">
//               <div className="flex items-center gap-3 mb-4 justify-center">
//                 <div className="w-12 h-[2px] bg-green-600"></div>
//                 <span className="text-green-600 font-semibold tracking-wider text-sm">
//                   SIMPLE & STREAMLINED
//                 </span>
//                 <div className="w-12 h-[2px] bg-green-600"></div>
//               </div>
//             </div>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
//               Your Application Journey
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Four easy steps to begin your academic excellence
//             </p>
//           </div>

//           {/* STEPS GRID */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {/* STEP 1 */}
//             <div className="group relative overflow-hidden rounded-2xl">
//               {/* CARD */}
//               <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 h-full transition-all duration-300">
//                 {/* EXPANDING BACKGROUND CIRCLE - STARTS FROM NUMBER POSITION */}
//                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-600/5 rounded-full group-hover:scale-[20] transition-transform duration-1000 ease-in-out"></div>

//                 {/* STEP NUMBER - PART OF THE EXPANDING CIRCLE */}
//                 <div className="absolute -top-12 -right-12 w-24 h-24 flex items-end justify-start pl-3 pb-3 z-20">
//                   <span className="text-xl font-bold text-green-600">01</span>
//                 </div>

//                 {/* ICON - TOP LEFT */}
//                 <div className="relative z-10 mb-8">
//                   <div className="w-14 h-14 bg-green-600/10 rounded-xl flex items-center justify-center">
//                     <UserCheck className="w-7 h-7 text-green-600" />
//                   </div>
//                 </div>

//                 {/* CONTENT */}
//                 <div className="relative z-10">
//                   <h3 className="text-xl font-bold text-gray-800 mb-3">
//                     Create Account
//                   </h3>
//                   <p className="text-gray-600 leading-relaxed mb-4 text-sm">
//                     Register with your email and verify to access your personal
//                     application portal instantly.
//                   </p>

//                   {/* DURATION TAG */}
//                   <div className="inline-flex items-center gap-2 text-xs text-gray-500">
//                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
//                     <span>2 minutes</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* STEP 2 */}
//             <div className="group relative overflow-hidden rounded-2xl">
//               <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 h-full transition-all duration-300">
//                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-600/5 rounded-full group-hover:scale-[20] transition-transform duration-1000 ease-in-out"></div>

//                 <div className="absolute -top-12 -right-12 w-24 h-24 flex items-end justify-start pl-3 pb-3 z-20">
//                   <span className="text-xl font-bold text-green-600">02</span>
//                 </div>

//                 <div className="relative z-10 mb-8">
//                   <div className="w-14 h-14 bg-green-600/10 rounded-xl flex items-center justify-center">
//                     <FileText className="w-7 h-7 text-green-600" />
//                   </div>
//                 </div>

//                 <div className="relative z-10">
//                   <h3 className="text-xl font-bold text-gray-800 mb-3">
//                     Fill Application
//                   </h3>
//                   <p className="text-gray-600 leading-relaxed mb-4 text-sm">
//                     Complete your personal and academic details. Save progress and
//                     return anytime before submission.
//                   </p>

//                   <div className="inline-flex items-center gap-2 text-xs text-gray-500">
//                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
//                     <span>15 minutes</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* STEP 3 */}
//             <div className="group relative overflow-hidden rounded-2xl">
//               <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 h-full transition-all duration-300">
//                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-600/5 rounded-full group-hover:scale-[20] transition-transform duration-1000 ease-in-out"></div>

//                 <div className="absolute -top-12 -right-12 w-24 h-24 flex items-end justify-start pl-3 pb-3 z-20">
//                   <span className="text-xl font-bold text-green-600">03</span>
//                 </div>

//                 <div className="relative z-10 mb-8">
//                   <div className="w-14 h-14 bg-green-600/10 rounded-xl flex items-center justify-center">
//                     <Upload className="w-7 h-7 text-green-600" />
//                   </div>
//                 </div>

//                 <div className="relative z-10">
//                   <h3 className="text-xl font-bold text-gray-800 mb-3">
//                     Upload Documents
//                   </h3>
//                   <p className="text-gray-600 leading-relaxed mb-4 text-sm">
//                     Submit required certificates, mark sheets, and photographs in
//                     supported formats (PDF/JPG).
//                   </p>

//                   <div className="inline-flex items-center gap-2 text-xs text-gray-500">
//                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
//                     <span>5 minutes</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* STEP 4 */}
//             <div className="group relative overflow-hidden rounded-2xl">
//               <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 h-full transition-all duration-300">
//                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-600/5 rounded-full group-hover:scale-[20] transition-transform duration-1000 ease-in-out"></div>

//                 <div className="absolute -top-12 -right-12 w-24 h-24 flex items-end justify-start pl-3 pb-3 z-20">
//                   <span className="text-xl font-bold text-green-600">04</span>
//                 </div>

//                 <div className="relative z-10 mb-8">
//                   <div className="w-14 h-14 bg-green-600/10 rounded-xl flex items-center justify-center">
//                     <Send className="w-7 h-7 text-green-600" />
//                   </div>
//                 </div>

//                 <div className="relative z-10">
//                   <h3 className="text-xl font-bold text-gray-800 mb-3">
//                     Submit & Pay
//                   </h3>
//                   <p className="text-gray-600 leading-relaxed mb-4 text-sm">
//                     Review your application, pay the fee securely, and receive
//                     instant confirmation via email.
//                   </p>

//                   <div className="inline-flex items-center gap-2 text-xs text-gray-500">
//                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
//                     <span>3 minutes</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }









"use client";
import React from "react";
import { UserPlus, LogIn, FileText, CreditCard, Download, Calendar } from "lucide-react";

export default function AdmissionProcess() {
  return (
    <>
      {/* APPLICATION PROCESS SECTION */}
      <section className="w-full bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* SECTION HEADER */}
          <div className="text-center mb-20">
            <div className="inline-block">
              <div className="flex items-center gap-3 mb-4 justify-center">
                <div className="w-12 h-[2px] bg-primary"></div>
                <span className="text-primary font-semibold tracking-wider text-sm">
                  SIMPLE & STREAMLINED
                </span>
                <div className="w-12 h-[2px] bg-green-600"></div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Your Application Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Five easy steps to begin your academic excellence
            </p>
          </div>

          {/* STEPPER CONTAINER */}
          <div className="relative">
            {/* HORIZONTAL PROGRESS LINE */}
            <div className="absolute top-12 left-0 right-0 h-[2px] bg-gray-200 hidden lg:block">
              <div className="h-full w-0 bg-green-600 transition-all duration-500"></div>
            </div>

            {/* STEPS */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
              {/* STEP 1 - NEW USER REGISTRATION */}
              <div className="relative flex flex-col items-center text-center group">
                {/* CIRCLE WITH ICON */}
                <div className="relative z-10 w-24 h-24 bg-white border-4 border-green-600 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <UserPlus className="w-10 h-10 text-green-600" />
                </div>

                {/* STEP NUMBER */}
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center z-20">
                  <span className="text-white font-bold text-sm">1</span>
                </div>

                {/* CONTENT */}
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  New User Registration
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Create your account with email verification
                </p>

                {/* CONNECTING LINE FOR MOBILE */}
                <div className="w-[2px] h-8 bg-gray-200 my-4 lg:hidden"></div>
              </div>

              {/* STEP 2 - LOG IN AS USER */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-24 h-24 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:border-green-600 group-hover:scale-110 group-hover:shadow-lg">
                  <LogIn className="w-10 h-10 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>

                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center z-20 group-hover:bg-green-600 transition-colors">
                  <span className="text-white font-bold text-sm">2</span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Log In as User
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Access your personal application portal
                </p>

                <div className="w-[2px] h-8 bg-gray-200 my-4 lg:hidden"></div>
              </div>

              {/* STEP 3 - FILL APPLICATION FORM */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-24 h-24 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:border-green-600 group-hover:scale-110 group-hover:shadow-lg">
                  <FileText className="w-10 h-10 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>

                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center z-20 group-hover:bg-green-600 transition-colors">
                  <span className="text-white font-bold text-sm">3</span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Fill Application Form
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Complete personal and academic details
                </p>

                <div className="w-[2px] h-8 bg-gray-200 my-4 lg:hidden"></div>
              </div>

              {/* STEP 4 - PAYMENT */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-24 h-24 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:border-green-600 group-hover:scale-110 group-hover:shadow-lg">
                  <CreditCard className="w-10 h-10 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>

                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center z-20 group-hover:bg-green-600 transition-colors">
                  <span className="text-white font-bold text-sm">4</span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Payment
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Pay application fee securely online
                </p>

                <div className="w-[2px] h-8 bg-gray-200 my-4 lg:hidden"></div>
              </div>

              {/* STEP 5 - DOWNLOAD APPLICATION */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-24 h-24 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:border-green-600 group-hover:scale-110 group-hover:shadow-lg">
                  <Download className="w-10 h-10 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>

                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center z-20 group-hover:bg-green-600 transition-colors">
                  <span className="text-white font-bold text-sm">5</span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Download Application
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get instant confirmation and receipt
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-20">
         <div className="max-w-7xl mx-auto px-6">
           <h2 className="text-4xl font-bold text-center text-gray-700 mb-16">
             Important Dates
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             <div className="bg-gradient-to-br from-green-700/10 to-green-600/5 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
               <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Calendar className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">
                 Last Date of Application
               </h3>
               <p className="text-3xl font-bold text-green-600 mb-2">April 13</p>
               <p className="text-gray-600">2026</p>
             </div>

             <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
               <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Calendar className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">
                 Date of LCET'26 Entrance Examination
               </h3>
               <p className="text-3xl font-bold text-green-600 mb-2">April 18</p>
               <p className="text-gray-600">2026</p>
             </div>

             <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
               <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Calendar className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">
                 Exam Result Declaration
               </h3>
               <p className="text-3xl font-bold text-green-600 mb-2">May 2nd Week</p>
               <p className="text-gray-600">2026</p>
             </div>

             <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
               <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Calendar className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">
                 Admission Counselling Starts On
               </h3>
               <p className="text-3xl font-bold text-green-600 mb-2">June 1st Week</p>
               <p className="text-gray-600">2026</p>
             </div>
           </div>
         </div>
       </section> 
    </>
  );
}
