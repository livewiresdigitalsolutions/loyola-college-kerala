import { FileText, ExternalLink, Calendar, Users } from "lucide-react";

const sessions = [
  {
    date: "Dec 2025",
    batch: "2024-26 Batch",
    description:
      "The mentoring session for Seniors (2024-26) to be scheduled after their exams before the college closes for Christmas vacations. Please meet your mentees promptly and kindly fill in the form for each mentee separately on or before December 23, 2025.",
    reportLink: "#",
  },
  {
    date: "Dec 2025",
    batch: "2025-27 Batch",
    description:
      "The mentoring session for juniors (2025-27) to be scheduled this week. Please meet your mentees promptly and kindly fill in the form for each mentee separately on or before Dec 19, 2025.",
    reportLink: "#",
  },
  {
    date: "August 2025",
    batch: "2025-27 Batch",
    description:
      "The first mentoring session for juniors (2025-27) to be scheduled this week and next. Please meet your mentees promptly and kindly fill in the form for each mentee separately on or before August 29, 2025.",
    reportLink: "#",
  },
  {
    date: "August 2025",
    batch: "2024-26 Batch",
    description:
      "The second mentoring session of this academic year for Seniors (2024-26) to be scheduled next week. Please meet your mentees promptly and kindly fill in the form for each mentee separately on or before August 29, 2025.",
    reportLink: "#",
  },
  {
    date: "June 2025",
    batch: "2023-25 Batch",
    description:
      "The last mentoring session for Seniors (2023-25) is scheduled between June 11-20. Please meet your mentees promptly and kindly fill in the form for each mentee separately on or before June 20, 2024.",
    reportLink: "#",
  },
];

export default function MentoringSessions() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20 font-sans">
      <h2 className="text-3xl md:text-[38px] font-bold text-gray-900 text-center mb-5">
        Mentoring Sessions
      </h2>
      <div className="w-16 h-1 bg-[#13432C] rounded-full mx-auto mb-20"></div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical center line */}
        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gray-200 -translate-x-1/2 hidden md:block z-0"></div>

        <div className="space-y-12 md:space-y-0 relative z-10">
          {sessions.map((session, i) => {
            const isLeft = i % 2 === 0;

            return (
              <div key={i} className="relative flex flex-col md:flex-row items-center w-full md:min-h-[220px]">
                {/* Timeline dot */}
                <div className="absolute left-1/2 top-10 -translate-y-1/2 w-4 h-4 bg-[#DCE092] rounded-full -translate-x-1/2 z-20 hidden md:flex items-center justify-center shadow-sm">
                  <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
                </div>

                {/* Left Side (can be Card or Badges) */}
                <div className={`w-full md:w-1/2 flex justify-center ${isLeft ? "md:justify-end md:pr-12 lg:pr-16" : "md:justify-end md:pr-12 lg:pr-16 order-2 md:order-1"}`}>
                  {isLeft ? (
                    /* Card on Left */
                    <div className="bg-white border border-gray-100 rounded-[14px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] w-full max-w-[440px]">
                      <p className="text-gray-600 text-[14.5px] leading-[1.7] mb-6">
                        {session.description}
                      </p>
                      <a
                        href={session.reportLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#13432C] font-semibold text-sm hover:underline"
                      >
                        <FileText className="w-[15px] h-[15px]" />
                        Submit Report
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </a>
                    </div>
                  ) : (
                    /* Badges on Left */
                    <div className="flex flex-col items-start w-full max-w-[440px] md:items-end mt-4 md:mt-0">
                      <div className="flex justify-start md:justify-end w-full">
                         <span className="inline-flex items-center gap-2 bg-[#13432C] text-white text-[15px] font-medium px-5 py-2.5 rounded-full shadow-sm">
                           <Calendar className="w-4 h-4 stroke-[2.5]" />
                           {session.date}
                         </span>
                      </div>
                      <div className="flex justify-start md:justify-end w-full mt-3">
                         <span className="inline-flex items-center gap-2 bg-[#F9FAEE] border border-[#DCE092] text-[#13432C] text-[15px] font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#DCE092]/20">
                           <Users className="w-4 h-4 stroke-[2.5]" />
                           {session.batch}
                         </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side (can be Badges or Card) */}
                <div className={`w-full md:w-1/2 flex justify-center ${isLeft ? "md:justify-start md:pl-12 lg:pl-16 mt-4 md:mt-0" : "md:justify-start md:pl-12 lg:pl-16 order-1 md:order-2"}`}>
                  {isLeft ? (
                    /* Badges on Right */
                    <div className="flex flex-col items-start w-full max-w-[440px]">
                      <div className="flex justify-start w-full">
                         <span className="inline-flex items-center gap-2 bg-[#13432C] text-white text-[15px] font-medium px-5 py-2.5 rounded-full shadow-sm">
                           <Calendar className="w-4 h-4 stroke-[2.5]" />
                           {session.date}
                         </span>
                      </div>
                      <div className="flex justify-start w-full mt-3">
                         <span className="inline-flex items-center gap-2 bg-[#F9FAEE] border border-[#DCE092] text-[#13432C] text-[15px] font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#DCE092]/20">
                           <Users className="w-4 h-4 stroke-[2.5]" />
                           {session.batch}
                         </span>
                      </div>
                    </div>
                  ) : (
                    /* Card on Right */
                    <div className="bg-white border border-gray-100 rounded-[14px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] w-full max-w-[440px]">
                      <p className="text-gray-600 text-[14.5px] leading-[1.7] mb-6">
                        {session.description}
                      </p>
                      <a
                        href={session.reportLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#13432C] font-semibold text-sm hover:underline"
                      >
                        <FileText className="w-[15px] h-[15px]" />
                        Submit Report
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
