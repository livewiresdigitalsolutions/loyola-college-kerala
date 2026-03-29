"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

interface ArtsSection {
  id: number;
  title: string;
  content: string;
}

export default function Arts() {
  const [isOpen, setIsOpen] = useState(true);
  const [artsSections, setArtsSections] = useState<ArtsSection[]>([]);

  useEffect(() => {
    fetch("/api/students/college-union?type=accordion-arts")
      .then(r => r.json())
      .then(d => { if (d.success) setArtsSections(d.data || []); })
      .catch(() => {});
  }, []);

  if (artsSections.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
        >
          <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Arts &amp; Sports</h2>
          <ChevronUp
            className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`}
          />
        </button>
        <hr className="border-gray-200" />

        {isOpen && (
          <div className="px-6 py-8">
            {artsSections.map((section, i) => (
              <div key={section.id} className="mb-8 last:mb-0">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h3>
                {section.content.split("\n\n").map((para, j) => (
                  <p key={j} className="text-gray-600 text-[15px] leading-[1.85] text-justify mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
                {i < artsSections.length - 1 && <hr className="border-gray-100 mt-8" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
