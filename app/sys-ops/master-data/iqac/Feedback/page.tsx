// app/sys-ops/master-data/iqac/Feedback/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Pencil, X, Check, FileText } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface FeedbackDoc { id: number; title: string; pdf_url: string; file_name?: string; display_order: number; is_active: boolean; }
type Tab = "forms" | "reports" | "atr";

const TAB_META: { key: Tab; label: string; desc: string }[] = [
    { key: "forms", label: "Feedback Forms", desc: "Download buttons shown at top of page (e.g. Teaching Staff Feedback Form)" },
    { key: "reports", label: "Feedback Reports", desc: "Rows in the Feedback Reports table" },
    { key: "atr", label: "Action Taken Reports", desc: "Rows in the Action Taken Reports table" },
];

function StatusBadge({ active, onToggle }: { active: boolean; onToggle: () => void }) {
    return (
        <button onClick={onToggle} className={`text-xs px-2 py-1 rounded-full ${active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {active ? "Active" : "Inactive"}
        </button>
    );
}

function FeedbackTab({ type, desc }: { type: Tab; desc: string }) {
    const [docs, setDocs] = useState<FeedbackDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<FeedbackDoc>>({});
    const [form, setForm] = useState({ title: "", display_order: "0", is_active: true });

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch(`/api/iqac/Feedback?type=${type}&includeInactive=true`);
            const d = await r.json();
            if (d.success) setDocs(d.data || []);
        } catch { toast.error("Failed to load"); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetch_(); }, [type]);

    const handleUpload = async () => {
        if (!file || !form.title) { toast.error("File and title required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("title", form.title);
            fd.append("display_order", form.display_order);
            fd.append("is_active", form.is_active.toString());
            const r = await fetch(`/api/iqac/Feedback/upload?type=${type}`, { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Uploaded"); setShowForm(false); setFile(null); setForm({ title: "", display_order: "0", is_active: true }); fetch_(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    const handleUpdate = async (id: number) => {
        try {
            const r = await fetch(`/api/iqac/Feedback?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...editForm }) });
            const d = await r.json();
            if (d.success) { toast.success("Updated"); setEditingId(null); fetch_(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed"); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this document?")) return;
        try {
            const r = await fetch(`/api/iqac/Feedback?type=${type}&id=${id}`, { method: "DELETE" });
            const d = await r.json();
            if (d.success) { toast.success("Deleted"); fetch_(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed"); }
    };

    const toggle = async (id: number, current: boolean) => {
        await fetch(`/api/iqac/Feedback?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_active: !current }) });
        fetch_();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">{docs.length} document(s)</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]">
                    <Plus className="w-4 h-4" /> Upload Document
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-5">
                    <h3 className="font-bold mb-4">Upload Document</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-[#342D87] transition-colors">
                                <input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id={`fb-upload-${type}`} />
                                <label htmlFor={`fb-upload-${type}`} className="cursor-pointer flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Select file</span>
                                    <span className="text-xs text-gray-400 mt-1">PDF or Image · Max 20MB</span>
                                </label>
                            </div>
                            {file && <p className="mt-2 text-xs text-green-700 bg-green-50 rounded px-3 py-2 truncate">{file.name}</p>}
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                                <input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                    placeholder={type === "forms" ? "e.g. Teaching Staff Feedback Form" : "e.g. Feedback on Teaching Learning 2022-23"}
                                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Display Order</label>
                                <input type="number" className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                    value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id={`fb_active_${type}`} checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                                <label htmlFor={`fb_active_${type}`} className="text-sm text-gray-700">Active</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleUpload} disabled={uploading || !file}
                            className="flex items-center gap-2 bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">
                            {uploading ? "Uploading..." : <><Upload className="w-4 h-4" />Upload</>}
                        </button>
                        <button onClick={() => { setShowForm(false); setFile(null); }} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-gray-200 overflow-hidden shadow">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-4 py-3 text-left w-8">S.No</th>
                            <th className="px-4 py-3 text-left">Title</th>
                            <th className="px-4 py-3 text-left">File</th>
                            <th className="px-4 py-3 text-left">Order</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : docs.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-400">No documents yet.</td></tr>
                        ) : docs.map((doc, idx) => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-400 text-center">{idx + 1}</td>
                                <td className="px-4 py-3 font-medium max-w-[220px] truncate">
                                    {editingId === doc.id
                                        ? <input className="w-full border rounded px-2 py-1 text-sm" value={editForm.title ?? doc.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                                        : doc.title}
                                </td>
                                <td className="px-4 py-3">
                                    {doc.pdf_url
                                        ? <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline flex items-center gap-1"><FileText className="w-3.5 h-3.5" />View</a>
                                        : <span className="text-gray-400 text-xs">—</span>}
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {editingId === doc.id
                                        ? <input type="number" className="w-16 border rounded px-2 py-1 text-sm" value={editForm.display_order ?? doc.display_order} onChange={e => setEditForm({ ...editForm, display_order: parseInt(e.target.value) })} />
                                        : doc.display_order}
                                </td>
                                <td className="px-4 py-3"><StatusBadge active={doc.is_active} onToggle={() => toggle(doc.id, doc.is_active)} /></td>
                                <td className="px-4 py-3">
                                    {editingId === doc.id
                                        ? <div className="flex gap-1">
                                            <button onClick={() => handleUpdate(doc.id)} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs"><Check className="w-3 h-3" />Save</button>
                                            <button onClick={() => setEditingId(null)} className="bg-gray-200 px-3 py-1 rounded text-xs"><X className="w-3 h-3" /></button>
                                        </div>
                                        : <div className="flex gap-2">
                                            <button onClick={() => { setEditingId(doc.id); setEditForm(doc); }} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
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

export default function FeedbackAdminPage() {
    const [tab, setTab] = useState<Tab>("forms");
    const current = TAB_META.find(t => t.key === tab)!;

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
                <p className="text-gray-600 mt-1">Manage feedback forms, reports, and action taken reports</p>
            </div>
            <div className="border-b border-gray-200">
                <nav className="flex gap-0">
                    {TAB_META.map(({ key, label }) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-[#342D87] text-[#342D87] bg-indigo-50/50" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                            {label}
                        </button>
                    ))}
                </nav>
            </div>
            <FeedbackTab key={tab} type={tab} desc={current.desc} />
        </div>
    );
}
