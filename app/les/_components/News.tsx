'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { newsItems as fallbackNews } from '../_data'
import { getNewsItems } from '../_services/api'
import { NewsItem } from '../_data/types'

export default function News() {
  const [items, setItems] = useState<NewsItem[]>(fallbackNews)

  useEffect(() => {
    getNewsItems().then(setItems)
  }, [])

  return (
    <div className="space-y-6">
      {/* News Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-primary mb-6">NEWS</h2>
        
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <article key={item.id} className="py-4 first:pt-0 last:pb-0 group cursor-pointer">
              <h3 className="text-gray-800 font-medium leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{item.timeAgo}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Live Support Card */}
      <div className="bg-primary rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">Live Support</h2>
        <p className="text-white/90 mb-4">8 am - 8 pm</p>
        
        <Link 
          href="/les/contact" 
          className="block w-full bg-white hover:bg-gray-100 text-primary font-semibold py-3 px-6 rounded-lg text-center transition-colors"
        >
          Contact Now
        </Link>
      </div>
    </div>
  )
}
