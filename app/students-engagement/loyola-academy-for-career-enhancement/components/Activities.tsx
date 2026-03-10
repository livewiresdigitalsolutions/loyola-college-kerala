"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

interface Activity {
  id: number;
  date: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

const LG = "#13432C";

const fallback: Activity[] = [
  { id: -1, date: "24th Jan 2026", description: "Exposure visit to Energy Management Centre", display_order: 0, is_active: true },
  { id: -2, date: "13th Jan 2026", description: "Discussion on 'Oil, Politics, and Global Norms: Understanding US actions in Venezuela and Venezuelan resistance'", display_order: 1, is_active: true },
  { id: -3, date: "6th January 2026", description: "LACE's first Meeting in 2026", display_order: 2, is_active: true },
  { id: -4, date: "18th November 2024", description: "Discussion on United Nations: Roles and Relevance", display_order: 3, is_active: true },
  { id: -5, date: "12-08-2024", description: "A Discussion on 'The Questions raised by Joy's Death'", display_order: 4, is_active: true },
  { id: -6, date: "23-07-2024", description: "Experience Sharing & Felicitation to the Seniors & Competition Winners", display_order: 5, is_active: true },
];

export default function Activities() {
  const [isOpen, setIsOpen] = useState(true);
  const [activities, setActivities] = useState<Activity[]>(fallback);

  useEffect(() => {
    fetch("/api/students/loyola-academy-for-career-enhancement?type=activities")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setActivities(d.data); })
      .catch(() => { });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
        >
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: LG }}>Activities</h2>
          <ChevronUp
            className="w-5 h-5 transition-transform duration-300"
            style={{ color: LG, transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </button>
        <hr className="border-gray-200" />

        {isOpen && (
          <table className="w-full">
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="px-6 py-4 text-sm text-gray-500 font-bold whitespace-nowrap w-[180px] align-top">
                    {activity.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-bold">{activity.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
