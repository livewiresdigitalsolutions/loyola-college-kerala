"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

const LG = "#13432C";

const fallback: TeamMember[] = [
  { id: -1, name: "Dr Angelo Mathew", role: "FACULTY IN CHARGE", image_url: "/assets/associations/lila/angelo-mathew.jpg", display_order: 0, is_active: true },
];

export default function OrganizingTeam() {
  const [members, setMembers] = useState<TeamMember[]>(fallback);

  useEffect(() => {
    fetch("/api/students/loyola-initiative-for-language-advancement?type=organizing-team")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setMembers(d.data); })
      .catch(() => { });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <h2 className="text-3xl md:text-[38px] font-bold text-gray-900 text-center mb-5">
        Organizing Team
      </h2>
      <div className="w-16 h-1 rounded-full mx-auto mb-16" style={{ backgroundColor: LG }}></div>

      <div className="flex flex-wrap justify-center gap-12 md:gap-24">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center text-center">
            <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden shadow-md shadow-gray-200 mb-6 drop-shadow-sm bg-gray-200">
              <Image
                src={member.image_url || "/assets/defaultprofile.png"}
                alt={member.name}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-base font-bold mb-2 tracking-wide" style={{ color: LG }}>
              {member.name}
            </h3>
            <p className="text-[10.5px] font-semibold tracking-wider text-gray-400 uppercase">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
