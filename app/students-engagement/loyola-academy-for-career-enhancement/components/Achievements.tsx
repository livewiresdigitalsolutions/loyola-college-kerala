"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

const achievements = [
  {
    title: "Career Awareness Workshop",
    date: "15th March 2025",
    description:
      "LACE organised a career awareness workshop for students to explore job opportunities in the competitive world. The session was led by industry experts who provided insights into emerging career paths and essential skills.",
    image: "/assets/associations/lace/achievement-1.jpg",
  },
];

export default function Achievements() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Achievements</h2>
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
          {achievements.map((item, i) => (
            <div key={i}>
              <div className="flex flex-col md:flex-row gap-6 py-5">
                {/* Image */}
                <div className="w-full md:w-[200px] h-[160px] md:h-[140px] rounded-lg overflow-hidden shrink-0 bg-gray-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={200}
                    height={140}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-[#D4A12A] font-medium mb-3">{item.date}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
              {i < achievements.length - 1 && <hr className="border-gray-100 mx-6" />}
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
