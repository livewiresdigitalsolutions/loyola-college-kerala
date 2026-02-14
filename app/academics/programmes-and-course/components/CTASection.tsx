import React from 'react'
import { Download, ArrowRight, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT - CTA */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Ready to Begin<br />Your Academic<br />Journey?
            </h2>
            <p className="text-white/80 mb-8 max-w-md">
              Download our comprehensive programme brochure or apply online to start your application process.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
              >
                <Download className="w-5 h-5" />
                Download Brochure
              </Link>
              <Link
                href="/admission-form"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F0B129] text-primary font-semibold rounded-lg hover:bg-[#d9a024] transition-colors"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* RIGHT - CONTACT INFO */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Need More Information?</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Phone</p>
                  <p className="text-white font-medium">+91 0474 2 735 880</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Email</p>
                  <p className="text-white font-medium">admission@loyolacollege.edu.in</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Office</p>
                  <p className="text-white font-medium">Admission Office<br />Mon-Sat: 9 AM - 5 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
