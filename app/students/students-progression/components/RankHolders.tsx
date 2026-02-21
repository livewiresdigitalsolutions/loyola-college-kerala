"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

type Rank = "FIRST" | "SECOND" | "THIRD";

interface RankHolder {
    name: string;
    department: string;
    rank: Rank;
    image: string;
}

const rankBadgeColors: Record<Rank, string> = {
    FIRST: "bg-[var(--primary)] text-white",
    SECOND: "bg-[var(--secondary)] text-white",
    THIRD: "bg-[var(--primary)] text-white",
};

const rankHolders: RankHolder[] = [
    {
        name: "Femi Ann Mathew",
        department: "Department of Sociology",
        rank: "FIRST",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Noureen A",
        department: "Department of Sociology",
        rank: "SECOND",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Dinu Mol Varkey",
        department: "Department of Sociology",
        rank: "THIRD",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Anna George K",
        department: "Department of Social Work",
        rank: "FIRST",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Sandra Johnson",
        department: "Department of Social Work",
        rank: "SECOND",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Dona Maria Kuriakose",
        department: "Department of Social Work",
        rank: "THIRD",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Rahul A",
        department: "Department of Personnel Management",
        rank: "FIRST",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Neenu Susan George",
        department: "Department of Personnel Management",
        rank: "SECOND",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Shilpa Sajeev",
        department: "Department of Personnel Management",
        rank: "THIRD",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Jophy John Kallarakal",
        department: "Department of Counselling Psychology",
        rank: "FIRST",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Ancy B S",
        department: "Department of Counselling Psychology",
        rank: "SECOND",
        image: "/assets/defaultprofile.png",
    },
    {
        name: "Aleena Biju Varghese",
        department: "Department of Counselling Psychology",
        rank: "THIRD",
        image: "/assets/defaultprofile.png",
    },
];

export default function RankHolders() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* SECTION HEADING */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        Rank Holders
                    </h2>
                </div>

                {/* ── Cards Grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                    {rankHolders.map((student, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/5] overflow-hidden m-3 rounded-lg">
                                <Image
                                    src={student.image}
                                    alt={student.name}
                                    fill
                                    className="object-cover"
                                />

                                {/* Rank Badge */}
                                <span
                                    className={`absolute top-2 right-2 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm ${rankBadgeColors[student.rank]}`}
                                >
                                    {student.rank}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="px-3 pb-4 pt-1 text-center flex-1 flex flex-col">
                                <h3 className="text-sm md:text-[15px] font-bold text-gray-900 leading-snug">
                                    {student.name}
                                </h3>
                                <p className="text-[10px] md:text-[11px] text-gray-500 mt-1.5 uppercase tracking-wider leading-snug">
                                    {student.department}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── View More Button ── */}
                <div className="text-center mt-16">
                    <button className="inline-flex items-center justify-center gap-1.5 border-2 border-[var(--primary)] text-[var(--primary)] px-10 py-4.5 rectangle-lg text-sm font-bold hover:bg-[var(--primary)] hover:text-white transition-all duration-200">
                        View more Rank Holders
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
