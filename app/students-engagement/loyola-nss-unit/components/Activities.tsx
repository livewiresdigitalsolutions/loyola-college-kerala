"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

const activities = [
  {
    title: "Blood Donation Camp",
    date: "15th June 2025",
    description:
      "NSS Unit of Loyola College organised a blood donation camp in collaboration with the District Blood Bank. Over 50 volunteers donated blood, making it one of the most successful camps in the college's history.",
    image: "/assets/associations/nss/activity-1.jpg",
  },
  {
    title: "Campus Cleaning Drive",
    date: "2nd October 2024",
    description:
      "As part of Gandhi Jayanti celebrations, the NSS volunteers undertook a massive campus cleaning drive, promoting the Swachh Bharat initiative. The drive extended to the neighbouring community as well.",
    image: "/assets/associations/nss/activity-2.jpg",
  },
  {
    title: "Tree Plantation Programme",
    date: "5th June 2024",
    description:
      "On World Environment Day, the NSS Unit organised a tree plantation programme within the campus and nearby areas. Over 100 saplings were planted by the NSS volunteers along with the faculty members.",
    image: "/assets/associations/nss/activity-3.jpg",
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
