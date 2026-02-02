"use client";
import React, { useState } from "react";
import Image from "next/image";
import { X, Award, Calendar, GraduationCap } from "lucide-react";

interface PGProgramme {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  seats: number;
  eligibility: string;
}

const pgProgrammes: PGProgramme[] = [
  {
    id: "1",
    name: "M.A. Sociology",
    description: "Sociology was the founding programme of Loyola college of Social Sciences and has more than 60 years of impressive history in training young sociologists and social scientists which have been instrumental in the formation of the Kerala Sociological Society. It prepares students for impactful careers in Advanced research and Academics, Media, Corporate Social Responsibility, NGO and Development sectors, Policy Making, Planning and Advocacy.",
    image: "/departmentsCoverImage/Sociology.png",
    category: "Social Sciences",
    seats: 30,
    eligibility: "Bachelor's degree in any discipline with minimum 50% aggregate marks.",
  },
  {
    id: "2",
    name: "M.S.W. Social Work",
    description: "Social Work Programme at Loyola has been a beacon of transformative education for over six decades, shaping compassionate and skilled professionals to address pressing social challenges. The programme emphasises student-centred development, offering personalised expert mentoring and extensive experiential learning opportunities through collaborations with local, national, and international partners.",
    image: "/departmentsCoverImage/SocialWork.png",
    category: "Social Sciences",
    seats: 40,
    eligibility: "Bachelor's degree in any discipline with minimum 50% aggregate marks.",
  },
  {
    id: "3",
    name: "M.A. Human Resource Management",
    description: "The Programme develop students techno-savvy, professionally competent and value driven HRs for careers in multinational corporations, the banking and finance industries, in both private and public sectors.",
    image: "/departmentsCoverImage/HumanResourceManagement.jpg",
    category: "Management",
    seats: 30,
    eligibility: "Bachelor's degree in any discipline with minimum 50% aggregate marks.",
  },
  {
    id: "4",
    name: "M.Sc. Counselling Psychology",
    description: "The MSc Counselling Psychology programme at Loyola is the first of its kind affiliated to University of Kerala, offering a comprehensive curriculum that blends theoretical knowledge with practical training to equip students with the skills necessary for professional counselling. With a strong focus on cognitive, emotional, social, vocational, and developmental concerns, the programme prepares students to work in diverse settings, including schools, hospitals, workplaces, and community centres.",
    image: "/departmentsCoverImage/Psychology.png",
    category: "Psychology",
    seats: 25,
    eligibility: "Bachelor's degree in Psychology with minimum 50% aggregate marks.",
  },
  {
    id: "5",
    name: "M.S.W. Disaster Management",
    description: "The MSW in Disaster Management is a flagship multi-disciplinary programme that equips students with knowledge, skills and values to undertake social work practice in disaster settings. The programme offers specialisations related to mental health care during disasters and the use of technologies in disaster risk reduction. It opens up employment opportunities in diverse settings at the national and international level.",
    image: "/departmentsCoverImage/DisasterManagement.png",
    category: "Social Sciences",
    seats: 30,
    eligibility: "Bachelor's degree in any discipline with minimum 50% aggregate marks.",
  },
];

export default function PGProgrammesList() {
  const [selectedProgramme, setSelectedProgramme] = useState<PGProgramme | null>(null);

  const handleDownloadProspectus = () => {
    window.open("https://loyolacollegekerala.edu.in/admissions/PG%20PROSPECTUS%202025-26%20LOYOLA.pdf", "_blank");
  };

  const handleApplyNow = () => {
    window.location.href = "https://lcss.linways.com/v4/adm-applicant/login";
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Postgraduate Programmes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Advanced degree programmes designed to deepen expertise and foster research excellence across diverse disciplines.
          </p>
          
          {/* ACTION BUTTONS */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadProspectus}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-300"
            >
              <GraduationCap className="w-5 h-5" />
              Download Prospectus
            </button>
            <button
              onClick={handleApplyNow}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg"
            >
              Apply Now
            </button>
          </div> */}
        </div>

        {/* PROGRAMMES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pgProgrammes.map((programme) => (
            <div
              key={programme.id}
            //   onClick={() => setSelectedProgramme(programme)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col cursor-pointer"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={programme.image}
                  alt={programme.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* CATEGORY BADGE */}
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {programme.category}
                  </span>
                </div>

                {/* SEATS BADGE */}
                {/* <div className="absolute top-4 right-4">
                  <span className="bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {programme.seats} Seats
                  </span>
                </div> */}
              </div>

              {/* CONTENT */}
              <div className="p-6 py-10 flex flex-col flex-grow ">
                {/* PROGRAMME NAME */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {programme.name}
                </h3>

                {/* DESCRIPTION - TRUNCATED */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-12 flex-grow text-justify">
                  {programme.description}
                </p>

                {/* READ MORE INDICATOR
                <div className="mt-4 text-primary text-sm font-semibold flex items-center gap-1">
                  <span>Click to read more</span>
                  <Award className="w-4 h-4" />
                </div> */}
              </div>

              {/* HOVER BORDER EFFECT */}
              <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* PROGRAMME DETAILS MODAL */}
      {selectedProgramme && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProgramme(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white p-6 flex items-start justify-between z-10">
              <div className="flex-1 pr-4">
                <h3 className="text-2xl font-bold mb-2">{selectedProgramme.name}</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedProgramme.category}
                  </span>
                  <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedProgramme.seats} Seats
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProgramme(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6">
              {/* PROGRAMME DESCRIPTION */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  Programme Overview
                </h4>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProgramme.description}
                  </p>
                </div>
              </div>

              {/* ELIGIBILITY CRITERIA */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                  Eligibility Criteria
                </h4>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProgramme.eligibility}
                  </p>
                </div>
              </div>

              {/* ADMISSION WEIGHTAGE */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                  Admission Ranking System
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1">70%</div>
                    <div className="text-xs font-semibold text-gray-700">Entrance Exam</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-1">20%</div>
                    <div className="text-xs font-semibold text-gray-700">UG Marks</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">10%</div>
                    <div className="text-xs font-semibold text-gray-700">Interview</div>
                  </div>
                </div>
              </div>

              {/* IMPORTANT DATES */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  Important Dates - 2026
                </h4>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-amber-200">
                    <span className="text-sm font-medium text-gray-700">Application Deadline</span>
                    <span className="text-sm font-bold text-gray-900">May 15, 2026</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-amber-200">
                    <span className="text-sm font-medium text-gray-700">Entrance Examination</span>
                    <span className="text-sm font-bold text-gray-900">May 20, 2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Rank List Publication</span>
                    <span className="text-sm font-bold text-gray-900">May 25, 2026</span>
                  </div>
                </div>
              </div>

              {/* ADDITIONAL INFO */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 mb-6">
                <h5 className="font-semibold text-gray-900 mb-3 text-sm">Additional Information</h5>
                <ul className="text-xs text-gray-700 space-y-2">
                  <li>• Two-year full-time programme affiliated to University of Kerala</li>
                  <li>• Comprehensive curriculum with research focus</li>
                  <li>• Field visits and internship opportunities</li>
                  <li>• Expert faculty with industry experience</li>
                </ul>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={handleApplyNow}
                  className="flex-1 bg-primary text-white text-center font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => setSelectedProgramme(null)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
