"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

interface Activity { id: number; title: string; date: string; description: string; image_url: string; }

export default function Activities() {
  const [isOpen, setIsOpen] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/students/womens-cell?type=activities")
      .then(r => r.json())
      .then(d => { if (d.success) setActivities(d.data || []); })
      .catch(() => {});
  }, []);

  if (activities.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors">
          <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Activities</h2>
          <ChevronUp className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <div className="px-6 py-6">
            {activities.map((item, i) => (
              <div key={item.id}>
                <div className="flex flex-col md:flex-row gap-6 py-5">
                  <div className="w-full md:w-[200px] h-[160px] md:h-[140px] rounded-lg overflow-hidden shrink-0 bg-gray-200">
                    <Image src={item.image_url} alt={item.title} width={200} height={140} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                    {item.date && <p className="text-sm text-[#D4A12A] font-medium mb-3">{item.date}</p>}
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
