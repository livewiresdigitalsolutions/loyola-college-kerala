'use client';

import { MapPin, Phone, Mail, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react';

export default function ContactCards() {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const res = await fetch('/api/sys-ops/contact');
        if (res.ok) {
          const data = await res.json();
          setContactInfo(data);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchContactInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Use defaults if fetch fails or no data
  const emails = contactInfo?.emails || { general: '', admissions: '', alumni: '' };
  const phones = contactInfo?.phones || { reception: '', office: '', principal: '' };
  const addressLines = (contactInfo?.address || '').split('\n').filter(Boolean);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* 1. Visit Us Card */}
      <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col items-start h-full">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#F6F6EE' }}>
          <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-primary mb-4">Visit Us</h3>
        <div className="text-gray-500 font-medium text-[14px] space-y-2 leading-relaxed w-full min-h-[50px]">
          {addressLines.length > 0 ? addressLines.map((line: string, i: number) => (
            <p key={i}>{line}</p>
          )) : <p className="text-gray-400 italic">Address not configured</p>}
        </div>
        <Link 
          href="https://maps.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
        >
          Get Directions <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 2. Call Us Card */}
      <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col items-start h-full">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#F6F6EE' }}>
          <Phone className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-primary mb-4">Call Us</h3>
        <div className="text-gray-500 font-medium text-[14px] space-y-2 leading-relaxed w-full">
          {phones.reception && <p>Reception: {phones.reception}</p>}
          {phones.office && <p>Office: {phones.office}</p>}
          {phones.principal && <p>Principal: {phones.principal}</p>}
        </div>
      </div>

      {/* 3. Email Us Card */}
      <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col items-start h-full">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#F6F6EE' }}>
          <Mail className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-primary mb-4">Email Us</h3>
        <div className="text-gray-500 font-medium text-[14px] space-y-2 leading-relaxed w-full">
          {emails.general && (
            <div>
              <span className="block mb-1">General:</span>
              <a href={`mailto:${emails.general}`} className="hover:text-primary transition-colors">{emails.general}</a>
            </div>
          )}
          {emails.admissions && (
            <div>
              <span className="block mb-1">Admissions:</span>
              <a href={`mailto:${emails.admissions}`} className="hover:text-primary transition-colors">{emails.admissions}</a>
            </div>
          )}
          {emails.alumni && (
            <div>
              <span className="block mb-1">Alumni:</span>
              <a href={`mailto:${emails.alumni}`} className="hover:text-primary transition-colors wrap-break-word">{emails.alumni}</a>
            </div>
          )}
        </div>
        <Link 
          href={`mailto:${emails.general || 'info@loyolacollegekerala.edu.in'}`}
          className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
        >
          Send an Email <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
