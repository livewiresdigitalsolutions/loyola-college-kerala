import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Syllabus, SyllabusLink, PublicationCategory } from "../../data/types";

interface SyllabusSectionProps {
  syllabus: {
    ug: Syllabus[];
    pg: Syllabus[];
  };
  syllabusLinks?: SyllabusLink[];
  publications?: PublicationCategory[];
}

export default function SyllabusSection({
  syllabus,
  syllabusLinks,
  publications,
}: SyllabusSectionProps) {
  const hasSyllabusLinks = syllabusLinks && syllabusLinks.length > 0;
  const hasPublications = publications && publications.length > 0;

  if (!hasSyllabusLinks && !hasPublications) return null;

  return (
    <>
      {/* ── SYLLABUS SECTION ── */}
      {hasSyllabusLinks && (
        <section className="py-16 bg-[#f5f0e8]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2
              className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-10"
              style={{ color: "#1a3c2a", fontFamily: "serif" }}
            >
              Syllabus
            </h2>

            {/* Syllabus pill buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {syllabusLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                  style={{ backgroundColor: "#1a5632" }}
                >
                  {link.label}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PUBLICATIONS SECTION ── */}
      {hasPublications && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2
              className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-2"
              style={{ color: "#1a3c2a", fontFamily: "serif" }}
            >
              Publications
            </h2>
            {/* Decorative underline */}
            <div
              className="w-20 h-[3px] mx-auto mb-12"
              style={{ backgroundColor: "#1a5632" }}
            />

            {/* Publications grid */}
            <div
              className="grid gap-12"
              style={{
                gridTemplateColumns: `repeat(${publications.length}, minmax(0, 1fr))`,
              }}
            >
              {publications.map((category, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Circular image */}
                  <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-gray-200 shadow-md mb-5">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {category.title}
                  </h3>

                  {/* Publication items */}
                  <ul className="space-y-2 mb-6">
                    {category.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-gray-600 text-sm italic"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* View All button */}
                  {category.viewAllLink && (
                    <a
                      href={category.viewAllLink}
                      className="inline-block px-6 py-2.5 text-white text-sm font-semibold rounded transition-all duration-300 hover:opacity-90 hover:shadow-md"
                      style={{ backgroundColor: "#1a3c2a" }}
                    >
                      View All
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
