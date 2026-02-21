import { AssociationData } from "../_data/associations";

interface AboutProps {
  data: AssociationData;
}

export default function About({ data }: AboutProps) {
  return (
    <section id="about" className="scroll-mt-32 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-10 h-[3px] bg-[#F0B129] rounded-full" />
          <span className="text-sm font-bold tracking-widest text-[var(--primary)] uppercase">
            About Us
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Text Content */}
          <div className="flex-1 space-y-5">
            {data.about_paragraphs.map((para, idx) => (
              <p key={idx} className="text-gray-700 text-[15px] leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Emblem */}
          <div className="lg:w-[320px] shrink-0">
            <div className="border-4 border-[var(--secondary)] rounded-lg p-4 bg-white shadow-sm">
              <div className="relative w-full aspect-square rounded overflow-hidden bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
                <div className="text-center p-6">
                  <div
                    className="w-36 h-36 mx-auto rounded-full flex items-center justify-center shadow-lg mb-3"
                    style={{ backgroundColor: data.tag_color }}
                  >
                    <span className="text-4xl font-black text-white tracking-wider">
                      {data.name}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mt-4 leading-snug">
                    {data.full_name}
                  </p>
                  <p className="text-xs text-emerald-700 italic mt-2">
                    {data.motto}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
