"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

const achievements = [
  {
    title: "Nature Tour 2021",
    date: "27th February 2021",
    description:
      "LITCOF organised a nature tour to Vazhvanthol water falls on 27 th February 2021. Forty One senior students and Three faculty members (Dr. Sunil Kumar, Fr. Saji S.J, Dr. Nisha Jolly Nelson and Fr. Sunny Kunnapallit S.J) participated.",
    image: "/assets/associations/litcof/nature-tour-2021.jpg",
  },
  {
    title: "Nature Tour 2020",
    date: "February 29, 2020",
    description:
      "Today (February 29) we had a wonderful time. After lot of tough schedule finally our tour became a grand success... I am damn sure that everyone enjoyed the day wholeheartedly... I take this opportunity to thank our Backbones of our LITCOF. SAJI ACHAN and SUNIL sir for arranging such a wonderful trip... Special thanks to Nisha mam and Lakshmi mam for accompanying with us. Special mention to Priya who have done her duty in a perfect manner as a coordinator. Finally I thank everyone for coming and made this day a great success ...Kudoos to Litcof\" - Adhil K U \"I too was personally very happy after yesterday's picnic. After 1 and a half years this was the most memorable event i have ever received from this college. I specially thank all my dear faculty members and my dearest friends who lead this event to such an experience where the memories will always linger in my mind wherever i am in my life journey. love u all\" - Brother Arun Joseph",
    image: "/assets/associations/litcof/nature-tour-2020.jpg",
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
