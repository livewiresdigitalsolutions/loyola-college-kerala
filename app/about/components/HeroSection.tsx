// // components/HeroSection.tsx
// import Image from 'next/image';

// const HeroSection = () => {
//   return (
//     <header className="relative h-[600px] flex items-center justify-center overflow-hidden">
//       <div className="absolute inset-0">
//         <Image
//           alt="College Campus"
//           src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920"
//           fill
//           className="object-cover grayscale-[20%]"
//           priority
//         />
//         <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
//       </div>
//       <div className="relative z-10 text-center text-white px-4 max-w-4xl">
//         <span className="inline-block px-4 py-1 border border-primary/40 rounded-full text-primary text-sm font-medium mb-6 backdrop-blur-sm bg-white/90">
//           ACCREDITED AT A LEVEL BY NAAC
//         </span>
//         <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
//           About our university
//         </h1>
//         <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
//           A Jesuit institution dedicated to Excellence, Social Responsibility,
//           and Holistic Formation in the heart of Trivandrum.
//         </p>
//       </div>
//     </header>
//   );
// };

// export default HeroSection;






import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <>
      {/* HERO SECTION WITH IMAGE AND GREEN OVERLAY */}
      <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/loyola-building.png"
            alt="Loyola College Campus"
            fill
            className="object-cover"
            priority
          />
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
                <span className="text-white hover:text-white cursor-pointer">About</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#F0B129] font-medium">Overview</span>
              </nav>

              {/* OVERVIEW LABEL */}
              <p className="text-white font-semibold text-sm tracking-wider uppercase mb-2">
                Overview
              </p>

              {/* MAIN HEADING */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                About Loyola College of<br />Social Sciences
              </h1>

              {/* Subtext */}
              <p className="mt-6 text-xl md:text-lg text-white/90 leading-relaxed max-w-2xl">
                A Jesuit institution committed to academic excellence, social responsibility, 
                and transformative education for over six decades.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}