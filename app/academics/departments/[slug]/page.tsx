import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getDepartmentBySlug, getAllDepartmentSlugs } from "../data/departmentsData";
import DepartmentIntro from "./components/DepartmentIntro";
import DepartmentGoals from "./components/DepartmentGoals";
import FacultySection from "./components/FacultySection";
import ProgrammesSection from "./components/ProgrammesSection";
import SyllabusSection from "./components/SyllabusSection";

interface DepartmentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const department = getDepartmentBySlug(slug);
  
  if (!department) {
    notFound();
  }
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px]">
        <Image
          src={department.image}
          alt={department.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <span className="text-white text-sm font-semibold">
                {department.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {department.name}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {department.shortDescription}
            </p>
          </div>
        </div>
      </section>
      
      {/* Department Content */}
      <DepartmentIntro introduction={department.introduction} />
      <DepartmentGoals goals={department.goals} />
      <FacultySection faculty={department.faculty} />
      <ProgrammesSection programmes={department.programmes} />
      <SyllabusSection syllabus={department.syllabus} />
    </div>
  );
}

// Generate static params for all departments at build time
export async function generateStaticParams() {
  const slugs = getAllDepartmentSlugs();
  
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const department = getDepartmentBySlug(slug);
  
  if (!department) {
    return {
      title: "Department Not Found",
    };
  }
  
  return {
    title: `${department.name} | Loyola College`,
    description: department.shortDescription,
  };
}
