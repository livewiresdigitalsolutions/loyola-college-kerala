// app/sys-ops/master-data/iqac/Contact-us/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// ─── Validation helpers ───────────────────────────────────────────────────────
// Role Title: letters, spaces, dots, hyphens, apostrophes only
const toRoleText  = (v: string) => v.replace(/[^A-Za-z\s.\-']/g, "");
const isRoleText  = (v: string) => v === "" || /^[A-Za-z\s.\-']+$/.test(v);
// Name: letters, spaces, dots, hyphens, apostrophes, commas (no digits)
const toNameText  = (v: string) => v.replace(/[0-9]/g, "");
const isNameText  = (v: string) => !/[0-9]/.test(v);
// Phone: digits only, max 10
const toPhone     = (v: string) => v.replace(/\D/g, "").slice(0, 10);
// Email regex
const isEmail     = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

interface ContactInfo {
    id?: number;
    coordinator_name: string;
    coordinator_role: string;
    asst_coordinator_name: string;
    asst_coordinator_role: string;
    support_staff_name: string;
    support_staff_role: string;
    email: string;
    phone: string;
}

const DEFAULT: ContactInfo = {
    coordinator_name: "",
    coordinator_role: "IQAC Coordinator",
    asst_coordinator_name: "",
    asst_coordinator_role: "IQAC Assistant Coordinator",
    support_staff_name: "",
    support_staff_role: "IQAC Support Staff",
    email: "",
    phone: "",
};

export default function ContactUsAdminPage() {
    const [form, setForm] = useState<ContactInfo>(DEFAULT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasRecord, setHasRecord] = useState(false);

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/iqac/Contact-us");
            const d = await r.json();
            if (d.success && d.data) {
                setForm(d.data);
                setHasRecord(true);
            }
        } catch { toast.error("Failed to load contact info"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetch_(); }, []);

    const handleSave = async () => {
        // Validate role titles
        if (!isRoleText(form.coordinator_role))      { toast.error("Coordinator Role Title must contain only text"); return; }
        if (!isRoleText(form.asst_coordinator_role)) { toast.error("Asst. Coordinator Role Title must contain only text"); return; }
        if (!isRoleText(form.support_staff_role))    { toast.error("Support Staff Role Title must contain only text"); return; }
        // Validate names (no numbers)
        if (!isNameText(form.coordinator_name))      { toast.error("Coordinator Name must not contain numbers"); return; }
        if (!isNameText(form.asst_coordinator_name)) { toast.error("Asst. Coordinator Name must not contain numbers"); return; }
        if (!isNameText(form.support_staff_name))    { toast.error("Support Staff Name must not contain numbers"); return; }
        // Validate email
        if (form.email && !isEmail(form.email))      { toast.error("Please enter a valid email address"); return; }
        // Validate phone
        if (form.phone && form.phone.length !== 10)  { toast.error("Phone number must be exactly 10 digits"); return; }

        setSaving(true);
        try {
            const method = hasRecord ? "PUT" : "POST";
            const r = await fetch("/api/iqac/Contact-us", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const d = await r.json();
            if (d.success) {
                toast.success("Contact info saved successfully");
                setHasRecord(true);
                fetch_();
            } else {
                toast.error(d.error || "Failed to save");
            }
        } catch { toast.error("Failed to save"); }
        finally { setSaving(false); }
    };

    const INPUT_CLS = "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87] focus:border-transparent";

    const roleField = (label: string, key: keyof ContactInfo, placeholder?: string) => (
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
            <input className={INPUT_CLS} placeholder={placeholder} value={form[key] as string}
                onChange={e => setForm({ ...form, [key]: toRoleText(e.target.value) })} />
        </div>
    );

    const nameField = (label: string, key: keyof ContactInfo, placeholder?: string) => (
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
            <input className={INPUT_CLS} placeholder={placeholder} value={form[key] as string}
                onChange={e => setForm({ ...form, [key]: toNameText(e.target.value) })} />
        </div>
    );

    return (
        <div className="space-y-6 max-w-3xl">
            <Toaster position="top-right" />

            <div>
                <h1 className="text-3xl font-bold text-gray-900">IQAC Contact Us</h1>
                <p className="text-gray-600 mt-1">
                    Manage the contact information displayed on the IQAC Contact Us page.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 text-gray-400 py-10">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading...</span>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">

                    {/* ── Staff Members ── */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                            Staff Members
                        </h2>

                        {/* Coordinator */}
                        <div className="mb-6">
                            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-3">
                                Coordinator
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roleField("Role Title", "coordinator_role", "e.g. IQAC Coordinator")}
                                {nameField("Name", "coordinator_name", "e.g. Fr. Saji J, SJ")}
                            </div>
                        </div>

                        {/* Assistant Coordinator */}
                        <div className="mb-6">
                            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-3">
                                Assistant Coordinator
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roleField("Role Title", "asst_coordinator_role", "e.g. IQAC Assistant Coordinator")}
                                {nameField("Name", "asst_coordinator_name", "e.g. Dr. S.C. Andrew Michael")}
                            </div>
                        </div>

                        {/* Support Staff */}
                        <div>
                            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-3">
                                Support Staff
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roleField("Role Title", "support_staff_role", "e.g. IQAC Support Staff")}
                                {nameField("Name", "support_staff_name", "e.g. Mr. Arun Gopinath")}
                            </div>
                        </div>
                    </div>

                    {/* ── Contact Details ── */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                            Contact Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" className={INPUT_CLS} placeholder="e.g. iqaclcss@gmail.com"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="tel" inputMode="numeric" maxLength={10} className={INPUT_CLS} placeholder="e.g. 9876543210"
                                    value={form.phone} onChange={e => setForm({ ...form, phone: toPhone(e.target.value) })} />
                            </div>
                        </div>
                    </div>

                    {/* ── Preview ── */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                            Preview
                        </h2>
                        <div className="rounded-sm overflow-hidden" style={{ background: "#0d4a33" }}>
                            <div className="px-6 py-8 text-center">
                                <p className="text-white font-bold tracking-widest uppercase text-lg mb-6">Contact</p>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {[
                                        { role: form.coordinator_role, name: form.coordinator_name },
                                        { role: form.asst_coordinator_role, name: form.asst_coordinator_name },
                                        { role: form.support_staff_role, name: form.support_staff_name },
                                    ].map((s, i) => (
                                        <div key={i}>
                                            <p className="text-white/70 text-xs mb-1">{s.role || "—"}</p>
                                            <p className="text-white text-sm font-semibold">{s.name || "—"}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-white/20 pt-5 flex justify-center gap-12 text-sm text-white/80">
                                    <span>{form.email || "email@example.com"}</span>
                                    <span>{form.phone || "0000-000000"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save button */}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-[#342D87] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2470] disabled:opacity-50 transition-colors"
                        >
                            {saving ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
                            ) : (
                                <><Save className="w-4 h-4" />Save Changes</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
