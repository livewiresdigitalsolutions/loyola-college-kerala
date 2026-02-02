"use client";

import { Megaphone } from "lucide-react";

export default function AnnouncementMarquee() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <div className="marquee-wrapper">
            <div className="marquee-content text-sm text-gray-800 px-6 py-2 flex items-center gap-16">

              <span>
                The last date for submitting the online application for admissions is
                <strong> April 13, 2026</strong>. Applicants are advised to complete the process well in advance.
              </span>

              <button
                onClick={scrollToTop}
                className="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:opacity-90 shrink-0"
              >
                Apply Now
              </button>

              <span>
                The <strong>Loyola Common Entrance Exaination (LCET)</strong> for all eligible applicants is scheduled to be held on
                <strong> April 18, 2026</strong>. Detailed instructions will be communicated via the official website.
              </span>

              <button
                onClick={scrollToTop}
                className="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:opacity-90 shrink-0"
              >
                Apply Now
              </button>

              <span>
                The tentative date for declaration of entrance examination results is expected to be
                <strong> during the second week of May 2026</strong>.
              </span>

              <button
                onClick={scrollToTop}
                className="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:opacity-90 shrink-0"
              >
                Apply Now
              </button>

              <span>
                Counseling and admission-related procedures will begin from the
                <strong> first week of June 2026</strong> as per the published schedule.
              </span>

              <button
                onClick={scrollToTop}
                className="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:opacity-90 shrink-0"
              >
                Apply Now
              </button>

            </div>

            {/* DUPLICATE FOR SEAMLESS LOOP */}
            <div className="marquee-content text-sm text-gray-800 px-6 py-2 flex items-center gap-16">
              <span>
                The last date for submitting the online application for admissions is
                <strong> April 13, 2026</strong>. Applicants are advised to complete the process well in advance.
              </span>

              <button
                onClick={scrollToTop}
                className="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:opacity-90 shrink-0"
              >
                Apply Now
              </button>

              <span>
                The <strong>Loyola Common Entrance Exaination (LCET)</strong> for all eligible applicants is scheduled to be held on
                <strong> April 18, 2026</strong>. Detailed instructions will be communicated via the official website.
              </span>

              <button
                onClick={scrollToTop}
                className="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:opacity-90 shrink-0"
              >
                Apply Now
              </button>

              <span>
                The tentative date for declaration of entrance examination results is expected to be
                <strong> during the second week of May 2026</strong>.
              </span>

              <button
                onClick={scrollToTop}
                className="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:opacity-90 shrink-0"
              >
                Apply Now
              </button>

              <span>
                Counseling and admission-related procedures will begin from the
                <strong> first week of June 2026</strong> as per the published schedule.
              </span>

              <button
                onClick={scrollToTop}
                className="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:opacity-90 shrink-0"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SAFE GLOBAL CSS */}
      <style>{`
        .marquee-wrapper {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }

        .marquee-wrapper:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
