// app/sys-ops/master-data/iqac/NAAC-Accreditation/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Pencil, X, Check, BookOpen, Award, Camera, Newspaper } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HistoryRecord {
    id: number; cycle: number; period: string; naac_score: string;
    principal: string; director: string; naac_coordinator: string;
    core_team: string; display_order: number; is_active: boolean;
}
interface Certificate { id: number; title: string; image_url: string; display_order: number; is_active: boolean; }
interface PeerVisit { id: number; title: string; visit_year: number; photo_count: number; cover_image_url: string; display_order: number; is_active: boolean; }
interface Clipping { id: number; title: string; image_url: string; display_order: number; is_active: boolean; }

type Tab = "history" | "certificates" | "peer-visits" | "clippings";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "history", label: "Accreditation History", icon: BookOpen },
    { key: "certificates", label: "Certificates", icon: Award },
    { key: "peer-visits", label: "Peer Team Visits", icon: Camera },
    { key: "clippings", label: "Newspaper Clippings", icon: Newspaper },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NaacAccreditationAdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>("history");

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">NAAC Accreditation Management</h1>
                <p className="text-gray-600 mt-1">Manage NAAC accreditation data, certificates, peer visits, and newspaper clippings</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-0 overflow-x-auto">
                    {TABS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === key
                                ? "border-[#342D87] text-[#342D87] bg-indigo-50/50"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "history" && <HistoryTab />}
            {activeTab === "certificates" && <ImageUploadTab
                apiBase="/api/iqac/naac/certificates"
                uploadApi="/api/iqac/naac/certificates/upload"
                label="NAAC Certificate"
                imageKey="image_url"
                aspectClass="aspect-[3/4]"
            />}
            {activeTab === "peer-visits" && <PeerVisitsTab />}
            {activeTab === "clippings" && <ImageUploadTab
                apiBase="/api/iqac/naac/clippings"
                uploadApi="/api/iqac/naac/clippings/upload"
                label="Newspaper Clipping"
                imageKey="image_url"
                aspectClass="aspect-[4/3]"
            />}
        </div>
    );
}

// ─── History Tab ──────────────────────────────────────────────────────────────
function HistoryTab() {
    const [records, setRecords] = useState<HistoryRecord[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const emptyForm = { cycle: "", period: "", naac_score: "", principal: "", director: "", naac_coordinator: "", core_team: "", display_order: "0", is_active: true };
    const [form, setForm] = useState(emptyForm);
    const [editForm, setEditForm] = useState<Partial<HistoryRecord>>({});

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/iqac/naac/history?includeInactive=true");
            const d = await r.json();
            if (d.success) setRecords(d.data || []);
        } catch { toast.error("Failed to load records"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetch_(); }, []);

    const handleAdd = async () => {
        if (!form.cycle || !form.period || !form.naac_score || !form.principal) {
            toast.error("Cycle, Period, NAAC Score, and Principal are required"); return;
        }
        setSaving(true);
        try {
            const r = await fetch("/api/iqac/naac/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, cycle: parseInt(form.cycle), display_order: parseInt(form.display_order) }),
            });
            const d = await r.json();
            if (d.success) { toast.success("Record added"); setShowForm(false); setForm(emptyForm); fetch_(); }
            else toast.error(d.error || "Failed to add");
        } catch { toast.error("Failed to add"); }
        finally { setSaving(false); }
    };

    const handleUpdate = async (id: number) => {
        try {
            const r = await fetch("/api/iqac/naac/history", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...editForm }) });
            const d = await r.json();
            if (d.success) { toast.success("Updated"); setEditingId(null); fetch_(); }
            else toast.error(d.error || "Failed to update");
        } catch { toast.error("Failed to update"); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this record?")) return;
        try {
            const r = await fetch(`/api/iqac/naac/history?id=${id}`, { method: "DELETE" });
            const d = await r.json();
            if (d.success) { toast.success("Deleted"); fetch_(); }
            else toast.error(d.error || "Failed to delete");
        } catch { toast.error("Failed to delete"); }
    };

    const handleToggle = async (id: number, current: boolean) => {
        try {
            await fetch("/api/iqac/naac/history", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_active: !current }) });
            fetch_();
        } catch { toast.error("Failed to update status"); }
    };

    const field = (label: string, key: keyof typeof form, placeholder?: string, type: string = "text") => (
        <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87] focus:border-transparent"
                placeholder={placeholder}
                value={form[key] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{records.length} record(s)</p>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]">
                    <Plus className="w-4 h-4" /> Add Record
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Add Accreditation Record</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {field("Cycle *", "cycle", "e.g. 1", "number")}
                        {field("Period *", "period", "e.g. 2005")}
                        {field("NAAC Score *", "naac_score", "e.g. Five Stars")}
                        {field("Principal *", "principal", "Dr. John Smith, SJ")}
                        {field("Director / Rector", "director", "Fr. Michael SJ")}
                        {field("NAAC Coordinator", "naac_coordinator", "Dr. Jane Doe")}
                        <div className="lg:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Core Team (one per line)</label>
                            <textarea
                                rows={3}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                placeholder="Dr. Name One&#10;Dr. Name Two&#10;Mr. Name Three"
                                value={form.core_team}
                                onChange={(e) => setForm({ ...form, core_team: e.target.value })}
                            />
                        </div>
                        {field("Display Order", "display_order", "0", "number")}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <input type="checkbox" id="is_active_h" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                        <label htmlFor="is_active_h" className="text-sm text-gray-700">Active</label>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <button onClick={handleAdd} disabled={saving} className="bg-[#342D87] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">
                            {saving ? "Saving..." : "Add Record"}
                        </button>
                        <button onClick={() => { setShowForm(false); setForm(emptyForm); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Cycle</th>
                            <th className="px-4 py-3 text-left">Period</th>
                            <th className="px-4 py-3 text-left">NAAC Score</th>
                            <th className="px-4 py-3 text-left">Principal</th>
                            <th className="px-4 py-3 text-left">Coordinator</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : records.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-8 text-gray-400">No records yet. Add your first accreditation cycle.</td></tr>
                        ) : records.map((rec) => (
                            <tr key={rec.id} className="hover:bg-gray-50">
                                {editingId === rec.id ? (
                                    <>
                                        <td className="px-4 py-2"><input type="number" className="w-16 border rounded px-2 py-1 text-sm" value={editForm.cycle ?? rec.cycle} onChange={(e) => setEditForm({ ...editForm, cycle: parseInt(e.target.value) })} /></td>
                                        <td className="px-4 py-2"><input className="w-24 border rounded px-2 py-1 text-sm" value={editForm.period ?? rec.period} onChange={(e) => setEditForm({ ...editForm, period: e.target.value })} /></td>
                                        <td className="px-4 py-2"><input className="w-40 border rounded px-2 py-1 text-sm" value={editForm.naac_score ?? rec.naac_score} onChange={(e) => setEditForm({ ...editForm, naac_score: e.target.value })} /></td>
                                        <td className="px-4 py-2"><input className="w-40 border rounded px-2 py-1 text-sm" value={editForm.principal ?? rec.principal} onChange={(e) => setEditForm({ ...editForm, principal: e.target.value })} /></td>
                                        <td className="px-4 py-2"><input className="w-40 border rounded px-2 py-1 text-sm" value={editForm.naac_coordinator ?? rec.naac_coordinator} onChange={(e) => setEditForm({ ...editForm, naac_coordinator: e.target.value })} /></td>
                                        <td className="px-4 py-2">—</td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-1">
                                                <button onClick={() => handleUpdate(rec.id)} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs"><Check className="w-3 h-3" /> Save</button>
                                                <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs"><X className="w-3 h-3" /></button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-4 py-3 font-medium">{rec.cycle}</td>
                                        <td className="px-4 py-3 text-gray-600">{rec.period}</td>
                                        <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{rec.naac_score}</td>
                                        <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{rec.principal}</td>
                                        <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{rec.naac_coordinator}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleToggle(rec.id, rec.is_active)} className={`text-xs px-2 py-1 rounded-full ${rec.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {rec.is_active ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingId(rec.id); setEditForm(rec); }} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(rec.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Generic Image Upload Tab ─────────────────────────────────────────────────
function ImageUploadTab({ apiBase, uploadApi, label, imageKey, aspectClass }: {
    apiBase: string; uploadApi: string; label: string; imageKey: string; aspectClass: string;
}) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [form, setForm] = useState({ title: "", display_order: "0", is_active: true });

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${apiBase}?includeInactive=true`);
            const d = await r.json();
            if (d.success) setItems(d.data || []);
        } catch { toast.error("Failed to load"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetch_(); }, [apiBase]);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!f.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleUpload = async () => {
        if (!file || !form.title) { toast.error("Image and title are required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("title", form.title);
            fd.append("display_order", form.display_order);
            fd.append("is_active", form.is_active.toString());
            const r = await fetch(uploadApi, { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) {
                toast.success(`${label} uploaded`);
                setShowForm(false); setFile(null); setPreview(""); setForm({ title: "", display_order: "0", is_active: true });
                fetch_();
            } else toast.error(d.error || "Upload failed");
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    const handleToggle = async (id: number, current: boolean) => {
        try {
            await fetch(apiBase, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_active: !current }) });
            fetch_();
        } catch { toast.error("Failed to update status"); }
    };

    const handleEditSave = async (id: number) => {
        try {
            const r = await fetch(apiBase, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, title: editTitle }) });
            const d = await r.json();
            if (d.success) { toast.success("Title updated"); setEditingId(null); fetch_(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed to update"); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(`Delete this ${label.toLowerCase()}?`)) return;
        try {
            const r = await fetch(`${apiBase}?id=${id}`, { method: "DELETE" });
            const d = await r.json();
            if (d.success) { toast.success("Deleted"); fetch_(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed to delete"); }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{items.length} item(s)</p>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]">
                    <Plus className="w-4 h-4" /> Upload {label}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Upload {label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Image *</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#342D87] transition-colors cursor-pointer">
                                <input type="file" accept="image/*" onChange={handleFile} className="hidden" id={`img-upload-${label}`} />
                                <label htmlFor={`img-upload-${label}`} className="cursor-pointer flex flex-col items-center">
                                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Click to upload</span>
                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · Max 5MB</span>
                                </label>
                            </div>
                            {preview && (
                                <div className={`relative mt-3 ${aspectClass} w-32 bg-gray-100 rounded overflow-hidden`}>
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        {/* Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                                <input className="w-full border rounded px-3 py-2 text-sm" placeholder={`e.g. Cycle 1 ${label}`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Display Order</label>
                                <input type="number" className="w-full border rounded px-3 py-2 text-sm" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id={`active_${label}`} checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                                <label htmlFor={`active_${label}`} className="text-sm text-gray-700">Active</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <button onClick={handleUpload} disabled={uploading || !file} className="flex items-center gap-2 bg-[#342D87] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">
                            {uploading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading...</> : <><Upload className="w-4 h-4" />Upload</>}
                        </button>
                        <button onClick={() => { setShowForm(false); setFile(null); setPreview(""); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading...</div>
            ) : items.length === 0 ? (
                <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                    No {label.toLowerCase()}s yet. Upload one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                            <div className={`relative ${aspectClass} bg-gray-100`}>
                                <img src={item[imageKey]} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-3">
                                {editingId === item.id ? (
                                    <div className="space-y-2">
                                        <input className="w-full border rounded px-2 py-1 text-xs" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEditSave(item.id)} className="flex items-center gap-0.5 bg-green-600 text-white px-2 py-1 rounded text-xs"><Check className="w-3 h-3" /></button>
                                            <button onClick={() => setEditingId(null)} className="bg-gray-200 px-2 py-1 rounded text-xs"><X className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs font-medium text-gray-800 truncate mb-2">{item.title}</p>
                                        <div className="flex items-center justify-between">
                                            <button onClick={() => handleToggle(item.id, item.is_active)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {item.is_active ? "Active" : "Off"}
                                            </button>
                                            <div className="flex gap-1">
                                                <button onClick={() => { setEditingId(item.id); setEditTitle(item.title); }} className="text-blue-600 hover:text-blue-800"><Pencil className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Peer Visits Tab ──────────────────────────────────────────────────────────
function PeerVisitsTab() {
    const [visits, setVisits] = useState<PeerVisit[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<PeerVisit>>({});
    const emptyForm = { title: "", visit_year: String(new Date().getFullYear()), photo_count: "0", display_order: "0", is_active: true };
    const [form, setForm] = useState(emptyForm);

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/iqac/naac/peer-visits?includeInactive=true");
            const d = await r.json();
            if (d.success) setVisits(d.data || []);
        } catch { toast.error("Failed to load"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetch_(); }, []);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!f.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
        setFile(f); setPreview(URL.createObjectURL(f));
    };

    const handleUpload = async () => {
        if (!file || !form.title) { toast.error("Cover image and title are required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("title", form.title);
            fd.append("visit_year", form.visit_year);
            fd.append("photo_count", form.photo_count);
            fd.append("display_order", form.display_order);
            fd.append("is_active", form.is_active.toString());
            const r = await fetch("/api/iqac/naac/peer-visits/upload", { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Peer visit added"); setShowForm(false); setFile(null); setPreview(""); setForm(emptyForm); fetch_(); }
            else toast.error(d.error || "Upload failed");
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    const handleUpdate = async (id: number) => {
        try {
            const r = await fetch("/api/iqac/naac/peer-visits", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...editForm }) });
            const d = await r.json();
            if (d.success) { toast.success("Updated"); setEditingId(null); fetch_(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed to update"); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this peer visit entry?")) return;
        try {
            const r = await fetch(`/api/iqac/naac/peer-visits?id=${id}`, { method: "DELETE" });
            const d = await r.json();
            if (d.success) { toast.success("Deleted"); fetch_(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed to delete"); }
    };

    const handleToggle = async (id: number, current: boolean) => {
        try {
            await fetch("/api/iqac/naac/peer-visits", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_active: !current }) });
            fetch_();
        } catch { toast.error("Failed to update status"); }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{visits.length} visit(s)</p>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]">
                    <Plus className="w-4 h-4" /> Add Peer Visit
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Add Peer Team Visit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cover Image Upload */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Cover Photo *</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#342D87] transition-colors">
                                <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="pv-img-upload" />
                                <label htmlFor="pv-img-upload" className="cursor-pointer flex flex-col items-center">
                                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Click to upload cover photo</span>
                                </label>
                            </div>
                            {preview && (
                                <div className="relative mt-3 aspect-video w-full max-w-xs bg-gray-100 rounded overflow-hidden">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        {/* Fields */}
                        <div className="space-y-4">
                            {[
                                { label: "Title *", key: "title", placeholder: "NAAC Peer Team Visit 2022" },
                                { label: "Visit Year *", key: "visit_year", placeholder: "2022", type: "number" },
                                { label: "Number of Photos", key: "photo_count", placeholder: "1", type: "number" },
                                { label: "Display Order", key: "display_order", type: "number" },
                            ].map(({ label, key, placeholder, type = "text" }) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                                    <input type={type} className="w-full border rounded px-3 py-2 text-sm" placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                                </div>
                            ))}
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="pv_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                                <label htmlFor="pv_active" className="text-sm text-gray-700">Active</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <button onClick={handleUpload} disabled={uploading || !file} className="flex items-center gap-2 bg-[#342D87] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">
                            {uploading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading...</> : <><Upload className="w-4 h-4" />Add Visit</>}
                        </button>
                        <button onClick={() => { setShowForm(false); setFile(null); setPreview(""); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> :
                visits.length === 0 ? <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">No peer visits yet.</div> :
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {visits.map((v) => (
                            <div key={v.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                                <div className="relative aspect-video bg-gray-100">
                                    <img src={v.cover_image_url} alt={v.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30" />
                                    <div className="absolute bottom-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                                        {v.visit_year} · {v.photo_count} photos
                                    </div>
                                </div>
                                <div className="p-3">
                                    {editingId === v.id ? (
                                        <div className="space-y-2">
                                            <input className="w-full border rounded px-2 py-1 text-xs" value={editForm.title ?? v.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                                            <div className="flex gap-2">
                                                <input type="number" className="w-20 border rounded px-2 py-1 text-xs" placeholder="Year" value={editForm.visit_year ?? v.visit_year} onChange={(e) => setEditForm({ ...editForm, visit_year: parseInt(e.target.value) })} />
                                                <input type="number" className="w-20 border rounded px-2 py-1 text-xs" placeholder="Photos" value={editForm.photo_count ?? v.photo_count} onChange={(e) => setEditForm({ ...editForm, photo_count: parseInt(e.target.value) })} />
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleUpdate(v.id)} className="flex items-center gap-0.5 bg-green-600 text-white px-2 py-1 rounded text-xs"><Check className="w-3 h-3" /> Save</button>
                                                <button onClick={() => setEditingId(null)} className="bg-gray-200 px-2 py-1 rounded text-xs"><X className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium text-gray-800 truncate mb-2">{v.title}</p>
                                            <div className="flex items-center justify-between">
                                                <button onClick={() => handleToggle(v.id, v.is_active)} className={`text-xs px-2 py-0.5 rounded-full ${v.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                    {v.is_active ? "Active" : "Off"}
                                                </button>
                                                <div className="flex gap-1">
                                                    <button onClick={() => { setEditingId(v.id); setEditForm(v); }} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
            }
        </div>
    );
}
