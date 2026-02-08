import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Involvement {
  title: string;
  image: string;
  href: string;
}

const involvements: Involvement[] = [
  {
    title: "CHILDLINE",
    image: "/assets/defaultprofile.png",
    href: "/les/engagements/childline"
  },
  {
    title: "LOYOLA FAMILY COUNSELLING CENTRE",
    image: "/assets/defaultprofile.png",
    href: "/les/engagements/familyCounsellingCentre"
  },
  {
    title: "RESEARCH",
    image: "/assets/defaultprofile.png",
    href: "/les/engagements/research"
  },
  {
    title: "TRAINING",
    image: "/assets/defaultprofile.png",
    href: "/les/engagements/training"
  },
  {
    title: "EARLY CHILDHOOD EDUCATION CENTRE",
    image: "/assets/defaultprofile.png",
    href: "/les/engagements/ecec"
  },
  {
    title: "COMMUNITY DEVELOPMENT",
    image: "/assets/defaultprofile.png",
    href: "/les/engagements/communityDevelopment"
  },
  {
    title: "PUBLICATIONS",
    image: "/assets/defaultprofile.png",
    href: "/les/engagements/publications"
  }
]

export default function Involvements() {
  return (
    <section className="p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-10 uppercase tracking-wide">
        Involvements
      </h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {involvements.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            className="group block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Image */}
            <div className="overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={200}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Title */}
            <div className="p-4">
              <h3 className="text-xs md:text-sm font-semibold text-primary text-center uppercase tracking-wide leading-tight">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
