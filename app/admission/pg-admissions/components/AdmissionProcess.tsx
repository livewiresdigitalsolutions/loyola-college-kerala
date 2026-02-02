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
                 Date of Commencement of Admissions
               </h3>
               <p className="text-3xl font-bold text-green-600 mb-2">Begins on 11th May</p>
               <p className="text-gray-600">2026</p>
             </div>

             <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
               <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Calendar className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">
                 Induction Program begins
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
