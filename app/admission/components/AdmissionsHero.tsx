"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Award, UserCheck, CheckCircle2 } from "lucide-react";
import ApplicationModal from "@/app/admission/components/ApplicationModal";
import { Toaster } from "react-hot-toast";

export default function AdmissionsHero() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);

  const handleStartApplicationClick = () => {
    setShowModal(true);
    setShowLogin(false);
  };

  const handleDownloadBrochureClick = () => {
    // Replace with your actual brochure PDF path
    window.open("/assets/brochure.pdf", "_blank");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowLogin(false);
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* ADMISSION MODAL */}
      <ApplicationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
      />

      {/* HERO SECTION WITH IMAGE AND GREEN OVERLAY */}
      <section className="relative w-full h-[600px] md:h-[700px]">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/loyola-building.png"
            alt="Campus"
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
                  ADMISSIONS OPEN 2026-27
                </span>
              </div> */}

              {/* MAIN HEADING */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Shape Your
                <br />
                <span className="text-white/90">Future Today</span>
              </h1>

              {/* SUBHEADING */}
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
                    <div className="text-2xl font-bold text-white">30+</div>
                    <div className="text-sm text-white/80">Programs</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">5000+</div>
                    <div className="text-sm text-white/80">Students</div>
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

              {/* CTA BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStartApplicationClick}
                  className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/90 transition-all duration-300 inline-flex items-center justify-center gap-2 group shadow-xl"
                >
                  Start Application
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleDownloadBrochureClick}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm"
                >
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}