// import Image from "next/image";
// import Link from "next/link";
// import { Calendar, ArrowRight } from "lucide-react";

// export default function LatestNews() {
//   return (
//     <section className="w-full bg-white py-20">
//       <div className="max-w-7xl mx-auto px-6">

//         {/* TITLE */}
//         <h2 className="text-center text-4xl font-semibold text-primary mb-12">
//           Latest News & Updates
//         </h2>

//         {/* MAIN CARD */}
//         <div className="bg-white  rounded-2xl p-6 shadow-xl mb-10 transition-transform duration-300 hover:scale-105">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

//             {/* IMAGE */}
//             <div className="rounded-xl overflow-hidden">
//               <Image
//                 src="/assets/news.jpg"
//                 alt="Workshop"
//                 width={600}
//                 height={400}
//                 className="w-full h-[280px] object-cover"
//               />
//             </div>

//             {/* CONTENT */}
//             <div className="space-y-4">
//               <span className="inline-block px-4 py-1 text-sm rounded-full bg-[#ECEBFA] text-primary font-medium">
//                 WORKSHOP
//               </span>

//               <h3 className="text-2xl font-semibold text-primary leading-snug">
//                 Three-Day Intensive Skill Training on Dialectical Behavioural Therapy
//               </h3>

//               <div className="flex items-center gap-2 text-gray-500 text-sm">
//                 <Calendar className="w-4 h-4" />
//                 Jan 15, 2025
//               </div>

//               <p className="text-gray-600">
//                 Loyola recently held an intensive workshop on Dialectical Behavioural
//                 Therapy for mental health professionals.
//               </p>

//               <Link
//                 href="#"
//                 className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
//               >
//                 Read More <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* BOTTOM GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

//           {/* CARD 1 */}
//           <NewsCard
//             date="Jan 17, 2025"
//             title="Loyola Faculty Published in Top Journal"
//             image="/assets/news.jpg"
//             description="A Loyola faculty member has been published in one of the leading academic journals."
//           />

//           {/* CARD 2 */}
//           <NewsCard
//             date="Jan 12, 2025"
//             title="Guest Lecture on Social Policy and Governance"
//             image="/assets/news.jpg"
//             description="An expert guest lecture on social policy and governance held in the main auditorium."
//           />

//           {/* CARD 3 */}
//           <NewsCard
//             date="Jan 08, 2025"
//             title="Loyola Students Win National Research Award"
//             image="/assets/news.jpg"
//             description="A team of Loyola students has won a prestigious national award for their research."
//           />

//         </div>

//         {/* VIEW ALL */}
//         <div className="mt-10 text-center">
//           <Link
//             href="#"
//             className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
//           >
//             View All News <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//       </div>
//     </section>
//   );
// }

// /* ---------------- SMALL CARD COMPONENT ---------------- */

// function NewsCard({
//   date,
//   title,
//   image,
//   description,
// }: {
//   date: string;
//   title: string;
//   image: string;
//   description: string;
// }) {
//   return (
//     <div className=" rounded-2xl p-4 shadow-xl bg-white space-y-4 transition-transform duration-300 hover:scale-105 ">
//       <div className="text-sm text-gray-500">{date}</div>

//       <h4 className="text-lg font-semibold text-primary">
//         {title}
//       </h4>

//       <div className="rounded-xl overflow-hidden">
//         <Image
//           src={image}
//           alt={title}
//           width={400}
//           height={250}
//           className="w-full h-[160px] object-cover"
//         />
//       </div>

//       <p className="text-gray-600 text-sm">
//         {description}
//       </p>

//       <Link
//         href="#"
//         className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
//       >
//         Read More <ArrowRight className="w-4 h-4" />
//       </Link>
//     </div>
//   );
// }










import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const newsArticles = [
  {
    date: "January 5, 2026",
    category: "Events",
    title: "Annual Cultural Festival 'Sangam 2026' Announced",
    description:
      "Join us for three days of cultural celebrations, workshops, and performances.",
    link: "/news/sangam-2026",
  },
  {
    date: "December 28, 2025",
    category: "Admissions",
    title: "Admissions Open for 2026-27 Academic Year",
    description:
      "Applications are now being accepted for all UG, PG, and Doctoral programmes.",
    link: "/admissions",
  },
  {
    date: "December 20, 2025",
    category: "Achievement",
    title: "Students Win National Social Work Competition",
    description:
      "Team Loyola secures first place in the All-India Social Innovation Challenge.",
    link: "/news/national-award",
  },
];

export default function LatestNews() {
  return (
    <section className="w-full bg-[#F6F6EE] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-sm font-bold text-gray-900 tracking-wider mb-3">
              STAY INFORMED
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter">
              Latest News & Updates
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group"
          >
            <span className="relative font-bold">
              View All News
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* MAIN LAYOUT - ADJUSTED WIDTH RATIO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION - FEATURED CARD (NARROWER - 2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl h-[600px] lg:h-[700px] flex flex-col">
              {/* FEATURED IMAGE */}
              <div className="relative flex-[65] overflow-hidden">
                <Image
                  src="/assets/loyola.png"
                  alt="Featured Campus Building"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                {/* FEATURED BADGE */}
                <div className="absolute top-6 left-6">
                  <span className="inline-block px-4 py-1.5 text-xs font-semibold rounded-md bg-primary text-white uppercase tracking-wider">
                    Featured
                  </span>
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-8 flex-[35] flex flex-col justify-between">
                <div className="space-y-3">
                  {/* DATE AND CATEGORY */}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>January 8, 2026</span>
                    <span>•</span>
                    <span>Research</span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tighter">
                    Groundbreaking Study on Social Justice Published by Faculty
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-gray-700 leading-relaxed">
                    Dr. Maria Thomas and her research team have published a
                    comprehensive study examining the impact of community-led
                    initiatives on social equity in Kerala.
                  </p>
                </div>

                {/* READ FULL ARTICLE LINK */}
                <Link
                  href="/news/social-justice-study"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group w-fit"
                >
                  <span className="relative font-bold">
                    Read Full Article
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - 3 CARDS STACKED (WIDER - 1/3) */}
          <div className="lg:col-span-1">
            <div className="h-[600px] lg:h-[700px] flex flex-col gap-6">
              {newsArticles.map((article, index) => (
                <NewsCard key={index} {...article} />
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE VIEW ALL LINK */}
        <Link
          href="/news"
          className="md:hidden inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group mt-8"
        >
          <span className="relative">
            View All News
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- NEWS CARD COMPONENT ---------------- */
function NewsCard({
  date,
  category,
  title,
  description,
  link,
}: {
  date: string;
  category: string;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 space-y-3 group flex-1 flex flex-col justify-between">
      <div className="space-y-3">
        {/* DATE AND CATEGORY */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{date}</span>
          <span>•</span>
          <span className="font-medium">{category}</span>
        </div>

        {/* TITLE */}
        <h4 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300">
          {title}
        </h4>

        {/* DESCRIPTION */}
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>

      {/* READ MORE LINK */}
      <Link
        href={link}
        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 text-sm w-fit"
      >
        <span className="relative">
          Read More
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
        </span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
