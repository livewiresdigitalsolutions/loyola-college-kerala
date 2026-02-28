"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

const activities = [
  {
    title: "Self-Defence Training Workshop",
    date: "March 2019",
    description:
      "A comprehensive self-defence training workshop was organised for women students to equip them with basic safety techniques and self-protection skills. The session was led by trained professionals and received enthusiastic participation from students across all departments.",
    image: "/assets/associations/womens-cell/activity-1.jpg",
  },
  {
    title: "Awareness Session on Women's Rights and Legal Aid",
    date: "January 2019",
    description:
      "An awareness session on women's rights and legal aid was conducted to educate students about existing laws that protect women, available legal remedies, and helpline services. The session empowered students with knowledge of their constitutional and legal rights.",
    image: "/assets/associations/womens-cell/activity-2.jpg",
  },
  {
    title: "Inauguration of Women Cell",
    date: "2018",
    description:
      "The Women Cell was officially inaugurated in 2018 with a series of creative programmes aimed at empowering women students. The inauguration marked the beginning of a dedicated platform for addressing gender issues and promoting women's empowerment on campus.",
    image: "/assets/associations/womens-cell/activity-3.jpg",
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

      {/* Content */}
      {isOpen && (
        <div className="px-6 py-6">
          {activities.map((item, i) => (
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
              {i < activities.length - 1 && <hr className="border-gray-100 mx-6" />}
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
