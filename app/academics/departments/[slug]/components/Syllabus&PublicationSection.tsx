import React from "react";
import { Download, BookText } from "lucide-react";
import { Syllabus } from "../../data/types";

interface SyllabusSectionProps {
  syllabus: {
    ug: Syllabus[];
    pg: Syllabus[];
  };
}

export default function SyllabusSection({ syllabus }: SyllabusSectionProps) {
  const renderSyllabus = (syllabi: Syllabus[], title: string) => {
    if (syllabi.length === 0) return null;

    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {syllabi.map((sem, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-primary">
                  {sem.semester}
                </h4>
                {sem.pdfLink && (
                  <a
                    href={sem.pdfLink}
                    download
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                )}
              </div>
              <ul className="space-y-2">
                {sem.subjects.map((subject, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-gray-700 text-sm"
                  >
                    <BookText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{subject}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Course Syllabus
        </h2>

        {renderSyllabus(syllabus.ug, "Undergraduate Syllabus")}
        {renderSyllabus(syllabus.pg, "Postgraduate Syllabus")}
      </div>
    </section>
  );
}
