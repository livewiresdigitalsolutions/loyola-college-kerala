import React from "react";
import Image from "next/image";
import { Mail, Phone, Award } from "lucide-react";
import { Faculty } from "../../data/types";

interface FacultySectionProps {
  faculty: Faculty[];
}

export default function FacultySection({ faculty }: FacultySectionProps) {
  if (faculty.length === 0) return null;
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Our Faculty
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((member) => (
            <div
              key={member.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Faculty Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4" />
                      <span>{member.qualification}</span>
                    </div>
                    <p className="text-sm">
                      <span className="font-semibold">Specialization:</span>{" "}
                      {member.specialization}
                    </p>
                    <div className="pt-3 border-t border-white/30 space-y-2">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </a>
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          {member.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Designation Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {member.designation.includes("Head") ? "HOD" : "Faculty"}
                  </span>
                </div>
              </div>
              
              {/* Basic Info - Always Visible */}
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold text-sm">
                  {member.designation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



