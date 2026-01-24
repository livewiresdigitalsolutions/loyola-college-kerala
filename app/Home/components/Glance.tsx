// // "use client";
// // import Image from "next/image";
// // import { ArrowRight } from "lucide-react";
// // import Link from "next/link";

// // export default function LoyolaAtAGlance() {
// //   return (
// //     <>
// //       <section className="w-full bg-[#F6F6EE] py-20">
// //         <div className="max-w-7xl mx-auto px-6">
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
// //             {/* LEFT CONTENT */}
// //             <div className="flex flex-col h-[450px] lg:h-[650px] justify-between">
// //               <div className="space-y-8">
// //                 {/* THIN LINE + SINCE 1963 */}
// //                 <div className="flex items-left flex-col gap-6">
// //                   <div className="w-full h-[1px] bg-primary/50"></div>
// //                   <h1 className="text-sm font-bold text-gray-900 tracking-wider">
// //                     SINCE 1963
// //                   </h1>
// //                 </div>

// //                 {/* MAIN HEADING */}
// //                 <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900">
// //                   Education that <br />
// //                   engages society, <br />
// //                   not just classrooms.
// //                 </h2>

// //                 {/* PARAGRAPH */}
// //                 <p className="text-gray-700 leading-relaxed pr-10 font-medium text-lg text-justify">
// //                   Loyola College of Social Sciences (Autonomous), one of the
// //                   oldest Social Science Colleges in India, was founded in 1963
// //                   by a visionary Jesuit Fr. Joseph Edamaram S.J, to bring social
// //                   changes in Kerala and society at large. The College instils
// //                   excellence in life through service. True to the Jesuit ideal
// //                   of MAGIS (Excellence) and the commitment to Faith and Justice,
// //                   Loyola strives to extend the benefits of higher education to
// //                   the people, especially the marginalized. In reaching this
// //                   goal, we are guided by the Ignatian vision of life and its
// //                   application in Education.
// //                 </p>
// //                 <p className="text-gray-700 leading-relaxed pr-10 font-medium text-lg text-justify">
// //                   Loyola College of Social Sciences is a living tradition, an
// //                   organic entity of the Global Network of Jesuit Higher
// //                   Education. The tradition of Jesuit education is committed to
// //                   human excellence, global citizenship, care for all creation,
// //                   justice, accessibility for all, interculturality, and life-
// //                   long learning. The Jesuit education aims at forming men and
// //                   women for others, leaders of competence, conscience,
// //                   compassion and commitment.
// //                 </p>
// //               </div>

// //               {/* LINK WITH ICON - ALIGNED TO BOTTOM */}
// //               <Link
// //                 href="/philosophy"
// //                 className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-4 transition-all duration-300 group relative w-fit"
// //               >
// //                 {/* <span className="relative">
// //                   Read About Our Philosophy
// //                   <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
// //                 </span>
// //                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> */}
// //               </Link>
// //             </div>

// //             {/* RIGHT OVERLAPPING IMAGES */}
// //             <div className="relative w-full h-[600px] lg:h-[650px]">
// //               {/* FIRST IMAGE - TOP RIGHT */}
// //               <div className="absolute top-0 right-0 w-[70%] h-[55%] overflow-visible shadow-2xl z-10">
// //                 <Image
// //                   src="/assets/CampusActivities.png"
// //                   alt="Loyola College Campus"
// //                   fill
// //                   className="object-cover"
// //                   priority
// //                 />
// //                 {/* TOP RIGHT CORNER FRAME - SHARP EDGES */}
// //                 <div className="absolute -top-6 -right-6 w-20 h-20 border-t-[8px] border-r-[8px] border-primary rounded-none"></div>
// //               </div>

// //               {/* SECOND IMAGE - BOTTOM LEFT (OVERLAPPING) */}
// //               <div className="absolute bottom-0 left-0 w-[70%] h-[55%] overflow-visible shadow-2xl z-20">
// //                 <Image
// //                   src="/assets/loyola-building.png"
// //                   alt="Loyola College Students"
// //                   fill
// //                   className="object-cover"
// //                 />
// //                 {/* BOTTOM LEFT CORNER FRAME - SHARP EDGES */}
// //                 <div className="absolute -bottom-6 -left-6 w-20 h-20 border-b-[8px] border-l-[8px] border-primary rounded-none"></div>
// //               </div>

// //               {/* OPTIONAL: DECORATIVE ELEMENT */}
// //               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* STATS SECTION - GREEN WITH ROUNDED CORNERS */}
// //       <section className="w-full bg-[#F6F6EE] pt-10 pb-20">
// //         <div className="max-w-7xl mx-auto px-3">
// //           <div className="bg-primary rounded-xl p-8 md:p-10">
// //             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
// //               {/* STAT 1 */}
// //               <div className="flex items-center gap-4">
// //                 <Image
// //                   src="/icons/Graduationcap.png"
// //                   alt="Graduation Cap"
// //                   width={64}
// //                   height={64}
// //                   className="w-16 h-16 flex-shrink-0"
// //                 />
// //                 <div>
// //                   <h3 className="text-3xl md:text-4xl mb-2 font-bold text-white">
// //                     13+ Programs
// //                   </h3>
// //                   <p className="text-white/90 text-sm md:text-base">
// //                     Across Arts, Science and Commerce
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* DIVIDER */}
// //               <div className="hidden md:block w-[1px] h-20 bg-white/30"></div>

// //               {/* STAT 2 */}
// //               <div className="flex items-center gap-4">
// //                 <Image
// //                   src="/icons/Graduationcap.png"
// //                   alt="Users"
// //                   width={64}
// //                   height={64}
// //                   className="w-16 h-16 flex-shrink-0"
// //                 />
// //                 <div>
// //                   <h3 className="text-3xl md:text-4xl mb-2 font-bold text-white">
// //                     1000+ Students
// //                   </h3>
// //                   <p className="text-white/90 text-sm md:text-base">
// //                     From diverse backgrounds
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* DIVIDER */}
// //               <div className="hidden md:block w-[1px] h-20 bg-white/30"></div>

// //               {/* STAT 3 */}
// //               <div className="flex items-center gap-4">
// //                 <Image
// //                   src="/icons/Graduationcap.png"
// //                   alt="Award"
// //                   width={64}
// //                   height={64}
// //                   className="w-16 h-16 flex-shrink-0"
// //                 />
// //                 <div>
// //                   <h3 className="text-3xl md:text-4xl mb-2 font-bold text-white">
// //                     A++ Grade
// //                   </h3>
// //                   <p className="text-white/90 text-sm md:text-base">
// //                     NAAC Accredited Institution
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   );
// // }














// "use client";
// import Image from "next/image";
// import { ArrowRight } from "lucide-react";
// import Link from "next/link";

// export default function LoyolaAtAGlance() {
//   return (
//     <>
//       <section className="w-full bg-[#F6F6EE] py-20">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
//             {/* LEFT CONTENT */}
//             <div className="flex flex-col min-h-[450px] lg:h-[650px] justify-between order-1">
//               <div className="space-y-8">
//                 {/* THIN LINE + SINCE 1963 */}
//                 <div className="flex items-left flex-col gap-6">
//                   <div className="w-full h-[1px] bg-primary/50"></div>
//                   <h1 className="text-sm font-bold text-gray-900 tracking-wider">
//                     SINCE 1963
//                   </h1>
//                 </div>

//                 {/* MAIN HEADING */}
//                 <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900">
//                   Education that <br />
//                   engages society, <br />
//                   not just classrooms.
//                 </h2>

//                 {/* PARAGRAPH */}
//                 <p className="text-gray-700 leading-relaxed lg:pr-10 font-medium text-base md:text-lg text-justify">
//                   Loyola College of Social Sciences (Autonomous), one of the
//                   oldest Social Science Colleges in India, was founded in 1963
//                   by a visionary Jesuit Fr. Joseph Edamaram S.J, to bring social
//                   changes in Kerala and society at large. The College instils
//                   excellence in life through service. True to the Jesuit ideal
//                   of MAGIS (Excellence) and the commitment to Faith and Justice,
//                   Loyola strives to extend the benefits of higher education to
//                   the people, especially the marginalized. In reaching this
//                   goal, we are guided by the Ignatian vision of life and its
//                   application in Education.
//                 </p>
//                 <p className="text-gray-700 leading-relaxed lg:pr-10 font-medium text-base md:text-lg text-justify">
//                   Loyola College of Social Sciences is a living tradition, an
//                   organic entity of the Global Network of Jesuit Higher
//                   Education. The tradition of Jesuit education is committed to
//                   human excellence, global citizenship, care for all creation,
//                   justice, accessibility for all, interculturality, and life-
//                   long learning. The Jesuit education aims at forming men and
//                   women for others, leaders of competence, conscience,
//                   compassion and commitment.
//                 </p>
//               </div>

//               {/* LINK WITH ICON - ALIGNED TO BOTTOM */}
//               <Link
//                 href="/philosophy"
//                 className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-4 transition-all duration-300 group relative w-fit mt-8 lg:mt-0"
//               >
//                 {/* <span className="relative">
//                   Read About Our Philosophy
//                   <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
//                 </span>
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> */}
//               </Link>
//             </div>

//             {/* RIGHT OVERLAPPING IMAGES */}
//             <div className="relative w-full h-[500px] sm:h-[550px] lg:h-[650px] order-2 mt-12 lg:mt-0">
//               {/* FIRST IMAGE - TOP RIGHT */}
//               <div className="absolute top-0 right-0 w-[70%] h-[55%] overflow-visible shadow-2xl z-10">
//                 <Image
//                   src="/assets/CampusActivities.png"
//                   alt="Loyola College Campus"
//                   fill
//                   className="object-cover"
//                   priority
//                 />
//                 {/* TOP RIGHT CORNER FRAME - SHARP EDGES */}
//                 <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 border-t-[6px] sm:border-t-[8px] border-r-[6px] sm:border-r-[8px] border-primary rounded-none"></div>
//               </div>

//               {/* SECOND IMAGE - BOTTOM LEFT (OVERLAPPING) */}
//               <div className="absolute bottom-0 left-0 w-[70%] h-[55%] overflow-visible shadow-2xl z-20">
//                 <Image
//                   src="/assets/loyola-building.png"
//                   alt="Loyola College Students"
//                   fill
//                   className="object-cover"
//                 />
//                 {/* BOTTOM LEFT CORNER FRAME - SHARP EDGES */}
//                 <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 border-b-[6px] sm:border-b-[8px] border-l-[6px] sm:border-l-[8px] border-primary rounded-none"></div>
//               </div>

//               {/* OPTIONAL: DECORATIVE ELEMENT */}
//               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* STATS SECTION - GREEN WITH ROUNDED CORNERS */}
//       <section className="w-full bg-[#F6F6EE] pt-20 pb-20">
//         <div className="max-w-7xl mx-auto px-3 sm:px-6">
//           <div className="bg-primary rounded-xl p-6 sm:p-8 md:p-10">
//             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
//               {/* STAT 1 */}
//               <div className="flex items-center gap-4 w-full md:w-auto">
//                 <Image
//                   src="/icons/Graduationcap.png"
//                   alt="Graduation Cap"
//                   width={64}
//                   height={64}
//                   className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"
//                 />
//                 <div>
//                   <h3 className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 font-bold text-white">
//                     7 UG Programs
//                   </h3>
//                   <p className="text-white/90 text-sm md:text-base">
//                     Across Arts, Science and Commerce
//                   </p>
//                 </div>
//               </div>

//               {/* DIVIDER */}
//               <div className="hidden md:block w-[1px] h-20 bg-white/30"></div>

//               {/* STAT 2 */}
//               <div className="flex items-center gap-4 w-full md:w-auto">
//                 <Image
//                   src="/icons/Graduationcap.png"
//                   alt="Users"
//                   width={64}
//                   height={64}
//                   className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"
//                 />
//                 <div>
//                   <h3 className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 font-bold text-white">
//                     5 PG Programmes
//                   </h3>
//                   <p className="text-white/90 text-sm md:text-base">
//                     Across Arts, Science and Commerce
//                   </p>
//                 </div>
//               </div>

//               {/* DIVIDER */}
//               <div className="hidden md:block w-[1px] h-20 bg-white/30"></div>

//               {/* STAT 3 */}
//               <div className="flex items-center gap-4 w-full md:w-auto">
//                 <Image
//                   src="/icons/Graduationcap.png"
//                   alt="Award"
//                   width={64}
//                   height={64}
//                   className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"
//                 />
//                 <div>
//                   <h3 className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 font-bold text-white">
//                     A++ Grade
//                   </h3>
//                   <p className="text-white/90 text-sm md:text-base">
//                     NAAC Accredited Institution
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }















"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoyolaAtAGlance() {
  return (
    <>
      <section className="w-full bg-[#F6F6EE] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* LEFT CONTENT */}
            <div className="flex flex-col justify-between order-1">
              <div className="space-y-8">
                {/* THIN LINE + SINCE 1963 */}
                <div className="flex items-left flex-col gap-6">
                  <div className="w-full h-[1px] bg-primary/50"></div>
                  <h1 className="text-sm font-bold text-gray-900 tracking-wider">
                    SINCE 1963
                  </h1>
                </div>

                {/* MAIN HEADING */}
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900">
                  Education that <br />
                  engages society, <br />
                  not just classrooms.
                </h2>

                {/* PARAGRAPH */}
                <p className="text-gray-700 leading-relaxed lg:pr-10 font-medium text-base md:text-lg text-justify">
                  Loyola College of Social Sciences (Autonomous), one of the
                  oldest Social Science Colleges in India, was founded in 1963
                  by a visionary Jesuit Fr. Joseph Edamaram S.J, to bring social
                  changes in Kerala and society at large. The College instils
                  excellence in life through service. True to the Jesuit ideal
                  of MAGIS (Excellence) and the commitment to Faith and Justice,
                  Loyola strives to extend the benefits of higher education to
                  the people, especially the marginalized. In reaching this
                  goal, we are guided by the Ignatian vision of life and its
                  application in Education.
                </p>
                <p className="text-gray-700 leading-relaxed lg:pr-10 font-medium text-base md:text-lg text-justify">
                  Loyola College of Social Sciences is a living tradition, an
                  organic entity of the Global Network of Jesuit Higher
                  Education. The tradition of Jesuit education is committed to
                  human excellence, global citizenship, care for all creation,
                  justice, accessibility for all, interculturality, and life-
                  long learning. The Jesuit education aims at forming men and
                  women for others, leaders of competence, conscience,
                  compassion and commitment.
                </p>
              </div>
            </div>

            {/* RIGHT OVERLAPPING IMAGES */}
            <div className="relative w-full h-[500px] sm:h-[550px] lg:h-[650px] order-2 mt-12 lg:mt-0">
              {/* FIRST IMAGE - TOP RIGHT */}
              <div className="absolute top-0 right-0 w-[70%] h-[55%] overflow-visible shadow-2xl z-10">
                <Image
                  src="/assets/CampusActivities.png"
                  alt="Loyola College Campus"
                  fill
                  className="object-cover"
                  priority
                />
                {/* TOP RIGHT CORNER FRAME - SHARP EDGES */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 border-t-[6px] sm:border-t-[8px] border-r-[6px] sm:border-r-[8px] border-primary rounded-none"></div>
              </div>

              {/* SECOND IMAGE - BOTTOM LEFT (OVERLAPPING) */}
              <div className="absolute bottom-0 left-0 w-[70%] h-[55%] overflow-visible shadow-2xl z-20">
                <Image
                  src="/assets/loyola-building.png"
                  alt="Loyola College Students"
                  fill
                  className="object-cover"
                />
                {/* BOTTOM LEFT CORNER FRAME - SHARP EDGES */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 border-b-[6px] sm:border-b-[8px] border-l-[6px] sm:border-l-[8px] border-primary rounded-none"></div>
              </div>

              {/* OPTIONAL: DECORATIVE ELEMENT */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - GREEN WITH ROUNDED CORNERS */}
      <section className="w-full bg-white pb-20 pt-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="bg-primary rounded-xl p-6 sm:p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* STAT 1 */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Image
                  src="/icons/Graduationcap.png"
                  alt="Graduation Cap"
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"
                />
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 font-bold text-white">
                    7 UG Programs
                  </h3>
                  <p className="text-white/90 text-sm md:text-base">
                    Across Arts, Science and Commerce
                  </p>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="hidden md:block w-[1px] h-20 bg-white/30"></div>

              {/* STAT 2 */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Image
                  src="/icons/Graduationcap.png"
                  alt="Users"
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"
                />
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 font-bold text-white">
                    5 PG Programmes
                  </h3>
                  <p className="text-white/90 text-sm md:text-base">
                    Across Arts, Science and Commerce
                  </p>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="hidden md:block w-[1px] h-20 bg-white/30"></div>

              {/* STAT 3 */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Image
                  src="/icons/Graduationcap.png"
                  alt="Award"
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"
                />
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 font-bold text-white">
                    A++ Grade
                  </h3>
                  <p className="text-white/90 text-sm md:text-base">
                    NAAC Accredited Institution
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
