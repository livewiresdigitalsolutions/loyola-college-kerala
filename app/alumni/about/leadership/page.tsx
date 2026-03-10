import React from 'react'
import HeroSection from '@/app/components/HeroSection'

const leadershipData = [
  { year: '1967-1968', president: 'Sri. JOHN MORRIS .M', secretary: 'Sri. M.P VISWAM', treasurer: '-' },
  { year: '1968-1969', president: 'Sri. KARUNAKARA KURUP', secretary: 'Sri. N SUGATHAN', treasurer: '-' },
  { year: '1969-1970', president: 'Sri. ACHUTHAN NAIR', secretary: 'Dr. MARIAMMA JOSEPH', treasurer: '-' },
  { year: '1970-1971', president: 'Sri. ACHUTHAN NAIR', secretary: 'Dr. MARIAMMA JOSEPH', treasurer: '-' },
  { year: '1971-1972', president: 'Sri.SUKUMARAN NAIR', secretary: 'Prof. TSN PILLAI', treasurer: '-' },
  { year: '1972-1973', president: 'Dr. G.C.GOPALA PILLAI', secretary: 'Prof. K.R RAMACHANDRAN', treasurer: '-' },
  { year: '1973-1974', president: 'Sri.THOMAS VARGHESE', secretary: 'Prof. K.R RAMACHANDRAN NAIR', treasurer: '-' },
  { year: '1974-1975', president: 'DOMINIC ALWARIS', secretary: 'K.R RAMACHANDRAN', treasurer: '-' },
  { year: '1975-1976', president: '-', secretary: '-', treasurer: '-' },
  { year: '1976-1977', president: 'G.C GOPALAPILLAI', secretary: 'K.R RAMACHANDRAN', treasurer: '-' },
  { year: '1977-1978', president: 'G.C GOPALAPILLAI', secretary: 'K.R RAMACHANDRAN', treasurer: '-' },
  { year: '1978-1979', president: 'ANTONY THOMAS', secretary: 'KOHU RANI VARGHESE', treasurer: '-' },
]

export default function AlumniLeadership() {
  return (
    <>
      <HeroSection
        title="Alumni Presidents"
        smallTitle="LOYOLA COLLEGE ALUMNI ASSOCIATION"
        backgroundImage="/assets/alumni/herobg.jpg"
        breadcrumbs={[
          { label: 'About us' },
          { label: 'Alumni Presidents', highlight: true },
        ]}
        height="h-[400px] md:h-[450px] lg:h-[500px]"
      />

      {/* Table Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#1a5632]">
                  <th className="text-left py-4 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider w-[120px]">Year</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider">President</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider">Secretary</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-[#1a5632] uppercase tracking-wider">Treasurer</th>
                </tr>
              </thead>
              <tbody>
                {leadershipData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition"
                  >
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">{row.year}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{row.president}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{row.secretary}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{row.treasurer}</td>
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
