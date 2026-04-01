"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useProgramData } from "./useProgramData";

const tabs = [
  {
    key: "ug",
    label: "FYUG Programmes",
    description:
      "Build a strong foundation in arts, science and social sciences through our comprehensive four-year undergraduate programmes.",
    image: "/assets/UG.png",
    link: "/academics/programmes-and-course",
    linkText: "View All UG Programmes",
  },
  {
    key: "pg",
    label: "PG Programmes",
    description:
      "Deepen your expertise with advanced studies in specialised areas of social sciences, management, and applied disciplines.",
    image: "/assets/PG.png",
    link: "/academics/programmes-and-course",
    linkText: "View All PG Programmes",
  },
  {
    key: "phd",
    label: "Ph.D",
    description:
      "Contribute to cutting-edge research and advance the field of social sciences through doctoral scholarship.",
    image: "/assets/PHD.png",
    link: "/academics/programmes-and-course",
    linkText: "View Doctoral Programmes",
  },
];

export default function AcademicProgrammes() {
  const { ug, pg, phd, loading } = useProgramData();

  const programmeMap: Record<string, string[]> = {
    ug,
    pg,
    phd,
  };

  return (
    <section className="w-full bg-[#F6F6EE] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-sm font-bold text-gray-900 tracking-wider mb-4">
            ACADEMIC EXCELLENCE
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter">
              Explore Our Programmes
            </h2>
            <Link
              href="/academics/programmes-and-course"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group shrink-0"
            >
              <span className="relative">
                View All Programmes
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-gray-600 max-w-2xl text-lg mt-4">
            Choose from a diverse range of undergraduate, postgraduate, and
            doctoral programmes — all designed to foster critical thinking and
            social responsibility.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-gray-500 font-medium">Loading programmes...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tabs.map((tab) => {
              const programs = programmeMap[tab.key];

              return (
                <div
                  key={tab.key}
                  className="group flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* IMAGE SECTION */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={tab.image}
                      alt={tab.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Programme count badge */}
                    <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      {programs.length} Programme{programs.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="bg-white group-hover:bg-primary text-gray-900 group-hover:text-white p-8 flex-1 flex flex-col transition-colors duration-300">
                    <h3 className="text-2xl font-bold mb-3">{tab.label}</h3>

                    <p className="text-gray-700 group-hover:text-white/90 mb-5 leading-relaxed text-sm transition-colors duration-300">
                      {tab.description}
                    </p>

                    {/* PROGRAMMES LIST — dynamically from db via api */}
                    <ul className="space-y-2 mb-6 flex-1">
                      {programs.length === 0 ? (
                        <li className="text-sm text-gray-500 group-hover:text-white/80 italic">
                          No programmes added yet.
                        </li>
                      ) : (
                        programs.map((program, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-gray-900 group-hover:text-white transition-colors duration-300"
                          >
                            <span className="text-primary group-hover:text-white/60 mt-0.5 text-base leading-none">
                              •
                            </span>
                            <span className="text-sm font-medium">{program}</span>
                          </li>
                        ))
                      )}
                    </ul>

                    {/* LINK */}
                    <Link
                      href={tab.link}
                      className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all duration-300 text-primary group-hover:text-white text-sm mt-auto pt-4 border-t border-gray-100 group-hover:border-white/20"
                    >
                      {tab.linkText}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
