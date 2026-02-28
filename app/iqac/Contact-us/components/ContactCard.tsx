"use client";
import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";

interface ContactInfo {
    id: number;
    coordinator_name: string;
    coordinator_role: string;
    asst_coordinator_name: string;
    asst_coordinator_role: string;
    support_staff_name: string;
    support_staff_role: string;
    email: string;
    phone: string;
}

export default function ContactCard() {
    const [info, setInfo] = useState<ContactInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/iqac/Contact-us")
            .then(r => r.json())
            .then(d => { if (d.success && d.data) setInfo(d.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!info) return (
        <section className="py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <p className="text-center text-gray-400 text-sm">Contact information not available yet.</p>
            </div>
        </section>
    );

    const staffMembers = [
        { role: info.coordinator_role || "IQAC Coordinator", name: info.coordinator_name },
        { role: info.asst_coordinator_role || "IQAC Assistant Coordinator", name: info.asst_coordinator_name },
        { role: info.support_staff_role || "IQAC Support Staff", name: info.support_staff_name },
    ].filter(s => s.name);

    return (
        <section className="py-10 md:py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                {/* Dark green contact card */}
                <div
                    className="rounded-sm overflow-hidden"
                    style={{ background: "#0d4a33" }}
                >
                    <div className="px-8 py-10 md:py-14 text-center">
                        {/* Heading */}
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest uppercase mb-10">
                            Contact
                        </h2>

                        {/* Staff members row */}
                        {staffMembers.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                {staffMembers.map((s, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-white/80 text-sm font-medium mb-1">{s.role}</p>
                                        <p className="text-white font-semibold text-base">{s.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Divider */}
                        {(info.email || info.phone) && (
                            <div className="border-t border-white/20 pt-8">
                                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                                    {info.email && (
                                        <div className="text-center">
                                            <p className="text-white/70 text-xs uppercase tracking-widest mb-2 font-medium">Email</p>
                                            <a
                                                href={`mailto:${info.email}`}
                                                className="flex items-center gap-2 text-white hover:text-[#F0B129] transition-colors"
                                            >
                                                <Mail className="w-4 h-4 flex-shrink-0" />
                                                <span className="text-sm">{info.email}</span>
                                            </a>
                                        </div>
                                    )}
                                    {info.phone && (
                                        <div className="text-center">
                                            <p className="text-white/70 text-xs uppercase tracking-widest mb-2 font-medium">Phone Number</p>
                                            <a
                                                href={`tel:${info.phone}`}
                                                className="flex items-center gap-2 text-white hover:text-[#F0B129] transition-colors"
                                            >
                                                <Phone className="w-4 h-4 flex-shrink-0" />
                                                <span className="text-sm">{info.phone}</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
