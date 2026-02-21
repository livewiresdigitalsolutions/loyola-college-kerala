"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

type Rank = "FIRST" | "SECOND" | "THIRD";

interface Qualifier {
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

const netQualifiers: Qualifier[] = [
    {
        name: "Anonymous",
        department: "Department of Sociology",
        rank: "FIRST",
        image: "/assets/defaultprofile.png",
    },
];

const jrfQualifiers: Qualifier[] = [];

const competitionWinners: Qualifier[] = [];

function QualifierCard({ qualifier }: { qualifier: Qualifier }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden m-3 rounded-lg">
                <Image
                    src={qualifier.image}
                    alt={qualifier.name}
                    fill
                    className="object-cover"
                />
                {/* Rank Badge */}
                <span
                    className={`absolute top-2 right-2 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm ${rankBadgeColors[qualifier.rank]}`}
                >
                    {qualifier.rank}
                </span>
            </div>

            {/* Info */}
            <div className="px-3 pb-4 pt-1 text-center flex-1 flex flex-col">
                <h3 className="text-sm md:text-[15px] font-bold text-gray-900 leading-snug">
                    {qualifier.name}
                </h3>
                <p className="text-[10px] md:text-[11px] text-gray-500 mt-1.5 uppercase tracking-wider leading-snug">
                    {qualifier.department}
                </p>
            </div>
        </div>
    );
}

interface SubSectionProps {
    title: string;
    yearRange: string;
    qualifiers: Qualifier[];
    buttonLabel: string;
}

function SubSection({ title, yearRange, qualifiers, buttonLabel }: SubSectionProps) {
    return (
        <div className="mb-20 last:mb-0">
            {/* Sub-section heading */}
            <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-primary">
                    {title}
                </h3>
                <span className="mt-3 inline-block bg-[var(--secondary)] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    {yearRange}
                </span>
            </div>

            {/* Qualifier Cards */}
            {qualifiers.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 mt-8">
                    {qualifiers.map((q, idx) => (
                        <QualifierCard key={idx} qualifier={q} />
                    ))}
                </div>
            )}

            {/* View More Button */}
            <div className="text-center mt-16">
                <button className="inline-flex items-center gap-1.5 border-2 border-[var(--primary)] text-[var(--primary)] px-10 py-4.5 rectangle-lg text-sm font-bold hover:bg-[var(--primary)] hover:text-white transition-all duration-200">
                    {buttonLabel}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default function AcademicQualifiers() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* SECTION HEADING */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        Academic Qualifiers
                    </h2>
                    <div className="mt-3 w-12 h-1 bg-[var(--primary)] mx-auto rounded-full" />
                </div>

                {/* UGC NET Qualifiers */}
                <SubSection
                    title="UGC NET Qualifiers"
                    yearRange="2019 - 21"
                    qualifiers={netQualifiers}
                    buttonLabel="View more UGC NET Qualifiers"
                />

                {/* JRF Qualifiers */}
                <SubSection
                    title="JRF Qualifiers"
                    yearRange="2017 - 19"
                    qualifiers={jrfQualifiers}
                    buttonLabel="View more JRF Qualifiers"
                />

                {/* Winners of competition */}
                <SubSection
                    title="Winners of competition"
                    yearRange="2017 - 19"
                    qualifiers={competitionWinners}
                    buttonLabel="View more Winners of Competition"
                />
            </div>
        </section>
    );
}
