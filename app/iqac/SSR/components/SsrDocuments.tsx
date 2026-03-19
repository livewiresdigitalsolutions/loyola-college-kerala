"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Download } from "lucide-react";

interface SsrDocument {
    id: number;
    s_no: number;
    title: string;
    pdf_url: string;
}

export default function SsrDocuments() {
    const [docs, setDocs] = useState<SsrDocument[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/iqac/ssr")
            .then((r) => r.json())
            .then((d) => { if (d.success) setDocs(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="bg-white py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-primary tracking-wide">
                        Self Study Reports (SSR)
                    </h2>
                    <div className="mt-2 w-12 h-0.5 bg-primary" />
                    <p className="mt-3 text-sm text-gray-600 max-w-2xl">
                        Download the Self Study Reports prepared for NAAC accreditation cycles.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                        Loading documents…
                    </div>
                ) : docs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-sm">
                        <BookOpen className="w-10 h-10 mb-3 opacity-40" />
                        <p className="text-sm">No SSR documents available yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-sm shadow-sm border border-gray-200">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr style={{ background: "#0d4a33" }}>
                                    {["S.No", "SSR", "Download"].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-white font-semibold text-xs uppercase tracking-wide whitespace-nowrap border-r border-green-800 last:border-r-0"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {docs.map((doc, idx) => (
                                    <tr
                                        key={doc.id}
                                        className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50/40 transition-colors`}
                                    >
                                        {/* S.No */}
                                        <td className="px-4 py-3 font-bold text-primary text-base w-16">
                                            {doc.s_no}
                                        </td>
                                        {/* SSR Title */}
                                        <td className="px-4 py-3 text-gray-800 font-medium">
                                            {doc.title}
                                        </td>
                                        {/* Download */}
                                        <td className="px-4 py-3 w-40">
                                            {doc.pdf_url ? (
                                                <a
                                                    href={doc.pdf_url}
                                                    download
                                                    className="inline-flex items-center gap-1.5 bg-primary text-white text-xs px-4 py-2 rounded hover:bg-primary/90 transition-colors font-medium"
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
                )}
            </div>
        </section>
    );
}
