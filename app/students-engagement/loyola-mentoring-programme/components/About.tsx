import { ChevronRight } from "lucide-react";

export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left – Title */}
        <div className="md:w-[240px] shrink-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            About LMP
          </h2>
          <div className="w-14 h-1 bg-[#13432C] rounded-full mt-4"></div>
        </div>

        {/* Right – Content */}
        <div className="flex-1 pl-0 md:pl-10">
          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            In Loyola, mentoring is designed to support our students&apos; personal wellbeing and
            professional advancement. It has been regarded as one of the best-practices in higher
            education. Mentoring is perhaps a caring and sharing bond built between the staff and
            the student which will enable the students:
          </p>

          <ul className="space-y-4 mb-6 md:pl-2">
            <li className="flex items-start gap-3 text-gray-600 text-[15px] leading-[1.85]">
              <ChevronRight className="w-4 h-4 mt-1.5 text-[#13432C] shrink-0" />
              <span>
                To establish a significant relationship with the teachers and gain self-esteem
                and self-confidence.
              </span>
            </li>
            <li className="flex items-start gap-3 text-gray-600 text-[15px] leading-[1.85]">
              <ChevronRight className="w-4 h-4 mt-1.5 text-[#13432C] shrink-0" />
              <span>
                To know their potentials and the level of competence for further growth by
                identifying the appropriate platforms such as LACE, LLA, LET, UTCOF etc.
              </span>
            </li>
            <li className="flex items-start gap-3 text-gray-600 text-[15px] leading-[1.85]">
              <ChevronRight className="w-4 h-4 mt-1.5 text-[#13432C] shrink-0" />
              <span>
                To modify their thinking, feelings or behaviour for personal and professional
                development.
              </span>
            </li>
          </ul>

          <p className="text-gray-600 text-[15px] leading-[1.85]">
            Hence, it&apos;s a continuous caring experience throughout the mentees&apos; stay at Loyola.
            Mentoring is a noble and sacred act wherein the mentors and the mentees build an
            organic relationship respecting and accepting the person. Hence, the information
            shared with the mentor would be treated with utmost value and respect and kept
            confidential. The mentors are affable and approachable for creating a comfortable
            mentoring environment. Hence every mentor meets his/her mentees at least once in a
            month and furnish their report in the google form which will be compiled as single
            report for each student and kept with the respective mentor.
          </p>
        </div>
      </div>
    </section>
  );
}
