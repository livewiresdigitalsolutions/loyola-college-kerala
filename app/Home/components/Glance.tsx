"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoyolaAtAGlance() {
  return (
    <>
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* LEFT CONTENT */}
            <div className="flex flex-col h-[450px] lg:h-[650px] justify-between">
              <div className="space-y-8">
                {/* THIN LINE + SINCE 1963 */}
                <div className="flex items-left flex-col gap-6">
                  <div className="w-full h-[1px] bg-primary/30"></div>
                  <h1 className="text-sm font-medium text-gray-500 tracking-wider">
                    SINCE 1963
                  </h1>
                </div>

                {/* MAIN HEADING */}
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                  Education that <br />
                  engages society, <br />
                  not just classrooms.
                </h2>

                {/* PARAGRAPH */}
                <p className="text-gray-700 leading-relaxed text-lg">
                  At Loyola, we believe true intelligence is measured by
                  impact. Our curriculum moves beyond textbooks to challenge
                  the mind and move the heart toward meaningful action. We
                  don't just teach students to read the world—we prepare them
                  to shape it.
                </p>
              </div>

              {/* LINK WITH ICON - ALIGNED TO BOTTOM */}
              <Link
                href="/philosophy"
                className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-4 transition-all duration-300 group relative w-fit"
              >
                <span className="relative">
                  Read About Our Philosophy
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* RIGHT OVERLAPPING IMAGES */}
            <div className="relative w-full h-[600px] lg:h-[650px]">
              {/* FIRST IMAGE - TOP RIGHT */}
              <div className="absolute top-0 right-0 w-[70%] h-[55%] overflow-hidden shadow-2xl z-10">
                <Image
                  src="/assets/loyola-building.png"
                  alt="Loyola College Campus"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* SECOND IMAGE - BOTTOM LEFT (OVERLAPPING) */}
              <div className="absolute bottom-0 left-0 w-[70%] h-[55%] overflow-hidden shadow-2xl z-20">
                <Image
                  src="/assets/loyola-building.png"
                  alt="Loyola College Students"
                  fill
                  className="object-cover"
                />
              </div>

              {/* OPTIONAL: DECORATIVE ELEMENT */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - GREEN WITH ROUNDED CORNERS */}
      <section className="w-full bg-white pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-primary rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* STAT 1 */}
              <div className="flex items-center gap-4">
                <Image
                  src="/icons/Graduationcap.png"
                  alt="Graduation Cap"
                  width={64}
                  height={64}
                  className="w-16 h-16 flex-shrink-0"
                />
                <div>
                  <h3 className="text-3xl md:text-4xl mb-2 font-bold text-white">
                    30+ Programs
                  </h3>
                  <p className="text-white/90 text-sm md:text-base">
                    Across Arts, Science and Commerce
                  </p>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="hidden md:block w-[1px] h-20 bg-white/30"></div>

              {/* STAT 2 */}
              <div className="flex items-center gap-4">
                <Image
                  src="/icons/Graduationcap.png"
                  alt="Users"
                  width={64}
                  height={64}
                  className="w-16 h-16 flex-shrink-0"
                />
                <div>
                  <h3 className="text-3xl md:text-4xl mb-2 font-bold text-white">
                    5000+ Students
                  </h3>
                  <p className="text-white/90 text-sm md:text-base">
                    From diverse backgrounds
                  </p>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="hidden md:block w-[1px] h-20 bg-white/30"></div>

              {/* STAT 3 */}
              <div className="flex items-center gap-4">
                <Image
                  src="/icons/Graduationcap.png"
                  alt="Award"
                  width={64}
                  height={64}
                  className="w-16 h-16 flex-shrink-0"
                />
                <div>
                  <h3 className="text-3xl md:text-4xl mb-2 font-bold text-white">
                    A++ Grade
                  </h3>
                  <p className="text-white/90 text-sm md:text-base">
                    NAAC Accredited Institution
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
