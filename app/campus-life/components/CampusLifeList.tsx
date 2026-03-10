"use client";

import { useEffect, useState } from "react";

interface CampusItem {
    id: number;
    title: string;
    description: string;
    category: string;
    image_url: string;
    sort_order: number;
}

const BG_COLORS = [
    "#f7f5f0",
    "#ffffff",
    "#eef2ee",
    "#f5f0e8",
    "#f0f0f5",
    "#edf5f2",
];

export default function CampusLifeList() {
    const [items, setItems] = useState<CampusItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch("/api/campus-life")
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(setItems)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ width: "100%" }}>
            {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ display: "flex", flexDirection: "row", backgroundColor: BG_COLORS[i % BG_COLORS.length], minHeight: 360 }}>
                    <div style={{ width: "50%", backgroundColor: "#e5e7eb" }} />
                    <div style={{ width: "50%", padding: "48px 64px", display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ width: 32, height: 3, backgroundColor: "#ddd", borderRadius: 2 }} />
                        <div style={{ width: "60%", height: 28, backgroundColor: "#e5e7eb", borderRadius: 4 }} />
                        <div style={{ width: "100%", height: 16, backgroundColor: "#f3f4f6", borderRadius: 4 }} />
                        <div style={{ width: "90%", height: 16, backgroundColor: "#f3f4f6", borderRadius: 4 }} />
                    </div>
                </div>
            ))}
        </div>
    );

    if (error) return (
        <div style={{ padding: "96px 0", textAlign: "center", color: "#9ca3af" }}>
            Could not load campus facilities. Please try again later.
        </div>
    );

    if (items.length === 0) return (
        <div style={{ padding: "96px 0", textAlign: "center", color: "#9ca3af" }}>
            No campus facilities have been added yet.
        </div>
    );

    return (
        <div style={{ width: "100%" }}>
            {items.map((item, idx) => {
                const imageLeft = idx % 2 === 0;
                const bg = BG_COLORS[idx % BG_COLORS.length];

                const imageCol = (
                    <div
                        key="img"
                        className="campus-img-col"
                        style={{ width: "50%", minHeight: 280, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px" }}>
                        <div style={{ width: "100%", height: 240, position: "relative", overflow: "hidden" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.image_url}
                                alt={item.title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                    transition: "transform 0.5s ease",
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                            />
                        </div>
                    </div>
                );

                const textCol = (
                    <div
                        key="txt"
                        style={{
                            width: "50%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "48px 64px",
                            minHeight: 280,
                            boxSizing: "border-box",
                        }}
                    >
                        {/* Decorative bar */}
                        <div style={{ width: 32, height: 3, backgroundColor: "var(--primary)", marginBottom: 20 }} />


                        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", marginBottom: 16, lineHeight: 1.3 }}>
                            {item.title}
                        </h2>

                        {item.description && item.description.split("\n\n").map((para, i) => (
                            <p key={i} style={{ color: "#6b7280", lineHeight: 1.75, fontSize: 15, marginBottom: 12 }}>
                                {para}
                            </p>
                        ))}
                    </div>
                );

                return (
                    <div
                        key={item.id}
                        style={{ display: "flex", flexDirection: "row", backgroundColor: bg, alignItems: "center" }}
                    >
                        {imageLeft ? [imageCol, textCol] : [textCol, imageCol]}
                    </div>
                );
            })}
        </div>
    );
}
