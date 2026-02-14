import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/loyola-building.png"
            alt="Loyola College Building"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay - Using specific green from design/globals if variable not working, but trying CSS variable first */}
          <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col justify-center h-full text-white space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm/none text-white/80 uppercase tracking-wide font-medium">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
            <span className="text-white/40">›</span>
            <span className="text-secondary">Gallery</span>
          </nav>

          {/* Title - Reduced margin-top to separate from breadcrumbs */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mt-2">
            Campus Gallery
          </h1>

          {/* Description */}
          <p className="max-w-xl text-lg md:text-xl text-white/90 font-light leading-relaxed">
            Glimpses of life at Loyola: Academic pursuits, cultural vibrancy,
            and infrastructural excellence.
          </p>
        </div>
      </section>

      {/* Placeholder for Gallery Grid (To be implemented later) */}
      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Gallery content will go here */}
      </section>
    </main>
  );
}
