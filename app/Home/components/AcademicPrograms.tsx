// import Image from "next/image";
// import Link from "next/link";
// import { GraduationCap, BookOpen, Award } from "lucide-react";

// const programmes = [
//   {
//     title: "Undergraduate Programmes",
//     description:
//       "Foundational study in social sciences, commerce combining academic learning with field exposure and community engagement.",
//     link: "/programmes/undergraduate",
//     icon: GraduationCap,
//     image: "/assets/UG.png", // put in /public
//   },
//   {
//     title: "Postgraduate Programmes",
//     description:
//       "Advanced and specialised programmes focused on research, interdisciplinary perspectives, and real-world social challenges.",
//     link: "/programmes/postgraduate",
//     icon: BookOpen,
//     image: "/assets/PG.png",
//   },
//   {
//     title: "Doctoral Programmes",
//     description:
//       "Research-led doctoral programmes fostering original scholarship in society, policy, culture, and human development.",
//     link: "/programmes/doctoral",
//     icon: Award,
//     image: "/assets/PHD.png",
//   },
// ];

// export default function AcademicProgrammes() {
//   return (
//     <section className="w-full bg-green-50 py-20">
//       <div className="max-w-7xl mx-auto px-6">

//         {/* HEADER */}
//         <div className="mb-12">
//           <h2 className="text-4xl font-bold text-primary">
//             Academic Programmes
//           </h2>
//           <p className="mt-2 text-gray-600 max-w-2xl">
//             Programmes designed to build critical thinkers, researchers,
//             and socially responsible leaders.
//           </p>
//         </div>

//         {/* PROGRAMMES GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">

//           {programmes.map((item, index) => {
//             const Icon = item.icon;

//             return (
//               <div key={index} className="space-y-5  rounded-xl shadow-xl">

//                 {/* IMAGE */}
//                 <div className="rounded-lg overflow-hidden">
//                   <Image
//                     src={item.image}
//                     alt={item.title}
//                     width={700}
//                     height={350}
//                     className="w-full h-[250px] object-cover transition-transform duration-300 hover:scale-110"
//                   />
//                 </div>

//                 {/* ICON + TITLE */}
//                 <div className="flex items-center gap-3 px-4">
//                   <Icon className="w-7 h-7 text-primary" />
//                   <h3 className="text-xl font-semibold text-primary">
//                     {item.title}
//                   </h3>
//                 </div>

//                 {/* DESCRIPTION */}
//                 <p className="text-gray-600 leading-relaxed px-4 text-justify">
//                   {item.description}
//                 </p>

//                 {/* LINK */}
//                 <Link
//                   href={item.link}
//                   className="inline-flex items-center gap-2 text-primary font-medium hover:underline px-4 mb-3"
//                 >
//                   View Programmes →
//                 </Link>

//               </div>
//             );
//           })}

//         </div>
//       </div>
//     </section>
//   );
// }




import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const programmes = [
  {
    title: "Undergraduate Programmes",
    description:
      "Foundational study in social sciences, commerce combining academic learning with field exposure and community engagement.",
    link: "/programmes/undergraduate",
    image: "/assets/UG.png",
  },
  {
    title: "Postgraduate Programmes",
    description:
      "Advanced and specialised programmes focused on research, interdisciplinary perspectives, and real-world social challenges.",
    link: "/programmes/postgraduate",
    image: "/assets/PG.png",
  },
  {
    title: "Doctoral Programmes",
    description:
      "Research-led doctoral programmes fostering original scholarship in society, policy, culture, and human development.",
    link: "/programmes/doctoral",
    image: "/assets/PHD.png",
  },
];

export default function AcademicProgrammes() {
  return (
    <section className="w-full bg-green-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-primary">
            Academic Programmes
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Programmes designed to build critical thinkers, researchers, and
            socially responsible leaders.
          </p>
        </div>

        {/* PROGRAMMES GRID - 3 PORTRAIT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programmes.map((item, index) => {
            return (
              <Link
                key={index}
                href={item.link}
                className="group relative h-[600px] rounded-3xl overflow-hidden block shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                {/* FULL BACKGROUND IMAGE */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* DARK GRADIENT OVERLAY - BOTTOM FADE */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                {/* CONTENT AT BOTTOM */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-300 group-hover:-translate-y-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-white/90 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300">
                    View Programmes
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
