"use client";

import { Building2, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Placement {
    id: number;
    title: string;
    year_range: string;
    department: string;
}

export default function Placements() {
    const [placements, setPlacements] = useState<Placement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/students/students-progression?type=placements")
            .then((r) => r.json())
            .then((d) => { if (d.success) setPlacements(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="bg-white py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* SECTION HEADING */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        Placements
                    </h2>
                    <div className="mt-3 w-12 h-1 bg-[var(--secondary)] mx-auto rounded-full" />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 border border-dashed border-gray-200 rounded-xl px-5 py-5 animate-pulse">
                                <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : placements.length === 0 ? (
                    <p className="text-center text-gray-400 py-16">No placements found.</p>
                ) : (
                    <div className="grid font-size:14px grid-cols-1 md:grid-cols-2 gap-5">
                        {placements.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-4 border border-dashed border-gray-200 rounded-xl px-5 py-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-[var(--primary)]" />
                                </div>

                                {/* Text */}
                                <div>
                                    <h3 className="text-sm md:text-[20px] font-bold text-gray-900 leading-snug font-size:15px">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                                        <span className="text-[var(--secondary)] font-semibold">
                                            {item.year_range}
                                        </span>
                                        {item.year_range && item.department && <span className="mx-1.5">&middot;</span>}
                                        {item.department}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* View More Button */}
                {!loading && placements.length > 0 && (
                    <div className="text-center mt-16">
                        <button className="inline-flex items-center justify-center gap-1.5 border-2 border-[var(--primary)] text-[var(--primary)] px-10 py-4.5 rectangle-lg text-sm font-bold hover:bg-[var(--primary)] hover:text-white transition-all duration-200">
                            View more Placements
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
