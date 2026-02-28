"use client";

import { useState } from "react";
import { ChevronUp, Leaf } from "lucide-react";

export default function BioDiversity() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Bio-diversity</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {isOpen && (
        <div className="px-6 py-8">
          <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
            To foster higher sensitivity to bio-diversity and awareness about ecology and
            environment. Three bio-diversity parks are there in Loyola campus to bring in the concept
            of diverse flora and fauna.
          </p>

          {/* Three Parks */}
          <h3 className="text-lg font-bold text-[#13432C] mb-4">Three Bio-diversity Parks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {["Thanal Park", "Daya Park", "Violet-Bouquet"].map((park, i) => (
              <div
                key={i}
                className="bg-[#F6F6EE] border border-[#13432C]/10 rounded-lg px-5 py-4 flex items-center gap-3"
              >
                <Leaf className="w-5 h-5 text-[#13432C] shrink-0" />
                <span className="font-semibold text-[#13432C] text-[15px]">{park}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-[15px] leading-relaxed mb-8 italic">
            The bio-diversity park was inaugurated by the renowned activist and social reformer
            Ms. Dayabhai on 24th July 2014.
          </p>

          <hr className="border-gray-100 mb-8" />

          {/* One Student One Plant */}
          <h3 className="text-lg font-bold text-[#13432C] mb-3">One Student One Plant</h3>
          <p className="text-gray-700 text-[15px] leading-relaxed mb-4">
            To inculcate the principle of value of life among students this project is initiated. The
            students only plant the saplings and they water it, manure it and take care of it and
            hand it over to the next batch. The cycle repeats. The project is supported by
            Bio-diversity board and college.
          </p>
          <p className="text-gray-600 text-[15px] leading-relaxed mb-8">
            A bio-diversity register which consists of the list of all plants and their scientific
            names is maintained.
          </p>

          <hr className="border-gray-100 mb-8" />

          {/* Environment Day Celebrations */}
          <h3 className="text-lg font-bold text-[#13432C] mb-4">Environment Day Celebrations</h3>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#13432C] mt-1.5 shrink-0"></span>
              <span className="text-gray-700 text-[15px] leading-relaxed">
                <strong>Mazhanadattam</strong> – Rain walk through the forest area of Ponmudi
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#13432C] mt-1.5 shrink-0"></span>
              <span className="text-gray-700 text-[15px] leading-relaxed">
                <strong>Kadakkoru Maram</strong> – Gifting saplings to shop keepers in Sreekaryam
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#13432C] mt-1.5 shrink-0"></span>
              <span className="text-gray-700 text-[15px] leading-relaxed">
                <strong>Gift a Green</strong> – Gifting saplings to nearby Anganawadis
              </span>
            </li>
          </ul>

          <hr className="border-gray-100 mb-8" />

          {/* Bio-diversity Audit */}
          <h3 className="text-lg font-bold text-[#13432C] mb-3">Bio-diversity Audit</h3>
          <p className="text-gray-700 text-[15px] leading-relaxed">
            To identify the trees and plants on the campus. A comprehensive audit of the campus
            flora is conducted periodically to document and preserve the bio-diversity of the
            college grounds.
          </p>
        </div>
      )}
      </div>
    </section>
  );
}
