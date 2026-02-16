"use client";
import React from "react";
import { Calendar } from "lucide-react";

export default function AdmissionProcess() {
  return (
    <>
      {/* IMPORTANT DATES SECTION */}

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
