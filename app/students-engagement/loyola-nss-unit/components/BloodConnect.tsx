"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

interface TextBlock { id: number; content: string; }

export default function BloodConnect() {
  const [isOpen, setIsOpen] = useState(true);
  const [paragraphs, setParagraphs] = useState<TextBlock[]>([]);

  useEffect(() => {
    fetch("/api/students/loyol-nss-unit?type=blood-connect")
      .then(r => r.json())
      .then(d => { if (d.success) setParagraphs(d.data || []); })
      .catch(() => {});
  }, []);

  if (paragraphs.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
        >
          <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Loyola College Blood Connect</h2>
          <ChevronUp className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <div className="px-6 py-8 space-y-4">
            {paragraphs.map(p => (
              <p key={p.id} className="text-gray-700 text-[15px] leading-relaxed">{p.content}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
