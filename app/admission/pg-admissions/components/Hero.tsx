"use client";
import React from "react";
import Image from "next/image";
import { ArrowRight, Award, CheckCircle2 } from "lucide-react";

export default function PgAdmissionsHero() {
  const handleDownloadBrochureClick = () => {
    window.open("/files/brochure.pdf", "_blank");
  };

  const handleDownloadProspectusClick = () => {
    window.open("/files/prospectus.pdf", "_blank");
  };

  const handleApplyNowClick = () => {
    window.location.href = "/apply";
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/loyola-building.png"
          alt="Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* HERO CONTENT - TWO COLUMN LAYOUT */}
      <div className="relative z-10 min-h-screen flex items-center py-12">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* LEFT SIDE - CONTENT */}
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Shape Your
                <br />
                <span className="text-white/90">Future Today</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-light">
                Join a legacy of excellence where academic rigor meets holistic
                development. Begin your journey towards becoming a leader,
                innovator, and changemaker.
              </p>

              {/* STATS ROW */}
              <div className="flex flex-wrap gap-8 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">7 UG</div>
                    <div className="text-sm text-white/80">Programs</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">5 PG</div>
                    <div className="text-sm text-white/80">Programs</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">A++</div>
                    <div className="text-sm text-white/80">NAAC Grade</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - BUTTONS IN COLUMN */}
            <div className="flex justify-end">
              <div className="flex flex-col gap-4 max-w-md w-full">
                <button
                  onClick={handleDownloadBrochureClick}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm inline-flex items-center justify-center gap-2 group"
                >
                  Download Brochure
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleDownloadProspectusClick}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm inline-flex items-center justify-center gap-2 group"
                >
                  Download Prospectus
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleApplyNowClick}
                  className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-white hover:border-2 hover:border-white transition-all duration-300 inline-flex items-center justify-center gap-2 group shadow-lg"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
