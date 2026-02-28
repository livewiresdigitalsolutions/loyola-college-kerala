"use client";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface Timeline { id: number; year: string; view_url: string; display_order: number; }

export default function IqacTimelines() {
    const [timelines, setTimelines] = useState<Timeline[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/iqac/Activities?type=timelines")
            .then(r => r.json())
            .then(d => { if (d.success) setTimelines(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>;
    if (timelines.length === 0) return null;

    return (
        <section className="py-10 md:py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">IQAC Timelines</h2>
                <div className="mt-2 w-10 h-0.5 bg-primary mb-6" />
                <div className="overflow-x-auto rounded-sm shadow-sm border border-gray-200 max-w-lg">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr style={{ background: "#0d4a33" }}>
                                <th className="px-4 py-3 text-left text-white font-semibold text-xs uppercase tracking-wide border-r border-green-800">Year</th>
                                <th className="px-4 py-3 text-left text-white font-semibold text-xs uppercase tracking-wide">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timelines.map((t, idx) => (
                                <tr key={t.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50/40 transition-colors`}>
                                    <td className="px-4 py-3 text-gray-900 font-medium">{t.year}</td>
                                    <td className="px-4 py-3">
                                        {t.view_url ? (
                                            <a
                                                href={t.view_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 bg-primary text-white text-xs px-3 py-1.5 rounded hover:bg-primary/90 transition-colors font-medium"
                                            >
                                                <ExternalLink className="w-3 h-3" /> View
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
        </section>
    );
}
