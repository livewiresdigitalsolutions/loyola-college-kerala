"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

interface AccordionItem {
  id: number;
  title: string;
  content: string;
}

interface OtherActivity {
  id: number;
  text: string;
}

export default function Activities() {
  const [isOpen, setIsOpen] = useState(true);
  const [activities, setActivities] = useState<AccordionItem[]>([]);
  const [otherActivities, setOtherActivities] = useState<OtherActivity[]>([]);

  useEffect(() => {
    fetch("/api/students/college-union?type=accordion-activities")
      .then(r => r.json())
      .then(d => { if (d.success) setActivities(d.data || []); })
      .catch(() => {});
    fetch("/api/students/college-union?type=accordion-other")
      .then(r => r.json())
      .then(d => { if (d.success) setOtherActivities(d.data || []); })
      .catch(() => {});
  }, []);

  if (activities.length === 0 && otherActivities.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
        >
          <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Activities</h2>
          <ChevronUp
            className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`}
          />
        </button>
        <hr className="border-gray-200" />

        {isOpen && (
          <div className="px-6 py-8">
            {/* Main Activities */}
            {activities.map((item, i) => (
              <div key={item.id} className="mb-8 last:mb-0">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-[15px] leading-[1.85] text-justify">{item.content}</p>
                {i < activities.length - 1 && <hr className="border-gray-100 mt-8" />}
              </div>
            ))}

            {/* Other Activities */}
            {otherActivities.length > 0 && (
              <>
                {activities.length > 0 && <hr className="border-gray-100 my-8" />}
                <h3 className="text-lg font-bold text-gray-900 mb-5">Other Activities</h3>
                <ul className="space-y-4">
                  {otherActivities.map(item => (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#13432C] mt-1.5 shrink-0"></span>
                      <span className="text-gray-700 text-[15px] leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
