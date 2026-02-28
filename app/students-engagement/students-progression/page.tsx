import Link from "next/link";
import { ChevronRight } from "lucide-react";
import RankHolders from "./components/RankHolders";
import AcademicQualifiers from "./components/AcademicQualifiers";
import Placements from "./components/Placements";
import Initiatives from "./components/Initiatives";

export default function StudentProgressionPage() {
  return (
    <>
      {/* HERO SECTION WITH IMAGE AND GREEN OVERLAY */}
      <section className="relative w-full h-[400px] md:h-[500px]">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          {/* GREEN GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70"></div>
          {/* ADDITIONAL DARK OVERLAY FOR TEXT READABILITY */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>


        {/* HERO CONTENT */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-3xl">
              {/* BREADCRUMB NAVIGATION */}
              <nav className="flex items-center gap-2 text-white/90 mb-8 text-sm">
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#F0B129] font-medium">Student Progression</span>
              </nav>


              {/* MAIN HEADING */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Student Progression
              </h1>
            </div>
          </div>
        </div>
      </section>


      {/* ───── Sections ───── */}
      <RankHolders />
      <AcademicQualifiers />
      <Placements />
      <Initiatives />
    </>
  );
}
