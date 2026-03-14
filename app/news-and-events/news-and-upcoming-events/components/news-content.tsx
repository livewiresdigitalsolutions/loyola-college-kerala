'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Clock, MapPin, ArrowRight, X, Loader2 } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = 'All' | 'Academic News' | 'Campus Life' | 'Seminars & Workshops' | 'Announcements'

interface NewsItem {
  id: number
  category: string
  date: string
  title: string
  excerpt: string
  image: string
  lead_text: string
  body: string
  section_title?: string
  section_body?: string
}

interface EventItem {
  id: number
  month: string
  day: string
  title: string
  time: string
  venue: string
}

const CATEGORIES: Category[] = [
  'All',
  'Academic News',
  'Campus Life',
  'Seminars & Workshops',
  'Announcements',
]

// ─── Story Modal ──────────────────────────────────────────────────────────────

function StoryModal({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const bodyParagraphs = typeof item.body === 'string' ? JSON.parse(item.body) : item.body || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 shrink-0">
          <Image
            src={item.image || '/assets/loyola-building.png'}
            alt={item.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-1.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 left-0 p-5">
            <span
              className="inline-block bg-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm mb-3"
              style={{ color: '#F0B129' }}
            >
              {item.category}
            </span>
            <h2 className="text-white text-xl font-bold leading-tight max-w-sm">
              {item.title}
            </h2>
          </div>
        </div>
        <div className="overflow-y-auto p-6 flex flex-col gap-4">
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: '#F0B129' }}
          >
            Published on {item.date}
          </p>
          <p className="text-primary font-semibold text-sm leading-relaxed">
            {item.lead_text}
          </p>
          {Array.isArray(bodyParagraphs) && bodyParagraphs.map((para: string, i: number) => (
            <p key={i} className="text-gray-600 text-sm leading-relaxed">
              {para}
            </p>
          ))}
          {item.section_title && (
            <>
              <h3 className="text-primary font-bold text-base mt-2">{item.section_title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.section_body}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Event Modal ──────────────────────────────────────────────────────────────

function EventModal({ item, onClose }: { item: EventItem; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-10 flex flex-col items-center text-center"
        style={{ backgroundColor: '#F6F6EE' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-gray-200 bg-white mb-5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#F0B129' }}>{item.month}</p>
          <p className="text-3xl font-extrabold leading-none text-primary">{item.day}</p>
        </div>
        <h2 className="text-xl font-bold text-primary leading-snug mb-6">{item.title}</h2>
        <div className="w-full border-t border-gray-200 mb-5" />
        <div className="flex items-start gap-3 w-full mb-4 text-left">
          <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Time</p>
            <p className="text-sm font-medium text-gray-700">{item.time}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 w-full mb-7 text-left">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Location</p>
            <p className="text-sm font-medium text-gray-700">{item.venue}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewsContent() {
  const [active, setActive] = useState<Category>('All')
  const [visible, setVisible] = useState(4)
  const [selectedStory, setSelectedStory] = useState<NewsItem | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [newsRes, eventsRes] = await Promise.all([
          fetch('/api/sys-ops/news'),
          fetch('/api/sys-ops/events')
        ]);
        
        if (newsRes.ok) {
          const data = await newsRes.json();
          setNewsItems(data.news || []);
        }
        
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const filtered =
    active === 'All' ? newsItems : newsItems.filter((n) => n.category === active)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 w-full bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <section className="bg-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-12">
            {CATEGORIES.map((cat) => {
              const isActive = active === cat
              return (
                <button
                  key={cat}
                  onClick={() => { setActive(cat); setVisible(4) }}
                  className={`
                    px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200
                    ${isActive
                      ? 'bg-primary text-white border-primary shadow-md scale-105'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary hover:shadow-sm'
                    }
                  `}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-primary mb-6">Latest Updates</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filtered.slice(0, visible).map((item) => (
                  <article
                    key={item.id}
                    className="rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
                    style={{ backgroundColor: '#F6F6EE' }}
                  >
                    <div className="relative w-full h-64">
                      <Image
                        src={item.image || '/assets/loyola-building.png'}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <span
                        className="absolute top-3 left-3 bg-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm"
                        style={{ color: '#F0B129' }}
                      >
                        {item.category}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#F0B129' }}>
                        {item.date}
                      </p>
                      <h3 className="text-[15px] font-bold text-primary leading-snug mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{item.excerpt}</p>
                      <button
                        onClick={() => setSelectedStory(item)}
                        className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all duration-200 w-fit"
                      >
                        Read Story <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-lg font-medium">No stories in this category yet.</p>
                </div>
              )}

              {visible < filtered.length && (
                <div className="mt-10">
                  <button
                    onClick={() => setVisible((v) => v + 4)}
                    className="w-full py-4 border border-gray-200 rounded-xl text-sm font-bold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                  >
                    Load More Stories
                  </button>
                </div>
              )}
            </div>

            <aside>
              <h2 className="text-2xl font-bold text-primary mb-6">Upcoming Events</h2>

              <div className="flex flex-col gap-4">
                {events.length === 0 && (
                  <p className="text-gray-500 italic text-sm">No upcoming events listed.</p>
                )}
                {events.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 text-left w-full"
                  >
                    <div
                      className="shrink-0 w-14 text-center rounded-lg py-2 border border-gray-200"
                      style={{ backgroundColor: '#F6F6EE' }}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#F0B129' }}>{ev.month}</p>
                      <p className="text-2xl font-extrabold leading-none text-primary">{ev.day}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary leading-snug mb-1">{ev.title}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
                        <Clock className="w-3 h-3 shrink-0" /> {ev.time}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" /> {ev.venue}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {selectedStory && (
        <StoryModal item={selectedStory} onClose={() => setSelectedStory(null)} />
      )}
      {selectedEvent && (
        <EventModal item={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  )
}
