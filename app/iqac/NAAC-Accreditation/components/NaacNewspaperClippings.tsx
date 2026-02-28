"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Clipping {
    id: number;
    title: string;
    image_url: string;
    display_order: number;
}

export default function NaacNewspaperClippings() {
    const [clippings, setClippings] = useState<Clipping[]>([]);

    useEffect(() => {
        fetch("/api/iqac/naac/clippings")
            .then((r) => r.json())
            .then((d) => { if (d.success) setClippings(d.data || []); })
            .catch(console.error);
    }, []);

    if (clippings.length === 0) return null;

    return (
        <section className="bg-gray-50 py-10 md:py-14 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
                        Newspaper Clippings
                    </h2>
                    <div className="mt-2 w-12 h-0.5 bg-primary" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {clippings.map((clip) => (
                        <div key={clip.id} className="group">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-md border border-gray-200 bg-white group-hover:shadow-lg transition-shadow">
                                <Image
                                    src={clip.image_url}
                                    alt={clip.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <p className="mt-2 text-xs text-center text-gray-600">{clip.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
