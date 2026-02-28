"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

const events = [
  {
    title: "Rebuilding Kerala – A Discussion",
    date: "30/10/2018",
    description:
      "The first initiative of LITCOF was to hold a discussion on 'Rebuilding Kerala after the floods'. LITCOF, being an association to broaden the student's perspective, it was no surprise our first gathering would be of something immediate and dire of nature. Students of various departments joined in as we discussed the disaster management happened before, during and after the floods. As the discussion continued each and every student at the gathering began to chime in their valid opinions and observations. On the whole, the first LITCOF initiative was a grand success which built confidence in the LITCOF committee.",
    image: "/assets/associations/litcof/rebuilding-kerala.jpg",
  },
  {
    title: "Ponmudi Trip – Photography and Travelogue competition",
    date: "6/11/2018",
    description:
      "After the 'Rebuilding Kerala' discussion, it was time to begin the proper inception of LITCOF. After learning that the floods' main reason was ignorance towards nature, we decided to hold our second programme in the lap of nature. We took LITCOF to Ponmudi, a hill station in the heart of Thiruvananthapuram. We held a photography and travelogue competition to hearten our members. As we went downhill back to our homes, our hearts were loved and our minds revitalized.",
    image: "/assets/associations/litcof/ponmudi-trip.jpg",
  },
  {
    title: "Chimizhu – A monthly student publication",
    date: "Monthly",
    description:
      "Chimizhu is a monthly publication to elevate the intellectual capabilities of our members. Every month a particular subject is handpicked as the theme for Chimizhu. Short stories, poems and abstracts of the members are published.",
    image: "/assets/associations/litcof/chimizhu.jpg",
  },
  {
    title: "Economic Reservation Policy",
    date: "29/01/2019",
    description:
      "It was an occasion to hear an eminent expert from the economics. An interactive session was held on the constitutional amendment for providing reservation for the economically backward sections of forwards communities in the month of January. Prof. Mary George, economist, led us to the underlining currents of the topic.",
    image: "/assets/associations/litcof/economic-reservation.jpg",
  },
];

export default function Events() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Events</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Content */}
      {isOpen && (
        <div className="px-6 py-6">
          {events.map((event, i) => (
            <div key={i}>
              <div className="flex flex-col md:flex-row gap-6 py-5">
                {/* Image */}
                <div className="w-full md:w-[200px] h-[160px] md:h-[140px] rounded-lg overflow-hidden shrink-0 bg-gray-200">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={200}
                    height={140}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-[#D4A12A] font-medium mb-3">{event.date}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
              {i < events.length - 1 && <hr className="border-gray-100 mx-6" />}
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
