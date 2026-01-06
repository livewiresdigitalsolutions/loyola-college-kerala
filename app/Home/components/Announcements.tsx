"use client";

import { Megaphone } from 'lucide-react';

export default function AnnouncementMarquee() {
  return (
    <div className="max-w-screen bg-white border-b border-gray-200">
      <div className="flex items-center">

        {/* LEFT TAG */}
        <div className="relative bg-primary text-white px-6 py-3 text-sm font-medium shrink-0 flex items-center gap-2">
          <Megaphone size={18} />
          Announcements
          <span
            className="
              absolute top-1 -right-2
              w-0 h-0
              border-t-[20px] border-b-[20px]
              border-l-[12px] border-l-primary
              border-t-transparent border-b-transparent
            "
          />
        </div>

        {/* MARQUEE */}
        <div className="flex-1 overflow-hidden">
          <div className="marquee px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
            Congratulations to Dr. Simon Thattil, Academic Director, Loyola College of Social Sciences,
            on being elected President of the Indian Accounting Association.
          </div>
        </div>

      </div>

      {/* SAFE GLOBAL CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .marquee {
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </div>
  );
}
