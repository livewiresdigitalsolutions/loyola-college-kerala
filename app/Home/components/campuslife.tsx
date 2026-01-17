import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


const campusFeatures = [
  {
    title: "Sports & Fitness",
    description:
      "Modern facilities for cricket, football, basketball, and indoor games.",
  },
  {
    title: "Library & Resources",
    description:
      "Extensive collection of 50,000+ books and digital resources.",
  },
  {
    title: "Cultural Events",
    description:
      "Annual festivals, performances, and competitions throughout the year.",
  },
];


export default function CampusLife() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER WITH LINK */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-sm font-bold text-gray-900 tracking-wider mb-3">
              VIBRANT COMMUNITY
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900">
              Campus Life
            </h2>
          </div>
          <Link
            href="/campus"
            className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group"
          >
            <span className="relative">
              Explore Campus
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>


        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT FEATURED IMAGE - TAKES 2 COLUMNS */}
          <div className="lg:col-span-2 relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl group">
            <Image
              src="/assets/CampusActivities.png"
              alt="Student Clubs and Activities"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />


            {/* DARK GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>


            {/* TEXT OVERLAY AT BOTTOM */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-3">
                Student Clubs & Activities
              </h3>
              <p className="text-white/90 text-lg max-w-xl">
                Over 25 student-run clubs covering arts, culture, social service,
                and professional development.
              </p>
            </div>
          </div>


          {/* RIGHT INFO CARDS - STACKED WITH FULL HEIGHT */}
          <div className="flex flex-col gap-6 h-[400px] lg:h-[500px]">
            {campusFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-[#F5F1E8] rounded-2xl p-6 hover:bg-primary hover:text-white transition-colors duration-300 group cursor-pointer flex-1 flex flex-col justify-center"
              >
                <h4 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-white">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-700 group-hover:text-white/90 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>


        {/* MOBILE LINK */}
        <Link
          href="/campus"
          className="md:hidden inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group mt-8"
        >
          <span className="relative">
            Explore Campus
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
