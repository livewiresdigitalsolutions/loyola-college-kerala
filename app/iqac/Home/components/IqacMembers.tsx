"use client";

import React, { useEffect, useState } from "react";

interface IqacMember {
    id: number;
    role: string;
    name: string;
    department?: string;
    category?: string;
    display_order: number;
}

const CATEGORY_LABELS: Record<string, string> = {
    general: "Management / Key Roles",
    arts: "Member of the Department of Arts",
    science: "Member of the Department of Science",
    admin: "Administrative Expert",
    alumni: "Alumni",
    student: "Student Representative",
    local: "Local Society Representative",
    industry: "Industry / Employer Representative",
};

// Fallback static data (used while DB is being populated)
const STATIC_MEMBERS: IqacMember[] = [
    { id: 1, role: "Chairperson", name: "Dr. George Thomas, SJ – Principal", category: "general", display_order: 1 },
    { id: 2, role: "IQAC Coordinator", name: "Fr. Biju SJ", category: "general", display_order: 2 },
    { id: 3, role: "Asst. Coordinator", name: "Dr. SGC and Mr. H. Jamal", category: "general", display_order: 3 },
    { id: 4, role: "Librarian", name: "Dr. P.C. Kurian V", category: "general", display_order: 4 },
    { id: 5, role: "Member of the Dept. of Arts", name: "Dr. Prawathy P.K.", department: "HoD, Department of Social Work", category: "arts", display_order: 5 },
    { id: 6, role: "", name: "Dr. Asha R", department: "HoD, Department of Development Management", category: "arts", display_order: 6 },
    { id: 7, role: "", name: "Ms. Jose Nithiladamanilan Chirayil", department: "HoD, Department of Counselling Psychology", category: "arts", display_order: 7 },
    { id: 8, role: "", name: "Dr. Justin Mathew", department: "HoD, MCAM, Business Management", category: "arts", display_order: 8 },
    { id: 9, role: "", name: "Dr. Siranjeevi M", department: "HoD, MCAM (CS) / IT Dept", category: "arts", display_order: 9 },
    { id: 10, role: "", name: "Dr. Geo Varghese Alexander", department: "HoD, M.Sc. Psychology", category: "arts", display_order: 10 },
    { id: 11, role: "", name: "Dr. Joyal V Sebastian", department: "HoD (I/C) MAECO", category: "arts", display_order: 11 },
    { id: 12, role: "", name: "Mr. Anurag B", category: "arts", display_order: 12 },
    { id: 13, role: "", name: "Mr. Agnel B", category: "arts", display_order: 13 },
    { id: 14, role: "", name: "Mr. Jito Sam Thomas", category: "arts", display_order: 14 },
    { id: 15, role: "Administrative Expert", name: "Prof. Steven Simon Therd", category: "admin", display_order: 15 },
    { id: 16, role: "Swimming Trainer", name: "Prof. Saji Leela", category: "admin", display_order: 16 },
    { id: 17, role: "Controller of Examination", name: "Fr. Hildegard Fr. M", category: "admin", display_order: 17 },
    { id: 18, role: "Bursar", name: "Fr. D. Barry L. Gracias", category: "admin", display_order: 18 },
    { id: 19, role: "Non-Teaching Staff Rep.", name: "Mr. Joji C", category: "admin", display_order: 19 },
    { id: 20, role: "", name: "Mr. Joel Gojnath", category: "admin", display_order: 20 },
    { id: 21, role: "Local Society Rep.", name: "Dr. Suvarna Seri", category: "local", display_order: 21 },
    { id: 22, role: "", name: "Dr. Jimmy Thomas, J", category: "local", display_order: 22 },
];

export default function IqacMembers() {
    const [members, setMembers] = useState<IqacMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [usedFallback, setUsedFallback] = useState(false);

    useEffect(() => {
        fetch("/api/iqac/About?type=members")
            .then((r) => r.json())
            .then((d) => {
                if (d.success && d.data && d.data.length > 0) {
                    setMembers(d.data);
                } else {
                    // Fall back to static data if DB table is empty or not ready
                    setMembers(STATIC_MEMBERS);
                    setUsedFallback(true);
                }
            })
            .catch(() => {
                setMembers(STATIC_MEMBERS);
                setUsedFallback(true);
            })
            .finally(() => setLoading(false));
    }, []);

    // Group by category
    const categories = Object.keys(CATEGORY_LABELS);
    const grouped = categories.map(cat => ({
        label: CATEGORY_LABELS[cat],
        items: members.filter(m => (m.category || "general") === cat),
    })).filter(g => g.items.length > 0);

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

    return (
        <section className="bg-white py-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-wide">
                        IQAC Members
                    </h2>
                    <div className="mt-2 w-16 h-0.5 bg-primary" />
                </div>

                <div className="overflow-x-auto rounded border border-gray-200 shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-primary text-white text-xs uppercase tracking-wide">
                                <th className="px-4 py-3 text-left w-1/4">Role</th>
                                <th className="px-4 py-3 text-left w-1/3">Name</th>
                                <th className="px-4 py-3 text-left">Department / Designation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {grouped.map((group) => (
                                <React.Fragment key={group.label}>
                                    {/* Category header row */}
                                    <tr className="bg-primary/10">
                                        <td colSpan={3} className="px-4 py-2 text-xs font-semibold text-primary uppercase tracking-wide">
                                            {group.label}
                                        </td>
                                    </tr>
                                    {group.items.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2.5 text-gray-600 text-xs">{member.role || ""}</td>
                                            <td className="px-4 py-2.5 font-medium text-gray-800">{member.name}</td>
                                            <td className="px-4 py-2.5 text-gray-500 text-xs">{member.department || ""}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
