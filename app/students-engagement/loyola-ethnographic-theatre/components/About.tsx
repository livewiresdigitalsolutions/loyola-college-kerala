export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left – Title */}
        <div className="md:w-[240px] shrink-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            About LET
          </h2>
          <div className="w-14 h-1 bg-[#13432C] rounded-full mt-4"></div>
        </div>

        {/* Right – Content */}
        <div className="flex-1 pl-0 md:pl-10">
          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            It is an alternative means of presenting scholarly results for an audience. Medium of
            &lsquo;film&rsquo; as part of early ethnography. Use of visual technologies for
            collecting raw input for rating or coding &ndash; like the note-making in the field. In
            other words, it is an ensembling of technologies in recording &amp; editing &ndash; for
            presentation.
          </p>

          <p className="text-gray-600 text-[15px] leading-[1.85] mb-4">
            Its advantages over note-making are:
          </p>

          <div className="pl-6 mb-6 space-y-2">
            <p className="text-gray-600 text-[15px] leading-[1.85]">
              Audiovisual inscriptions may be reviewed by multiple observers that were not present
              when the events transpired.
            </p>
            <p className="text-gray-600 text-[15px] leading-[1.85]">
              The inscriptions may be stored.
            </p>
            <p className="text-gray-600 text-[15px] leading-[1.85]">
              Event records may be re-analyzed and retrieved by future generations of researchers.
            </p>
          </div>

          <p className="text-gray-600 text-[15px] leading-[1.85] mb-8">
            Ethnography is a qualitative method began in early 20th cent., in Social Anthropology. A
            reaction against positivism. Emphasis on interpretative methodology, in terms of meaning
            adequacy. Thorough description of a particular stratum of the social world.
          </p>

          {/* Vision Box */}
          <div className="border-l-4 border-[#13432C] bg-[#F6F6EE] px-6 py-5 rounded-r-lg">
            <h3 className="text-lg font-bold text-[#13432C] mb-2">Vision</h3>
            <p className="text-gray-600 text-[15px] leading-[1.85]">
              LET seeks to generate Social awareness through short films, conduct Video ethnography
              workshop, creating socially relevant short films to make a video library.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
