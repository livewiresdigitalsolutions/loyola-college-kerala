"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

export default function BloodConnect() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Loyola College Blood Connect</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Content */}
      {isOpen && (
        <div className="px-6 py-8">
          <p className="text-gray-700 text-[15px] leading-relaxed">
            As part of World Blood Donation Day celebrations in the year 2017 Loyola College has
            started an initiative named Loyola College Blood Connect. This is a directory of the NSS
            volunteers with their blood groups. Promoting more blood donation among youth.
          </p>
        </div>
      )}
      </div>
    </section>
  );
}
