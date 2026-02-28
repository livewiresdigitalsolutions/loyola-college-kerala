"use client";

import { useEffect, useState } from "react";
import { Download, ChevronDown, ChevronUp } from "lucide-react";

interface StandaloneDoc { id: number; title: string; pdf_url: string; display_order: number; }
interface MinuteDoc { id: number; title: string; committee: string; pdf_url: string; display_order: number; }

const COMMITTEES = ["Governing Body", "Academic Council", "Finance Committee"];

export default function AutonomyContent() {
    const [standalone, setStandalone] = useState<StandaloneDoc[]>([]);
    const [minutes, setMinutes] = useState<MinuteDoc[]>([]);
    const [loading, setLoading] = useState(true);
    // Track which committees are open (all open by default)
    const [openCommittees, setOpenCommittees] = useState<Record<string, boolean>>(
        Object.fromEntries(COMMITTEES.map(c => [c, true]))
    );

    useEffect(() => {
        Promise.all([
            fetch("/api/iqac/Autonomy?type=standalone").then(r => r.json()),
            fetch("/api/iqac/Autonomy?type=minutes").then(r => r.json()),
        ]).then(([sa, mn]) => {
            if (sa.success) setStandalone(sa.data || []);
            if (mn.success) setMinutes(mn.data || []);
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const toggleCommittee = (name: string) =>
        setOpenCommittees(prev => ({ ...prev, [name]: !prev[name] }));

    // Group minutes by committee, preserving committee order
    const byCommittee: Record<string, MinuteDoc[]> = {};
    for (const m of minutes) {
        if (!byCommittee[m.committee]) byCommittee[m.committee] = [];
        byCommittee[m.committee].push(m);
    }
    // Dynamic committees: start with known order, then add any others
    const allCommittees = [
        ...COMMITTEES.filter(c => byCommittee[c]),
        ...Object.keys(byCommittee).filter(c => !COMMITTEES.includes(c)),
    ];

    // Split standalone into top (display_order < 50) and bottom (≥ 50)
    const topDocs = standalone.filter(d => d.display_order < 50).sort((a, b) => a.display_order - b.display_order);
    const bottomDocs = standalone.filter(d => d.display_order >= 50).sort((a, b) => a.display_order - b.display_order);

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <section className="bg-white py-10 md:py-14">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                {/* Section heading */}
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Autonomy</h2>
                    <div className="mt-2 w-10 h-0.5 bg-primary mb-3" />
                    <p className="text-sm text-gray-500">
                        Access official autonomy documents, committee minutes, and institutional policies.
                    </p>
                </div>

                {/* ── Top standalone docs ── */}
                {topDocs.map(doc => (
                    <StandaloneRow key={doc.id} doc={doc} />
                ))}

                {/* ── Minutes accordion ── */}
                {allCommittees.length > 0 && (
                    <div className="mt-6 mb-4">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Minutes</h3>
                        <div className="space-y-3">
                            {allCommittees.map(committee => (
                                <div key={committee} className="border border-gray-200 rounded-sm overflow-hidden">
                                    {/* Accordion header */}
                                    <button
                                        onClick={() => toggleCommittee(committee)}
                                        className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-green-50/40 transition-colors text-left"
                                    >
                                        <span className="text-sm font-semibold text-gray-800">{committee}</span>
                                        {openCommittees[committee]
                                            ? <ChevronUp className="w-4 h-4 text-gray-500" />
                                            : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                    </button>

                                    {/* Committee table */}
                                    {openCommittees[committee] && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse text-sm">
                                                <thead>
                                                    <tr style={{ background: "#0d4a33" }}>
                                                        {["S.No", "Document Name", "Download"].map(h => (
                                                            <th key={h} className="px-4 py-2.5 text-left text-white font-semibold text-xs uppercase tracking-wide border-r border-green-800 last:border-r-0">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(byCommittee[committee] || []).map((doc, idx) => (
                                                        <tr key={doc.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50/40 transition-colors`}>
                                                            <td className="px-4 py-3 text-gray-500 text-center w-14">{idx + 1}</td>
                                                            <td className="px-4 py-3 text-gray-900 font-medium">{doc.title}</td>
                                                            <td className="px-4 py-3 w-36">
                                                                {doc.pdf_url ? (
                                                                    <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer" download
                                                                        className="inline-flex items-center gap-1.5 bg-primary text-white text-xs px-3 py-1.5 rounded hover:bg-primary/90 transition-colors font-medium">
                                                                        <Download className="w-3.5 h-3.5" /> Download
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-gray-400 text-xs">Not available</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Bottom standalone docs ── */}
                {bottomDocs.map(doc => (
                    <StandaloneRow key={doc.id} doc={doc} />
                ))}
            </div>
        </section>
    );
}

function StandaloneRow({ doc }: { doc: StandaloneDoc }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50/60 transition-colors px-1">
            <span className="text-sm font-medium text-gray-900 flex-1 pr-4">{doc.title}</span>
            {doc.pdf_url ? (
                <a
                    href={doc.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1.5 bg-primary text-white text-xs px-3 py-1.5 rounded hover:bg-primary/90 transition-colors font-medium whitespace-nowrap flex-shrink-0"
                >
                    <Download className="w-3.5 h-3.5" /> Download
                </a>
            ) : (
                <span className="text-gray-400 text-xs">Not available</span>
            )}
        </div>
    );
}
