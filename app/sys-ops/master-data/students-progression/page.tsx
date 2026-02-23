// app/sys-ops/master-data/students-progression/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
    Trash2, Plus, Upload, Pencil, X, Check,
    Award, BookCheck, Briefcase, Lightbulb, ChevronDown
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";

// ─── Types ────────────────────────────────────────
type Tab = "rank-holders" | "qualifiers" | "placements" | "initiatives";

interface RankHolder {
    id: number;
    name: string;
    department: string;
    rank: "FIRST" | "SECOND" | "THIRD";
    batch_year: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
}

interface Qualifier {
    id: number;
    name: string;
    department: string;
    qualifier_type: "NET" | "JRF" | "COMPETITION";
    rank: "FIRST" | "SECOND" | "THIRD";
    year_range: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
}

interface Placement {
    id: number;
    title: string;
    year_range: string;
    department: string;
    display_order: number;
    is_active: boolean;
}

interface Initiative {
    id: number;
    title: string;
    description: string;
    display_order: number;
    is_active: boolean;
}

// ─── Shared helpers ───────────────────────────────
const BASE = "/api/students/students-progression";

function apiUrl(type: Tab, extra?: string) {
    return `${BASE}${extra ?? ""}?type=${type}`;
}

// ─── Main Page ────────────────────────────────────
export default function StudentProgressionAdmin() {
    const [activeTab, setActiveTab] = useState<Tab>("rank-holders");

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "rank-holders", label: "Rank Holders", icon: <Award className="w-4 h-4" /> },
        { id: "qualifiers", label: "Qualifiers", icon: <BookCheck className="w-4 h-4" /> },
        { id: "placements", label: "Placements", icon: <Briefcase className="w-4 h-4" /> },
        { id: "initiatives", label: "Initiatives", icon: <Lightbulb className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Progression</h1>
                <p className="text-gray-600 mt-1">Manage rank holders, qualifiers, placements and initiatives</p>
            </div>

            {/* Tab Bar */}
            <div className="flex gap-2 border-b border-gray-200">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${activeTab === t.id
                                ? "border-[#342D87] text-[#342D87]"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "rank-holders" && <RankHoldersTab />}
            {activeTab === "qualifiers" && <QualifiersTab />}
            {activeTab === "placements" && <PlacementsTab />}
            {activeTab === "initiatives" && <InitiativesTab />}
        </div>
    );
}

// ══════════════════════════════════════════════════
// TAB: RANK HOLDERS
// ══════════════════════════════════════════════════
function RankHoldersTab() {
    const [items, setItems] = useState<RankHolder[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<RankHolder>>({});
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [newForm, setNewForm] = useState({
        name: "", department: "", rank: "FIRST" as const,
        batch_year: "", display_order: 0, is_active: true,
    });

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch(apiUrl("rank-holders") + "&all=true");
            const d = await r.json();
            if (d.success) setItems(d.data || []);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetch_(); }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!f.type.startsWith("image/")) { toast.error("Select an image file"); return; }
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleAdd = async () => {
        if (!file || !newForm.name || !newForm.department) {
            toast.error("Image, name, and department are required"); return;
        }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            Object.entries(newForm).forEach(([k, v]) => fd.append(k, String(v)));
            const r = await fetch(apiUrl("rank-holders", "/upload"), { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) {
                toast.success("Rank holder added");
                setShowAdd(false); setFile(null); setPreview("");
                setNewForm({ name: "", department: "", rank: "FIRST", batch_year: "", display_order: 0, is_active: true });
                fetch_();
            } else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this record?")) return;
        const r = await fetch(`${BASE}?type=rank-holders&id=${id}`, { method: "DELETE" });
        const d = await r.json();
        if (d.success) { toast.success("Deleted"); fetch_(); }
        else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: RankHolder) => {
        const r = await fetch(`${BASE}?type=rank-holders`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id, is_active: !item.is_active }),
        });
        const d = await r.json();
        if (d.success) { toast.success("Updated"); fetch_(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=rank-holders`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, ...editForm }),
        });
        const d = await r.json();
        if (d.success) { toast.success("Updated"); setEditingId(null); fetch_(); }
        else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470] transition-colors">
                    <Plus className="w-4 h-4" /> Add Rank Holder
                </button>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Rank Holder</h2>
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo *</label>
                        <label htmlFor="rh-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-[#342D87] transition-colors">
                            {preview ? <img src={preview} alt="" className="h-32 object-contain mb-2 rounded" /> : <Upload className="w-10 h-10 text-gray-400 mb-2" />}
                            <span className="text-sm text-gray-500">{file ? file.name : "Click to upload"}</span>
                        </label>
                        <input id="rh-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.department} onChange={e => setNewForm({ ...newForm, department: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                            <select className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.rank} onChange={e => setNewForm({ ...newForm, rank: e.target.value as any })}>
                                <option value="FIRST">FIRST</option>
                                <option value="SECOND">SECOND</option>
                                <option value="THIRD">THIRD</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="e.g. 2023-24" value={newForm.batch_year} onChange={e => setNewForm({ ...newForm, batch_year: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                            <input type="checkbox" id="rh-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="rh-active" className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} disabled={uploading} className="bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#2a2470] disabled:opacity-50">
                            {uploading ? "Saving..." : "Save"}
                        </button>
                        <button onClick={() => { setShowAdd(false); setFile(null); setPreview(""); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                        <div className="relative aspect-[4/5] bg-gray-100">
                            <img src={item.image_url || "/assets/defaultprofile.png"} alt={item.name} className="w-full h-full object-cover" />
                            <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${item.rank === "FIRST" ? "bg-yellow-400 text-yellow-900" : item.rank === "SECOND" ? "bg-gray-300 text-gray-700" : "bg-orange-400 text-orange-900"}`}>
                                {item.rank}
                            </span>
                        </div>
                        <div className="p-3">
                            {editingId === item.id ? (
                                <div className="space-y-2">
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.name ?? ""} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.department ?? ""} onChange={e => setEditForm({ ...editForm, department: e.target.value })} placeholder="Department" />
                                    <select className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.rank ?? "FIRST"} onChange={e => setEditForm({ ...editForm, rank: e.target.value as any })}>
                                        <option value="FIRST">FIRST</option>
                                        <option value="SECOND">SECOND</option>
                                        <option value="THIRD">THIRD</option>
                                    </select>
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.batch_year ?? ""} onChange={e => setEditForm({ ...editForm, batch_year: e.target.value })} placeholder="Batch Year" />
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700"><Check className="w-3 h-3" /> Save</button>
                                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{item.department}</p>
                                    {item.batch_year && <p className="text-xs text-gray-400 mt-0.5">Batch: {item.batch_year}</p>}
                                    <div className="flex items-center justify-between mt-3">
                                        <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {item.is_active ? "Active" : "Inactive"}
                                        </button>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ name: item.name, department: item.department, rank: item.rank, batch_year: item.batch_year }); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="col-span-full text-center text-gray-400 py-16">No rank holders yet. Add one above.</p>}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════
// TAB: QUALIFIERS
// ══════════════════════════════════════════════════
function QualifiersTab() {
    const [items, setItems] = useState<Qualifier[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Qualifier>>({});
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [newForm, setNewForm] = useState({
        name: "", department: "", qualifier_type: "NET" as const,
        rank: "FIRST" as const, year_range: "", display_order: 0, is_active: true,
    });

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch(apiUrl("qualifiers") + "&all=true");
            const d = await r.json();
            if (d.success) setItems(d.data || []);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetch_(); }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f); setPreview(URL.createObjectURL(f));
    };

    const handleAdd = async () => {
        if (!file || !newForm.name || !newForm.department) {
            toast.error("Image, name, and department are required"); return;
        }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            Object.entries(newForm).forEach(([k, v]) => fd.append(k, String(v)));
            const r = await fetch(apiUrl("qualifiers", "/upload"), { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) {
                toast.success("Qualifier added");
                setShowAdd(false); setFile(null); setPreview("");
                setNewForm({ name: "", department: "", qualifier_type: "NET", rank: "FIRST", year_range: "", display_order: 0, is_active: true });
                fetch_();
            } else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete?")) return;
        const r = await fetch(`${BASE}?type=qualifiers&id=${id}`, { method: "DELETE" });
        const d = await r.json();
        if (d.success) { toast.success("Deleted"); fetch_(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: Qualifier) => {
        const r = await fetch(`${BASE}?type=qualifiers`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id, is_active: !item.is_active }),
        });
        const d = await r.json();
        if (d.success) { toast.success("Updated"); fetch_(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=qualifiers`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, ...editForm }),
        });
        const d = await r.json();
        if (d.success) { toast.success("Updated"); setEditingId(null); fetch_(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    const typeLabel = (t: string) => t === "NET" ? "UGC NET" : t === "JRF" ? "JRF" : "Competition";

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470] transition-colors">
                    <Plus className="w-4 h-4" /> Add Qualifier
                </button>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Qualifier</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo *</label>
                        <label htmlFor="q-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-[#342D87]">
                            {preview ? <img src={preview} alt="" className="h-32 object-contain mb-2 rounded" /> : <Upload className="w-10 h-10 text-gray-400 mb-2" />}
                            <span className="text-sm text-gray-500">{file ? file.name : "Click to upload"}</span>
                        </label>
                        <input id="q-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[["name", "Name *", "text"], ["department", "Department *", "text"], ["year_range", "Year Range", "text"]].map(([field, label, type]) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                <input type={type} className="w-full border border-gray-300 rounded p-2 text-sm" value={(newForm as any)[field]} onChange={e => setNewForm({ ...newForm, [field]: e.target.value })} placeholder={field === "year_range" ? "e.g. 2022-24" : ""} />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.qualifier_type} onChange={e => setNewForm({ ...newForm, qualifier_type: e.target.value as any })}>
                                <option value="NET">UGC NET</option>
                                <option value="JRF">JRF</option>
                                <option value="COMPETITION">Competition</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                            <select className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.rank} onChange={e => setNewForm({ ...newForm, rank: e.target.value as any })}>
                                <option value="FIRST">FIRST</option>
                                <option value="SECOND">SECOND</option>
                                <option value="THIRD">THIRD</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                            <input type="checkbox" id="q-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="q-active" className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} disabled={uploading} className="bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#2a2470] disabled:opacity-50">{uploading ? "Saving..." : "Save"}</button>
                        <button onClick={() => { setShowAdd(false); setFile(null); setPreview(""); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                        <div className="relative aspect-[4/5] bg-gray-100">
                            <img src={item.image_url || "/assets/defaultprofile.png"} alt={item.name} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{typeLabel(item.qualifier_type)}</span>
                        </div>
                        <div className="p-3">
                            {editingId === item.id ? (
                                <div className="space-y-2">
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.name ?? ""} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.department ?? ""} onChange={e => setEditForm({ ...editForm, department: e.target.value })} placeholder="Department" />
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.year_range ?? ""} onChange={e => setEditForm({ ...editForm, year_range: e.target.value })} placeholder="Year Range" />
                                    <select className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.qualifier_type ?? "NET"} onChange={e => setEditForm({ ...editForm, qualifier_type: e.target.value as any })}>
                                        <option value="NET">UGC NET</option><option value="JRF">JRF</option><option value="COMPETITION">Competition</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700"><Check className="w-3 h-3" /> Save</button>
                                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="font-semibold text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.department}</p>
                                    {item.year_range && <p className="text-xs text-gray-400">{item.year_range}</p>}
                                    <div className="flex items-center justify-between mt-3">
                                        <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ name: item.name, department: item.department, qualifier_type: item.qualifier_type, rank: item.rank, year_range: item.year_range }); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="col-span-full text-center text-gray-400 py-16">No qualifiers yet.</p>}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════
// TAB: PLACEMENTS
// ══════════════════════════════════════════════════
function PlacementsTab() {
    const [items, setItems] = useState<Placement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Placement>>({});
    const [newForm, setNewForm] = useState({ title: "", year_range: "", department: "", display_order: 0, is_active: true });

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch(apiUrl("placements") + "&all=true");
            const d = await r.json();
            if (d.success) setItems(d.data || []);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetch_(); }, []);

    const handleAdd = async () => {
        if (!newForm.title) { toast.error("Title is required"); return; }
        const r = await fetch(`${BASE}?type=placements`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...newForm, is_active: newForm.is_active ? 1 : 0 }),
        });
        const d = await r.json();
        if (d.success) {
            toast.success("Placement added");
            setShowAdd(false); setNewForm({ title: "", year_range: "", department: "", display_order: 0, is_active: true }); fetch_();
        } else toast.error(d.error || "Failed");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete?")) return;
        const r = await fetch(`${BASE}?type=placements&id=${id}`, { method: "DELETE" });
        const d = await r.json();
        if (d.success) { toast.success("Deleted"); fetch_(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: Placement) => {
        const r = await fetch(`${BASE}?type=placements`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id, is_active: !item.is_active }),
        });
        const d = await r.json();
        if (d.success) { toast.success("Updated"); fetch_(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=placements`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, ...editForm }),
        });
        const d = await r.json();
        if (d.success) { toast.success("Updated"); setEditingId(null); fetch_(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470]">
                    <Plus className="w-4 h-4" /> Add Placement
                </button>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Placement</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })} placeholder="e.g. MAHRM Placement Brochure 2021" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year Range</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.year_range} onChange={e => setNewForm({ ...newForm, year_range: e.target.value })} placeholder="e.g. 2019-21" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.department} onChange={e => setNewForm({ ...newForm, department: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                            <input type="checkbox" id="pl-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="pl-active" className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} className="bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#2a2470]">Save</button>
                        <button onClick={() => setShowAdd(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Year Range</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Department</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    {editingId === item.id
                                        ? <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.title ?? ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                                        : <span className="font-medium">{item.title}</span>
                                    }
                                </td>
                                <td className="px-4 py-3 text-amber-600 font-semibold">
                                    {editingId === item.id
                                        ? <input className="w-24 border border-gray-300 rounded p-1.5 text-sm" value={editForm.year_range ?? ""} onChange={e => setEditForm({ ...editForm, year_range: e.target.value })} />
                                        : item.year_range
                                    }
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {editingId === item.id
                                        ? <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.department ?? ""} onChange={e => setEditForm({ ...editForm, department: e.target.value })} />
                                        : item.department
                                    }
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                        {item.is_active ? "Active" : "Inactive"}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === item.id ? (
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveEdit} className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs font-medium"><Check className="w-3 h-3" /> Save</button>
                                            <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title, year_range: item.year_range, department: item.department }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">No placements yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════
// TAB: INITIATIVES
// ══════════════════════════════════════════════════
function InitiativesTab() {
    const [items, setItems] = useState<Initiative[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Initiative>>({});
    const [newForm, setNewForm] = useState({ title: "", description: "", display_order: 0, is_active: true });

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch(apiUrl("initiatives") + "&all=true");
            const d = await r.json();
            if (d.success) setItems(d.data || []);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetch_(); }, []);

    const handleAdd = async () => {
        if (!newForm.title) { toast.error("Title is required"); return; }
        const r = await fetch(`${BASE}?type=initiatives`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...newForm, is_active: newForm.is_active ? 1 : 0 }),
        });
        const d = await r.json();
        if (d.success) {
            toast.success("Initiative added");
            setShowAdd(false); setNewForm({ title: "", description: "", display_order: 0, is_active: true }); fetch_();
        } else toast.error(d.error || "Failed");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete?")) return;
        const r = await fetch(`${BASE}?type=initiatives&id=${id}`, { method: "DELETE" });
        const d = await r.json();
        if (d.success) { toast.success("Deleted"); fetch_(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: Initiative) => {
        const r = await fetch(`${BASE}?type=initiatives`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id, is_active: !item.is_active }),
        });
        const d = await r.json();
        if (d.success) { toast.success("Updated"); fetch_(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=initiatives`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, ...editForm }),
        });
        const d = await r.json();
        if (d.success) { toast.success("Updated"); setEditingId(null); fetch_(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470]">
                    <Plus className="w-4 h-4" /> Add Initiative
                </button>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Initiative</h2>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })} placeholder="e.g. Cancer Detection Camp" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea rows={3} className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })} placeholder="Brief description..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                                <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <input type="checkbox" id="ini-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                                <label htmlFor="ini-active" className="text-sm text-gray-700">Active</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} className="bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#2a2470]">Save</button>
                        <button onClick={() => setShowAdd(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Description</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium max-w-[200px]">
                                    {editingId === item.id
                                        ? <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.title ?? ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                                        : item.title
                                    }
                                </td>
                                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                                    {editingId === item.id
                                        ? <textarea rows={2} className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.description ?? ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                                        : item.description
                                    }
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                        {item.is_active ? "Active" : "Inactive"}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === item.id ? (
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveEdit} className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs font-medium"><Check className="w-3 h-3" /> Save</button>
                                            <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title, description: item.description }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-gray-400">No initiatives yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
