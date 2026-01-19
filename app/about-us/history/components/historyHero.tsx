"use client"
import React from "react";
import Image from "next/image";
import { Calendar, Award, Users, BookOpen } from "lucide-react";


export default function HistoryHero() {
  return (
    <>
      {/* HERO SECTION WITH IMAGE AND GREEN OVERLAY */}
      <section className="relative w-full h-[600px] md:h-[800px]">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/loyola-building.png"
            alt="History"
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
              {/* <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-sm tracking-wide">
                  OUR HISTORY
                </span>
              </div> */}


              {/* MAIN HEADING */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Six Decades of
                <br />
                <span className="text-white/90">Academic Excellence</span>
              </h1>


              {/* SUBHEADING */}
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-light">
                From our founding in 1963 to today, discover the remarkable
                journey of how Loyola College became Kerala's premier institution
                for social sciences.
              </p>


              {/* STATS ROW */}
              <div className="flex flex-wrap gap-8 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">1963</div>
                    <div className="text-sm text-white/80">Established</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">60+</div>
                    <div className="text-sm text-white/80">Years of Legacy</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">10,000+</div>
                    <div className="text-sm text-white/80">Alumni Network</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">Premier</div>
                    <div className="text-sm text-white/80">Social Sciences</div>
                  </div>
                </div>
              </div>


              {/* OPTIONAL DESCRIPTIVE TEXT */}
              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20">
                <p className="text-white/90 text-sm leading-relaxed">
                  A pioneering institution dedicated to excellence in education,
                  research, and service. Our rich heritage reflects decades of
                  commitment to shaping leaders and scholars who make a difference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


