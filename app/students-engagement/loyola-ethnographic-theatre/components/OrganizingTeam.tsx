import Image from "next/image";

const teamMembers = [
  {
    name: "Fr.Dr. Saji S.J",
    role: "STAFF CO-ORDINATOR",
    image: "/assets/associations/let/saji-sj.jpg",
  },
  {
    name: "Dr Angelo Mathew",
    role: "STAFF CO-ORDINATOR",
    image: "/assets/associations/lila/angelo-mathew.jpg",
  },
];

export default function OrganizingTeam() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <h2 className="text-3xl md:text-[38px] font-bold text-gray-900 text-center mb-5">
        Organizing Team
      </h2>
      <div className="w-16 h-1 bg-[#13432C] rounded-full mx-auto mb-16"></div>

      <div className="flex flex-wrap justify-center gap-12 md:gap-24">
        {teamMembers.map((member, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            {/* Circular Image */}
            <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden shadow-md shadow-gray-200 mb-6 drop-shadow-sm bg-gray-200">
              <Image
                src={member.image}
                alt={member.name}
                width={160}
                height={160}
                className="object-cover w-full h-full"
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
