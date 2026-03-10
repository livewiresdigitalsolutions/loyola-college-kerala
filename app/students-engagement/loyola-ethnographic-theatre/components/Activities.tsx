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

export default function Activities() {
  const [isOpen, setIsOpen] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/students/loyola-ethnographic-theatre?type=activities")
      .then(r => r.json())
      .then(d => { if (d.success) setActivities(d.data || []); })
      .catch(() => { });
  }, []);

  if (activities.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        {/* Header */}
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

        {/* Table */}
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
