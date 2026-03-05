"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

interface Activity {
  id: number;
  date: string;
  description: string;
}

const fallback: Activity[] = [
  { id: -1, date: "24th Jan 2025", description: "Exposure visit to Energy Management Centre" },
  { id: -2, date: "18th Jan 2025", description: "Discussion on 'Oil, Politics, and Global Norms: Understanding US Actions in Venezuela and Resistance'" },
  { id: -3, date: "9th January 2025", description: "LITCOF's first Meeting in 2025" },
  { id: -4, date: "18th November 2024", description: "Discussion on United Nations- Roles and Relevance" },
  { id: -5, date: "12-09-2024", description: "A Discussion on 'The Questions raised by Jay's Death'" },
  { id: -6, date: "01-07-2024", description: "Experience Sharing & Felicitation to the Seniors & Competition Winners" },
  { id: -7, date: "03-04-2024", description: "Chimizhu Release" },
  { id: -8, date: "20-03-2024", description: "Discussion on 'NEP 2020'" },
  { id: -9, date: "14-03-2024", description: "Discussion on 'Secularism and Indian Constitution'" },
  { id: -10, date: "03-01-2024", description: "Discussion on 'Israel -Hamas War'" },
  { id: -11, date: "13-12-2023", description: "A Nature field to Palaruvi" },
  { id: -12, date: "11-12-2023", description: "Discussion on 'Women Reservation'" },
  { id: -13, date: "19-06-2023", description: "Discussion on 'Uniform Civil Code'" },
  { id: -14, date: "16-06-2023", description: "Felicitation to LITCOF Seniors" },
  { id: -15, date: "11-05-2023", description: "Annual General Body Meeting" },
  { id: -16, date: "27-06-2022", description: "Releasing of 'Chimizhu' & Experience Sharing- Rose Mary (Third)" },
  { id: -17, date: "21-02-2022", description: "Nature Field Trip to Vazhvanthol" },
  { id: -18, date: "19-02-2021", description: "Book Review by Aswathy K (Pinakappan by Rachi)" },
];

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>(fallback);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetch("/api/students/loyola-in-the-company-of-friends?type=activities")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setActivities(d.data); })
      .catch(() => {/* keep fallback */ });
  }, []);

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
            className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"
              }`}
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
