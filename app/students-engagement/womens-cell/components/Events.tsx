"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

interface EventItem { id: number; title: string; subtitle: string; image_url: string; }

export default function Events() {
  const [isOpen, setIsOpen] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch("/api/students/womens-cell?type=events")
      .then(r => r.json())
      .then(d => { if (d.success) setEvents(d.data || []); })
      .catch(() => {});
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors">
          <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Events</h2>
          <ChevronUp className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <div className="px-6 py-6">
            {events.map((event, i) => (
              <div key={event.id}>
                <div className="flex flex-col md:flex-row gap-6 py-5">
                  <div className="w-full md:w-[200px] h-[160px] md:h-[140px] rounded-lg overflow-hidden shrink-0 bg-gray-200">
                    <Image src={event.image_url} alt={event.title} width={200} height={140} className="object-cover w-full h-full" />
                  </div>
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
