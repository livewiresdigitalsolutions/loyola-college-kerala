"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

const activities = [
  {
    title: "Oath of Office & Inauguration of College Union",
    content: `College organise Oath Taking Ceremony for newly nominated or elected Student Union at the Sutter Hall in the College. On this occasion a prominent writer or social activist or any other recognized person may be invited by the College Union in consultation with the Union Advisor and with the consent of the Principal as chief guest. The College Manager (Rev. Father) will be presiding over the oath taking ceremony. The program will start with the college prayer. Student Union In charge/ College Union Advisor will deliver a welcome speech and read names of all the newly elected Union representatives. With a formal note to the office bearers about their responsibility to always maintain the dignity of the college and to work for the betterment of the students as well as the college, Oath of Office prescribed by the Lingdoh Committee will be administered. Then all newly nominated office bearers, Chairman, Vice Chairman, and General Secretary and other representatives will occupy the seats assigned to them on the stage. Chief guest will inaugurate the union and deliver inaugural address. There will be Manager's remark on this occasion. Principal will congratulate the new office bearers subsequently and will specify on the moral responsibility to deliver duty of each and every office bearer of the Union. College Union Chairman's address will be the attraction of this occasion.`,
  },
  {
    title: "Planning Forum",
    content: `The literary competitions for the students of Loyola College are assuming significance after the publication of college Magazine every year as many talented writers were identified during the competitions organized by the planning forum gets published here. Writing competition is conducted for picking talented college students who are skilled in writing essays, stories and poems in addition to cartooning pencil sketching and painting. Photography and collage also assumed importance under planning forum post-2015. Planning and scheduling of events will be carried out in the presence of the College Union Advisor, Planning Forum Secretary, and Planning Forum Faculty Advisor. Students belong to different teams identified for Arts and Sports festivals of the college will contest and secure prizes. Competitions are held in the morning and evening hours without affecting the regular academic schedules. Evaluation of creative events will be done with the help of external experts by the Faculty advisor and prizes will be distributed on a special vocation so planned by the college Union prior to College Day.`,
  },
  {
    title: "Annual Day",
    content: `The Annual Day is a grand celebration that marks the culmination of the academic year. It is a platform to celebrate the achievements of the students and the college community. The event features cultural performances, prize distributions, and addresses by distinguished guests.`,
  },
];

const otherActivities = [
  "Protest meeting against Citizenship Amendment Act, National Register of Citizens & the police action on the students of Jamia Millia University.",
  "Republic Day Observance",
  "Inauguration of the poster presentation corner by Dr Shaji Varkey – Dean of Social Sciences, Dept of Political Science, University of Kerala",
  "Panel discussion – Topic: Citizenship and Constitution, Panelists – Dr Shaji Varkey & Dr Sindhu Thulaseedharan – Head, Dept of Law, University of Kerala",
  "Interaction, Caption contest, Quiz competition – Topic: Indian Constitution, National Identity and Symbols",
  "Observance of World Radio Day. The importance of the day was passed through the message aired through public address system.",
];

export default function Activities() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Activities</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {isOpen && (
        <div className="px-6 py-8">
          {/* Main Activities */}
          {activities.map((item, i) => (
            <div key={i} className="mb-8 last:mb-0">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-[15px] leading-[1.85] text-justify">{item.content}</p>
              {i < activities.length - 1 && <hr className="border-gray-100 mt-8" />}
            </div>
          ))}

          {/* Other Activities */}
          <hr className="border-gray-100 my-8" />
          <h3 className="text-lg font-bold text-gray-900 mb-5">Other Activities</h3>
          <ul className="space-y-4">
            {otherActivities.map((item, i) => (
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
