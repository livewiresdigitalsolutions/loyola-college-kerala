"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Mail, Phone, ChevronLeft, ChevronRight, User } from "lucide-react";

// Dummy Data
const DEPARTMENTS = [
  "All Departments",
  "Sociology",
  "Social Work",
  "Psychology",
  "Counselling Psychology",
  "Human Resource Management",
  "Disaster Management",
  "Finance & Accounts",
  "Fintech & AI",
  "Data Science",
  "Computer Science",
  "English",
  "Language Academy",
  "Physical Education",
];

const FACULTY_DATA = [
  {
    id: 1,
    name: "Dr. Mritha Jolly Nelson",
    designation: "Assistant Professor & HOD",
    department: "Department of Sociology",
    image: "/assets/defaultprofile.png",
  },
  {
    id: 2,
    name: "Dr. Mritha Jolly Nelson",
    designation: "Assistant Professor & HOD",
    department: "Department of Sociology",
    image: "/assets/defaultprofile.png",
  },
  {
    id: 3,
    name: "Dr. Mritha Jolly Nelson",
    designation: "Assistant Professor & HOD",
    department: "Department of Sociology",
    image: "/assets/defaultprofile.png",
  },
  {
    id: 4,
    name: "Dr. Mritha Jolly Nelson",
    designation: "Assistant Professor & HOD",
    department: "Department of Sociology",
    image: "/assets/defaultprofile.png",
  },
  {
    id: 5,
    name: "Dr. Mritha Jolly Nelson",
    designation: "Assistant Professor & HOD",
    department: "Department of Sociology",
    image: "/assets/defaultprofile.png",
  },
  {
    id: 6,
    name: "Dr. Mritha Jolly Nelson",
    designation: "Assistant Professor & HOD",
    department: "Department of Sociology",
    image: "/assets/defaultprofile.png",
  },
    {
    id: 7,
    name: "Dr. Mritha Jolly Nelson",
    designation: "Assistant Professor & HOD",
    department: "Department of Sociology",
    image: "/assets/defaultprofile.png",
  },
    {
    id: 8,
    name: "Dr. Mritha Jolly Nelson",
    designation: "Assistant Professor & HOD",
    department: "Department of Sociology",
    image: "/assets/defaultprofile.png",
  },
    {
    id: 9,
    name: "Dr. Mritha Jolly Nelson",
    designation: "Assistant Professor & HOD",
    department: "Department of Sociology",
    image: "/assets/defaultprofile.png",
  },
];

export default function MeetOutFaculty() {
  const [activeDepartment, setActiveDepartment] = useState("All Departments");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Faculty
          </h2>
          <p className="text-gray-500">
            Browse our faculty members by department or view all.
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex justify-center gap-3 mb-16 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            <div className="flex flex-wrap justify-center gap-3 w-full">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDepartment(dept)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border border-gray-100 ${
                activeDepartment === dept
                  ? "bg-primary text-white shadow-md transform scale-105 border-primary"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-200"
              }`}
            >
              {dept}
            </button>
          ))}
          </div>
        </div>

        {/* FACULTY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {FACULTY_DATA.map((faculty) => (
            <div
              key={faculty.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src={faculty.image}
                  alt={faculty.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {faculty.name}
                </h3>
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  {faculty.designation}
                </p>
                <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">
                  {faculty.department}
                </p>

                <button className="flex items-center gap-2 text-yellow-500 text-sm font-bold tracking-wide hover:gap-3 transition-all uppercase">
                  <Mail className="w-4 h-4" />
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                currentPage === page
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors">
             <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
