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

const fallback: Achievement[] = [
  {
    id: -1,
    title: "Nature Tour 2021",
    date: "27th February 2021",
    description: "LITCOF organised a nature tour to Vazhvanthol water falls on 27 th February 2021. Forty One senior students and Three faculty members (Dr. Sunil Kumar, Fr. Saji S.J, Dr. Nisha Jolly Nelson and Fr. Sunny Kunnapallit S.J) participated.",
    image_url: "/assets/associations/litcof/nature-tour-2021.jpg",
  },
  {
    id: -2,
    title: "Nature Tour 2020",
    date: "February 29, 2020",
    description: "Today (February 29) we had a wonderful time. After lot of tough schedule finally our tour became a grand success... I am damn sure that everyone enjoyed the day wholeheartedly... I take this opportunity to thank our Backbones of our LITCOF. SAJI ACHAN and SUNIL sir for arranging such a wonderful trip... Special thanks to Nisha mam and Lakshmi mam for accompanying with us. Special mention to Priya who have done her duty in a perfect manner as a coordinator. Finally I thank everyone for coming and made this day a great success ...Kudoos to Litcof\" - Adhil K U \"I too was personally very happy after yesterday's picnic. After 1 and a half years this was the most memorable event i have ever received from this college. I specially thank all my dear faculty members and my dearest friends who lead this event to such an experience where the memories will always linger in my mind wherever i am in my life journey. love u all\" - Brother Arun Joseph",
    image_url: "/assets/associations/litcof/nature-tour-2020.jpg",
  },
];

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(fallback);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetch("/api/students/loyola-in-the-company-of-friends?type=achievements")
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
          <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Achievements</h2>
          <ChevronUp
            className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"
              }`}
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
