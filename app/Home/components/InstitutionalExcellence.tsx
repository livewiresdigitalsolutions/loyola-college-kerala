"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// ── Rotating quotes — easy to extend ─────────────────────────────────────────
const quotes = [
  {
    text: "Education is not merely about acquiring knowledge, but about cultivating wisdom to serve humanity with compassion and justice.",
    author: "Rev. Dr. Jose Kurien",
    title: "Principal, Loyola College of Social Sciences",
  },
  {
    text: "The Jesuit tradition calls us to form men and women for others — leaders who combine competence, conscience, and compassion.",
    author: "Fr. Joseph Edamaram S.J.",
    title: "Founder, Loyola College of Social Sciences",
  },
  {
    text: "True excellence in education lies not just in classrooms, but in the communities we serve and the lives we transform.",
    author: "Loyola College",
    title: "Academic Mission Statement",
  },
];

const AUTO_INTERVAL = 6000;

export default function InstitutionalExcellence() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIdx((i) => (i + 1) % quotes.length);
        setFading(false);
      }, 350);
    }, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    if (idx === activeIdx) return;
    setFading(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setFading(false);
    }, 350);
  };

  const q = quotes[activeIdx];

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            {/* LABEL */}
            <p className="text-sm font-bold text-gray-900 tracking-wider">
              INSTITUTIONAL EXCELLENCE
            </p>

            {/* MAIN HEADING */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tighter">
              Six Decades of Academic Leadership
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-700 font-medium leading-relaxed text-lg">
              Since 1963, Loyola College of Social Sciences has been at the
              forefront of transformative education in Kerala. Our commitment to
              academic rigour, social responsibility, and holistic development has
              earned us recognition as one of India&apos;s premier institutions
              for social sciences.
            </p>

            {/* ROTATING QUOTE BOX */}
            <div className="border-l-4 border-primary pl-6 py-2 min-h-[120px]">
              <blockquote
                className="text-gray-800 text-lg italic leading-relaxed transition-opacity duration-350"
                style={{ opacity: fading ? 0 : 1 }}
              >
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <p
                className="text-sm font-medium text-gray-600 mt-3 transition-opacity duration-350"
                style={{ opacity: fading ? 0 : 1 }}
              >
                — {q.author},{" "}
                <span className="text-gray-400 font-normal">{q.title}</span>
              </p>

              {/* DOTS */}
              <div className="flex gap-2 mt-4">
                {quotes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Quote ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeIdx
                        ? "bg-primary w-6"
                        : "bg-gray-300 hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/assets/graduation-ceremony.png"
              alt="Graduation Ceremony at Loyola College"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
