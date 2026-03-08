"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  date: string;
  description: string;
  image_url: string;
}

const LG = "#13432C";

const fallback: Achievement[] = [
  {
    id: -1,
    title: "Career Awareness Workshop",
    date: "15th March 2025",
    description:
      "LACE organised a career awareness workshop for students to explore job opportunities in the competitive world. The session was led by industry experts who provided insights into emerging career paths and essential skills.",
    image_url: "/assets/associations/lace/achievement-1.jpg",
  },
];

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(fallback);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetch("/api/students/loyola-academy-for-career-enhancement?type=achievements")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setAchievements(d.data); })
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
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: LG }}>Achievements</h2>
          <ChevronUp
            className="w-5 h-5 transition-transform duration-300"
            style={{ color: LG, transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </button>
        <hr className="border-gray-200" />

        {/* Content */}
        {isOpen && (
          <div className="px-6 py-6">
            {achievements.map((item, i) => (
              <div key={item.id}>
                <div className="flex flex-col md:flex-row gap-6 py-5">
                  {/* Image — fill guarantees exact uniform size */}
                  <div
                    className="relative rounded-lg overflow-hidden shrink-0 bg-gray-200"
                    style={{ width: 200, minWidth: 200, height: 140 }}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="200px"
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
