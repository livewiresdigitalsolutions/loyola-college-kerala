"use client";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface ActivityItem { id: number; text: string; display_order: number; }

export default function MajorActivities() {
    const [items, setItems] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/iqac/Activities?type=activities")
            .then(r => r.json())
            .then(d => { if (d.success) setItems(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>;
    if (items.length === 0) return null;

    return (
        <section className="py-10 md:py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    Major Activities of the IQAC in Loyola
                </h2>
                <div className="mt-2 w-10 h-0.5 bg-primary mb-6" />
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* Split items into two columns */}
                        {[items.slice(0, Math.ceil(items.length / 2)), items.slice(Math.ceil(items.length / 2))].map((col, ci) => (
                            <ul key={ci} className="divide-y divide-gray-100">
                                {col.map(item => (
                                    <li key={item.id} className="flex items-start gap-3 px-5 py-3 hover:bg-green-50/30 transition-colors">
                                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
