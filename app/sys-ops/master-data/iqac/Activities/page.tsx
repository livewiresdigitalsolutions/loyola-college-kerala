// app/sys-ops/master-data/iqac/Activities/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Plus, Upload, Pencil, X, Check, CheckCircle, FileText, BarChart3, Clock, BookOpen } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ActivityItem { id: number; text: string; display_order: number; is_active: boolean; }
interface Report { id: number; title: string; pdf_url: string; file_name: string; display_order: number; is_active: boolean; }
interface Timeline { id: number; year: string; view_url: string; display_order: number; is_active: boolean; }
interface Minute { id: number; year: string; pdf_url: string; file_name: string; display_order: number; is_active: boolean; }

type Tab = "activities" | "reports" | "timelines" | "minutes";
const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "activities", label: "Major Activities", icon: CheckCircle },
    { key: "reports", label: "IQAC Reports", icon: BarChart3 },
    { key: "timelines", label: "Timelines", icon: Clock },
    { key: "minutes", label: "Minutes & ATR", icon: BookOpen },
];

const API = (type: string, extras = "") => `/api/iqac/Activities?type=${type}${extras}`;

// ─── Shared helpers ────────────────────────────────────────────────────────────
function useData<T>(type: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch(API(type, "&includeInactive=true"));
            const d = await r.json();
            if (d.success) setData(d.data || []);
        } catch { toast.error("Failed to load"); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetch_(); }, []);
    return { data, loading, refresh: fetch_ };
}

async function toggleActive(type: string, id: number, current: boolean, refresh: () => void) {
    try {
        await fetch(API(type), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_active: !current }) });
        refresh();
    } catch { toast.error("Failed"); }
}

async function deleteRecord(type: string, id: number, refresh: () => void) {
    if (!confirm("Delete this record?")) return;
    try {
        const r = await fetch(`/api/iqac/Activities?type=${type}&id=${id}`, { method: "DELETE" });
        const d = await r.json();
        if (d.success) { toast.success("Deleted"); refresh(); }
        else toast.error(d.error || "Failed");
    } catch { toast.error("Failed"); }
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ active, onToggle }: { active: boolean; onToggle: () => void }) {
    return (
        <button onClick={onToggle} className={`text-xs px-2 py-1 rounded-full ${active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {active ? "Active" : "Inactive"}
        </button>
    );
}

// ─── Activities Tab ────────────────────────────────────────────────────────────
function ActivitiesTab() {
    const { data: items, loading, refresh } = useData<ActivityItem>("activities");
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [form, setForm] = useState({ text: "", display_order: "0", is_active: true });

    const handleAdd = async () => {
        if (!form.text) { toast.error("Activity text is required"); return; }
        setSaving(true);
        try {
            const r = await fetch(API("activities"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, display_order: parseInt(form.display_order) }) });
            const d = await r.json();
            if (d.success) { toast.success("Activity added"); setShowForm(false); setForm({ text: "", display_order: "0", is_active: true }); refresh(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed"); }
        finally { setSaving(false); }
    };

    const handleUpdate = async (id: number) => {
        try {
            const r = await fetch(API("activities"), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, text: editText }) });
            const d = await r.json();
            if (d.success) { toast.success("Updated"); setEditingId(null); refresh(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed"); }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{items.length} activities</p>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]">
                    <Plus className="w-4 h-4" /> Add Activity
                </button>
            </div>
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-5">
                    <h3 className="font-bold mb-4">Add Major Activity</h3>
                    <textarea rows={2} className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87] mb-3" placeholder="e.g. Reorienting workshops" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} />
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <input type="number" className="w-20 border rounded px-2 py-1 text-sm" value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} />
                            <label className="text-xs text-gray-600">Display Order</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="act_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                            <label htmlFor="act_active" className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} disabled={saving} className="bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? "Saving..." : "Add"}</button>
                        <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                        <tr><th className="px-4 py-3 text-left">Activity Text</th><th className="px-4 py-3 text-left">Order</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td></tr>
                            : items.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-gray-400">No activities yet.</td></tr>
                                : items.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 max-w-[400px]">
                                            {editingId === item.id
                                                ? <input className="w-full border rounded px-2 py-1 text-sm" value={editText} onChange={e => setEditText(e.target.value)} />
                                                : <span className="text-gray-800">{item.text}</span>}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{item.display_order}</td>
                                        <td className="px-4 py-3"><StatusBadge active={item.is_active} onToggle={() => toggleActive("activities", item.id, item.is_active, refresh)} /></td>
                                        <td className="px-4 py-3">
                                            {editingId === item.id
                                                ? <div className="flex gap-1">
                                                    <button onClick={() => handleUpdate(item.id)} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs"><Check className="w-3 h-3" /> Save</button>
                                                    <button onClick={() => setEditingId(null)} className="bg-gray-200 px-3 py-1 rounded text-xs"><X className="w-3 h-3" /></button>
                                                </div>
                                                : <div className="flex gap-2">
                                                    <button onClick={() => { setEditingId(item.id); setEditText(item.text); }} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => deleteRecord("activities", item.id, refresh)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                                </div>}
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Reports Tab ──────────────────────────────────────────────────────────────
function ReportsTab() {
    const { data: reports, loading, refresh } = useData<Report>("reports");
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [form, setForm] = useState({ title: "", display_order: "0", is_active: true });

    const handleUpload = async () => {
        if (!file || !form.title) { toast.error("File and title required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("title", form.title);
            fd.append("display_order", form.display_order);
            fd.append("is_active", form.is_active.toString());
            const r = await fetch("/api/iqac/Activities/upload?type=reports", { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Report uploaded"); setShowForm(false); setFile(null); setForm({ title: "", display_order: "0", is_active: true }); refresh(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{reports.length} report(s)</p>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]"><Plus className="w-4 h-4" /> Upload Report</button>
            </div>
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-5">
                    <h3 className="font-bold mb-4">Upload IQAC Report</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-[#342D87] transition-colors">
                                <input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="rpt-upload" />
                                <label htmlFor="rpt-upload" className="cursor-pointer flex flex-col items-center"><Upload className="w-8 h-8 text-gray-400 mb-2" /><span className="text-sm text-gray-600">Select file</span></label>
                            </div>
                            {file && <p className="mt-2 text-xs text-green-700 bg-green-50 rounded px-3 py-2">{file.name}</p>}
                        </div>
                        <div className="space-y-3">
                            <div><label className="block text-xs font-medium text-gray-700 mb-1">Title *</label><input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" placeholder="e.g. IQAC Report 2019-21" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                            <div><label className="block text-xs font-medium text-gray-700 mb-1">Display Order</label><input type="number" className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} /></div>
                            <div className="flex items-center gap-2"><input type="checkbox" id="rpt_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /><label htmlFor="rpt_active" className="text-sm text-gray-700">Active</label></div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleUpload} disabled={uploading || !file} className="flex items-center gap-2 bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{uploading ? "Uploading..." : <><Upload className="w-4 h-4" />Upload</>}</button>
                        <button onClick={() => { setShowForm(false); setFile(null); }} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600"><tr><th className="px-4 py-3 text-left">Title</th><th className="px-4 py-3 text-left">File</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td></tr>
                            : reports.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-gray-400">No reports yet.</td></tr>
                                : reports.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                                            {editingId === r.id ? <input className="w-full border rounded px-2 py-1 text-sm" value={editTitle} onChange={e => setEditTitle(e.target.value)} /> : r.title}
                                        </td>
                                        <td className="px-4 py-3">{r.pdf_url ? <a href={r.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline flex items-center gap-1"><FileText className="w-3.5 h-3.5" />View</a> : <span className="text-gray-400 text-xs">—</span>}</td>
                                        <td className="px-4 py-3"><StatusBadge active={r.is_active} onToggle={() => toggleActive("reports", r.id, r.is_active, refresh)} /></td>
                                        <td className="px-4 py-3">
                                            {editingId === r.id
                                                ? <div className="flex gap-1"><button onClick={async () => { const res = await fetch(API("reports"), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: r.id, title: editTitle }) }); const d = await res.json(); if (d.success) { toast.success("Updated"); setEditingId(null); refresh(); } }} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs"><Check className="w-3 h-3" /> Save</button><button onClick={() => setEditingId(null)} className="bg-gray-200 px-3 py-1 rounded text-xs"><X className="w-3 h-3" /></button></div>
                                                : <div className="flex gap-2"><button onClick={() => { setEditingId(r.id); setEditTitle(r.title); }} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button><button onClick={() => deleteRecord("reports", r.id, refresh)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div>}
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Timelines Tab ────────────────────────────────────────────────────────────
function TimelinesTab() {
    const { data: timelines, loading, refresh } = useData<Timeline>("timelines");
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Timeline>>({});
    const [form, setForm] = useState({ year: "", view_url: "", display_order: "0", is_active: true });

    const handleAdd = async () => {
        if (!form.year) { toast.error("Year is required"); return; }
        setSaving(true);
        try {
            const r = await fetch(API("timelines"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, display_order: parseInt(form.display_order) }) });
            const d = await r.json();
            if (d.success) { toast.success("Timeline added"); setShowForm(false); setForm({ year: "", view_url: "", display_order: "0", is_active: true }); refresh(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed"); }
        finally { setSaving(false); }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{timelines.length} timeline(s)</p>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]"><Plus className="w-4 h-4" /> Add Timeline</button>
            </div>
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-5">
                    <h3 className="font-bold mb-4">Add IQAC Timeline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">Year *</label><input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" placeholder="e.g. 2021-22" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">View URL</label><input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" placeholder="https://..." value={form.view_url} onChange={e => setForm({ ...form, view_url: e.target.value })} /></div>
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">Display Order</label><input type="number" className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} /></div>
                    </div>
                    <div className="flex items-center gap-4 mb-4"><input type="checkbox" id="tl_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /><label htmlFor="tl_active" className="text-sm text-gray-700">Active</label></div>
                    <div className="flex gap-3"><button onClick={handleAdd} disabled={saving} className="bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? "Saving..." : "Add"}</button><button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button></div>
                </div>
            )}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600"><tr><th className="px-4 py-3 text-left">Year</th><th className="px-4 py-3 text-left">View URL</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td></tr>
                            : timelines.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-gray-400">No timelines yet.</td></tr>
                                : timelines.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{editingId === t.id ? <input className="w-24 border rounded px-2 py-1 text-sm" value={editForm.year ?? t.year} onChange={e => setEditForm({ ...editForm, year: e.target.value })} /> : t.year}</td>
                                        <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{editingId === t.id ? <input className="w-full border rounded px-2 py-1 text-sm" value={editForm.view_url ?? t.view_url} onChange={e => setEditForm({ ...editForm, view_url: e.target.value })} /> : (t.view_url || "—")}</td>
                                        <td className="px-4 py-3"><StatusBadge active={t.is_active} onToggle={() => toggleActive("timelines", t.id, t.is_active, refresh)} /></td>
                                        <td className="px-4 py-3">
                                            {editingId === t.id
                                                ? <div className="flex gap-1"><button onClick={async () => { const r = await fetch(API("timelines"), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: t.id, ...editForm }) }); const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); refresh(); } }} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs"><Check className="w-3 h-3" /> Save</button><button onClick={() => setEditingId(null)} className="bg-gray-200 px-3 py-1 rounded text-xs"><X className="w-3 h-3" /></button></div>
                                                : <div className="flex gap-2"><button onClick={() => { setEditingId(t.id); setEditForm(t); }} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button><button onClick={() => deleteRecord("timelines", t.id, refresh)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div>}
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Minutes Tab ──────────────────────────────────────────────────────────────
function MinutesTab() {
    const { data: minutes, loading, refresh } = useData<Minute>("minutes");
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editYear, setEditYear] = useState("");
    const [form, setForm] = useState({ year: "", display_order: "0", is_active: true });

    const handleUpload = async () => {
        if (!file || !form.year) { toast.error("File and year are required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("year", form.year);
            fd.append("display_order", form.display_order);
            fd.append("is_active", form.is_active.toString());
            const r = await fetch("/api/iqac/Activities/upload?type=minutes", { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Minutes uploaded"); setShowForm(false); setFile(null); setForm({ year: "", display_order: "0", is_active: true }); refresh(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{minutes.length} record(s)</p>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]"><Plus className="w-4 h-4" /> Upload Minutes</button>
            </div>
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-5">
                    <h3 className="font-bold mb-4">Upload Minutes & ATR</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-[#342D87] transition-colors">
                                <input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="min-upload" />
                                <label htmlFor="min-upload" className="cursor-pointer flex flex-col items-center"><Upload className="w-8 h-8 text-gray-400 mb-2" /><span className="text-sm text-gray-600">Select file</span></label>
                            </div>
                            {file && <p className="mt-2 text-xs text-green-700 bg-green-50 rounded px-3 py-2">{file.name}</p>}
                        </div>
                        <div className="space-y-3">
                            <div><label className="block text-xs font-medium text-gray-700 mb-1">Year *</label><input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" placeholder="e.g. 2022-2023" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
                            <div><label className="block text-xs font-medium text-gray-700 mb-1">Display Order</label><input type="number" className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} /></div>
                            <div className="flex items-center gap-2"><input type="checkbox" id="min_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /><label htmlFor="min_active" className="text-sm text-gray-700">Active</label></div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleUpload} disabled={uploading || !file} className="flex items-center gap-2 bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{uploading ? "Uploading..." : <><Upload className="w-4 h-4" />Upload</>}</button>
                        <button onClick={() => { setShowForm(false); setFile(null); }} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600"><tr><th className="px-4 py-3 text-left">S.No</th><th className="px-4 py-3 text-left">Year</th><th className="px-4 py-3 text-left">File</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
                            : minutes.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">No minutes yet.</td></tr>
                                : minutes.map((m, idx) => (
                                    <tr key={m.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-500 text-center w-12">{idx + 1}</td>
                                        <td className="px-4 py-3 font-medium">{editingId === m.id ? <input className="w-32 border rounded px-2 py-1 text-sm" value={editYear} onChange={e => setEditYear(e.target.value)} /> : m.year}</td>
                                        <td className="px-4 py-3">{m.pdf_url ? <a href={m.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline flex items-center gap-1"><FileText className="w-3.5 h-3.5" />View</a> : <span className="text-gray-400 text-xs">—</span>}</td>
                                        <td className="px-4 py-3"><StatusBadge active={m.is_active} onToggle={() => toggleActive("minutes", m.id, m.is_active, refresh)} /></td>
                                        <td className="px-4 py-3">
                                            {editingId === m.id
                                                ? <div className="flex gap-1"><button onClick={async () => { const r = await fetch(API("minutes"), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: m.id, year: editYear }) }); const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); refresh(); } }} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs"><Check className="w-3 h-3" /> Save</button><button onClick={() => setEditingId(null)} className="bg-gray-200 px-3 py-1 rounded text-xs"><X className="w-3 h-3" /></button></div>
                                                : <div className="flex gap-2"><button onClick={() => { setEditingId(m.id); setEditYear(m.year); }} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button><button onClick={() => deleteRecord("minutes", m.id, refresh)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div>}
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────
export default function ActivitiesAdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>("activities");
    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">IQAC Activities Management</h1>
                <p className="text-gray-600 mt-1">Manage major activities, reports, timelines, and minutes</p>
            </div>
            <div className="border-b border-gray-200">
                <nav className="flex gap-0 overflow-x-auto">
                    {TABS.map(({ key, label, icon: Icon }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === key ? "border-[#342D87] text-[#342D87] bg-indigo-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                            <Icon className="w-4 h-4" />{label}
                        </button>
                    ))}
                </nav>
            </div>
            {activeTab === "activities" && <ActivitiesTab />}
            {activeTab === "reports" && <ReportsTab />}
            {activeTab === "timelines" && <TimelinesTab />}
            {activeTab === "minutes" && <MinutesTab />}
        </div>
    );
}
