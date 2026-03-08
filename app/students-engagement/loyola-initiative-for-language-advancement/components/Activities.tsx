"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

interface Activity { id: number; date: string; description: string; display_order: number; is_active: boolean; }

const LG = "#13432C";

const fallback: Activity[] = [
  { id: -1, date: "21-12-2021", description: "Christmas get together and felicitation", display_order: 0, is_active: true },
  { id: -2, date: "September 2021", description: "Chimizhu Release", display_order: 1, is_active: true },
];

export default function Activities() {
  const [isOpen, setIsOpen] = useState(true);
  const [activities, setActivities] = useState<Activity[]>(fallback);

  useEffect(() => {
    fetch("/api/students/loyola-initiative-for-language-advancement?type=activities")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setActivities(d.data); })
      .catch(() => { });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: LG }}>Activities</h2>
          <ChevronUp className="w-5 h-5 transition-transform duration-300" style={{ color: LG, transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <table className="w-full">
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="px-6 py-4 text-sm text-gray-500 font-bold whitespace-nowrap w-[180px] align-top">{a.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-bold">{a.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
