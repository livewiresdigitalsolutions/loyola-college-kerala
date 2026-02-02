"use client"
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ExecutiveMember {
  name: string
  role: string
}

interface AccordionSection {
  id: string
  title: string
  content: string | ExecutiveMember[]
  type: 'text' | 'members'
}

const ptaData: AccordionSection[] = [
  {
    id: 'about',
    title: 'About',
    type: 'text',
    content: `The Parent-Teacher Association (PTA) takes keen interest in the development of the students by mobilising support to various student support programs on Campus. The PTA conducts its meeting biannually, one of which is an annual general body meeting (AGM). The previous year's report and the expenditure is presented before the gathering. General feedback from parents is sought and placed in the office before the following year's meeting takes place. The main office bearers of the PTA are four parents elected from the gathering representing each department, the Vice President & Manager (Patron), Principal (President), Bursar (Treasurer), Vice-Principal and Head of the Departments are ex-officio of the PTA. The new PTA council meets immediately as a procedure and the annual plan of events will be discussed in that meeting.

The AGM is followed by the departmental meetings wherein the parents express their satisfaction and discuss their concerns about their children. This is followed by individual meetings with all teachers in the department. Feedback is collected from parents by way of a feedback form and the meetings conclude with lunch in the canteen.`
  },
  {
    id: 'minutes',
    title: 'Minutes',
    type: 'text',
    content: 'Minutes content will be displayed here. Add your PTA meeting minutes, documents, or download links.'
  },
  {
    id: 'meetings',
    title: 'PTA Meetings',
    type: 'text',
    content: 'PTA meeting schedules and details will be displayed here.'
  },
  {
    id: 'executive',
    title: 'Executive Committee Members',
    type: 'members',
    content: [
      { name: 'Rev. Fr. Sunny Kunnappallil S.J', role: 'Patron' },
      { name: 'Dr. Sabu P. Thomas S.J', role: 'President' },
      { name: 'Mrs. Rejitha V R', role: 'Vice President' },
      { name: 'Mr. Thomas George', role: 'Secretary' },
      { name: 'Mrs. Priya Menon', role: 'Treasurer' },
      { name: 'Dr. Lakshmi Varma', role: 'Joint Secretary' }
    ]
  }
]

export default function PtaAccordions() {
  const [openAccordions, setOpenAccordions] = useState<string[]>(['about'])

  const toggleAccordion = (sectionId: string) => {
    setOpenAccordions(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const renderContent = (section: AccordionSection) => {
    if (section.type === 'members' && Array.isArray(section.content)) {
      return (
        <>
          <p className="text-gray-700 leading-relaxed mb-6">
            The PTA Executive Committee comprises elected parent representatives and college officials who work collaboratively to enhance the educational experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {section.content.map((member, index) => (
              <div key={index} className="bg-[#F6F6EE] p-4 rounded text">
                <h4 className="font-semibold text-primary mb-1">
                  {member.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </>
      )
    }

    // Text content - handle paragraphs
    if (typeof section.content === 'string') {
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

    return null
  }

  return (
    <section className="bg-gray-50 py-16 md:py-24 ">
      <div className="max-w-4xl mx-auto px-6">
        
        {ptaData.map((section) => (
          <div key={section.id} className="mb-4">
            <button
              onClick={() => toggleAccordion(section.id)}
              className="w-full bg-[#F6F6EE] px-6 py-5 flex justify-between items-center hover:bg-[#eeeedc] transition-colors rounded-t"
            >
              <span className="text-lg md:text-xl font-semibold text-primary">
                {section.title}
              </span>
              {openAccordions.includes(section.id) ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            
            <AnimatePresence>
              {openAccordions.includes(section.id) && (
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
