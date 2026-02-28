export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left – Title */}
        <div className="md:w-[240px] shrink-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            About LACE
          </h2>
          <div className="w-14 h-1 bg-[#13432C] rounded-full mt-4"></div>
        </div>

        {/* Right – Content */}
        <div className="flex-1 pl-0 md:pl-10">
          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            Loyola Academy for Career Enhancement (LACE) is one of the initiatives of Loyola College
            to equip the young minds to cope with the competitive world both in curricular and
            co-curricular endeavours. It is a complementary academic programme, in realizing the
            pressing need of the hour wherein the students are trained and strengthened to face for
            the emerging national and global competitive job market.
          </p>

          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            Peer learning and Flipped learning are the unique methods that will be used in preparing
            the students for competitive examinations such as:
          </p>

          {/* Exam Tags */}
          <div className="flex flex-wrap gap-3 mb-6">
            {["UGC-NET/JRF", "SET", "UPSC", "KPSC", "SSC"].map((exam) => (
              <span
                key={exam}
                className="px-4 py-1.5 border border-[#13432C] text-[#13432C] rounded-full text-sm font-medium"
              >
                {exam}
              </span>
            ))}
          </div>

          <p className="text-gray-600 text-[15px] leading-[1.85]">
            Orientation and tutorial classes by experts in the respective fields are organised for
            the benefit of the students. This would encourage and equip the students with the
            required competitive edge which includes interaction with experts, discussions, and
            sharing of learning materials. This is also linked to the &ldquo;Career Resource
            Corner&rdquo; where career advancement materials especially for the competitive
            examinations are available and also updates the students with recent job opportunities.
          </p>
        </div>
      </div>
    </section>
  );
}
