"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

const themes = [
  "Waste management",
  "Pre-marital affairs",
  "Child abuse",
  "Migrant labour",
  "Extra marital affairs",
  "Exploitation of women in media",
  "Cyber crime",
  "Old age",
  "Abortion",
  "Child labour",
  "Commercial sex work",
  "Influence of media",
  "Road safety",
  "Competition among professional students",
  "Valued degradation",
  "E-waste",
  "Organ donation",
  "Suicidal tendency among adolescence",
  "Children of separated family",
  "Sand mining and common man",
  "Tribal issues",
  "Impact of modern gadgets among youth",
  "Blood donation",
];

export default function SuggestedThemes() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Suggested Themes / Issues</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Content - Tag Pills */}
      {isOpen && (
        <div className="px-6 py-8">
          <div className="flex flex-wrap gap-3">
            {themes.map((theme, i) => (
              <span
                key={i}
                className="px-4 py-1.5 border border-[#13432C] text-[#13432C] rounded-full text-sm font-medium"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
