"use client";

import React, { useEffect, useState } from "react";

interface IqacMember {
    id: number;
    role: string;       // sub-designation / extra info (e.g. "Principal", "Head Accountant")
    name: string;
    department?: string; // HoD of which dept, or extra label shown on the right
    category: string;   // the section heading label (e.g. "Chairperson", "IQAC Coordinator")
    display_order: number;
    is_active?: boolean;
}

// Ordered list of section headings — matches the DB `category` values
const SECTION_ORDER = [
    "Chairperson",
    "IQAC Coordinator",
    "Asst. Coordinator",
    "Librarian",
    "Head of the Departments",
    "Academic Expert",
    "Autonomy Director",
    "Controller of Examination",
    "Bursar",
    "Non Teaching Staff Representatives",
    "Local Society Representative",
    "Alumni Representative",
    "Student Representatives",
    "Employer Representative",
];

export default function IqacMembers() {
    const [members, setMembers] = useState<IqacMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/iqac/About?type=members")
            .then((r) => r.json())
            .then((d) => {
                if (d.success && d.data && d.data.length > 0) {
                    setMembers(d.data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="bg-white py-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-8 w-48 bg-gray-100 animate-pulse rounded mb-6" />
                    <div className="h-64 bg-gray-100 animate-pulse rounded" />
                </div>
            </section>
        );
    }

    // Group members by their category, preserving SECTION_ORDER
    const sections = SECTION_ORDER.map((label) => ({
        label,
        items: members
            .filter((m) => (m.category || "") === label)
            .sort((a, b) => a.display_order - b.display_order),
    })).filter((s) => s.items.length > 0);

    return (
        <section className="bg-white py-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                {/* Heading */}
                <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-wide">
                        IQAC Members
                    </h2>
                    <div className="mt-2 w-36 h-1 bg-[var(--primary)]" />
                </div>

                {sections.length === 0 ? (
                    <p className="text-gray-400 text-sm">No members added yet.</p>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {sections.map((section) => (
                            <div key={section.label} className="py-2">
                                {section.items.length === 1 ? (
                                    /* Single-member category: role label | name · sub-role | dept right */
                                    <div className="flex items-baseline gap-4 py-2">
                                        {/* Left: category label */}
                                        <span className="w-56 flex-shrink-0 text-sm font-semibold text-[var(--secondary)] italic">
                                            {section.label}:
                                        </span>
                                        {/* Middle: name + optional sub-designation */}
                                        <span className="flex-1 text-sm font-medium text-gray-800">
                                            {section.items[0].name}
                                            {section.items[0].role && (
                                                <span className="text-gray-400 font-normal ml-2 text-xs">
                                                    · {section.items[0].role}
                                                </span>
                                            )}
                                        </span>
                                        {/* Right: department */}
                                        {section.items[0].department && (
                                            <span className="text-xs text-gray-400 text-right ml-auto">
                                                {section.items[0].department}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    /* Multi-member category: label on first row, then indented members */
                                    <>
                                        <div className="flex items-baseline gap-4 py-2">
                                            <span className="w-56 flex-shrink-0 text-sm font-semibold text-[var(--secondary)] italic">
                                                {section.label}:
                                            </span>
                                            {/* First member inline with the label */}
                                            <span className="flex-1 text-sm font-medium text-gray-800">
                                                {section.items[0].name}
                                                {section.items[0].role && (
                                                    <span className="text-gray-400 font-normal ml-2 text-xs">
                                                        · {section.items[0].role}
                                                    </span>
                                                )}
                                            </span>
                                            {section.items[0].department && (
                                                <span className="text-xs text-gray-400 text-right ml-auto">
                                                    {section.items[0].department}
                                                </span>
                                            )}
                                        </div>
                                        {/* Remaining members indented under the label */}
                                        {section.items.slice(1).map((member) => (
                                            <div key={member.id} className="flex items-baseline gap-4 py-1.5">
                                                <span className="w-56 flex-shrink-0" /> {/* spacer to align */}
                                                <span className="flex-1 text-sm font-medium text-gray-800">
                                                    {member.name}
                                                    {member.role && (
                                                        <span className="text-gray-400 font-normal ml-2 text-xs">
                                                            · {member.role}
                                                        </span>
                                                    )}
                                                </span>
                                                {member.department && (
                                                    <span className="text-xs text-gray-400 text-right ml-auto">
                                                        {member.department}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
