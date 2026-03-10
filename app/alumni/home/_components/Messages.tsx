'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface MessageCard {
  role: string
  name: string
  image: string
  greeting?: string
  message: string
}

const messages: MessageCard[] = [
  {
    role: "MANAGER'S MESSAGE",
    name: 'Fr. Sunny Kunnapallil SJ',
    image: '/assets/les/lesHero.png',
    message:
      '"The modern world in which we live today is marked by rapid and profound developments that are reshaping human lives. Scientific breakthroughs, technological advancements, globalisation, and social changes have created unprecedented opportunities for progress."',
  },
  {
    role: "PRESIDENT'S MESSAGE",
    name: '',
    greeting: 'Dear Fellow Alumni,',
    image: '/assets/les/lesHero.png',
    message:
      '"The Loyola College Alumni Association began the year with renewed purpose, as the newly elected committee met on January 26, 2025, reaffirming its commitment to service, engagement, and continuity of Loyola values."',
  },
]

export default function Messages() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {messages.map((msg, index) => (
            <div key={index} className="space-y-6">
              {/* Section Title */}
              <h2 className="text-sm font-bold tracking-[0.15em] text-[#1a5632] uppercase">
                {msg.role}
              </h2>

              {/* Content */}
              <div className="flex gap-5">
                {/* Circular Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[#1a5632]/20">
                    <Image
                      src={msg.image}
                      alt={msg.name || msg.role}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 space-y-2">
                  {msg.name && (
                    <h3 className="text-lg font-bold text-gray-900">{msg.name}</h3>
                  )}
                  {msg.greeting && (
                    <h3 className="text-lg font-bold text-gray-900">{msg.greeting}</h3>
                  )}

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {expandedIndex === index
                      ? msg.message
                      : msg.message.slice(0, 200) + (msg.message.length > 200 ? '...' : '')}
                  </p>

                  <button
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                    className="inline-flex items-center gap-1.5 text-[#1a5632] text-sm font-semibold hover:underline mt-2 cursor-pointer"
                  >
                    Read full message
                    <span className="text-base">↓</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
