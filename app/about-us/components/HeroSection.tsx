// components/HeroSection.tsx
import Image from 'next/image';

const HeroSection = () => {
  return (
    <header className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          alt="College Campus"
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920"
          fill
          className="object-cover grayscale-[20%]"
          priority
        />
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <span className="inline-block px-4 py-1 border border-primary/40 rounded-full text-primary text-sm font-medium mb-6 backdrop-blur-sm bg-white/90">
          ACCREDITED AT A LEVEL BY NAAC
        </span>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
          About our university
        </h1>
        <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
          A Jesuit institution dedicated to Excellence, Social Responsibility,
          and Holistic Formation in the heart of Trivandrum.
        </p>
      </div>
    </header>
  );
};

export default HeroSection;
