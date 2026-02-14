import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDepartmentBySlug } from "../data/departmentsData";
import DepartmentIntro from "./components/DepartmentIntro";
import FacultySection from "./components/FacultySection";
import ProgrammesSection from "./components/ProgrammesSection";
import SyllabusSection from "./components/Syllabus&PublicationSection";


interface DepartmentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function fetchDepartment(slug: string) {
  // Try API first, fallback to static data
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/academics/departments?slug=${slug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const dept = data[0];
        return {
          ...dept,
          shortDescription: dept.short_description || dept.shortDescription,
          syllabusLinks: dept.syllabus_links || dept.syllabusLinks,
          faculty: dept.faculty_list || dept.faculty || [],
        };
      }
    }
  } catch (error) {
    console.error('API fetch failed, falling back to static data:', error);
  }

  // Fallback to static data
  return getDepartmentBySlug(slug);
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const department = await fetchDepartment(slug);

  if (!department) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src={department.image}
          alt={department.name}
          fill
          className="object-cover"
          priority
        />
        {/* Green Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, var(--color-primary, #1a5632) 0%, rgba(26, 86, 50, 0.7) 50%, transparent 100%)'
          }}
        ></div>
        {/* Additional Dark Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-3xl">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center gap-2 text-white/90 mb-8 text-sm flex-wrap">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/academics" className="hover:text-white transition-colors">Academics</Link>
                <span>/</span>
                <Link href="/academics/departments" className="hover:text-white transition-colors">Departments</Link>
                <span>/</span>
                <span className="text-white font-medium">{department.name}</span>
              </nav>

              {/* Department Name */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {department.name}
              </h1>

              {/* Short Description */}
              <p className="text-lg md:text-xl text-white/90 mt-4 max-w-2xl">
                {department.shortDescription || department.short_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Department Content */}
      <DepartmentIntro introduction={department.introduction} goals={department.goals} />
      <FacultySection faculty={department.faculty || department.faculty_list || []} />
      <ProgrammesSection programmes={department.programmes} />
      <SyllabusSection
        syllabus={department.syllabus}
        syllabusLinks={department.syllabusLinks || department.syllabus_links}
        publications={department.publications}
      />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const department = await fetchDepartment(slug);

  if (!department) {
    return {
      title: "Department Not Found",
    };
  }

  return {
    title: `${department.name} | Loyola College`,
    description: department.shortDescription || department.short_description,
  };
}
