import React from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

export default function WhatIsChildline() {
  return (
    <div className="space-y-8">
      {/* What is CHILDLINE Section */}
      <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          What is CHILDLINE?
        </h2>
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/les/childline.png"
            alt="CHILDLINE 1098"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
        
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
          <p>
            <strong>CHILDLINE is a 24-hour emergency helpline for children in distress.</strong>
          </p>
          <p>
            At national level, the CHILDLINE network which covered 569 districts and 129 railway stations in 
            March 2020, has expanded significantly. CHILDLINE services are now operational in over 81% of the 
            country - across 598 districts, through a network of 1,070 intervention units, Child Help Desks at 141 
            railway stations and 5 bus terminals, and nearly 11,000 child protection personnel.
          </p>
          <p>
            At the state level, CHILDLINE is operational in all the districts of Kerala. Every year 
            CHILDLINE intervenes in above 100,000 issues of children.
          </p>
        </div>
      </section>

      {/* CHILDLINE Thiruvananthapuram Section */}
      <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-primary pb-4">
          CHILDLINE Thiruvananthapuram
        </h2>
        
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
          <p>
            Being a torchbearer for the entire program,<br />
            which was started in the year 2000. Loyola Extension Services (LES) Trivandrum works as the 
            Nodal Organization.
          </p>
          <p>
            LES along with the Collaborative agencies, Don Bosco Veedu Society and Trivandrum Social Service 
            Society and Railway Child Help Desk (Don Bosco Veedu Society) has done many activities in the city 
            for children. Providing services to the children in need of care and protection, coordinating with 
            Government Departments, networking with the members of the allied system, organizing various 
            programs, etc. were done to propagate the activities of CHILDLINE.
          </p>
          <p>
            CHILDLINE India Foundation is the core support for the smooth functioning of the various activities.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 mt-6">
          <a 
            href="https://www.childlineindia.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            CHILDLINE India Foundation
            <ExternalLink className="w-4 h-4" />
          </a>
          <a 
            href="https://www.facebook.com/childlinetvm" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            Facebook Page
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  )
}