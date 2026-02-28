// app/sys-ops/master-data/iqac/SSR/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Pencil, X, Check, FileText } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface SsrDoc {
    id: number;
    title: string;
    cycle: number;
    academic_year: string;
    description: string;
    pdf_url: string;
    file_name: string;
    display_order: number;
    is_active: boolean;
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function SsrAdminPage() {
    const [docs, setDocs] = useState<SsrDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<SsrDoc>>({});

    const emptyForm = {
        title: "",
        cycle: "",
        academic_year: "",
        description: "",
        display_order: "0",
        is_active: true,
    };
    const [form, setForm] = useState(emptyForm);

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/iqac/ssr?includeInactive=true");
            const d = await r.json();
            if (d.success) setDocs(d.data || []);
        } catch {
            toast.error("Failed to load SSR documents");
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
        if (!file || !form.title || !form.cycle) {
            toast.error("File, title, and cycle are required");
            return;
        }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("title", form.title);
            fd.append("cycle", form.cycle);
            fd.append("academic_year", form.academic_year);
            fd.append("description", form.description);
            fd.append("display_order", form.display_order);
            fd.append("is_active", form.is_active.toString());

            const r = await fetch("/api/iqac/ssr/upload", { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) {
                toast.success("SSR document uploaded");
                setShowForm(false);
                setFile(null);
                setForm(emptyForm);
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
            const r = await fetch("/api/iqac/ssr", {
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
        if (!confirm("Delete this SSR document? This cannot be undone.")) return;
        try {
            const r = await fetch(`/api/iqac/ssr?id=${id}`, { method: "DELETE" });
            const d = await r.json();
            if (d.success) { toast.success("Deleted"); fetch_(); }
            else toast.error(d.error || "Failed to delete");
        } catch { toast.error("Failed to delete"); }
    };

    const handleToggle = async (id: number, current: boolean) => {
        try {
            await fetch("/api/iqac/ssr", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, is_active: !current }),
            });
            fetch_();
        } catch { toast.error("Failed to update status"); }
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <div>
                <h1 className="text-3xl font-bold text-gray-900">SSR Document Management</h1>
                <p className="text-gray-600 mt-1">
                    Manage Self Study Report (SSR) documents for IQAC
                </p>
            </div>

            {/* Header row */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{docs.length} document(s)</p>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470] transition-colors"
                >
                    <Plus className="w-4 h-4" /> Upload SSR Document
                </button>
            </div>

            {/* Upload Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#342D87]" />
                        Upload SSR Document
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                PDF / File *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#342D87] transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    onChange={handleFile}
                                    className="hidden"
                                    id="ssr-file-upload"
                                />
                                <label htmlFor="ssr-file-upload" className="cursor-pointer flex flex-col items-center">
                                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Click to select file</span>
                                    <span className="text-xs text-gray-400 mt-1">PDF or Image · Max 20MB</span>
                                </label>
                            </div>
                            {file && (
                                <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2 text-sm text-green-700">
                                    <FileText className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="ml-auto text-green-500 hover:text-red-500 flex-shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Fields */}
                        <div className="space-y-4">
                            {[
                                { label: "Title *", key: "title", placeholder: "e.g. SSR – Cycle 3" },
                                { label: "Cycle *", key: "cycle", placeholder: "e.g. 3", type: "number" },
                                { label: "Academic Year", key: "academic_year", placeholder: "e.g. 2021-22" },
                                { label: "Display Order", key: "display_order", type: "number" },
                            ].map(({ label, key, placeholder, type = "text" }) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                                    <input
                                        type={type}
                                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87] focus:border-transparent"
                                        placeholder={placeholder}
                                        value={(form as any)[key]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87] resize-none"
                                    placeholder="Brief description of this SSR..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="ssr_active"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                />
                                <label htmlFor="ssr_active" className="text-sm text-gray-700">Active</label>
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
                            onClick={() => { setShowForm(false); setFile(null); setForm(emptyForm); }}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Documents Table */}
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Cycle</th>
                            <th className="px-4 py-3 text-left">Academic Year</th>
                            <th className="px-4 py-3 text-left">Title</th>
                            <th className="px-4 py-3 text-left">Description</th>
                            <th className="px-4 py-3 text-left">File</th>
                            <th className="px-4 py-3 text-left">Order</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : docs.length === 0 ? (
                            <tr><td colSpan={8} className="text-center py-8 text-gray-400">No SSR documents yet. Upload the first one.</td></tr>
                        ) : docs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                                {editingId === doc.id ? (
                                    <>
                                        <td className="px-4 py-2">
                                            <input type="number" className="w-16 border rounded px-2 py-1 text-sm"
                                                value={editForm.cycle ?? doc.cycle}
                                                onChange={(e) => setEditForm({ ...editForm, cycle: parseInt(e.target.value) })} />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input className="w-24 border rounded px-2 py-1 text-sm"
                                                value={editForm.academic_year ?? doc.academic_year}
                                                onChange={(e) => setEditForm({ ...editForm, academic_year: e.target.value })} />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input className="w-48 border rounded px-2 py-1 text-sm"
                                                value={editForm.title ?? doc.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input className="w-52 border rounded px-2 py-1 text-sm"
                                                value={editForm.description ?? doc.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                                        </td>
                                        <td className="px-4 py-2 text-gray-400 text-xs">—</td>
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
                                        <td className="px-4 py-3 font-bold text-indigo-700">{doc.cycle}</td>
                                        <td className="px-4 py-3 text-gray-600">{doc.academic_year || "—"}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{doc.title}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{doc.description || "—"}</td>
                                        <td className="px-4 py-3">
                                            {doc.pdf_url ? (
                                                <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline">
                                                    <FileText className="w-3.5 h-3.5" />
                                                    {doc.file_name ? doc.file_name.substring(0, 20) + "…" : "View"}
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
                                                <button
                                                    onClick={() => { setEditingId(doc.id); setEditForm(doc); }}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
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
    );
}
