"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useProgramData } from "./useProgramData";

// ── simple count-up hook ──────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatItem({
  stat,
  active,
}: {
  stat: { icon: string; value: number; suffix: string; label: string; sub: string };
  active: boolean;
}) {
  const count = useCountUp(stat.value, 1400, active);
  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
      <Image
        src={stat.icon}
        alt={stat.label}
        width={64}
        height={64}
        className="w-12 h-12 sm:w-16 sm:h-16 shrink-0"
      />
      <div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 font-bold text-white">
          {count}
          {stat.suffix} {stat.label}
        </h3>
        <p className="text-white/80 text-sm md:text-base">{stat.sub}</p>
      </div>
    </div>
  );
}

export default function LoyolaAtAGlance() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  
  const { ug, pg, phd } = useProgramData();
  const stats = [
    {
      icon: "/icons/Graduationcap.png",
      value: ug.length,
      suffix: "",
      label: "UG Programmes",
      sub: "Four-Year Undergraduate Programmes",
    },
    {
      icon: "/icons/Graduationcap.png",
      value: pg.length,
      suffix: "",
      label: "PG Programmes",
      sub: "Postgraduate Specialisations",
    },
    {
      icon: "/icons/Graduationcap.png",
      value: phd.length,
      suffix: "",
      label: "Ph.D Programmes",
      sub: "Research & Doctoral Studies",
    },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── ABOUT SECTION ─────────────────────────────────────────────── */}
      <section className="w-full bg-[#F6F6EE] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* LEFT CONTENT */}
            <div className="flex flex-col justify-between order-1">
              <div className="space-y-8">
                <div className="flex items-left flex-col gap-6">
                  <div className="w-full h-px bg-primary/50"></div>
                  <h1 className="text-sm font-bold text-gray-900 tracking-wider">
                    SINCE 1963
                  </h1>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900">
                  Education that <br />
                  engages society, <br />
                  not just classrooms.
                </h2>

                <p className="text-gray-700 leading-relaxed lg:pr-10 font-medium text-base md:text-lg text-justify">
                  Loyola College of Social Sciences (Autonomous), one of the
                  oldest Social Science Colleges in India, was founded in 1963
                  by a visionary Jesuit Fr. Joseph Edamaram S.J, to bring social
                  changes in Kerala and society at large. The College instils
                  excellence in life through service. True to the Jesuit ideal
                  of MAGIS (Excellence) and the commitment to Faith and Justice,
                  Loyola strives to extend the benefits of higher education to
                  the people, especially the marginalized.
                </p>
                <p className="text-gray-700 leading-relaxed lg:pr-10 font-medium text-base md:text-lg text-justify">
                  Loyola College of Social Sciences is a living tradition, an
                  organic entity of the Global Network of Jesuit Higher
                  Education. The Jesuit education aims at forming men and women
                  for others, leaders of competence, conscience, compassion and
                  commitment.
                </p>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-base hover:gap-4 transition-all duration-300 group relative w-fit"
                >
                  <span className="relative">
                    Learn About Our History
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* RIGHT OVERLAPPING IMAGES */}
            <div className="relative w-full h-[500px] sm:h-[550px] lg:h-[650px] order-2 mt-12 lg:mt-0">
              <div className="absolute top-0 right-0 w-[70%] h-[55%] overflow-visible shadow-2xl z-10">
                <Image
                  src="/assets/CampusActivities.png"
                  alt="Loyola College Campus"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 border-t-[6px] sm:border-t-8 border-r-[6px] sm:border-r-8 border-primary rounded-none" />
              </div>
              <div className="absolute bottom-0 left-0 w-[70%] h-[55%] overflow-visible shadow-2xl z-20">
                <Image
                  src="/assets/loyola-building.png"
                  alt="Loyola College Building"
                  fill
                  className="object-cover"
                />
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 border-b-[6px] sm:border-b-8 border-l-[6px] sm:border-l-8 border-primary rounded-none" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ─────────────────────────────────────────────── */}
      <section className="w-full bg-white pb-20 pt-20" ref={statsRef}>
        <div className="w-[90%] mx-auto">
          <div className="bg-primary rounded-xl p-6 sm:p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-4 w-full md:w-auto">
                  {/* Divider between items */}
                  {i > 0 && (
                    <div className="hidden md:block w-px h-20 bg-white/30 mr-4" />
                  )}
                  <StatItem stat={stat} active={statsVisible} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
