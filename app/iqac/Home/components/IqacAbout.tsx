"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface IqacCoordinator {
    id: number;
    name: string;
    role: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
}

export default function IqacAbout() {
    const [coordinators, setCoordinators] = useState<IqacCoordinator[]>([]);

    useEffect(() => {
        fetch("/api/iqac/About?type=coordinators")
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
                    <div className="mt-2 w-36 h-1 bg-[var(--primary)]" />
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 font-size-18 lg:items-stretch">
                    {/* LEFT: Text Content */}
                    <div className="text-xl flex-1 text-justify ">
                        <p className="text-gray-700 md:text-lg leading-relaxed mb-6">
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
                                {/* <div className="mt-2 w-16 h-0.5 bg-[var(--primary)]" /> */}
                            </h3>

                            <ul className="space-y-2.5 md:text-lg text-gray-700">
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
                        <div className="flex flex-row gap-6 justify-center lg:justify-end self-stretch">
                            {coordinators.map((coord) => (
                                <div key={coord.id} className="flex flex-col text-center h-full">
                                    <div className="relative flex-1 w-44 md:w-52 min-h-[200px] overflow-hidden shadow-md mx-auto">
                                        <Image
                                            src={coord.image_url}
                                            alt={coord.name || "IQAC Coordinator"}
                                            fill
                                            className="object-cover object-top"
                                        />
                                    </div>
                                    <div className="mt-2 px-1">
                                        <p className="text-sm font-semibold text-primary leading-tight">
                                            {coord.name}
                                        </p>
                                        {coord.role && (
                                            <p className="text-xs text-gray-500 mt-0.5">{coord.role}</p>
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
