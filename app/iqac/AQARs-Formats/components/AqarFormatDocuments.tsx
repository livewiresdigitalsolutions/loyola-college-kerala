"use client";

import React, { useEffect, useState } from "react";
import { Download, BookOpen, FolderOpen } from "lucide-react";

interface FormatDoc {
    id: number;
    title: string;
    category: string;
    category_order: number;
    pdf_url: string;
    display_order: number;
}

export default function AqarFormatDocuments() {
    const [docs, setDocs] = useState<FormatDoc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/iqac/AQARs-Formats")
            .then((r) => r.json())
            .then((d) => { if (d.success) setDocs(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Group by category, preserving category_order sort
    const byCategory: Record<string, FormatDoc[]> = {};
    const categoryOrder: Record<string, number> = {};
    for (const doc of docs) {
        if (!byCategory[doc.category]) {
            byCategory[doc.category] = [];
            categoryOrder[doc.category] = doc.category_order;
        }
        byCategory[doc.category].push(doc);
    }
    const categories = Object.keys(byCategory).sort(
        (a, b) => (categoryOrder[a] ?? 0) - (categoryOrder[b] ?? 0)
    );

    return (
        <section className="bg-white py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">AQAR Formats</h2>
                    <div className="mt-2 w-12 h-0.5 bg-primary" />
                    <p className="mt-3 text-sm text-gray-600 max-w-2xl">
                        Download various forms and formats required for institutional documentation
                        and quality assurance processes.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                        Loading documents…
                    </div>
                ) : docs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-sm">
                        <BookOpen className="w-10 h-10 mb-3 opacity-40" />
                        <p className="text-sm">No format documents available yet.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {categories.map((cat) => {
                            const catDocs = byCategory[cat];
                            return (
                                <div key={cat}>
                                    {/* Category Heading */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <FolderOpen className="w-5 h-5 text-primary" />
                                        <h3 className="text-base md:text-lg font-bold text-gray-900">{cat}</h3>
                                    </div>

                                    {/* Table */}
                                    <div className="overflow-x-auto rounded-sm shadow-sm border border-gray-200">
                                        <table className="w-full border-collapse text-sm">
                                            <thead>
                                                <tr style={{ background: "#0d4a33" }}>
                                                    {["S.No", "Document Name", "Download"].map((h) => (
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
                                                {catDocs.map((doc, idx) => (
                                                    <tr
                                                        key={doc.id}
                                                        className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50/40 transition-colors`}
                                                    >
                                                        <td className="px-4 py-3 text-gray-500 text-center w-16 font-medium">
                                                            {idx + 1}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900 font-medium">
                                                            {doc.title}
                                                        </td>
                                                        <td className="px-4 py-3 w-36">
                                                            {doc.pdf_url ? (
                                                                <a
                                                                    href={doc.pdf_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download
                                                                    className="inline-flex items-center gap-1.5 bg-primary text-white text-xs px-3 py-1.5 rounded hover:bg-primary/90 transition-colors font-medium"
                                                                >
                                                                    <Download className="w-3.5 h-3.5" />
                                                                    Download
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
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
