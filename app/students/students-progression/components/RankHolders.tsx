"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface RankHolder {
    id: number;
    name: string;
    department: string;
    rank: "FIRST" | "SECOND" | "THIRD";
    batch_year: string;
    image_url: string;
}

const rankBadge = {
    FIRST: { label: "FIRST", bg: "bg-yellow-400", text: "text-yellow-900" },
    SECOND: { label: "SECOND", bg: "bg-gray-300", text: "text-gray-700" },
    THIRD: { label: "THIRD", bg: "bg-orange-400", text: "text-orange-900" },
};

export default function RankHolders() {
    const [rankHolders, setRankHolders] = useState<RankHolder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/students/students-progression?type=rank-holders")
            .then((r) => r.json())
            .then((d) => { if (d.success) setRankHolders(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="bg-gray-50 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section heading */}
                <div className="text-center mb-20">
                    <h2
                        className="text-3xl md:text-4xl font-bold text-primary"
                    >
                        Rank Holders
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
                ) : rankHolders.length === 0 ? (
                    <p className="text-center text-gray-400 py-16">No rank holders found.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                        {rankHolders.map((student, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] overflow-hidden m-3 rounded-lg">
                                    <Image
                                        src={student.image_url || "/assets/defaultprofile.png"}
                                        alt={student.name}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Rank Badge */}
                                    <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${rankBadge[student.rank].bg} ${rankBadge[student.rank].text}`}>
                                        {rankBadge[student.rank].label}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="px-3 pb-4 flex flex-col flex-1">
                                    <h3
                                        className="text-sm font-bold text-gray-900 leading-snug"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        {student.name}
                                    </h3>
                                    <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-1">
                                        {student.department}
                                    </p>
                                    {student.batch_year && (
                                        <p className="text-[10px] text-gray-400 mt-0.5">Batch: {student.batch_year}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* View More Button */}
                {!loading && rankHolders.length > 0 && (
                    <div className="text-center mt-12">
                        <button className="inline-flex items-center gap-2 border-2 border-[var(--primary)] text-[var(--primary)] px-8 py-3 text-sm font-bold hover:bg-[var(--primary)] hover:text-white transition-all duration-200">
                            View more Rank Holders
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
