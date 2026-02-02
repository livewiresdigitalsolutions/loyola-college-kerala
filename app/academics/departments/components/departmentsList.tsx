// "use client";
// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { ArrowRight } from "lucide-react";

// interface Department {
//   id: string;
//   name: string;
//   shortDescription: string;
//   image: string;
//   slug: string;
//   category: string;
// }

// const departments: Department[] = [
//   {
//     id: "1",
//     name: "Department of Sociology",
//     shortDescription: "Explore society, culture, and human relationships through critical analysis and research.",
//     image: "/departmentsCoverImage/Sociology.png",
//     slug: "sociology",
//     category: "Social Sciences",
//   },
//   {
//     id: "2",
//     name: "Department of Personnel Management",
//     shortDescription: "Master human resource strategies, organizational behavior, and workforce development.",
//     image: "/departmentsCoverImage/PersonnelManagement.png",
//     slug: "personnel-management",
//     category: "Management",
//   },
//   {
//     id: "3",
//     name: "Department of Disaster Management",
//     shortDescription: "Learn crisis response, risk assessment, and emergency preparedness strategies.",
//     image: "/departmentsCoverImage/DisasterManagement.png",
//     slug: "disaster-management",
//     category: "Applied Sciences",
//   },
//   {
//     id: "4",
//     name: "Department of Fintech and AI",
//     shortDescription: "Combine finance with cutting-edge technology and artificial intelligence solutions.",
//     image: "/departmentsCoverImage/FinTechAndAi.png",
//     slug: "fintech-ai",
//     category: "Technology",
//   },
//   {
//     id: "5",
//     name: "Department of Psychology",
//     shortDescription: "Understand human behavior, mental processes, and therapeutic interventions.",
//     image: "/departmentsCoverImage/Psychology.png",
//     slug: "psychology",
//     category: "Behavioral Sciences",
//   },
//   {
//     id: "6",
//     name: "Department of Data Science",
//     shortDescription: "Harness big data, analytics, and machine learning for data-driven insights.",
//     image: "/departmentsCoverImage/DataScience.png",
//     slug: "data-science",
//     category: "Technology",
//   },
//   {
//     id: "7",
//     name: "Department of English",
//     shortDescription: "Study literature, language, and communication in a global context.",
//     image: "/departmentsCoverImage/English.png",
//     slug: "english",
//     category: "Humanities",
//   },
//   {
//     id: "8",
//     name: "Department of Social Work",
//     shortDescription: "Empower communities and advocate for social justice and human welfare.",
//     image: "/departmentsCoverImage/SocialWork.png",
//     slug: "social-work",
//     category: "Social Sciences",
//   },
//   {
//     id: "9",
//     name: "Department of Counselling Psychology",
//     shortDescription: "Develop expertise in mental health counseling and psychological support.",
//     image: "/departmentsCoverImage/CounsellingPsychology.png",
//     slug: "counselling-psychology",
//     category: "Behavioral Sciences",
//   },
//   {
//     id: "10",
//     name: "Department of Finance and Accounts",
//     shortDescription: "Master financial management, accounting principles, and investment strategies.",
//     image: "/departmentsCoverImage/FinanceAndAccounts.png",
//     slug: "finance-accounts",
//     category: "Commerce",
//   },
//   {
//     id: "11",
//     name: "Department of Logistics and Supply Chain Management",
//     shortDescription: "Optimize supply chains, logistics operations, and global trade networks.",
//     image: "/departmentsCoverImage/LogisticsAndSupplyChainManagement.png",
//     slug: "logistics-scm",
//     category: "Management",
//   },
//   {
//     id: "12",
//     name: "Bachelor of Social Work",
//     shortDescription: "Undergraduate program focused on social welfare and community development.",
//     image: "/departmentsCoverImage/SocialWork.png",
//     slug: "bachelor-social-work",
//     category: "Social Sciences",
//   },
//   {
//     id: "13",
//     name: "Department of Computer Science",
//     shortDescription: "Build expertise in programming, software development, and computational theory.",
//     image: "/departmentsCoverImage/ComputerScience.png",
//     slug: "computer-science",
//     category: "Technology",
//   },
//   {
//     id: "14",
//     name: "Loyola Language Academy",
//     shortDescription: "Learn multiple languages and enhance intercultural communication skills.",
//     image: "/departmentsCoverImage/LanguageAcademy.png",
//     slug: "language-academy",
//     category: "Languages",
//   },
//   {
//     id: "15",
//     name: "Department of Physical Education",
//     shortDescription: "Promote health, fitness, and sports excellence through physical training.",
//     image: "/departmentsCoverImage/PhysicalEducation.png",
//     slug: "physical-education",
//     category: "Sports & Wellness",
//   },
// ];

// export default function DepartmentsList() {
//   return (
//     <section className="py-20 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* SECTION HEADER */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-6">
//             <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
//             <span className="text-primary font-semibold text-sm tracking-wide">
//               ACADEMIC EXCELLENCE
//             </span>
//           </div>
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Explore Our Departments
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Discover world-class programs across diverse disciplines, each
//             committed to innovation and excellence.
//           </p>
//         </div>

//         {/* DEPARTMENTS GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {departments.map((dept) => (
//             <Link
//               key={dept.id}
//               href={`/academics/departments/${dept.slug}`}
//               className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col"
//             >
//               {/* IMAGE CONTAINER */}
//               <div className="relative h-56 overflow-hidden">
//                 <Image
//                   src={dept.image}
//                   alt={dept.name}
//                   fill
//                   className="object-cover transition-transform duration-700 group-hover:scale-110"
//                 />
//                 {/* GRADIENT OVERLAY */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
//                 {/* CATEGORY BADGE */}
//                 <div className="absolute top-4 left-4">
//                   <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
//                     {dept.category}
//                   </span>
//                 </div>
//               </div>

//               {/* CONTENT */}
//               <div className="p-6 flex flex-col flex-grow">
//                 {/* DEPARTMENT NAME */}
//                 <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
//                   {dept.name}
//                 </h3>

//                 {/* DESCRIPTION */}
//                 <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
//                   {dept.shortDescription}
//                 </p>

//                 {/* READ MORE LINK */}
//                 <div className="flex items-center gap-2 text-primary font-semibold text-sm mt-auto">
//                   <span>Read more</span>
//                   <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
//                 </div>
//               </div>

//               {/* HOVER BORDER EFFECT */}
//               <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }















"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X, Award, Calendar } from "lucide-react";

interface Department {
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  slug: string;
  category: string;
  eligibility: string;
  seats: number;
}

const departments: Department[] = [
  {
    id: "1",
    name: "B.Com Finance and Accounts (ACCA Pathway)",
    shortDescription: "Pursue professional accounting excellence with ACCA certification pathway.",
    image: "/departmentsCoverImage/FinanceAndAccounts.png",
    slug: "finance-accounts-acca",
    category: "Commerce",
    eligibility: "Pass in Higher Secondary Examination. Non-Commerce students require 45% aggregate marks.",
    seats: 50,
  },
  {
    id: "2",
    name: "B.Com Finance and Accounts (CA Pathway)",
    shortDescription: "Build a career in Chartered Accountancy with specialized CA foundation preparation and financial expertise.",
    image: "/departmentsCoverImage/Financeandca.png",
    slug: "finance-accounts-ca",
    category: "Commerce",
    eligibility: "Build a strong foundation in Finance and Accounts with specialized CA pathway.",
    seats: 50,
  },
  {
    id: "3",
    name: "B.Com Fintech and AI",
    shortDescription: "Combine finance with cutting-edge technology and artificial intelligence for modern financial solutions.",
    image: "/departmentsCoverImage/FinTechAndAi.png",
    slug: "fintech-ai",
    category: "Commerce",
    eligibility: "Pass in Higher Secondary Examination. Non-Commerce students require 45% aggregate marks.",
    seats: 50,
  },
  {
    id: "4",
    name: "B.Com Logistics and Supply Chain Management",
    shortDescription: "Optimize supply chains, logistics operations, and global trade networks for modern business efficiency.",
    image: "/departmentsCoverImage/LogisticsAndSupplyChainManagement.png",
    slug: "logistics-scm",
    category: "Commerce",
    eligibility: "Pass in Higher Secondary Examination. Non-Commerce students require 45% aggregate marks.",
    seats: 50,
  },
  {
    id: "5",
    name: "Bachelor of Social Work (BSW)",
    shortDescription: "Empower communities and advocate for social justice, human welfare, and community development.",
    image: "/departmentsCoverImage/SocialWork.png",
    slug: "social-work",
    category: "Social Sciences",
    eligibility: "Pass in Higher Secondary Examination or equivalent.",
    seats: 50,
  },
  {
    id: "6",
    name: "B.Sc Psychology",
    shortDescription: "Understand human behavior, mental processes, and develop expertise in psychological sciences.",
    image: "/departmentsCoverImage/Psychology.png",
    slug: "psychology",
    category: "Behavioral Sciences",
    eligibility: "Pass in Higher Secondary Examination.",
    seats: 40,
  },
  {
    id: "7",
    name: "B.Sc Data Science",
    shortDescription: "Harness big data, analytics, and machine learning with minor tracks in AI, ML, and Computer Science.",
    image: "/departmentsCoverImage/DataScience.png",
    slug: "data-science",
    category: "Technology",
    eligibility: "Pass in Higher Secondary Examination.",
    seats: 40,
  },
];

export default function DepartmentsList() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary font-semibold text-sm tracking-wide">
              ACADEMIC EXCELLENCE
            </span>
          </div> */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Departments
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover world-class Four-Year Undergraduate Programmes across diverse disciplines,
            each committed to innovation and excellence.
          </p>
        </div>

        {/* DEPARTMENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={dept.image}
                  alt={dept.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* CATEGORY BADGE */}
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {dept.category}
                  </span>
                </div>

                {/* SEATS BADGE */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {dept.seats} Seats
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col flex-grow">
                {/* PROGRAMME NAME */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {dept.name}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                  {dept.shortDescription}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-auto">
                  {/* <button
                    onClick={() => setSelectedDept(dept)}
                    className="flex-1 flex items-center justify-center gap-2 text-primary font-semibold text-sm py-2 px-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <Award className="w-4 h-4" />
                    <span>Eligibility</span>
                  </button> */}
                  <Link
                    href={`/academics/departments/${dept.slug}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-2 px-4 rounded-lg hover:bg-primary/90 transition-all duration-300"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* HOVER BORDER EFFECT */}
              <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ELIGIBILITY MODAL */}
      {selectedDept && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDept(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white p-6 flex items-start justify-between z-10">
              <div className="flex-1 pr-4">
                <h3 className="text-2xl font-bold mb-2">{selectedDept.name}</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedDept.category}
                  </span>
                  <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedDept.seats} Seats
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                title="Close"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6">
              {/* ELIGIBILITY CRITERIA */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  Eligibility Criteria
                </h4>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedDept.eligibility}
                  </p>
                </div>
              </div>

              {/* ADMISSION WEIGHTAGE */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                  Admission Ranking System
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1">70%</div>
                    <div className="text-xs font-semibold text-gray-700">Entrance Exam</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-1">20%</div>
                    <div className="text-xs font-semibold text-gray-700">HS Marks</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">10%</div>
                    <div className="text-xs font-semibold text-gray-700">Interview</div>
                  </div>
                </div>
              </div>

              {/* IMPORTANT DATES */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  Important Dates - 2026
                </h4>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-amber-200">
                    <span className="text-sm font-medium text-gray-700">Application Deadline</span>
                    <span className="text-sm font-bold text-gray-900">April 13, 2026</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-amber-200">
                    <span className="text-sm font-medium text-gray-700">Entrance Examination</span>
                    <span className="text-sm font-bold text-gray-900">April 18, 2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Rank List Publication</span>
                    <span className="text-sm font-bold text-gray-900">April 23, 2026</span>
                  </div>
                </div>
              </div>

              {/* ADDITIONAL INFO */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 mb-6">
                <h5 className="font-semibold text-gray-900 mb-3 text-sm">Additional Information</h5>
                <ul className="text-xs text-gray-700 space-y-2">
                  <li>• Candidates eligible irrespective of Higher Secondary discipline</li>
                  <li>• 15 marks weightage for NCC/NSS/SPC/Scout & Guides</li>
                  <li>• APAAR ID mandatory for admission completion</li>
                  <li>• 10% marginal increase in seats applicable</li>
                </ul>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <Link
                  href={`/academics/departments/${selectedDept.slug}`}
                  className="flex-1 bg-primary text-white text-center font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300"
                  onClick={() => setSelectedDept(null)}
                >
                  View Full Details
                </Link>
                <button
                  onClick={() => setSelectedDept(null)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
