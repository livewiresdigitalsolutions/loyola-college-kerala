// "use client";
// import { useEffect, useState } from "react";
// import { Download } from "lucide-react";

// interface Report { id: number; title: string; pdf_url: string; display_order: number; }

// export default function IqacReports() {
//     const [reports, setReports] = useState<Report[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch("/api/iqac/Activities?type=reports")
//             .then(r => r.json())
//             .then(d => { if (d.success) setReports(d.data || []); })
//             .catch(console.error)
//             .finally(() => setLoading(false));
//     }, []);

//     if (loading) return <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>;
//     if (reports.length === 0) return null;

//     return (
//         <section className="py-10 md:py-12 bg-gray-50/50">
//             <div className="max-w-7xl mx-auto px-4 md:px-6">
//                 <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">IQAC Reports</h2>
//                 <div className="mt-2 w-10 h-0.5 bg-primary mb-6" />
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {reports.map(r => (
//                         <a
//                             key={r.id}
//                             href={r.pdf_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={{ background: "#0d4a33" }}
//                             className="flex flex-col items-center justify-center gap-2 text-white px-6 py-6 rounded-sm hover:brightness-110 transition-all text-center"
//                         >
//                             <Download className="w-5 h-5 flex-shrink-0" />
//                             <span className="text-sm font-medium leading-snug">{r.title}</span>
//                         </a>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }



"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface Report { id: number; title: string; pdf_url: string; display_order: number; }

async function handleDownload(url: string, filename: string) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch {
        // Fallback: open in new tab if fetch fails (e.g. CORS)
        window.open(url, "_blank");
    }
}

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
                <h2 className="text-lg md:text-xl font-bold text-primary tracking-wide mb-2">IQAC Reports</h2>
                <div className="mt-2 w-10 h-0.5 bg-primary mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reports.map(r => (
                        <button
                            key={r.id}
                            onClick={() => handleDownload(r.pdf_url, r.title + ".pdf")}
                            style={{ background: "#0d4a33" }}
                            className="flex flex-col items-center justify-center gap-2 text-white px-6 py-6 rounded-sm hover:brightness-110 transition-all text-center w-full cursor-pointer"
                        >
                            <Download className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium leading-snug">{r.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}