"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

interface Theme {
  id: number;
  theme: string;
  display_order: number;
  is_active: boolean;
}

const LG = "#13432C";

export default function SuggestedThemes() {
  const [isOpen, setIsOpen] = useState(true);
  const [themes, setThemes] = useState<Theme[]>([]);

  useEffect(() => {
    fetch("/api/students/loyola-ethnographic-theatre?type=themes")
      .then(r => r.json())
      .then(d => { if (d.success) setThemes(d.data || []); })
      .catch(() => { });
  }, []);

  if (themes.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
        >
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: LG }}>
            Suggested Themes / Issues
          </h2>
          <ChevronUp
            className="w-5 h-5 transition-transform duration-300"
            style={{ transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </button>
        <hr className="border-gray-200" />

        {/* Content - Tag Pills */}
        {isOpen && (
          <div className="px-6 py-8">
            <div className="flex flex-wrap gap-3">
              {themes.map((theme) => (
                <span
                  key={theme.id}
                  className="px-4 py-1.5 rounded-full text-sm font-medium"
                  style={{ border: `1px solid ${LG}`, color: LG }}
                >
                  {theme.theme}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
