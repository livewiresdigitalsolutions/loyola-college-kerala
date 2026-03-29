"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

interface TextBlock { id: number; content: string; }
interface BulletItem { id: number; text: string; }

export default function SpecialCamp() {
  const [isOpen, setIsOpen] = useState(true);
  const [paragraphs, setParagraphs] = useState<TextBlock[]>([]);
  const [aims, setAims] = useState<BulletItem[]>([]);

  useEffect(() => {
    fetch("/api/students/loyol-nss-unit?type=special-camp")
      .then(r => r.json())
      .then(d => { if (d.success) setParagraphs(d.data || []); })
      .catch(() => {});
    fetch("/api/students/loyol-nss-unit?type=special-camp-aims")
      .then(r => r.json())
      .then(d => { if (d.success) setAims(d.data || []); })
      .catch(() => {});
  }, []);

  if (paragraphs.length === 0 && aims.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
        >
          <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Special Camp</h2>
          <ChevronUp className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <div className="px-6 py-8">
            {paragraphs.map(p => (
              <p key={p.id} className="text-gray-700 text-[15px] leading-relaxed mb-6">{p.content}</p>
            ))}
            {aims.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-[#13432C] mb-5">Aims of Special Camp</h3>
                <ul className="space-y-4">
                  {aims.map(item => (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#13432C] mt-1.5 shrink-0"></span>
                      <span className="text-gray-700 text-[15px] leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
