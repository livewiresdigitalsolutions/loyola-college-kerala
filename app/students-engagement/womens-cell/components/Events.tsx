"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

const events = [
  {
    title: "A Session on \"Female Victims of Crime: A Legal Analysis\"",
    subtitle: "Resource Person – Dr Hameema M, Govt Law College TVM",
    image: "/assets/associations/womens-cell/event-1.jpg",
  },
  {
    title: "Workshop on Paper Bag Making",
    subtitle:
      "Sponsored by The Kerala State Women Development Corporation Limited, Department of Social Justice, Govt Of Kerala. Resource person – Ms Divya S (Research associate in an NGO)",
    image: "/assets/associations/womens-cell/event-2.jpg",
  },
  {
    title: "A Half-Day Session on the Theme \"Blood, Belief & Bourgeoisie\"",
    subtitle: "Speaker – Mr Arjun Unnikrishnan (The Red Cycle)",
    image: "/assets/associations/womens-cell/event-3.jpg",
  },
  {
    title: "Invited Lecture on 'Discussing Gender Issues'",
    subtitle:
      "By Adv Jyothi Vijayakumar in association with International Women's Day",
    image: "/assets/associations/womens-cell/event-4.jpg",
  },
];

export default function Events() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Events</h2>
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
          {events.map((event, i) => (
            <div key={i}>
              <div className="flex flex-col md:flex-row gap-6 py-5">
                {/* Image */}
                <div className="w-full md:w-[200px] h-[160px] md:h-[140px] rounded-lg overflow-hidden shrink-0 bg-gray-200">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={200}
                    height={140}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.subtitle}</p>
                </div>
              </div>
              {i < events.length - 1 && <hr className="border-gray-100 mx-6" />}
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
