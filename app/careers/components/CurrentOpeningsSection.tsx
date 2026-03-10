"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import JobDetailModal, { type JobOpening } from "./JobDetailModal";

export default function CurrentOpeningsSection() {
    const [openings, setOpenings] = useState<JobOpening[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

    useEffect(() => {
        fetch("/api/careers")
            .then(res => {
                if (!res.ok) throw new Error("Failed");
                return res.json();
            })
            .then(setOpenings)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <section className="py-16 px-6 max-w-6xl mx-auto">
                {/* Section heading */}
                <div className="mb-10">
                    <div className="w-10 h-0.5 bg-[var(--primary)] mb-3" />
                    <h2 className="text-3xl font-bold text-[var(--primary)]">Current Openings</h2>
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="divide-y divide-gray-200 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="py-8 flex items-start justify-between gap-6">
                                <div className="flex-1 space-y-3">
                                    <div className="h-3 w-32 bg-gray-200 rounded" />
                                    <div className="h-5 w-64 bg-gray-200 rounded" />
                                    <div className="h-3 w-full max-w-md bg-gray-100 rounded" />
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="h-8 w-24 bg-gray-200 rounded" />
                                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="py-12 text-center text-gray-500">
                        Unable to load openings. Please try again later.
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && openings.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        No current openings at this time. Check back soon!
                    </div>
                )}

                {/* Job listing rows */}
                {!loading && !error && openings.length > 0 && (
                    <div className="divide-y divide-gray-200">
                        {openings.map((job) => (
                            <div key={job.id} className="py-8 flex items-start justify-between gap-6 group">
                                {/* Left content */}
                                <div className="flex-1 space-y-2">
                                    <p className="text-xs font-semibold tracking-widest text-[var(--secondary)] uppercase">
                                        {job.category}
                                    </p>
                                    <h3 className="text-xl md:text-2xl font-bold text-[var(--primary)] group-hover:opacity-80 transition-opacity">
                                        {job.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                                        {job.description}
                                    </p>
                                </div>

                                {/* Right: deadline + arrow */}
                                <div className="flex items-center gap-4 shrink-0 pt-1">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Deadline</p>
                                        <p className={`text-sm font-semibold ${job.deadlineOpen ? "text-[var(--secondary)]" : "text-gray-800"}`}>
                                            {job.deadline}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedJob(job)}
                                        aria-label={`View details for ${job.title}`}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-200 shrink-0 cursor-pointer"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {selectedJob && (
                <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}
        </>
    );
}
