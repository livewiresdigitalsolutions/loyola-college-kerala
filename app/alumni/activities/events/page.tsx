import React from 'react'
import Image from 'next/image'
import HeroSection from '@/app/components/HeroSection'
import { Calendar } from 'lucide-react'

const events = [
  {
    title: 'HR CONFERENCE 2013',
    date: '2021-07-30 08:37:40',
    image: '/assets/alumni/herobg.jpg',
    description:
      'In the Golden Jubilee year of the college a HR conference was organised by the alumni association. The theme of the Conference was "Strengthening Human Resources for Strategic Business Management". The Gala event was inaugurated by Sri. Nikhil Kumar then Hon. Governor of Kerala. The Presidential address was delivered by Shri. Shiva Baby John, Hon. Minister for Labour, Govt. of Kerala. Shri P. N. Srinivas Vice-President (HR), Taj Group of Hotels, delivered the key note address. Altogether 10 eminent corporate heads representing prestigious organizations shared their experiences. During the HR conference Prof. T.S.N. Pillai was honoured as the Golden Mentor. The alumni also took the initiative to honour Sri. K.K.Jayachandran for getting IPS conferred by the Government of Kerala.',
  },
  {
    title: 'LOYOLA ALUMNI ASSOCIATION GOLDEN JUBILEE SEMINAR',
    date: '2021-07-30 08:13:40',
    image: '/assets/alumni/herobg.jpg',
    description:
      'A milestone seminar celebrating fifty years of the Loyola Alumni Association\'s contributions, legacy, and ongoing mission to empower society through thoughtful leadership and networking. Additional details to be updated soon.',
  },
]

export default function EventsSeminars() {
  return (
    <>
      <HeroSection
        title="Events & Seminars"
        smallTitle="LOYOLA COLLEGE ALUMNI ASSOCIATION"
        backgroundImage="/assets/alumni/herobg.jpg"
        breadcrumbs={[
          { label: 'Activities' },
          { label: 'Events & Seminars', highlight: true },
        ]}
        height="h-[400px] md:h-[450px] lg:h-[500px]"
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="space-y-12">
            {events.map((event, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-8">
                {/* Image */}
                <div className="w-full md:w-72 shrink-0">
                  <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
                    <Calendar size={12} />
                    POSTED ON: {event.date}
                  </p>
                  <h3 className="text-xl font-bold text-[#1a5632] mb-3">{event.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
