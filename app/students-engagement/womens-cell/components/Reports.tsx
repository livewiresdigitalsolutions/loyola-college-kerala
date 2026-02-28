"use client";

import { useState } from "react";
import { ChevronUp, FileText } from "lucide-react";

const reports = [
  {
    title: "Women Cell Report – 2019",
    link: "/assets/associations/womens-cell/women-cell-report-2019.pdf",
  },
  {
    title: "Women Cell Report – 2018",
    link: "/assets/associations/womens-cell/women-cell-report-2018.pdf",
  },
];

export default function Reports() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Reports</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Content */}
      {isOpen && (
        <div className="px-6 py-8">
          <ul className="space-y-4">
            {reports.map((report, i) => (
              <li key={i}>
                <a
                  href={report.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[#13432C] hover:underline font-medium text-[15px] group"
                >
                  <FileText className="w-5 h-5 text-[#13432C] group-hover:scale-110 transition-transform" />
                  {report.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </section>
  );
}
