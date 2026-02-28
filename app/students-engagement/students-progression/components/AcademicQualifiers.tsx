"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Qualifier {
    id: number;
    name: string;
    department: string;
    qualifier_type: "NET" | "JRF" | "COMPETITION";
    rank: "FIRST" | "SECOND" | "THIRD";
    year_range: string;
    image_url: string;
}

const rankBadge = {
    FIRST: { bg: "bg-yellow-400", text: "text-yellow-900" },
    SECOND: { bg: "bg-gray-300", text: "text-gray-700" },
    THIRD: { bg: "bg-orange-400", text: "text-orange-900" },
};

const sectionConfig = [
    { type: "NET" as const, title: "UGC NET Qualifiers", color: "text-[var(--primary)]" },
    { type: "JRF" as const, title: "JRF Qualifiers", color: "text-[var(--primary)]" },
    { type: "COMPETITION" as const, title: "Competition Winners", color: "text-[var(--primary)]" },
];

function QualifierCard({ qualifier }: { qualifier: Qualifier }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden m-3 rounded-lg">
                <Image
                    src={qualifier.image_url || "/assets/defaultprofile.png"}
                    alt={qualifier.name}
                    fill
                    className="object-cover"
                />
                {/* Rank Badge */}
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${rankBadge[qualifier.rank].bg} ${rankBadge[qualifier.rank].text}`}>
                    {qualifier.rank}
                </span>
            </div>

            {/* Info */}
            <div className="px-3 pb-4 flex flex-col flex-1">
                <h3 className="text-sm font-bold text-gray-900 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {qualifier.name}
                </h3>
                <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-1">{qualifier.department}</p>
                {qualifier.year_range && (
                    <span className="mt-2 inline-block text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full w-fit">
                        {qualifier.year_range}
                    </span>
                )}
            </div>
        </div>
    );
}

function SubSection({ title, qualifiers }: { title: string; qualifiers: Qualifier[] }) {
    if (qualifiers.length === 0) return null;

    return (
        <div className="mb-16">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-[var(--primary)] border-b-2 border-[var(--primary)] pb-1 w-fit">
                    {title}
                </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 mt-8">
                {qualifiers.map((q, idx) => (
                    <QualifierCard key={idx} qualifier={q} />
                ))}
            </div>

            <div className="mt-8">
                <button className="inline-flex items-center gap-2 border border-[var(--primary)] text-[var(--primary)] px-6 py-2.5 text-sm font-semibold rounded-full hover:bg-[var(--primary)] hover:text-white transition-all duration-200">
                    View more
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function AcademicQualifiers() {
    const [qualifiers, setQualifiers] = useState<Qualifier[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/students/students-progression?type=qualifiers")
            .then((r) => r.json())
            .then((d) => { if (d.success) setQualifiers(d.data || []); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section heading */}
                <div className="text-center mb-20">
                    <h2
                        className="text-3xl md:text-4xl font-bold text-primary"
                    >
                        Academic Qualifiers
                    </h2>
                    <div className="mt-3 w-12 h-1 bg-[var(--secondary)] mx-auto rounded-full" />
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                                <div className="aspect-[4/5] bg-gray-200 m-3 rounded-lg" />
                                <div className="px-3 pb-4 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : qualifiers.length === 0 ? (
                    <p className="text-center text-gray-400 py-16">No qualifiers found.</p>
                ) : (
                    sectionConfig.map(({ type, title }) => (
                        <SubSection
                            key={type}
                            title={title}
                            qualifiers={qualifiers.filter((q) => q.qualifier_type === type)}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
