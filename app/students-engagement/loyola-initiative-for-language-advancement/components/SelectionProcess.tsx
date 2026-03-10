"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

interface SelectionPoint { id: number; content: string; display_order: number; is_active: boolean; }

const LG = "#13432C";

const fallback: SelectionPoint[] = [
  { id: -1, content: "All the students are provided orientation at the time of induction on LILA by one of the faculty in charge.", display_order: 0, is_active: true },
  { id: -2, content: "Those students who volunteer to attend the LILA sessions will be administered an entry-level assessment test and admitted.", display_order: 1, is_active: true },
  { id: -3, content: "HODs of every department will be requested after the first internal assessment examination to induct slow learners found to have faced difficulty with English language.", display_order: 2, is_active: true },
  { id: -4, content: "An attendance book is maintained to ensure participation. Two student in-charges are selected by the LILA group for the effective conduct of the programme.", display_order: 3, is_active: true },
];

export default function SelectionProcess() {
  const [isOpen, setIsOpen] = useState(true);
  const [points, setPoints] = useState<SelectionPoint[]>(fallback);

  useEffect(() => {
    fetch("/api/students/loyola-initiative-for-language-advancement?type=selection-process")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setPoints(d.data); })
      .catch(() => { });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: LG }}>Selection Process of the participants</h2>
          <ChevronUp className="w-5 h-5 transition-transform duration-300" style={{ color: LG, transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <div className="px-6 py-8">
            <ul className="space-y-4">
              {points.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: LG }}></span>
                  <span className="text-gray-700 text-[15px] leading-relaxed">{item.content}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
