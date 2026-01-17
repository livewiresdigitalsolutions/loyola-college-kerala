"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Department {
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  slug: string;
  category: string;
}

const departments: Department[] = [
  {
    id: "1",
    name: "Department of Sociology",
    shortDescription: "Explore society, culture, and human relationships through critical analysis and research.",
    image: "/departmentsCoverImage/Sociology.png",
    slug: "sociology",
    category: "Social Sciences",
  },
  {
    id: "2",
    name: "Department of Personnel Management",
    shortDescription: "Master human resource strategies, organizational behavior, and workforce development.",
    image: "/departmentsCoverImage/PersonnelManagement.png",
    slug: "personnel-management",
    category: "Management",
  },
  {
    id: "3",
    name: "Department of Disaster Management",
    shortDescription: "Learn crisis response, risk assessment, and emergency preparedness strategies.",
    image: "/departmentsCoverImage/DisasterManagement.png",
    slug: "disaster-management",
    category: "Applied Sciences",
  },
  {
    id: "4",
    name: "Department of Fintech and AI",
    shortDescription: "Combine finance with cutting-edge technology and artificial intelligence solutions.",
    image: "/departmentsCoverImage/FinTechAndAi.png",
    slug: "fintech-ai",
    category: "Technology",
  },
  {
    id: "5",
    name: "Department of Psychology",
    shortDescription: "Understand human behavior, mental processes, and therapeutic interventions.",
    image: "/departmentsCoverImage/Psychology.png",
    slug: "psychology",
    category: "Behavioral Sciences",
  },
  {
    id: "6",
    name: "Department of Data Science",
    shortDescription: "Harness big data, analytics, and machine learning for data-driven insights.",
    image: "/departmentsCoverImage/DataScience.png",
    slug: "data-science",
    category: "Technology",
  },
  {
    id: "7",
    name: "Department of English",
    shortDescription: "Study literature, language, and communication in a global context.",
    image: "/departmentsCoverImage/English.png",
    slug: "english",
    category: "Humanities",
  },
  {
    id: "8",
    name: "Department of Social Work",
    shortDescription: "Empower communities and advocate for social justice and human welfare.",
    image: "/departmentsCoverImage/SocialWork.png",
    slug: "social-work",
    category: "Social Sciences",
  },
  {
    id: "9",
    name: "Department of Counselling Psychology",
    shortDescription: "Develop expertise in mental health counseling and psychological support.",
    image: "/departmentsCoverImage/CounsellingPsychology.png",
    slug: "counselling-psychology",
    category: "Behavioral Sciences",
  },
  {
    id: "10",
    name: "Department of Finance and Accounts",
    shortDescription: "Master financial management, accounting principles, and investment strategies.",
    image: "/departmentsCoverImage/FinanceAndAccounts.png",
    slug: "finance-accounts",
    category: "Commerce",
  },
  {
    id: "11",
    name: "Department of Logistics and Supply Chain Management",
    shortDescription: "Optimize supply chains, logistics operations, and global trade networks.",
    image: "/departmentsCoverImage/LogisticsAndSupplyChainManagement.png",
    slug: "logistics-scm",
    category: "Management",
  },
  {
    id: "12",
    name: "Bachelor of Social Work",
    shortDescription: "Undergraduate program focused on social welfare and community development.",
    image: "/departmentsCoverImage/SocialWork.png",
    slug: "bachelor-social-work",
    category: "Social Sciences",
  },
  {
    id: "13",
    name: "Department of Computer Science",
    shortDescription: "Build expertise in programming, software development, and computational theory.",
    image: "/departmentsCoverImage/ComputerScience.png",
    slug: "computer-science",
    category: "Technology",
  },
  {
    id: "14",
    name: "Loyola Language Academy",
    shortDescription: "Learn multiple languages and enhance intercultural communication skills.",
    image: "/departmentsCoverImage/LanguageAcademy.png",
    slug: "language-academy",
    category: "Languages",
  },
  {
    id: "15",
    name: "Department of Physical Education",
    shortDescription: "Promote health, fitness, and sports excellence through physical training.",
    image: "/departmentsCoverImage/PhysicalEducation.png",
    slug: "physical-education",
    category: "Sports & Wellness",
  },
];

export default function DepartmentsList() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary font-semibold text-sm tracking-wide">
              ACADEMIC EXCELLENCE
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Departments
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover world-class programs across diverse disciplines, each
            committed to innovation and excellence.
          </p>
        </div>

        {/* DEPARTMENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              href={`/academics/departments/${dept.slug}`}
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
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col flex-grow">
                {/* DEPARTMENT NAME */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {dept.name}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                  {dept.shortDescription}
                </p>

                {/* READ MORE LINK */}
                <div className="flex items-center gap-2 text-primary font-semibold text-sm mt-auto">
                  <span>Read more</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>

              {/* HOVER BORDER EFFECT */}
              <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
