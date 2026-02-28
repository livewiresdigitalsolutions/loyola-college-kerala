"use client";

import React, { useEffect, useState } from "react";

interface HistoryRecord {
    id: number;
    cycle: number;
    period: string;
    naac_score: string;
    principal: string;
    director: string;
    naac_coordinator: string;
    core_team: string;
}

export default function NaacHistory() {
    const [records, setRecords] = useState<HistoryRecord[]>([]);

    useEffect(() => {
        fetch("/api/iqac/naac/history")
            .then((r) => r.json())
            .then((d) => { if (d.success) setRecords(d.data || []); })
            .catch(console.error);
    }, []);

    return (
        <section className="bg-white py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
                        NAAC Accreditation History
                    </h2>
                    <div className="mt-2 w-12 h-0.5 bg-primary" />
                </div>

                <div className="overflow-x-auto rounded-sm shadow-sm border border-gray-200">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr style={{ background: "#0d4a33" }}>
                                {["Cycle", "Period", "NAAC Score", "Principal", "Director/Rector", "NAAC Coordinator", "Core Team"].map((h) => (
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
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                                        No accreditation history records found.
                                    </td>
                                </tr>
                            ) : (
                                records.map((rec, idx) => (
                                    <tr
                                        key={rec.id}
                                        className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50/40 transition-colors`}
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900 text-center">{rec.cycle}</td>
                                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{rec.period}</td>
                                        <td className="px-4 py-3 text-gray-700">{rec.naac_score}</td>
                                        <td className="px-4 py-3 text-gray-700">{rec.principal}</td>
                                        <td className="px-4 py-3 text-gray-700">{rec.director}</td>
                                        <td className="px-4 py-3 text-gray-700">{rec.naac_coordinator}</td>
                                        <td className="px-4 py-3 text-gray-600 text-xs">
                                            {rec.core_team
                                                ? rec.core_team.split("\n").map((name, i) => (
                                                    <div key={i}>{name.trim()}</div>
                                                ))
                                                : "—"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
