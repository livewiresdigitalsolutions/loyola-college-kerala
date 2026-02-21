import Image from "next/image";
import { AssociationData } from "../_data/associations";

interface OrganizingTeamProps {
  data: AssociationData;
}

export default function OrganizingTeam({ data }: OrganizingTeamProps) {
  // Separate staff coordinators from student coordinators
  const staffCoordinators = data.teamMembers.filter(
    (m) =>
      m.role?.toLowerCase().includes("staff") ||
      m.role?.toLowerCase().includes("advisor") ||
      m.role?.toLowerCase().includes("faculty") ||
      m.role?.toLowerCase().includes("hod")
  );

  const studentCoordinators = data.teamMembers.filter(
    (m) =>
      !m.role?.toLowerCase().includes("staff") &&
      !m.role?.toLowerCase().includes("advisor") &&
      !m.role?.toLowerCase().includes("faculty") &&
      !m.role?.toLowerCase().includes("hod")
  );

  return (
    <section
      id="organizing-team"
      className="scroll-mt-32 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-10 h-[3px] bg-[#F0B129] rounded-full" />
          <span className="text-sm font-bold tracking-widest text-[var(--primary)] uppercase">
            Organizing Team
          </span>
        </div>

        {/* Staff Coordinators */}
        {staffCoordinators.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Staff Coordinators
            </h3>
            <div className="flex flex-wrap gap-8">
              {staffCoordinators.map((member, idx) => (
                <div key={member.id || idx} className="w-40">
                  <div className="w-40 h-48 rounded-xl overflow-hidden bg-gray-100 mb-3 shadow-sm">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={160}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
                        <span className="text-3xl font-bold text-[var(--primary)]">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Coordinators */}
        {studentCoordinators.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Student Coordinators
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {studentCoordinators.map((member, idx) => (
                <div key={member.id || idx}>
                  <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 mb-3 shadow-sm">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={200}
                        height={250}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
                        <span className="text-3xl font-bold text-[var(--primary)]">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
