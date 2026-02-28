// app/sys-ops/master-data/iqac/Documents/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Pencil, X, Check, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface IqacDoc { id: number; title: string; category: string; pdf_url: string; file_name?: string; display_order: number; category_order: number; is_active: boolean; }

const PRESET_CATEGORIES = [
    "Institutional Documents",
    "Policy Documents",
    "Academic Documents",
    "Administrative Documents",
    "Student Related Documents",
    "Research Documents",
];

function StatusBadge({ active, onToggle }: { active: boolean; onToggle: () => void }) {
    return (
        <button onClick={onToggle} className={`text-xs px-2 py-1 rounded-full ${active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {active ? "Active" : "Inactive"}
        </button>
    );
}

export default function DocumentsAdminPage() {
    const [docs, setDocs] = useState<IqacDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<IqacDoc>>({});
    const [customCategory, setCustomCategory] = useState(false);
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    const [form, setForm] = useState({
        title: "", category: PRESET_CATEGORIES[0],
        display_order: "0", category_order: "0", is_active: true,
    });

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/iqac/Documents?includeInactive=true");
            const d = await r.json();
            if (d.success) {
                setDocs(d.data || []);
                // Open all categories by default
                const cats = Array.from(new Set((d.data || []).map((doc: IqacDoc) => doc.category)));
                const init: Record<string, boolean> = {};
                cats.forEach(c => { init[c as string] = true; });
                setOpenCategories(prev => ({ ...init, ...prev }));
            }
        } catch { toast.error("Failed to load"); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetch_(); }, []);

    const handleUpload = async () => {
        if (!file || !form.title || !form.category) { toast.error("File, title, and category required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("title", form.title);
            fd.append("category", form.category);
            fd.append("display_order", form.display_order);
            fd.append("category_order", form.category_order);
            fd.append("is_active", form.is_active.toString());
            const r = await fetch("/api/iqac/Documents/upload", { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Uploaded"); setShowForm(false); setFile(null); setForm({ title: "", category: PRESET_CATEGORIES[0], display_order: "0", category_order: "0", is_active: true }); setCustomCategory(false); fetch_(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    const handleUpdate = async (id: number) => {
        try {
            const r = await fetch("/api/iqac/Documents", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...editForm }) });
            const d = await r.json();
            if (d.success) { toast.success("Updated"); setEditingId(null); fetch_(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed"); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this document?")) return;
        try {
            const r = await fetch(`/api/iqac/Documents?id=${id}`, { method: "DELETE" });
            const d = await r.json();
            if (d.success) { toast.success("Deleted"); fetch_(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed"); }
    };

    const toggle = async (id: number, current: boolean) => {
        await fetch("/api/iqac/Documents", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_active: !current }) });
        fetch_();
    };

    // Group docs by category
    const categoryMap: Map<string, IqacDoc[]> = new Map();
    for (const doc of docs) {
        if (!categoryMap.has(doc.category)) categoryMap.set(doc.category, []);
        categoryMap.get(doc.category)!.push(doc);
    }
    const categories = Array.from(categoryMap.keys());

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">IQAC Documents</h1>
                    <p className="text-gray-600 mt-1">Manage official documents grouped by category</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]">
                    <Plus className="w-4 h-4" /> Upload Document
                </button>
            </div>

            {/* Upload Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-5">
                    <h3 className="font-bold mb-4 text-gray-800">Upload New Document</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* File drop zone */}
                        <div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-[#342D87] transition-colors">
                                <input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="doc-upload" />
                                <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Select file</span>
                                    <span className="text-xs text-gray-400 mt-1">PDF or Image · Max 20MB</span>
                                </label>
                            </div>
                            {file && <p className="mt-2 text-xs text-green-700 bg-green-50 rounded px-3 py-2 truncate">{file.name}</p>}
                        </div>
                        {/* Form fields */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Document Title *</label>
                                <input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                    placeholder="e.g. Academic Calendar 2024-25"
                                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-medium text-gray-700">Category *</label>
                                    <button type="button" onClick={() => { setCustomCategory(!customCategory); setForm({ ...form, category: customCategory ? PRESET_CATEGORIES[0] : "" }); }}
                                        className="text-xs text-indigo-600 hover:underline">{customCategory ? "Use preset" : "Custom category"}</button>
                                </div>
                                {customCategory
                                    ? <input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                        placeholder="Enter category name"
                                        value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                                    : <select className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                        value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        {PRESET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Display Order</label>
                                    <input type="number" className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                        value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Category Order</label>
                                    <input type="number" className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                        placeholder="0"
                                        value={form.category_order} onChange={e => setForm({ ...form, category_order: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="doc_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                                <label htmlFor="doc_active" className="text-sm text-gray-700">Active</label>
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

            {/* ── Grouped document tables ── */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : docs.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
                    No documents yet. Click "Upload Document" to add one.
                </div>
            ) : (
                <div className="space-y-6">
                    {categories.map(category => {
                        const catDocs = categoryMap.get(category) || [];
                        const isOpen = openCategories[category] !== false;
                        return (
                            <div key={category} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Category header */}
                                <button
                                    onClick={() => setOpenCategories(prev => ({ ...prev, [category]: !isOpen }))}
                                    className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-green-50/30 transition-colors border-b border-gray-100"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-800 text-sm">{category}</span>
                                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">{catDocs.length}</span>
                                    </div>
                                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>

                                {isOpen && (
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50/60 text-xs uppercase text-gray-500 border-b border-gray-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left w-10">S.No</th>
                                                <th className="px-4 py-2 text-left">Title</th>
                                                <th className="px-4 py-2 text-left">File</th>
                                                <th className="px-4 py-2 text-left">Order</th>
                                                <th className="px-4 py-2 text-left">Status</th>
                                                <th className="px-4 py-2 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {catDocs.map((doc, idx) => (
                                                <tr key={doc.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-400 text-center">{idx + 1}</td>
                                                    <td className="px-4 py-3 font-medium max-w-[240px] truncate">
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
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
