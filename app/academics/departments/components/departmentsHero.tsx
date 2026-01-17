"use client";
import React from "react";
import Image from "next/image";
import { BookOpen, Users, Microscope, GraduationCap } from "lucide-react";

export default function DepartmentsHero() {
  return (
    <>
      {/* HERO SECTION WITH IMAGE AND GREEN OVERLAY */}
      <section className="relative w-full h-[600px] md:h-[700px]">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/loyola-building.png"
            alt="Academic Departments"
            fill
            className="object-cover"
            priority
          />
          {/* GREEN GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/60"></div>
          {/* ADDITIONAL DARK OVERLAY FOR TEXT READABILITY */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-3xl">
              {/* BADGE */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-sm tracking-wide">
                  ACADEMIC EXCELLENCE
                </span>
              </div>

              {/* MAIN HEADING */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Explore Our
                <br />
                <span className="text-white/90">Departments</span>
              </h1>

              {/* SUBHEADING */}
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-light">
                Discover world-class programs across diverse disciplines. From
                sciences to humanities, each department is dedicated to
                fostering innovation, critical thinking, and academic excellence.
              </p>

              {/* STATS ROW */}
              <div className="flex flex-wrap gap-8 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">15+</div>
                    <div className="text-sm text-white/80">Departments</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">200+</div>
                    <div className="text-sm text-white/80">Faculty</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Microscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-sm text-white/80">Labs & Facilities</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">30+</div>
                    <div className="text-sm text-white/80">Programs</div>
                  </div>
                </div>
              </div>

              {/* OPTIONAL DESCRIPTIVE TEXT */}
              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20">
                <p className="text-white/90 text-sm leading-relaxed">
                  Each department combines rigorous academics with hands-on learning,
                  research opportunities, and mentorship from distinguished faculty
                  committed to your success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
