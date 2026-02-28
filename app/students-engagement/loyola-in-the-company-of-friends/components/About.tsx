import Link from "next/link";
import { FileText } from "lucide-react";

export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left – Title */}
        <div className="md:w-[240px] shrink-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            About LITCOF
          </h2>
          <div className="w-14 h-1 bg-[#13432C] rounded-full mt-4"></div>
        </div>

        {/* Right – Content */}
        <div className="flex-1 pl-0 md:pl-10">
          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            LITCOF &ndash; &lsquo;Loyola In The Company Of Friends&rsquo; &ndash; the transformed
            &lsquo;reading club&rsquo;, is an interdepartmental collaboration of five departments of
            Loyola College of Social Sciences. It is an extra-curricular space where students can
            participate in discussions on topics of utmost pertinence and express themselves
            accordingly.
          </p>

          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            LITCOF showcases a spectrum of activities where students can come together and pave the
            way for their future endeavours. At the outset, itself, LITCOF has been aiming at
            building a praxis for the classroom academics. It runs after the renowned Loyolite
            pedagogy of &lsquo;Engaged Knowledge Building&rsquo;. It provides multidimensional
            skills for its members such as writing, reading, communication, discussing, sharing,
            painting etc.
          </p>

          <p className="text-gray-600 text-[15px] leading-[1.85] mb-8">
            The goal of LITCOF is to make the students aware of their surroundings and make them fit
            for any impediment they may face once they leave Loyola. LITCOF members organise at
            least one activity in a month to meet the goals.
          </p>

          <Link
            href="#"
            className="inline-flex items-center gap-2 bg-[#13432C] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#0e3522] transition-colors"
          >
            <FileText className="w-4 h-4" />
            Membership Form
          </Link>
        </div>
      </div>
    </section>
  );
}
