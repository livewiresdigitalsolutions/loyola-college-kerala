import React from 'react'
import HeroSection from '@/app/components/HeroSection'
import { Phone, Mail } from 'lucide-react'

const roleBadgeColor: Record<string, string> = {
  Patron: 'bg-[#1a5632] text-white',
  Director: 'bg-[#1a5632] text-white',
  President: 'bg-[#1a5632] text-white',
  'Vice-President': 'bg-[#2d7a4f] text-white',
  Secretary: 'bg-[#F0B129] text-gray-900',
  Treasurer: 'bg-[#F0B129] text-gray-900',
  'Joint Secretary': 'bg-[#6b8f7b] text-white',
}

const officeBearers = [
  {
    name: 'Fr. Sunny Kunnapallil S. J',
    role: 'Patron',
    designation: 'Rector & Manager of Loyola Institutions',
    phone: '2881322028',
    email: 'lfkunny@gmail.com',
  },
  {
    name: 'Fr Sabu P Thomas',
    role: 'Director',
    designation: 'Principal, Loyola College',
    phone: '5449180093',
    email: 'sabupd@yahoo.com',
  },
  {
    name: 'Sri. Antony Thomas',
    role: 'President',
    designation: 'Strategic Projects Consultant, President, Rotary South, Trivandrum',
    phone: '3045230885',
    email: 'atonie833@gmail.com',
  },
  {
    name: 'Mr. J R Santhoshkumar',
    role: 'Vice-President',
    designation: 'AGM – Havells India Limited, (Rtd.), Trivandrum',
    phone: '9831307795',
    email: 'hilsanthaskumar@gmail.com',
  },
  {
    name: 'Dr. Jasmine Sara Alexander',
    role: 'Secretary',
    designation: 'Asst. Professor, Dept. of Social Work',
    phone: '9497555058',
    email: 'alexander.jasmin@gmail.com',
  },
  {
    name: 'Francine P.X.',
    role: 'Treasurer',
    designation: 'Asst. Professor, Dept. of Social Work',
    phone: '9485141545',
    email: 'francyxavier@yahoo.com',
  },
  {
    name: 'Malavika C',
    role: 'Joint Secretary',
    designation: 'Student, MA HRM, Loyola College, Trivandrum',
    phone: '5448887724',
    email: 'malavika1.2004@gmail.com',
  },
]

const executiveMembers = [
  { name: 'Hari Namboothri', designation: 'President & CEO, Consult Sompilita Inc, USA', phone: '8483585563', email: 'haritasse12@gmail.com' },
  { name: 'Vipindas D', designation: 'Tuverland India, Bangalore', phone: '8399688430', email: 'namdeeandnadee@gmail.com' },
  { name: 'B Krishna Kumar', designation: 'Krishnakumar Associates, Thrissur', phone: '5489033980', email: 'ragumatharlekrishnakumar@gmail.com' },
  { name: 'Adv. Renoj Mohan', designation: 'Advocate', phone: '8486369427', email: 'renojmohan@gmail.com' },
  { name: 'Arun S.B', designation: 'Student, PSC', phone: '8403889762', email: 'aruna2019@gmail.com' },
  { name: 'Lucy S', designation: 'Teacher, Leo XIII HSS, Pulluvila', phone: '9485563948', email: 'mislucy1961@gmail.com' },
  { name: 'Bela Mohan', designation: 'SFO Tech, Ernakulam', phone: '7559880183', email: 'belamohan@gmail.com' },
  { name: 'Bindiya Sudarsan', designation: '-', phone: '8289392885', email: 'bindiyasudarsan09@gmail.com' },
  { name: 'Sri. Vipin Kumar K.C (2001 – 03 MAPM)', designation: 'COO-MBCET & CCDET', phone: '9847308531', email: 'kc.vipinkume@gmail.com' },
]

export default function OfficeBearers() {
  return (
    <>
      <HeroSection
        title="Office Bearers"
        smallTitle="LOYOLA COLLEGE ALUMNI ASSOCIATION"
        backgroundImage="/assets/alumni/herobg.jpg"
        breadcrumbs={[
          { label: 'About us' },
          { label: 'Office Bearers', highlight: true },
        ]}
        height="h-[400px] md:h-[450px] lg:h-[500px]"
      />

      {/* Current Office Bearers */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <span className="text-[#1a5632]">☆</span> Current Office Bearers
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#1a5632]">
                  <th className="text-left py-3 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider">Alumni Role</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider">Professional Designation</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody>
                {officeBearers.map((member, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{member.name}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleBadgeColor[member.role] || 'bg-gray-200 text-gray-700'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{member.designation}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Phone size={12} className="text-[#1a5632]" /> {member.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Mail size={12} className="text-[#1a5632]" /> {member.email}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Executive Committee Members */}
      <section className="py-16 bg-[#f5f3ee]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <span className="text-[#1a5632]">⚙</span> Executive Committee Members
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#1a5632]">
                  <th className="text-left py-3 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider">Professional Designation</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody>
                {executiveMembers.map((member, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{member.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{member.designation}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Phone size={12} className="text-[#1a5632]" /> {member.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Mail size={12} className="text-[#1a5632]" /> {member.email}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
