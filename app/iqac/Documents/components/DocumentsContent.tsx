"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface IqacDoc { id: number; title: string; category: string; pdf_url: string; display_order: number; category_order: number; }

export default function DocumentsContent() {
    const [docs, setDocs] = useState<IqacDoc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/iqac/Documents")
            .then(r => r.json())
            .then(d => { if (d.success) setDocs(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (docs.length === 0) return (
        <section className="py-16 text-center text-gray-400 text-sm">No documents available yet.</section>
    );

    // Group by category preserving category_order
    const categoryMap: Map<string, IqacDoc[]> = new Map();
    for (const doc of docs) {
        if (!categoryMap.has(doc.category)) categoryMap.set(doc.category, []);
        categoryMap.get(doc.category)!.push(doc);
    }

    return (
        <section className="bg-white py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">IQAC Documents</h2>
                    <div className="mt-2 w-10 h-0.5 bg-primary" />
                </div>

                <div className="space-y-10">
                    {Array.from(categoryMap.entries()).map(([category, catDocs]) => (
                        <div key={category}>
                            {/* Category heading */}
                            <h3 className="text-sm md:text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                                {category}
                            </h3>

                            <div className="overflow-x-auto rounded-sm shadow-sm border border-gray-200">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr style={{ background: "#0d4a33" }}>
                                            {["S.No", "Document Name", "Download"].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-white font-semibold text-xs uppercase tracking-wide border-r border-green-800 last:border-r-0">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {catDocs.map((doc, idx) => (
                                            <tr
                                                key={doc.id}
                                                className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50/40 transition-colors`}
                                            >
                                                <td className="px-4 py-3 text-gray-500 text-center w-14 font-medium">{idx + 1}</td>
                                                <td className="px-4 py-3 text-gray-900 font-medium">{doc.title}</td>
                                                <td className="px-4 py-3 w-36">
                                                    {doc.pdf_url ? (
                                                        <a
                                                            href={doc.pdf_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download
                                                            className="inline-flex items-center gap-1.5 bg-primary text-white text-xs px-3 py-1.5 rounded hover:bg-primary/90 transition-colors font-medium"
                                                        >
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
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
