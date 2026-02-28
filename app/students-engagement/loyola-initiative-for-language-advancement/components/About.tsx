export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left – Title */}
        <div className="md:w-[240px] shrink-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            About LILA
          </h2>
          <div className="w-14 h-1 bg-[#13432C] rounded-full mt-4"></div>
        </div>

        {/* Right – Content */}
        <div className="flex-1 pl-0 md:pl-10">
          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            This meticulously designed comprehensive English language proficiency enhancement course
            focuses on listening, speaking, and reading and writing methodology, came to existence in
            2013. Loyola College of Social Sciences started such a practice-based participative training
            programme in English, by recognizing students getting admitted to the college from a wide
            spectrum of socio-economic and academic backgrounds.
          </p>

          <p className="text-gray-600 text-[15px] leading-[1.85]">
            LILA enables the students to communicate their views, ideas and perspectives convincingly. It
            also aims at the systematic linguistic development of students. The course is envisaged to be
            a practical-oriented, activity-based, recreational, modern technology-assisted one.
          </p>
        </div>
      </div>
    </section>
  );
}
