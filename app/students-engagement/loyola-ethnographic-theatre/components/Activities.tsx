"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

const activities = [
  {
    date: "30th October 2020",
    description: "Film screening & Review of the award-winning short film – 'A social life'",
  },
];

export default function Activities() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Activities</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Table */}
      {isOpen && (
        <table className="w-full">
          <tbody>
            {activities.map((activity, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-b-0">
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
