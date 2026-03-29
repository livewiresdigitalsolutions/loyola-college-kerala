"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  subtitle: string;
  image_url: string;
  is_advisor: boolean;
  display_order: number;
  is_active: boolean;
}

export default function OrganizingTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/api/students/college-union?type=organizing-team")
      .then(r => r.json())
      .then(d => { if (d.success) setMembers(d.data || []); })
      .catch(() => {});
  }, []);

  const advisor = members.find(m => m.is_advisor);
  const unionMembers = members.filter(m => !m.is_advisor);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <h2 className="text-3xl md:text-[38px] font-bold text-gray-900 text-center mb-5">
        College Union
      </h2>
      <div className="w-16 h-1 bg-[#13432C] rounded-full mx-auto mb-16"></div>

      {/* Staff Advisor - Highlighted */}
      {advisor && (
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] rounded-full overflow-hidden shadow-lg shadow-gray-200 mb-6 bg-gray-200 ring-4 ring-[#13432C]/10">
            <Image
              src={advisor.image_url || "/assets/defaultprofile.png"}
              alt={advisor.name}
              width={180}
              height={180}
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="text-lg font-bold text-[#13432C] mb-1 tracking-wide">
            {advisor.name}
          </h3>
          <p className="text-[10.5px] font-semibold tracking-wider text-gray-400 uppercase mb-1">
            {advisor.role}
          </p>
          {advisor.subtitle && (
            <p className="text-xs text-gray-500">{advisor.subtitle}</p>
          )}
        </div>
      )}

      {/* Divider */}
      {advisor && <div className="w-24 h-px bg-gray-200 mx-auto mb-16"></div>}

      {/* Union Members Grid */}
      {unionMembers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
          {unionMembers.map(member => (
            <div key={member.id} className="flex flex-col items-center text-center">
              <div className="w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-full overflow-hidden shadow-md shadow-gray-200 mb-4 drop-shadow-sm bg-gray-200">
                <Image
                  src={member.image_url || "/assets/defaultprofile.png"}
                  alt={member.name}
                  width={130}
                  height={130}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-sm font-bold text-[#13432C] mb-1 tracking-wide">
                {member.name}
              </h3>
              <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase leading-tight">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
