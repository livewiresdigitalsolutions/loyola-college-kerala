"use client"
import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ExecutiveMember {
  name: string
  role: string
}

interface AccordionSection {
  id: number
  section_key: string
  title: string
  content: string
  section_type: 'text' | 'members'
  sort_order: number
}

// Fallback data in case API is not yet seeded
const fallbackData: AccordionSection[] = [
  {
    id: 1,
    section_key: 'about',
    title: 'About',
    section_type: 'text',
    sort_order: 0,
    content: `The Parent-Teacher Association (PTA) takes keen interest in the development of the students by mobilising support to various student support programs on Campus. The PTA conducts its meeting biannually, one of which is an annual general body meeting (AGM). The previous year's report and the expenditure is presented before the gathering. General feedback from parents is sought and placed in the office before the following year's meeting takes place. The main office bearers of the PTA are four parents elected from the gathering representing each department, the Vice President & Manager (Patron), Principal (President), Bursar (Treasurer), Vice-Principal and Head of the Departments are ex-officio of the PTA. The new PTA council meets immediately as a procedure and the annual plan of events will be discussed in that meeting.\n\nThe AGM is followed by the departmental meetings wherein the parents express their satisfaction and discuss their concerns about their children. This is followed by individual meetings with all teachers in the department. Feedback is collected from parents by way of a feedback form and the meetings conclude with lunch in the canteen.`
  },
  {
    id: 2,
    section_key: 'minutes',
    title: 'Minutes',
    section_type: 'text',
    sort_order: 1,
    content: 'Minutes content will be displayed here. Add your PTA meeting minutes, documents, or download links.'
  },
  {
    id: 3,
    section_key: 'meetings',
    title: 'PTA Meetings',
    section_type: 'text',
    sort_order: 2,
    content: 'PTA meeting schedules and details will be displayed here.'
  },
  {
    id: 4,
    section_key: 'executive',
    title: 'Executive Committee Members',
    section_type: 'members',
    sort_order: 3,
    content: JSON.stringify([
      { name: 'Rev. Fr. Sunny Kunnappallil S.J', role: 'Patron' },
      { name: 'Dr. Sabu P. Thomas S.J', role: 'President' },
      { name: 'Mrs. Rejitha V R', role: 'Vice President' },
      { name: 'Mr. Thomas George', role: 'Secretary' },
      { name: 'Mrs. Priya Menon', role: 'Treasurer' },
      { name: 'Dr. Lakshmi Varma', role: 'Joint Secretary' }
    ])
  }
]

export default function PtaAccordions() {
  const [sections, setSections] = useState<AccordionSection[]>([])
  const [openAccordions, setOpenAccordions] = useState<string[]>(['about'])

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/about/pta/accordion')
      const data = await res.json()
      if (data.success && data.data && data.data.length > 0) {
        setSections(data.data)
      } else {
        setSections(fallbackData)
      }
    } catch {
      setSections(fallbackData)
    }
  }

  const toggleAccordion = (sectionKey: string) => {
    setOpenAccordions(prev =>
      prev.includes(sectionKey)
        ? prev.filter(k => k !== sectionKey)
        : [...prev, sectionKey]
    )
  }

  const renderContent = (section: AccordionSection) => {
    if (section.section_type === 'members') {
      let members: ExecutiveMember[] = []
      try {
        members = JSON.parse(section.content)
      } catch {
        members = []
      }
      return (
        <>
          <p className="text-gray-700 leading-relaxed mb-6">
            The PTA Executive Committee comprises elected parent representatives and college officials who work collaboratively to enhance the educational experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member, index) => (
              <div key={index} className="bg-[#F6F6EE] p-4 rounded text">
                <h4 className="font-semibold text-primary mb-1">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </>
      )
    }

    const paragraphs = section.content.split('\n\n')
    return (
      <>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={`text-gray-700 leading-relaxed text-justify ${index < paragraphs.length - 1 ? 'mb-4' : ''}`}>
            {paragraph}
          </p>
        ))}
      </>
    )
  }

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">

        {sections.map((section) => (
          <div key={section.section_key} className="mb-4">
            <button
              onClick={() => toggleAccordion(section.section_key)}
              className="w-full bg-[#F6F6EE] px-6 py-5 flex justify-between items-center hover:bg-[#eeeedc] transition-colors rounded-t"
            >
              <span className="text-lg md:text-xl font-semibold text-primary">
                {section.title}
              </span>
              {openAccordions.includes(section.section_key) ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>

            <AnimatePresence>
              {openAccordions.includes(section.section_key) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="bg-white px-6 py-8 rounded-b">
                    {renderContent(section)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

      </div>
    </section>
  )
}
