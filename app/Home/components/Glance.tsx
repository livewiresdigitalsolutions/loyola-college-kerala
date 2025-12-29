import Image from "next/image";

export default function LoyolaAtAGlance() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-18 items-center">

          {/* LEFT IMAGE */}
          <div className="w-full h-full">
            <Image
              src="/assets/loyola-building.png" // put image in /public
              alt="Loyola College Campus"
              width={700}
              height={500}
              className="w-full h-auto rounded-lg object-cover"
              priority
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#2F2A8A]">
              Loyola at a Glance
            </h2>

            <p className="text-gray-700 max-w-md">
              Education grounded in social responsibility, research,
              and community impact.
            </p>

            <div className="space-y-5 pt-4">
              <div>
                <h4 className="text-lg font-semibold text-[#2F2A8A]">
                  Established 1963
                </h4>
                <p className="text-gray-600">
                  Over six decades of social science education
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-[#2F2A8A]">
                  NAAC A++ Accredited
                </h4>
                <p className="text-gray-600">
                  Recognised quality standards
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-[#2F2A8A]">
                  Our Focus
                </h4>
                <p className="text-gray-600">
                  Society, culture, and human development.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-[#2F2A8A]">
                  How We Learn
                </h4>
                <p className="text-gray-600">
                  Fieldwork, community studies, and public scholarship.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
