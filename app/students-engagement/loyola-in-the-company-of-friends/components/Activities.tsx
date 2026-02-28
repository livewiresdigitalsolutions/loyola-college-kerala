"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

const activities = [
  { date: "24th Jan 2025", description: "Exposure visit to Energy Management Centre" },
  {
    date: "18th Jan 2025",
    description:
      "Discussion on 'Oil, Politics, and Global Norms: Understanding US Actions in Venezuela and Resistance'",
  },
  { date: "9th January 2025", description: "LITCOF's first Meeting in 2025" },
  {
    date: "18th November 2024",
    description: "Discussion on United Nations- Roles and Relevance",
  },
  {
    date: "12-09-2024",
    description: "A Discussion on 'The Questions raised by Jay's Death'",
  },
  {
    date: "01-07-2024",
    description: "Experience Sharing & Felicitation to the Seniors & Competition Winners",
  },
  { date: "03-04-2024", description: "Chimizhu Release" },
  { date: "20-03-2024", description: "Discussion on 'NEP 2020'" },
  {
    date: "14-03-2024",
    description: "Discussion on 'Secularism and Indian Constitution'",
  },
  { date: "03-01-2024", description: "Discussion on 'Israel -Hamas War'" },
  { date: "13-12-2023", description: "A Nature field to Palaruvi" },
  { date: "11-12-2023", description: "Discussion on 'Women Reservation'" },
  { date: "19-06-2023", description: "Discussion on 'Uniform Civil Code'" },
  { date: "16-06-2023", description: "Felicitation to LITCOF Seniors" },
  { date: "11-05-2023", description: "Annual General Body Meeting" },
  {
    date: "27-06-2022",
    description: "Releasing of 'Chimizhu' & Experience Sharing- Rose Mary (Third)",
  },
  { date: "21-02-2022", description: "Nature Field Trip to Vazhvanthol" },
  {
    date: "19-02-2021",
    description: "Book Review by Aswathy K (Pinakappan by Rachi)",
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
