"use client";

import { Heart, ChevronRight } from "lucide-react";

interface Initiative {
    title: string;
    description: string;
}

const initiatives: Initiative[] = [
    {
        title: "Paper Publications",
        description: "Elderly in India - Problems and Prospects, MSW",
    },
    {
        title: "Paper Publications",
        description: "Elderly in India - Problems and Prospects, MSW 2016-2018",
    },
    {
        title: "Cancer Detection Camp",
        description: "Social Extension Activity",
    },
    {
        title: "Dermatology Camp",
        description: "Health Initiative",
    },
    {
        title: "International Conclave on Innovation and Social Entrepreneurship",
        description: "UGC Sponsored at Loyola, Trivandrum",
    },
];

export default function Initiatives() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* SECTION HEADING */}
                <div className="text-center font-size:15px mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        Initiatives
                    </h2>
                    <div className="mt-3 w-12 h-1 bg-[var(--primary)] mx-auto rounded-full" />
                </div>

                {/* Initiative Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {initiatives.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-[#f4f3ee] rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Heart Icon */}
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-5">
                                <Heart className="w-4 h-4 text-[var(--primary)]" />
                            </div>

                            {/* Title */}
                            <h3 className="text-sm md:text-[20px] font-bold text-primary leading-snug mb-2">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-xs md:text-sm font-size:15px text-gray-500 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* View More Button */}
                <div className="text-center mt-16 font-size:20px">
                    <button className="inline-flex items-center justify-center gap-1.5 border-2 border-[var(--primary)] text-[var(--primary)] px-10 py-4.5 rectangle-lg text-sm font-bold hover:bg-[var(--primary)] hover:text-white transition-all duration-200">
                        View more Initiatives
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
