"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface AdminMember {
  id: number;
  name: string;
  role: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

export default function IgAcademicCouncil() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          "/api/about/institutional-governance?category=academic_council"
        );
        const data = await response.json();
        if (data.success) {
          setMembers(data.data || []);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Academic Council
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded mb-4"></div>
                <div className="w-12 h-0.5 bg-gray-200 mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (members.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADING */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Academic Council
          </h2>
        </div>

        {/* ACADEMIC COUNCIL GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <div key={member.id} className="text-left">
              {/* IMAGE */}
              <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden">
                <Image
                  src={member.image_url}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* DIVIDER LINE */}
              <div className="w-12 h-0.5 bg-primary mb-3"></div>

              {/* NAME */}
              <h3 className="text-base md:text-lg font-bold text-primary mb-1">
                {member.name}
              </h3>

              {/* ROLE */}
              {member.role && (
                <p className="text-sm text-gray-600">{member.role}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
