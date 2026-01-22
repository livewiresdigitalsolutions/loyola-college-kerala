// "use client"
// import React, { useRef } from 'react'
// import { motion, useScroll, useTransform } from 'framer-motion'
// import { useInView } from 'framer-motion'

// interface TimelineItem {
//   year: string
//   title: string
//   description: string
//   align: 'left' | 'right'
// }

// const timelineData: TimelineItem[] = [
//   {
//     year: '1963',
//     title: 'Foundation',
//     description: 'Loyola College of Social Sciences established by the Society of Jesus in Thiruvananthapuram, Kerala',
//     align: 'right'
//   },
//   {
//     year: '1970',
//     title: 'University Affiliation',
//     description: 'Affiliated with the University of Kerala, marking a significant milestone in the academic recognition',
//     align: 'left'
//   },
//   {
//     year: '1985',
//     title: 'Postgraduate Programmes',
//     description: 'Launch of postgraduate programmes in Social Work, Psychology, and Sociology',
//     align: 'right'
//   },
//   {
//     year: '1998',
//     title: 'Research Excellence',
//     description: 'Establishment of Research centres and initiation of doctoral programmes across multiple disciplines',
//     align: 'left'
//   },
//   {
//     year: '2005',
//     title: 'NAAC Accreditation',
//     description: 'First NAAC accreditation received with impressive quality and performance benchmarks',
//     align: 'right'
//   },
//   {
//     year: '2015',
//     title: 'Infrastructure Expansion',
//     description: 'Major expansion with new academic blocks, state-of-the-art library, and technology facilities',
//     align: 'left'
//   },
//   {
//     year: '2020',
//     title: 'NAAC A++ Grade',
//     description: 'Achieved NAAC A++ accreditation, placing it among India\'s most prestigious institutions',
//     align: 'right'
//   },
//   {
//     year: '2023',
//     title: 'Diamond Jubilee',
//     description: 'Celebrating 60 years of transformative education and social impact with 15,000+ students',
//     align: 'left'
//   }
// ]

// function TimelineDot() {
//   const dotRef = useRef(null)
//   const inView = useInView(dotRef, {
//     margin: "-50% 0px -50% 0px",
//     once: false,
//   })

//   return (
//     <div ref={dotRef}>
//       <motion.div
//         animate={{
//           scale: inView ? 1.2 : 1,
//         }}
//         transition={{ duration: 0.3 }}
//         className="w-4 h-4 rounded-full bg-[#0D4A33] shadow-lg relative z-10"
//       />
//     </div>
//   )
// }

// function TimelineContent({ item, isLast }: { item: TimelineItem; isLast: boolean }) {
//   const cardRef = useRef(null)
//   const inView = useInView(cardRef, {
//     margin: "-40% 0px -40% 0px",
//     once: true,
//   })

//   return (
//     <motion.div
//       ref={cardRef}
//       initial={{ opacity: 0, y: 30 }}
//       animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className={`${isLast ? '' : 'pb-24'}`}
//     >
//       <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary/20 mb-4">
//         {item.year}
//       </div>
//       <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">
//         {item.title}
//       </h3>
//       <p className="text-primary/80 text-sm md:text-base leading-relaxed">
//         {item.description}
//       </p>
//     </motion.div>
//   )
// }

// export default function Timeline() {
//   const timelineRef = useRef(null)

//   const { scrollYProgress } = useScroll({
//     target: timelineRef,
//     offset: ["start center", "end center"],
//   })

//   const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

//   return (
//     <section className="py-20 md:py-32" style={{ backgroundColor: '#F6F6EE' }}>
//       <div className="max-w-6xl mx-auto px-6">
//         {/* SECTION HEADER */}
//         <div className="text-center mb-20">
//           <span className="text-[#F0B129]  text-md font-medium tracking-wider uppercase mb-4 block">
//             OUR JOURNEY
//           </span>
//           <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
//             Milestones of Excellence
//           </h2>
//         </div>

//         {/* TIMELINE */}
//         <div className="relative max-w-5xl mx-auto" ref={timelineRef}>
//           {/* ANIMATED VERTICAL LINE */}
//           <div className="absolute left-1/2 top-0 bottom-0 w-[2px] transform -translate-x-1/2">
//             {/* Background line */}
//             <div className="absolute inset-0 bg-gray-300" />
//             {/* Animated progress line */}
//             <motion.div
//               className="absolute top-0 left-0 right-0 bg-primary origin-top"
//               style={{ height: lineHeight }}
//             />
//           </div>

//           {/* TIMELINE ITEMS */}
//           <div className="relative">
//             {timelineData.map((item, index) => (
//               <div
//                 key={item.year}
//                 className="relative grid grid-cols-[1fr_auto_1fr] gap-24 items-start"
//               >
//                 {/* LEFT SIDE */}
//                 <div className={`${item.align === 'right' ? 'text-right pl-8' : ''}`}>
//                   {item.align === 'right' && (
//                     <TimelineContent item={item} isLast={index === timelineData.length - 1} />
//                   )}
//                 </div>               

//                 {/* CENTER DOT */}
//                 <div className="relative flex justify-center pt-2">
//                   <TimelineDot />
//                 </div>

//                 {/* RIGHT SIDE */}
//                 <div className={`${item.align === 'left' ? 'text-left pr-8' : ''}`}>
//                   {item.align === 'left' && (
//                     <TimelineContent item={item} isLast={index === timelineData.length - 1} />
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }











"use client"
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'framer-motion'

interface TimelineItem {
  year: string
  title: string
  description: string
  align: 'left' | 'right'
}

const timelineData: TimelineItem[] = [
  {
    year: '1962',
    title: 'Foundation',
    description: 'Loyola College founded by Joseph Edamaram S. J. Shri. V. V. Giri, Honourable Governor of Kerala, lays foundation stone on 21 June.',
    align: 'right'
  },
  {
    year: '1963',
    title: 'University Affiliation',
    description: 'Loyola College accorded permanent affiliation by University of Kerala. Master\'s Degree in Sociology offered.',
    align: 'left'
  },
  {
    year: '1964',
    title: 'M.S.W. Program Launch',
    description: 'The M.S.W. Program and Junior College launched. Social Service League engages in flood disaster relief in the low lying areas of Trivandrum.',
    align: 'right'
  },
  {
    year: '1967',
    title: 'Alumni Association Founded',
    description: 'The Alumni Association founded. Visitation by Pedro Arrupe S. J, Superior General, Society of Jesus.',
    align: 'left'
  },
  {
    year: '1970',
    title: 'NSS Training Centre',
    description: 'Govt. of India appoints Loyola College as Technical Training and Orientation Centre for the National Service Scheme.',
    align: 'right'
  },
  {
    year: '1973',
    title: 'Ph.D. Research Centre',
    description: 'Loyola College recognised as approved Centre for Ph.D. Research in Sociology and Social Work by the University of Kerala. Mother Teresa visits the Campus.',
    align: 'left'
  },
  {
    year: '1987',
    title: 'Silver Jubilee',
    description: 'His Excellency Shri. P. Ramachandran, Governor of Kerala inaugurates Silver Jubilee Celebrations. First issue of the Loyola Journal of Social Sciences released.',
    align: 'right'
  },
  {
    year: '1988',
    title: 'Silver Jubilee Valediction',
    description: 'Silver Jubilee Valediction by His Excellency Dr. Shankar Dayal Sharma, Vice-President of India on 10th February.',
    align: 'left'
  },
  {
    year: '1996',
    title: 'AIDS Awareness Pioneer',
    description: 'Loyola College is declared first "AIDS AWARE College" under University of Kerala. Government of India recognizes LES as the Regional Resource Centre.',
    align: 'right'
  },
  {
    year: '2001',
    title: 'NAAC Five Star Accreditation',
    description: 'Department of Personnel Management constituted. Community Development started as the second specialisation for MSW. NAAC Accreditation awards Loyola College Five Stars.',
    align: 'left'
  },
  {
    year: '2007',
    title: 'NAAC A Grade - Highest in India',
    description: 'Reaccredited with NAAC on A Grade, with CGPA of 3.7 on a four point scale which was highest in India. His Excellency Dr. A.P.J Abdul Kalam visits Campus.',
    align: 'right'
  },
  {
    year: '2012',
    title: 'Golden Jubilee',
    description: 'His Excellency Shri Pranab Mukherjee, The Honourable President of India, visits college as part of the Golden Jubilee celebrations on 30 October, 2012.',
    align: 'left'
  },
  {
    year: '2013',
    title: 'Counselling Psychology Program',
    description: 'Launched MSc. Counselling Psychology. Rated as 3rd Best Social Work College in India by Outlook-MDRA National Survey and The Week magazine.',
    align: 'right'
  },
  {
    year: '2014',
    title: 'NAAC A Grade - Highest in India',
    description: 'NAAC Re-accredited in 3rd cycle CGPA of 3.72 on a four point scale with A Grade, which was highest in India. MoU with Global College, Stockholm, Sweden for faculty and student exchange programmes.',
    align: 'left'
  },
  {
    year: '2015',
    title: 'Gender Variant Friendly Campus',
    description: 'Declared Loyola campus as the first Gender Variant Friendly campus. Inauguration of Loyola Health and Fitness Centre. Students of Global College, Stockholm, Sweden arrived at LES for Live-in Exposure programmes.',
    align: 'right'
  },
  {
    year: '2018',
    title: 'Kerala Flood Relief',
    description: 'Engagement with Kerala Flood Relief and Trauma Counselling in collaboration with Government of Kerala and NIMHANS. Golden jubilee lecture series delivered by Dr Shashi Tharoor.',
    align: 'left'
  },
  {
    year: '2020',
    title: 'Disaster Management Department',
    description: 'Establishment of the Department of Disaster Management, offering MSW in disaster management. Stone laying of a new academic cum administrative block.',
    align: 'right'
  },
  {
    year: '2021',
    title: 'Continued Excellence',
    description: 'Golden Jubilee Memorial Lecture delivered by Dr. Nadarajah. Continuing the legacy of academic excellence and social impact.',
    align: 'left'
  }
]

function TimelineDot() {
  const dotRef = useRef(null)
  const inView = useInView(dotRef, {
    margin: "-50% 0px -50% 0px",
    once: false,
  })

  return (
    <div ref={dotRef}>
      <motion.div
        animate={{
          scale: inView ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="w-4 h-4 rounded-full bg-[#0D4A33] shadow-lg relative z-10"
      />
    </div>
  )
}

function TimelineContent({ item, isLast }: { item: TimelineItem; isLast: boolean }) {
  const cardRef = useRef(null)
  const inView = useInView(cardRef, {
    margin: "-40% 0px -40% 0px",
    once: true,
  })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${isLast ? '' : 'pb-24'}`}
    >
      <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary/20 mb-4">
        {item.year}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">
        {item.title}
      </h3>
      <p className="text-primary/80 text-sm md:text-base leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  )
}

export default function Timeline() {
  const timelineRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section className="py-20 md:py-32" style={{ backgroundColor: '#F6F6EE' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* SECTION HEADER */}
        <div className="text-center mb-20">
          <span className="text-[#F0B129] text-md font-medium tracking-wider uppercase mb-4 block">
            OUR JOURNEY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Milestones of Excellence
          </h2>
        </div>

        {/* TIMELINE */}
        <div className="relative max-w-5xl mx-auto" ref={timelineRef}>
          {/* ANIMATED VERTICAL LINE */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] transform -translate-x-1/2">
            {/* Background line */}
            <div className="absolute inset-0 bg-gray-300" />
            {/* Animated progress line */}
            <motion.div
              className="absolute top-0 left-0 right-0 bg-primary origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          {/* TIMELINE ITEMS */}
          <div className="relative">
            {timelineData.map((item, index) => (
              <div
                key={item.year}
                className="relative grid grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 lg:gap-16 items-start"
              >
                {/* LEFT SIDE */}
                <div className={`${item.align === 'right' ? 'text-right pr-4 md:pr-8' : ''}`}>
                  {item.align === 'right' && (
                    <TimelineContent item={item} isLast={index === timelineData.length - 1} />
                  )}
                </div>

                {/* CENTER DOT */}
                <div className="relative flex justify-center pt-2">
                  <TimelineDot />
                </div>

                {/* RIGHT SIDE */}
                <div className={`${item.align === 'left' ? 'text-left pl-4 md:pl-8' : ''}`}>
                  {item.align === 'left' && (
                    <TimelineContent item={item} isLast={index === timelineData.length - 1} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
