import Image from "next/image";
import Link from "next/link";
import { GraduationCap, BookOpen, Award } from "lucide-react";

const programmes = [
  {
    title: "Undergraduate Programmes",
    description:
      "Foundational study in social sciences, commerce combining academic learning with field exposure and community engagement.",
    link: "/programmes/undergraduate",
    icon: GraduationCap,
    image: "/assets/UG.png", // put in /public
  },
  {
    title: "Postgraduate Programmes",
    description:
      "Advanced and specialised programmes focused on research, interdisciplinary perspectives, and real-world social challenges.",
    link: "/programmes/postgraduate",
    icon: BookOpen,
    image: "/assets/PG.png",
  },
  {
    title: "Doctoral Programmes",
    description:
      "Research-led doctoral programmes fostering original scholarship in society, policy, culture, and human development.",
    link: "/programmes/doctoral",
    icon: Award,
    image: "/assets/PHD.png",
  },
];

export default function AcademicProgrammes() {
  return (
    <section className="w-full bg-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-[#2F2A8A]">
            Academic Programmes
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Programmes designed to build critical thinkers, researchers,
            and socially responsible leaders.
          </p>
        </div>

        {/* PROGRAMMES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">

          {programmes.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="space-y-5  rounded-xl shadow-xl">

                {/* IMAGE */}
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={700}
                    height={350}
                    className="w-full h-[250px] object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* ICON + TITLE */}
                <div className="flex items-center gap-3 px-4">
                  <Icon className="w-7 h-7 text-[#2F2A8A]" />
                  <h3 className="text-xl font-semibold text-[#2F2A8A]">
                    {item.title}
                  </h3>
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 leading-relaxed px-4 text-justify">
                  {item.description}
                </p>

                {/* LINK */}
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-2 text-[#2F2A8A] font-medium hover:underline px-4 mb-3"
                >
                  View Programmes →
                </Link>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
