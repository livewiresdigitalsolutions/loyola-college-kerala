"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";

interface PeerVisit {
    id: number;
    title: string;
    visit_year: number;
    photo_count: number;
    cover_image_url: string;
}

export default function NaacPeerVisits() {
    const [visits, setVisits] = useState<PeerVisit[]>([]);

    useEffect(() => {
        fetch("/api/iqac/naac/peer-visits")
            .then((r) => r.json())
            .then((d) => { if (d.success) setVisits(d.data || []); })
            .catch(console.error);
    }, []);

    if (visits.length === 0) return null;

    return (
        <section className="bg-white py-10 md:py-14 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
                        Peer Team Visit – Photos
                    </h2>
                    <div className="mt-2 w-12 h-0.5 bg-primary" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {visits.map((visit) => (
                        <div key={visit.id} className="group relative overflow-hidden rounded-sm shadow-md cursor-pointer">
                            {/* Cover Image */}
                            <div className="relative h-52 md:h-64 bg-gray-200">
                                <Image
                                    src={visit.cover_image_url}
                                    alt={visit.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                            </div>

                            {/* Overlay Badge */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="bg-primary/90 backdrop-blur-sm rounded-sm px-3 py-2 inline-flex items-start gap-2 max-w-full">
                                    <Images className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-white font-semibold text-sm leading-tight">
                                            VISIT {visit.visit_year}
                                        </p>
                                        {visit.photo_count > 0 && (
                                            <p className="text-white/80 text-xs">{visit.photo_count} PHOTOS</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Titles below cards */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-2`}>
                    {visits.map((visit) => (
                        <p key={visit.id} className="text-sm text-gray-700 font-medium text-center">
                            {visit.title}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
