import { Home } from 'lucide-react'
import Link from 'next/link'

export default function ContactHero() {
  return (
    <section className="relative w-full bg-primary pt-24 pb-20 px-4 md:px-8 lg:px-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"
        style={{ backgroundImage: "url('/assets/loyola-building.png')" }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start pt-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-medium mb-8">
          <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <span className="text-white/60 text-xs">›</span>
          <span className="text-[#F0B129]">Contact Us</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
          Get in Touch
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed font-light">
          We welcome your inquiries. Whether you're a prospective student, parent, alumni, 
          or looking to collaborate, our team is here to assist you.
        </p>
      </div>
    </section>
  )
}
