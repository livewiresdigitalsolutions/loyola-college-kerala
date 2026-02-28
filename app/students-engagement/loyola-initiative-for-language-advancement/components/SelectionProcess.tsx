"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

const selectionPoints = [
  "All the students are provided orientation at the time of induction on LILA by one of the faculty in charge.",
  "Those students who volunteer to attend the LILA sessions will be administered an entry-level assessment test and admitted.",
  "HODs of every department will be requested after the first internal assessment examination to induct slow learners found to have faced difficulty with English language.",
  "An attendance book is maintained to ensure participation. Two student in-charges are selected by the LILA group for the effective conduct of the programme.",
];

export default function SelectionProcess() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Selection Process of the participants</h2>
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
            {selectionPoints.map((item, i) => (
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
