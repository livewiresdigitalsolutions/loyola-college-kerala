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
    year: '1963',
    title: 'Foundation',
    description: 'Loyola College of Social Sciences established by the Society of Jesus in Thiruvananthapuram, Kerala',
    align: 'right'
  },
  {
    year: '1970',
    title: 'University Affiliation',
    description: 'Affiliated with the University of Kerala, marking a significant milestone in the academic recognition',
    align: 'left'
  },
  {
    year: '1985',
    title: 'Postgraduate Programmes',
    description: 'Launch of postgraduate programmes in Social Work, Psychology, and Sociology',
    align: 'right'
  },
  {
    year: '1998',
    title: 'Research Excellence',
    description: 'Establishment of Research centres and initiation of doctoral programmes across multiple disciplines',
    align: 'left'
  },
  {
    year: '2005',
    title: 'NAAC Accreditation',
    description: 'First NAAC accreditation received with impressive quality and performance benchmarks',
    align: 'right'
  },
  {
    year: '2015',
    title: 'Infrastructure Expansion',
    description: 'Major expansion with new academic blocks, state-of-the-art library, and technology facilities',
    align: 'left'
  },
  {
    year: '2020',
    title: 'NAAC A++ Grade',
    description: 'Achieved NAAC A++ accreditation, placing it among India\'s most prestigious institutions',
    align: 'right'
  },
  {
    year: '2023',
    title: 'Diamond Jubilee',
    description: 'Celebrating 60 years of transformative education and social impact with 15,000+ students',
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
          <span className="text-[#F0B129]  text-md font-medium tracking-wider uppercase mb-4 block">
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
                className="relative grid grid-cols-[1fr_auto_1fr] gap-24 items-start"
              >
                {/* LEFT SIDE */}
                <div className={`${item.align === 'right' ? 'text-right pl-8' : ''}`}>
                  {item.align === 'right' && (
                    <TimelineContent item={item} isLast={index === timelineData.length - 1} />
                  )}
                </div>               

                {/* CENTER DOT */}
                <div className="relative flex justify-center pt-2">
                  <TimelineDot />
                </div>

                {/* RIGHT SIDE */}
                <div className={`${item.align === 'left' ? 'text-left pr-8' : ''}`}>
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
