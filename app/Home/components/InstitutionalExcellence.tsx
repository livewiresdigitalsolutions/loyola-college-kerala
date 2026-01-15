import React from "react";
import Image from "next/image";

export default function InstitutionalExcellence() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            {/* LABEL */}
            <p className="text-sm font-bold text-gray-900 tracking-wider">
              INSTITUTIONAL EXCELLENCE
            </p>

            {/* MAIN HEADING */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tighter">
              Six Decades of Academic Leadership
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-700 font-medium leading-relaxed text-lg">
              Since 1963, Loyola College of Social Sciences has been at the
              forefront of transformative education in Kerala. Our commitment to
              academic rigor, social responsibility, and holistic development has
              earned us recognition as one of India's premier institutions for
              social sciences.
            </p>

            {/* QUOTE BOX */}
            <div className="border-l-4 border-primary pl-6 py-2">
              <blockquote className="text-gray-800 text-lg italic leading-relaxed">
                "Education is not merely about acquiring knowledge, but about
                cultivating wisdom to serve humanity with compassion and justice."
              </blockquote>
              <p className="text-sm font-medium text-gray-600 mt-3">
                — Rev. Dr. Jose Kurien, Principal
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[500px] lg:h-[600px]  rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/assets/graduation-ceremony.png"
              alt="Graduation Ceremony at Loyola College"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
