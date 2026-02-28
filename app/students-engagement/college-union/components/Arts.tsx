"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

const artsSections = [
  {
    title: "Arts Day",
    content: `Loyola college has the tradition of promoting wide range of art genres including music, dance, film, fine arts, literature, poetry etc. It solely understood as an essential part of Jesuit formation initiative where students get animated to express through the talents they have. Generally it is focused on visual arts or performing arts when organized under Arts festivals or Annual Arts day; which may feature a mixed program that include music, theatre, comedy, entertainment items that disseminate social science, or street theatre, and are typically presented in venues on a working day. Each event within the program is usually decided by the College Union Arts Secretary in the presence of the College Union Advisor, and Faculty Arts Advisor.

Available PG students are grouped into four teams in a public formal meeting to be attended by all the students and teachers. Team will be formulated in an objective democratic manner with the help of team captain and vice captains nominated by the student forum. Muster roll will be presented to all the Captains in the presence of the College Union Advisor and Faculty Arts Advisor. Teams will be directed to choose names to their teams and they will be known by that name during the conduct of competitions and till the announcement of results. Arts festival is largely curated by a four member functional committee nominated by the College Union. Members so nominated will handle the organization of Arts Day and will not be allowed to participate in the events. Our college attempts to make arts festivals distinctive from other colleges by ensuring presence of each and every student of the college on stage for at least one event or the other, which typically help students overcome their stage fright beyond their actual interest in Visual Arts or theatre. Kalaprathibha and Kalathilakam are selected and awarded prizes for a boy securing highest points and a girl respectively. Along with talent development, arts fest or arts day creates togetherness and fellowship among students and teachers on campus.`,
  },
  {
    title: "Sports Day",
    content: `Sports Day is organized under the auspice of College Union every year where sports events are planned and staged with the total participation of our college. This is a platform made available in which people participate in competitive sporting activities. Available PG students are grouped into four teams in a public formal meeting to be attended by all the students and teachers. The team will be formulated in an objective democratic manner with the help of team captain and vice-captains nominated by the student forum. Muster roll will be presented to all the Captains in the presence of the College Union Advisor, Sports Secretary, and Faculty Sports Advisor.

Captains are given space to call their choice based on the merit of the candidates so as to form four equally competent teams. Based on a lucky draw, teams will be then assigned to captains to ensure fair competition and sportsmanship. Students often take part in sports with the spirit of participation and jubilation more than the sheer aim of winning trophies or prizes. We stage many sports events during the morning and evening hours prior to and after regular working hours, where a whole day's fest in which students participate in the athletic sporting events usually held on a Saturday.`,
  },
];

export default function Arts() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Arts & Sports</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {isOpen && (
        <div className="px-6 py-8">
          {artsSections.map((section, i) => (
            <div key={i} className="mb-8 last:mb-0">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h3>
              {section.content.split("\n\n").map((para, j) => (
                <p key={j} className="text-gray-600 text-[15px] leading-[1.85] text-justify mb-4 last:mb-0">
                  {para}
                </p>
              ))}
              {i < artsSections.length - 1 && <hr className="border-gray-100 mt-8" />}
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
