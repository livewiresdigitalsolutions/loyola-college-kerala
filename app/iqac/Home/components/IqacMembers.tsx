"use client";

import React, { useEffect, useState } from "react";

interface IqacMember {
    id: number;
    role: string;
    name: string;
    department?: string;
    display_order: number;
    category?: string;
}

// Static IQAC members data matching the design
const staticMembers: IqacMember[] = [
    // Management / Key roles
    { id: 1, role: "Chairperson", name: "Dr. George Thomas, SJ – Principal", display_order: 1 },
    { id: 2, role: "IQAC Coordinator", name: "Fr. Biju SJ", display_order: 2 },
    { id: 3, role: "Asst. Coordinator", name: "Dr. SGC and Mr. H. Jamal", display_order: 3 },
    { id: 4, role: "Librarian", name: "Dr. P.C. Kurian V", display_order: 4 },

    // Members of the Department of Arts
    {
        id: 5,
        role: "Member of the Department of Arts",
        name: "Dr. Prawathy P.K.",
        department: "HoD, Department of Social Work",
        display_order: 5,
    },
    {
        id: 6,
        role: "",
        name: "Dr. Asha R",
        department: "HoD, Department of Development Management",
        display_order: 6,
    },
    {
        id: 7,
        role: "",
        name: "Ms. Jose Nithiladamanilan Chirayil",
        department: "HoD, Department of Counselling Psychology",
        display_order: 7,
    },
    {
        id: 8,
        role: "",
        name: "Dr. Justin Mathew",
        department: "HoD, MCAM, Business Management",
        display_order: 8,
    },
    {
        id: 9,
        role: "",
        name: "Dr. Vimalkumar",
        department: "PhD, Department of Social Science",
        display_order: 9,
    },
    {
        id: 10,
        role: "",
        name: "Dr. Saril Mathew Manikunnar, SJ",
        department: "PhD, Psychology",
        display_order: 10,
    },
    {
        id: 11,
        role: "",
        name: "Dr. Pranil Dhas Alexander",
        department: "HoD, School of Social Work",
        display_order: 11,
    },
    {
        id: 12,
        role: "",
        name: "Mr. Ansar Ali MG",
        department: "PhD, SD (M.ed)",
        display_order: 12,
    },
    {
        id: 13,
        role: "",
        name: "Dr. Jejin M",
        department: "HoD (Research), Child and Family Management",
        display_order: 13,
    },
    {
        id: 14,
        role: "",
        name: "Dr. Rekha Asse Pandaraim",
        department: "Sub-in-position of Primary Child and Family Management",
        display_order: 14,
    },

    // Special roles
    { id: 15, role: "Academic Expert", name: "Prof. Col. HiB Simon s Thottill", display_order: 15 },
    { id: 16, role: "Autonomy Director", name: "Prof. Saju Jacob", display_order: 16 },
    { id: 17, role: "Controller of Examination", name: "Sri Prasanth Pillai N", display_order: 17 },
    { id: 18, role: "Bursar", name: "Prof. Ansel George", display_order: 18 },

    // Non-Teaching Staff Representative
    {
        id: 19,
        role: "Non-Teaching Staff Representative",
        name: "Mr. Joy D.C.",
        department: "Head Accounts",
        display_order: 19,
    },
    {
        id: 20,
        role: "",
        name: "Mr. Arun Elizabeth",
        department: "SA",
        display_order: 20,
    },

    // Local Society Representative
    {
        id: 21,
        role: "Local Society Representative",
        name: "Mr. Surendran Nair, Panchayath Deva in Loyola Ashram",
        display_order: 21,
    },

    // Alumni Representative
    {
        id: 22,
        role: "Alumni Representative",
        name: "Mr. Anthony Thamrias, President, Alumni Association",
        display_order: 22,
    },

    // Student Representative
    {
        id: 23,
        role: "Student Representative",
        name: "Mr. Aarib G.",
        display_order: 23,
    },
    {
        id: 24,
        role: "",
        name: "Ms. Meril Nisha A",
        display_order: 24,
    },

    // Employee Representative
    {
        id: 25,
        role: "Employee Representative",
        name: "Fr. Lavin Raj – Director, Loyola Social Centre",
        display_order: 25,
    },
];

export default function IqacMembers() {
    const [members] = useState<IqacMember[]>(staticMembers);

    return (
        <section className="bg-white py-12 md:py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                {/* SECTION HEADING */}
                <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-wide">
                        IQAC Members
                    </h2>
                    <div className="mt-2 w-12 h-0.5 bg-[var(--secondary)]" />
                </div>

                {/* MEMBERS TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <tbody>
                            {members.map((member, idx) => {
                                const isRoleRow = member.role !== "";
                                return (
                                    <tr
                                        key={member.id}
                                        className={`border-b border-gray-100 ${isRoleRow && idx !== 0 ? "border-t border-t-gray-200" : ""}`}
                                    >
                                        {/* ROLE CELL */}
                                        <td className="py-2.5 pr-4 md:pr-8 w-[28%] align-top">
                                            {isRoleRow && (
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {member.role}
                                                </span>
                                            )}
                                        </td>

                                        {/* NAME CELL */}
                                        <td className="py-2.5 pr-4 md:pr-8 w-[38%] align-top">
                                            
                                            <span className="text-sm text-gray-700">
                                                {member.name}
                                            </span>
                                        </td>

                                        {/* DEPARTMENT CELL */}
                                        <td className="py-2.5 w-[34%] align-top text-right md:table-cell">
                                                <span className="text-xs text-gray-500">
                                                    {member.department}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
