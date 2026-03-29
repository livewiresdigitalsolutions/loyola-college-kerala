"use client";

import { useState, useEffect } from "react";
import { ChevronUp, Calendar } from "lucide-react";

interface NewsItem { id: number; title: string; date: string; description: string; }

export default function News() {
  const [isOpen, setIsOpen] = useState(true);
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/students/womens-cell?type=news")
      .then(r => r.json())
      .then(d => { if (d.success) setItems(d.data || []); })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors">
          <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">News / Announcements</h2>
          <ChevronUp className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <div className="px-6 py-6">
            {items.map((item, i) => (
              <div key={item.id}>
                <div className="py-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#D4A12A]" />
                    <span className="text-sm text-[#D4A12A] font-medium">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {i < items.length - 1 && <hr className="border-gray-100 mx-6" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
