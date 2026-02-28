"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface Minute { id: number; year: string; pdf_url: string; display_order: number; }

export default function IqacMinutes() {
    const [minutes, setMinutes] = useState<Minute[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/iqac/Activities?type=minutes")
            .then(r => r.json())
            .then(d => { if (d.success) setMinutes(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>;
    if (minutes.length === 0) return null;

    return (
        <section className="py-10 md:py-12 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">IQAC Minutes and Action Taken Report</h2>
                <div className="mt-2 w-10 h-0.5 bg-primary mb-6" />
                <div className="overflow-x-auto rounded-sm shadow-sm border border-gray-200">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr style={{ background: "#0d4a33" }}>
                                {["S.No", "Year", "Download"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-white font-semibold text-xs uppercase tracking-wide border-r border-green-800 last:border-r-0">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {minutes.map((m, idx) => (
                                <tr key={m.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50/40 transition-colors`}>
                                    <td className="px-4 py-3 text-gray-500 text-center w-16 font-medium">{idx + 1}</td>
                                    <td className="px-4 py-3 text-gray-900 font-medium">{m.year}</td>
                                    <td className="px-4 py-3 w-36">
                                        {m.pdf_url ? (
                                            <a
                                                href={m.pdf_url}
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
        </section>
    );
}
