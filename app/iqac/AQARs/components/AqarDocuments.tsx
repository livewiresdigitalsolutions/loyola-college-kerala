"use client";

import React, { useEffect, useState } from "react";
import { FileText, ExternalLink, BookOpen } from "lucide-react";

interface AqarDocument {
    id: number;
    title: string;
    cycle: number;
    academic_year: string;
    description: string;
    pdf_url: string;
    display_order: number;
}

export default function AqarDocuments() {
    const [docs, setDocs] = useState<AqarDocument[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/iqac/AQARs")
            .then((r) => r.json())
            .then((d) => { if (d.success) setDocs(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Group docs by cycle (descending)
    const byCycle: Record<number, AqarDocument[]> = {};
    for (const doc of docs) {
        if (!byCycle[doc.cycle]) byCycle[doc.cycle] = [];
        byCycle[doc.cycle].push(doc);
    }
    const cycles = Object.keys(byCycle)
        .map(Number)
        .sort((a, b) => b - a); // descending: Cycle 4 first

    // Global sequential row counter
    let rowNum = 0;

    return (
        <section className="bg-white py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        Annual Quality Assurance Reports (AQAR)
                    </h2>
                    <div className="mt-2 w-12 h-0.5 bg-primary" />
                    <p className="mt-3 text-sm text-gray-600 max-w-2xl">
                        Download the Annual Quality Assurance Reports prepared for NAAC accreditation cycles.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                        Loading documents…
                    </div>
                ) : docs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-sm">
                        <BookOpen className="w-10 h-10 mb-3 opacity-40" />
                        <p className="text-sm">No AQAR documents available yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-sm shadow-sm border border-gray-200">
                        <table className="w-full border-collapse text-sm">
                            {/* Table Header */}
                            <thead>
                                <tr style={{ background: "#0d4a33" }}>
                                    {["S.No", "AQAR", "Download"].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-white font-semibold text-xs uppercase tracking-wide border-r border-green-800 last:border-r-0"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cycles.map((cycle) => (
                                    <React.Fragment key={cycle}>
                                        {/* Cycle Group Header Row */}
                                        <tr style={{ background: "#1a5c3f" }}>
                                            <td
                                                colSpan={3}
                                                className="px-4 py-2 text-white text-xs font-semibold uppercase tracking-wider"
                                            >
                                                AQARs Cycle {cycle}
                                            </td>
                                        </tr>
                                        {/* Document Rows */}
                                        {byCycle[cycle].map((doc, idx) => {
                                            rowNum += 1;
                                            const currentRow = rowNum;
                                            return (
                                                <tr
                                                    key={doc.id}
                                                    className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50/40 transition-colors`}
                                                >
                                                    <td className="px-4 py-3 text-gray-500 text-center w-16 font-medium">
                                                        {currentRow}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-900 font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-primary/70 flex-shrink-0" />
                                                            {doc.title}
                                                            {doc.academic_year && (
                                                                <span className="text-xs text-gray-400 ml-1">
                                                                    ({doc.academic_year})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 w-36">
                                                        {doc.pdf_url ? (
                                                            <a
                                                                href={doc.pdf_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 bg-primary text-white text-xs px-3 py-1.5 rounded hover:bg-primary/90 transition-colors font-medium"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                                View PDF
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">Not available</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
