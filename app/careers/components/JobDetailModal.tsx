"use client";

import { X, Download } from "lucide-react";
import { useEffect } from "react";

// ─── Modal Variants ────────────────────────────────────────────────────────────

export interface PositionsVariant {
    variant: "positions";
    applicationOpenTill: string;
    positions: { id?: number; discipline: string; count: number }[];
    requirements: { id?: number; text: string }[] | string[];
    applyLink: string;
}

export interface DownloadVariant {
    variant: "download";
    extendedTill: string;
    description: string;
    note?: string;
    downloads: { label: string; href: string }[];
}

export type JobDetail = PositionsVariant | DownloadVariant;

export interface JobOpening {
    id: number;
    category: string;
    title: string;
    description: string;
    deadline: string;
    deadlineOpen: boolean;
    href: string;
    detail: JobDetail;
}

interface Props {
    job: JobOpening;
    onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: Props) {
    // Escape key to close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10"
                >
                    <X size={16} />
                </button>

                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold tracking-wide uppercase mb-3">
                        {job.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
                        {job.title}
                    </h2>
                </div>

                {/* Body — switches on variant */}
                <div className="px-8 py-6">
                    {job.detail.variant === "positions" ? (
                        <PositionsBody detail={job.detail} />
                    ) : (
                        <DownloadBody detail={job.detail} />
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Variant: positions table + requirements + apply ──────────────────────── */
function PositionsBody({ detail }: { detail: PositionsVariant }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div>
                <p className="text-sm text-[var(--primary)] mb-5">
                    Application Open Till:{" "}
                    <span className="font-medium">{detail.applicationOpenTill}</span>
                </p>
                <h3 className="text-base font-bold text-gray-900 mb-4">Open Positions</h3>
                <div className="divide-y divide-gray-100">
                    {detail.positions.map((pos) => (
                        <div key={pos.discipline} className="flex justify-between py-3">
                            <span className="text-sm text-gray-700">{pos.discipline}</span>
                            <span className="text-sm font-semibold text-gray-900">{pos.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right */}
            <div className="bg-[#f5f3ee] rounded-xl p-6 flex flex-col gap-6">
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4">Requirements</h3>
                    <ul className="space-y-3">
                        {detail.requirements.map((req, i) => {
                            const text = typeof req === 'string' ? req : (req as any).text;
                            return (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                                    {text}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <a
                    href={detail.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 rounded-lg bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity mt-auto"
                >
                    Apply Now Online
                </a>
            </div>
        </div>
    );
}

/* ── Variant: description text + PDF download buttons ─────────────────────── */
function DownloadBody({ detail }: { detail: DownloadVariant }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-4">
                <p className="text-sm text-[var(--primary)] font-medium">
                    Extended Till: {detail.extendedTill}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{detail.description}</p>
                {detail.note && (
                    <p className="text-xs text-[var(--primary)]/70 leading-relaxed">{detail.note}</p>
                )}
            </div>

            {/* Right */}
            <div className="bg-[#f5f3ee] rounded-xl p-6 flex flex-col gap-4">
                <h3 className="text-base font-bold text-gray-900">Download Details</h3>
                <div className="flex flex-col gap-3">
                    {detail.downloads.map((dl) => (
                        <a
                            key={dl.label}
                            href={dl.href}
                            download
                            className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors group"
                        >
                            {dl.label}
                            <Download size={16} className="text-[var(--primary)] shrink-0" />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
