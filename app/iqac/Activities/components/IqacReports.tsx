"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface Report { id: number; title: string; pdf_url: string; display_order: number; }

export default function IqacReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/iqac/Activities?type=reports")
            .then(r => r.json())
            .then(d => { if (d.success) setReports(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>;
    if (reports.length === 0) return null;

    return (
        <section className="py-10 md:py-12 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">IQAC Reports</h2>
                <div className="mt-2 w-10 h-0.5 bg-primary mb-6" />
                <div className="flex flex-wrap gap-4">
                    {reports.map(r => (
                        <a
                            key={r.id}
                            href={r.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ background: "#0d4a33" }}
                            className="flex items-center gap-3 text-white px-6 py-4 rounded-sm hover:brightness-110 transition-all min-w-[180px]"
                        >
                            <Download className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium leading-snug">{r.title}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
