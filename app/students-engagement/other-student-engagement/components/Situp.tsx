"use client";

import { useState } from "react";
import { ChevronUp, FileText } from "lucide-react";

export default function Situp() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">
          SITUP – Student IT Upgradation Program
        </h2>
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
          <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
            Engaged Competence Enhancement (ECE) is Loyola&apos;s distinctive institutional
            commitment to student support as well as a strategy to enhance student-competency
            (capacity-building) by placing student-engagement at the core of all teaching-learning
            processes. ICT/computing skills is one of the capacity building and skills enhancement
            initiatives taken by the institution. SITUP is a student club which comes under the
            category of ICT/computing skills.
          </p>

          <a
            href="https://loyolacollegekerala.edu.in/iqac/wp-content/uploads/2022/01/5.1.3-1-SITUP-Report-2020-21.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#13432C] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#0e3522] transition-colors"
          >
            <FileText className="w-4 h-4" />
            SITUP Report 2020-21 (PDF)
          </a>
        </div>
      )}
      </div>
    </section>
  );
}
