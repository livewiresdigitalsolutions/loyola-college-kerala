"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface IqacMedia {
    id: number;
    title: string;
    description: string;
    category: string;
    url: string;
    display_order: number;
}

export default function IqacAbout() {
    const [coordinators, setCoordinators] = useState<IqacMedia[]>([]);

    useEffect(() => {
        fetch("/api/iqac-media?category=coordinator")
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setCoordinators(d.data || []);
            })
            .catch(console.error);
    }, []);

    return (
        <section className="bg-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* SECTION HEADING */}
                <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-wide">
                        About IQAC
                    </h2>
                    <div className="mt-2 w-16 h-0.5 bg-[var(--primary)]" />
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    {/* LEFT: Text Content */}
                    <div className="flex-1">
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
                            The Internal Quality Assurance Cell (IQAC) is a quality management
                            system for and communicates internalization and institutionalization of
                            quality. So that the institution excels in standards and among its
                            structures and stakeholders. The IQAC proposes all the quality
                            enhancement and sustenance programmes of the College. Loyola College
                            establishes the IQAC in 2005 in accordance with the National Assessment
                            and Accreditation Council (NAAC) guidelines.
                        </p>

                        {/* KEY OBJECTIVES BOX */}
                        <div className="border border-gray-200 p-5 bg-[#F6F6EE] ">
                            <h3 className="text-xl md:text-2xl font-bold text-primary mb-6 tracking-wide">
                                Key Objectives
                                <div className="mt-2 w-16 h-0.5 bg-[var(--primary)]" />
                            </h3>

                            <ul className="space-y-2.5 text-sm  text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] mt-2 flex-shrink-0" />
                                    <span>
                                        To develop a system for conscious, consistent and catalytic action to improve
                                        the academic and administrative performance of the institution
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] mt-2 flex-shrink-0" />
                                    <span>
                                        To promote measures for institutional functioning towards quality enhancement
                                        through institutionalization of quality enhancement and dissemination of best practices
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT: Coordinator Images */}
                    {coordinators.length > 0 && (
                        <div className="flex flex-row lg:flex-row gap-6 justify-center lg:justify-end items-start">
                            {coordinators.map((coord) => (
                                <div key={coord.id} className="text-center">
                                    <div className="relative w-32 h-40 md:w-40 md:h-48 overflow-hidden shadow-md mx-auto">
                                        <Image
                                            src="/assets/les/defaultprofile.png"
                                            alt="IQAC Coordinator"
                                            fill
                                            className="object-cover object-top"
                                        />
                                    </div>
                                    <div className="mt-2 px-1">
                                        <p className="text-sm font-semibold text-primary leading-tight">
                                            {coord.title}
                                        </p>
                                        {coord.description && (
                                            <p className="text-xs text-gray-500 mt-0.5">{coord.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
