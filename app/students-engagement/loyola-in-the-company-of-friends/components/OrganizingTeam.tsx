"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image_url: string;
}

const fallback: TeamMember[] = [
  { id: -1, name: "Dr. Sunil Kumar P", role: "STAFF COORDINATOR", image_url: "/assets/associations/litcof/sunil-kumar.jpg" },
  { id: -2, name: "Dr. Saji J S J", role: "STAFF TEAM", image_url: "/assets/associations/litcof/saji-jsj.jpg" },
  { id: -3, name: "Ms. Neena C. Itty", role: "STUDENT COORDINATOR", image_url: "/assets/associations/litcof/neena-c-itty.jpg" },
  { id: -4, name: "Gayathri A.S.", role: "STUDENT COORDINATOR", image_url: "/assets/associations/litcof/gayathri-as.jpg" },
];

export default function OrganizingTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(fallback);

  useEffect(() => {
    fetch("/api/students/loyola-in-the-company-of-friends?type=organizing-team")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setTeamMembers(d.data); })
      .catch(() => {/* keep fallback */ });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <h2 className="text-3xl md:text-[38px] font-bold text-gray-900 text-center mb-5">
        Organizing Team
      </h2>
      <div className="w-16 h-1 bg-[#13432C] rounded-full mx-auto mb-16"></div>

      <div className="flex flex-wrap justify-center gap-12 md:gap-24">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex flex-col items-center text-center">
            {/*
              Use `position: relative` + `fill` so next/image ALWAYS fills
              the exact container — no matter the source image's aspect ratio.
            */}
            <div
              className="relative rounded-full overflow-hidden shadow-md shadow-gray-200 mb-6 drop-shadow-sm bg-gray-200"
              style={{ width: 160, height: 160, minWidth: 160, minHeight: 160 }}
            >
              <Image
                src={member.image_url}
                alt={member.name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>

            {/* Name */}
            <h3 className="text-base font-bold text-[#13432C] mb-2 tracking-wide">
              {member.name}
            </h3>

            {/* Role */}
            <p className="text-[10.5px] font-semibold tracking-wider text-gray-400 uppercase">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
