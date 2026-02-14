import React from "react";
import Image from "next/image";
import { Faculty } from "../../data/types";

interface FacultySectionProps {
  faculty: Faculty[];
}

export default function FacultySection({ faculty }: FacultySectionProps) {
  if (!faculty || faculty.length === 0) return null;

  return (
    <section className="py-16 bg-[#f5f0e8]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center uppercase tracking-wider">
          Faculty
        </h2>

        {/* Faculty Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {faculty.map((member) => (
            <div key={member.id}>
              {/* Faculty Photo */}
              <div className="relative h-80 overflow-hidden rounded-md">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Dark accent line */}
              <div className="w-10 h-1 bg-gray-800 mt-5 mb-3"></div>

              {/* Faculty Info */}
              <h3 className="text-lg font-bold text-gray-900">
                {member.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {member.designation}
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-amber-600 text-xs font-semibold uppercase tracking-wide mt-3 hover:text-amber-700 transition-colors"
              >
                View Full Profile
                <span className="ml-1">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
