// app/sys-ops/master-data/iqac/AQARs-Format/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Pencil, X, Check, FileText, FolderOpen } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface FormatDoc {
    id: number;
    title: string;
    category: string;
    category_order: number;
    pdf_url: string;
    file_name: string;
    display_order: number;
    is_active: boolean;
}

const PRESET_CATEGORIES = [
    "Institutional Documentation",
    "Feedback & Assessment Forms",
    "NAAC Forms & Manuals",
];

export default function AqarFormatsAdminPage() {
    const [docs, setDocs] = useState<FormatDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<FormatDoc>>({});
    const [customCategory, setCustomCategory] = useState(false);

    const emptyForm = {
        title: "",
        category: PRESET_CATEGORIES[0],
        category_order: "0",
        display_order: "0",
        is_active: true,
    };
    const [form, setForm] = useState(emptyForm);

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/iqac/AQARs-Formats?includeInactive=true");
            const d = await r.json();
            if (d.success) setDocs(d.data || []);
        } catch {
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch_(); }, []);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const valid = f.type === "application/pdf" || f.type.startsWith("image/");
        if (!valid) { toast.error("Please select a PDF or image file"); return; }
        setFile(f);
    };

    const handleUpload = async () => {
        if (!file || !form.title || !form.category) {
            toast.error("File, title, and category are required");
            return;
        }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("title", form.title);
            fd.append("category", form.category);
            fd.append("category_order", form.category_order);
            fd.append("display_order", form.display_order);
            fd.append("is_active", form.is_active.toString());

            const r = await fetch("/api/iqac/AQARs-Formats/upload", { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) {
                toast.success("Document uploaded");
                setShowForm(false);
                setFile(null);
                setForm(emptyForm);
                setCustomCategory(false);
                fetch_();
            } else {
                toast.error(d.error || "Upload failed");
            }
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            const r = await fetch("/api/iqac/AQARs-Formats", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...editForm }),
            });
            const d = await r.json();
            if (d.success) { toast.success("Updated"); setEditingId(null); fetch_(); }
            else toast.error(d.error || "Failed to update");
        } catch { toast.error("Failed to update"); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this document? This cannot be undone.")) return;
        try {
            const r = await fetch(`/api/iqac/AQARs-Formats?id=${id}`, { method: "DELETE" });
            const d = await r.json();
            if (d.success) { toast.success("Deleted"); fetch_(); }
            else toast.error(d.error || "Failed to delete");
        } catch { toast.error("Failed to delete"); }
    };

    const handleToggle = async (id: number, current: boolean) => {
        try {
            await fetch("/api/iqac/AQARs-Formats", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, is_active: !current }),
            });
            fetch_();
        } catch { toast.error("Failed to update status"); }
    };

    // Group docs by category for display
    const byCategory: Record<string, FormatDoc[]> = {};
    for (const doc of docs) {
        if (!byCategory[doc.category]) byCategory[doc.category] = [];
        byCategory[doc.category].push(doc);
    }
    const categories = Object.keys(byCategory).sort(
        (a, b) => (byCategory[a][0]?.category_order ?? 0) - (byCategory[b][0]?.category_order ?? 0)
    );

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <div>
                <h1 className="text-3xl font-bold text-gray-900">AQAR Formats Management</h1>
                <p className="text-gray-600 mt-1">Manage AQAR format documents grouped by category</p>
            </div>

            {/* Header row */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{docs.length} document(s) across {categories.length} category(ies)</p>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470] transition-colors"
                >
                    <Plus className="w-4 h-4" /> Upload Document
                </button>
            </div>

            {/* Upload Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#342D87]" />
                        Upload Format Document
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">PDF / File *</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#342D87] transition-colors">
                                <input type="file" accept="application/pdf,image/*" onChange={handleFile} className="hidden" id="fmt-file-upload" />
                                <label htmlFor="fmt-file-upload" className="cursor-pointer flex flex-col items-center">
                                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Click to select file</span>
                                    <span className="text-xs text-gray-400 mt-1">PDF or Image · Max 20MB</span>
                                </label>
                            </div>
                            {file && (
                                <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2 text-sm text-green-700">
                                    <FileText className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                    <button onClick={() => setFile(null)} className="ml-auto text-green-500 hover:text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87] focus:border-transparent"
                                    placeholder="e.g. Staff Meeting Minutes"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-medium text-gray-700">Category *</label>
                                    <button
                                        type="button"
                                        onClick={() => { setCustomCategory(!customCategory); setForm({ ...form, category: customCategory ? PRESET_CATEGORIES[0] : "" }); }}
                                        className="text-xs text-indigo-600 hover:text-indigo-800"
                                    >
                                        {customCategory ? "Use preset" : "Custom category"}
                                    </button>
                                </div>
                                {customCategory ? (
                                    <input
                                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                        placeholder="e.g. Research Documents"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    />
                                ) : (
                                    <select
                                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    >
                                        {PRESET_CATEGORIES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Category Order</label>
                                    <input
                                        type="number"
                                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                        placeholder="0"
                                        value={form.category_order}
                                        onChange={(e) => setForm({ ...form, category_order: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Display Order</label>
                                    <input
                                        type="number"
                                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]"
                                        placeholder="0"
                                        value={form.display_order}
                                        onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="fmt_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                                <label htmlFor="fmt_active" className="text-sm text-gray-700">Active</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleUpload}
                            disabled={uploading || !file}
                            className="flex items-center gap-2 bg-[#342D87] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-[#2a2470] transition-colors"
                        >
                            {uploading ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading...</>
                            ) : (
                                <><Upload className="w-4 h-4" />Upload Document</>
                            )}
                        </button>
                        <button
                            onClick={() => { setShowForm(false); setFile(null); setForm(emptyForm); setCustomCategory(false); }}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Documents — grouped by category */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : docs.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
                    No documents yet. Upload the first one.
                </div>
            ) : (
                <div className="space-y-8">
                    {categories.map((cat) => (
                        <div key={cat} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Category header */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <FolderOpen className="w-4 h-4 text-indigo-600" />
                                <span className="font-semibold text-gray-800 text-sm">{cat}</span>
                                <span className="ml-auto text-xs text-gray-400">{byCategory[cat].length} document(s)</span>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50/60 text-gray-500 uppercase text-xs border-b border-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Title</th>
                                            <th className="px-4 py-2 text-left">File</th>
                                            <th className="px-4 py-2 text-left">Order</th>
                                            <th className="px-4 py-2 text-left">Status</th>
                                            <th className="px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {byCategory[cat].map((doc) => (
                                            <tr key={doc.id} className="hover:bg-gray-50">
                                                {editingId === doc.id ? (
                                                    <>
                                                        <td className="px-4 py-2" colSpan={2}>
                                                            <input
                                                                className="w-full border rounded px-2 py-1 text-sm"
                                                                value={editForm.title ?? doc.title}
                                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input type="number" className="w-16 border rounded px-2 py-1 text-sm"
                                                                value={editForm.display_order ?? doc.display_order}
                                                                onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) })} />
                                                        </td>
                                                        <td className="px-4 py-2">—</td>
                                                        <td className="px-4 py-2">
                                                            <div className="flex gap-1">
                                                                <button onClick={() => handleUpdate(doc.id)} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                                                                    <Check className="w-3 h-3" /> Save
                                                                </button>
                                                                <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-300">
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-4 py-3 font-medium text-gray-900 max-w-[250px] truncate">{doc.title}</td>
                                                        <td className="px-4 py-3">
                                                            {doc.pdf_url ? (
                                                                <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline">
                                                                    <FileText className="w-3.5 h-3.5" />
                                                                    {doc.file_name ? doc.file_name.substring(0, 22) + "…" : "View"}
                                                                </a>
                                                            ) : (
                                                                <span className="text-gray-400 text-xs">No file</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-500">{doc.display_order}</td>
                                                        <td className="px-4 py-3">
                                                            <button
                                                                onClick={() => handleToggle(doc.id, doc.is_active)}
                                                                className={`text-xs px-2 py-1 rounded-full ${doc.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                                                            >
                                                                {doc.is_active ? "Active" : "Inactive"}
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex gap-2">
                                                                <button onClick={() => { setEditingId(doc.id); setEditForm(doc); }} className="text-blue-600 hover:text-blue-800">
                                                                    <Pencil className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-700">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
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
                    ))}
                </div>
            )}
        </div>
    );
}
