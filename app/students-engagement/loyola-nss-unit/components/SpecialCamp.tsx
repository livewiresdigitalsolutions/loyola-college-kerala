"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

const aims = [
  "To sensitize the students about the living conditions of the poor and to develop a feeling of social integration in them",
  "To create awareness among the students that higher education should not alienate them from the downtrodden sections of the society.",
  "To create awareness among community people that they are not kept aloof from the common stream of society.",
  "Develop competence required for group-living and sharing of responsibilities",
];

export default function SpecialCamp() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Special Camp</h2>
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
          <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
            To build social sensitivity in the youth, NSS always promoted rural live in camps where
            the students live with a selected community for a period of 10 days to have a real life
            experience of that community. Later these 10 days is reduced to 7 days by the University.
            A seven-day group living with limited amenities and the interaction with the community,
            give the student a first-hand picture of the struggle, a common man in that particular
            community has to face, to make both the ends meet. Normally, a socio-economically backward
            area will be the priority.
          </p>

          <p className="text-gray-700 text-[15px] leading-relaxed mb-8">
            Loyola has a history of vibrant and live memories of camp life, cherished by the various
            batches of 1963 onwards. This year was also not different. Instead of 10 days, university
            stipulated a 7-day camp and this year it will be conducted at Karimkulam, a small coastal
            village near Poovar.
          </p>

          {/* Aims Section */}
          <h3 className="text-lg font-bold text-[#13432C] mb-5">Aims of Special Camp</h3>
          <ul className="space-y-4">
            {aims.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#13432C] mt-1.5 shrink-0"></span>
                <span className="text-gray-700 text-[15px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </section>
  );
}
