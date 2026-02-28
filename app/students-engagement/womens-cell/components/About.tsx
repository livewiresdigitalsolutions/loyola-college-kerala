export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left – Title */}
        <div className="md:w-[240px] shrink-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Women Cell
          </h2>
          <div className="w-14 h-1 bg-[#13432C] rounded-full mt-4"></div>
        </div>

        {/* Right – Content */}
        <div className="flex-1 pl-0 md:pl-10">
          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            Women empowerment denotes the women&apos;s ability in taking decisions related to their
            life, education and work and giving equal rights to them in all spheres like: personal,
            social, economic, political, legal and so on. Injustice, gender bias and inequalities
            cannot be removed without women empowerment. Women must be educated and skills should be
            imparted to women to be empowered individuals.
          </p>

          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            As KSWDC aims at helping the younger generation to rediscover the strengths which lies
            inside them, Women Cell has been initiated in our College in 2018 with many creative
            programmes. The objectives of the Women Cell are to inculcate among the youth a sense of
            social commitment, to provide training for women so that they become empowered in their
            younger age thereby making them self-sustainable in the society, to create a feel of
            empathy among the youth to their fellow beings, to explore their innate talents and
            utilize them to the maximum for the betterment of the society.
          </p>

          <p className="text-gray-600 text-[15px] leading-[1.85]">
            We are glad to accomplish the objectives through the innovative activities of the Women
            Cell in our College.
          </p>
        </div>
      </div>
    </section>
  );
}
