import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";


export default function Cta() {
  return (
    <section className="w-full bg-[#F6F6EE] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* MAIN CTA CARD */}
        <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT CONTENT SECTION */}
            <div className="p-12 lg:p-16 text-white flex flex-col justify-between">
              {/* TOP CONTENT */}
              <div className="space-y-6">
                {/* LABEL */}
                <p className="text-sm font-bold tracking-wider uppercase text-white/80">
                  ADMISSIONS OPEN FOR 2026-27
                </p>


                {/* MAIN HEADING */}
                <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
                  Shape Your Future with Purpose
                </h2>


                {/* DESCRIPTION */}
                <p className="text-lg text-white/90 leading-relaxed max-w-xl">
                  For over six decades, Loyola College of Social Sciences has
                  cultivated leaders who combine academic excellence with social
                  responsibility. Begin your transformative educational journey at
                  Kerala's premier institution for social sciences.
                </p>


                {/* DIVIDER */}
                <div className="w-full h-[1px] bg-white/30 my-8"></div>


                {/* INFO GRID */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-white/70 mb-1">
                      Application Deadline
                    </p>
                    <p className="text-xl font-bold">June 15, 2026</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70 mb-1">Academic Year</p>
                    <p className="text-xl font-bold">2026-27</p>
                  </div>
                </div>


                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Link
                    href="/admissions"
                    className="inline-flex items-center text-center justify-center px-8 py-4 bg-white text-primary font-bold hover:bg-white/90 transition-all duration-300 shadow-lg"
                  >
                    View Application Requirements
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-all duration-300"
                  >
                    Request Information
                  </Link>
                </div>
              </div>


                {/* BOTTOM CONTACT INFO */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 text-sm text-white/90">
                <a
                    href="tel:+914842765634"
                    className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                    <Phone className="w-4 h-4" />
                    +91 484 276 5634
                </a>
                
                {/* DIVIDER */}
                <div className="hidden sm:block w-[1px] h-5 bg-white/30"></div>
                
                <a
                    href="mailto:admissions@loyolacollege.edu"
                    className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                    <Mail className="w-4 h-4" />
                    admissions@loyolacollege.edu
                </a>
                </div>

            </div>


            {/* RIGHT IMAGE SECTION */}
            <div className="relative h-[400px] lg:h-auto">
              <Image
                src="/assets/loyola-building.png"
                alt="Loyola College Building"
                fill
                className="object-cover"
              />
              {/* GREEN GRADIENT OVERLAY - BOTTOM LEFT TO RIGHT */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
