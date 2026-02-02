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

export default function HeroSection() {
  return (
    <section className="relative bg-[var(--primary)] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center text-[var(--primary-foreground)]/80 text-sm mb-6">
          <span className="hover:text-[var(--primary-foreground)] cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="hover:text-[var(--primary-foreground)] cursor-pointer">About</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-[var(--primary-foreground)]">Overview</span>
        </nav>
        
        <div className="max-w-3xl">
          <p className="text-[var(--secondary)] font-semibold text-sm tracking-wider uppercase mb-2">Overview</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--primary-foreground)] leading-tight">
            About Loyola College of<br />Social Sciences
          </h1>
          <p className="mt-6 text-lg text-[var(--primary-foreground)]/90 max-w-2xl leading-relaxed">
            A Jesuit institution committed to academic excellence, social responsibility, 
            and transformative education for over six decades.
          </p>
        </div>
      </div>
    </section>
  );
}