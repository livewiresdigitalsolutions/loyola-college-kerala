"use client";

import { useState } from "react";
import { ChevronUp, Calendar } from "lucide-react";

const announcements = [
  {
    date: "March 8, 2025",
    title: "International Women's Day Celebrations",
    description:
      "The Women Cell invites all students to participate in the International Women's Day celebrations. A series of activities including panel discussions, cultural programmes, and an art exhibition will be organised.",
  },
  {
    date: "February 15, 2025",
    title: "Registration Open: Leadership Workshop for Women",
    description:
      "A two-day leadership workshop exclusively for women students is being organised in collaboration with KSWDC. Interested students can register at the Women Cell office.",
  },
  {
    date: "January 20, 2025",
    title: "Women Cell Monthly Meeting",
    description:
      "The monthly meeting of the Women Cell will be held to discuss upcoming programmes and initiatives. All committee members and student volunteers are requested to attend.",
  },
];

export default function News() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">News / Announcements</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Content */}
      {isOpen && (
        <div className="px-6 py-6">
          {announcements.map((item, i) => (
            <div key={i}>
              <div className="py-5">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#D4A12A]" />
                  <span className="text-sm text-[#D4A12A] font-medium">{item.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
              {i < announcements.length - 1 && <hr className="border-gray-100 mx-6" />}
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
