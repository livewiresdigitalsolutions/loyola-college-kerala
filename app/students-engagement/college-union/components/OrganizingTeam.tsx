import Image from "next/image";

const staffAdvisor = {
  name: "Dr. Pramod S K",
  role: "COLLEGE UNION STAFF ADVISOR",
  subtitle: "Assistant Professor, Counselling Psychology",
  image: "/assets/associations/college-union/pramod-sk.jpg",
};

const unionMembers = [
  { name: "Alex Joseph", role: "The Chairperson", image: "/assets/associations/college-union/alex-joseph.jpg" },
  { name: "Venus Cherian", role: "The Vice Chairperson", image: "/assets/associations/college-union/venus-cherian.jpg" },
  { name: "Hafsa K M", role: "The General Secretary", image: "/assets/associations/college-union/hafsa-km.jpg" },
  { name: "Meenakshy Sudheer", role: "The Councillor to the University Union", image: "/assets/associations/college-union/meenakshy-sudheer.jpg" },
  { name: "Arya S Babu", role: "The Arts Club Secretary", image: "/assets/associations/college-union/arya-s-babu.jpg" },
  { name: "Parvathy G Prakash", role: "The Editor of the College Magazine", image: "/assets/associations/college-union/parvathy-g-prakash.jpg" },
  { name: "Manu Vinayak M L", role: "Student Representative 1st Year UG", image: "/assets/associations/college-union/manu-vinayak.jpg" },
  { name: "Philson Saji", role: "Student Representative 1st Year PG", image: "/assets/associations/college-union/philson-saji.jpg" },
  { name: "Rohan Raj", role: "Student Representative 2nd Year PG", image: "/assets/associations/college-union/rohan-raj.jpg" },
  { name: "Sathy Devi V S", role: "Lady Representative", image: "/assets/associations/college-union/sathy-devi.jpg" },
  { name: "Twinkle Johnson", role: "Lady Representative", image: "/assets/associations/college-union/twinkle-johnson.jpg" },
  { name: "Jayanth J S", role: "Sports Club Secretary", image: "/assets/associations/college-union/jayanth-js.jpg" },
  { name: "Karthika K S", role: "SC/ST Representative", image: "/assets/associations/college-union/karthika-ks.jpg" },
  { name: "Malavika Jagadish", role: "Planning Forum Secretary", image: "/assets/associations/college-union/malavika-jagadish.jpg" },
];

export default function OrganizingTeam() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <h2 className="text-3xl md:text-[38px] font-bold text-gray-900 text-center mb-5">
        College Union
      </h2>
      <div className="w-16 h-1 bg-[#13432C] rounded-full mx-auto mb-16"></div>

      {/* Staff Advisor - Highlighted */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] rounded-full overflow-hidden shadow-lg shadow-gray-200 mb-6 bg-gray-200 ring-4 ring-[#13432C]/10">
          <Image
            src={staffAdvisor.image}
            alt={staffAdvisor.name}
            width={180}
            height={180}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-lg font-bold text-[#13432C] mb-1 tracking-wide">
          {staffAdvisor.name}
        </h3>
        <p className="text-[10.5px] font-semibold tracking-wider text-gray-400 uppercase mb-1">
          {staffAdvisor.role}
        </p>
        <p className="text-xs text-gray-500">{staffAdvisor.subtitle}</p>
      </div>

      {/* Divider */}
      <div className="w-24 h-px bg-gray-200 mx-auto mb-16"></div>

      {/* Union Members Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
        {unionMembers.map((member, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-full overflow-hidden shadow-md shadow-gray-200 mb-4 drop-shadow-sm bg-gray-200">
              <Image
                src={member.image}
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
    </section>
  );
}
