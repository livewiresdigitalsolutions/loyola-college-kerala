import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/loyola-building.png"
          alt="Loyola Ethnographic Theatre"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/70 to-transparent"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/90 mb-8 text-sm">
              <Link
                href="/"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span>Student</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#F0B129] font-medium">
                Loyola Ethnographic Theatre (LET)
              </span>
            </nav>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Loyola Ethnographic Theatre
              <span className="text-[#F0B129]"> (LET)</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
