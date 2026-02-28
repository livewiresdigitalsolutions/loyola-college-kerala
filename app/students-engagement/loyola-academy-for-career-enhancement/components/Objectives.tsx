"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

const objectives = [
  "Expose the students to the world of competitive exams (National & Global).",
  "Establish a students' study circle to facilitate and enrich the learning process for different competitive exams.",
  "Equip the students to be competent enough to explore job opportunities in the global world.",
];

export default function Objectives() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Objective</h2>
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
          <ul className="space-y-4">
            {objectives.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#13432C] mt-1.5 shrink-0"></span>
                <span className="text-gray-700 text-[15px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </section>
  );
}
