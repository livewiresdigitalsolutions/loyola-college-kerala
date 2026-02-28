export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left – Title */}
        <div className="md:w-[240px] shrink-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            About NSS
          </h2>
          <div className="w-14 h-1 bg-[#13432C] rounded-full mt-4"></div>
        </div>

        {/* Right – Content */}
        <div className="flex-1 pl-0 md:pl-10">
          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            An active unit of NSS is functioning in Loyola College and this is the first NSS unit
            under the University of Kerala. The college has got around 120 students for post
            graduation and all the students are members of the NSS unit. It is a unique feature of
            our college that all our co-curricular, extra curricular, and field based activities are
            considered as part of NSS activities.
          </p>

          <p className="text-gray-600 text-[15px] leading-[1.85]">
            All the activities of the college are geared towards the fulfilment of Jesuit vision and
            the unit of National Service Scheme of this college plans and implements its activities
            accordingly.
          </p>
        </div>
      </div>
    </section>
  );
}
