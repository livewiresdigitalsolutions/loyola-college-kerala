"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface FeedbackDoc { id: number; title: string; pdf_url: string; display_order: number; }

function DownloadTable({ title, docs }: { title: string; docs: FeedbackDoc[] }) {
    if (docs.length === 0) return null;
    return (
        <div className="mb-10">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">{title}</h3>
            <div className="overflow-x-auto rounded-sm shadow-sm border border-gray-200">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr style={{ background: "#0d4a33" }}>
                            {["S.No", "Feedback Forms", "Download"].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-white font-semibold text-xs uppercase tracking-wide border-r border-green-800 last:border-r-0">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {docs.map((doc, idx) => (
                            <tr key={doc.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50/40 transition-colors`}>
                                <td className="px-4 py-3 text-gray-500 text-center w-14 font-medium">{idx + 1}</td>
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
        </div>
    );
}

export default function FeedbackContent() {
    const [forms, setForms] = useState<FeedbackDoc[]>([]);
    const [reports, setReports] = useState<FeedbackDoc[]>([]);
    const [atr, setAtr] = useState<FeedbackDoc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/iqac/Feedback?type=forms").then(r => r.json()),
            fetch("/api/iqac/Feedback?type=reports").then(r => r.json()),
            fetch("/api/iqac/Feedback?type=atr").then(r => r.json()),
        ]).then(([f, rp, at]) => {
            if (f.success) setForms(f.data || []);
            if (rp.success) setReports(rp.data || []);
            if (at.success) setAtr(at.data || []);
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <section className="bg-white py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Page heading */}
                <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Feedback</h2>
                    <div className="mt-2 w-10 h-0.5 bg-primary mb-3" />
                    <p className="text-sm text-gray-500">Download feedback forms and access action taken reports from IQAC.</p>
                </div>

                {/* ── Feedback Forms buttons ── */}
                {forms.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Feedback Forms</h3>
                        <div className="flex flex-wrap gap-3">
                            {forms.map(f => (
                                <a
                                    key={f.id}
                                    href={f.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    style={{ background: "#0d4a33" }}
                                    className="inline-flex items-center gap-2 text-white text-sm px-5 py-3 rounded-sm hover:brightness-110 transition-all font-medium"
                                >
                                    <Download className="w-4 h-4 flex-shrink-0" />
                                    {f.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Feedback and ATR section ── */}
                {(reports.length > 0 || atr.length > 0) && (
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-6">
                            Feedback and Action Taken Reports
                        </h3>
                        <DownloadTable title="Feedback Reports" docs={reports} />
                        <DownloadTable title="Action Taken Reports" docs={atr} />
                    </div>
                )}
            </div>
        </section>
    );
}
