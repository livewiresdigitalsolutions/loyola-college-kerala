"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
    Plus, Edit2, Trash2, Save, X, ArrowLeft, ChevronRight,
    Briefcase, ToggleLeft, ToggleRight,
    UploadCloud, FileText, Trash,
} from "lucide-react";

interface Opening {
    id: number;
    category: string;
    title: string;
    description: string;
    deadline: string;
    deadline_open: boolean;
    variant: "positions" | "download";
    is_active: boolean;
    sort_order: number;
}

interface UploadedFile {
    label: string;
    href: string;
}

const EMPTY_FORM = {
    category: "",
    title: "",
    description: "",
    deadline: "",
    deadline_open: false,
    variant: "positions" as "positions" | "download",
    sort_order: 0,
    application_open_till: "",
    apply_link: "",
    extended_till: "",
    body_description: "",
    note: "",
};

const INP = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none";
const LBL = "block text-xs font-semibold text-gray-600 mb-1";

export default function CareersAdminPage() {
    const router = useRouter();
    const [items, setItems] = useState<Opening[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/careers?all=1");
            if (res.ok) setItems(await res.json());
            else toast.error("Failed to load openings");
        } catch { toast.error("Network error"); }
        finally { setLoading(false); }
    };

    /* ── File upload helper ──────────────────────────────────────────────────── */
    const uploadFile = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/careers/upload", { method: "POST", body: fd });
            if (!res.ok) { const err = await res.json(); toast.error(err.error || "Upload failed"); return; }
            const { url, originalName } = await res.json();
            setUploadedFiles(prev => [...prev, { label: originalName, href: url }]);
            toast.success(`"${originalName}" uploaded`);
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        Array.from(e.target.files || []).forEach(uploadFile);
        e.target.value = ""; // reset so same file can be re-selected
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        Array.from(e.dataTransfer.files).forEach(uploadFile);
    };

    const removeFile = (idx: number) =>
        setUploadedFiles(prev => prev.filter((_, i) => i !== idx));

    const updateFileLabel = (idx: number, label: string) =>
        setUploadedFiles(prev => prev.map((f, i) => i === idx ? { ...f, label } : f));

    /* ── Create opening + attach downloads ──────────────────────────────────── */
    const handleAdd = async () => {
        if (!form.title.trim() || !form.category.trim()) {
            toast.error("Title and Category are required");
            return;
        }
        if (form.variant === "download" && uploadedFiles.length === 0) {
            toast.error("Please upload at least one file for a Download-type opening");
            return;
        }
        setSaving(true);
        try {
            // 1. Create the opening
            const res = await fetch("/api/careers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form }),
            });
            if (!res.ok) {
                const err = await res.json();
                toast.error(err.error || "Failed to create opening");
                return;
            }
            const newOpening = await res.json();

            // 2. Attach uploaded files as downloads (parallel)
            if (form.variant === "download" && uploadedFiles.length > 0) {
                await Promise.all(
                    uploadedFiles.map((f, i) =>
                        fetch(`/api/careers/${newOpening.id}/downloads`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ label: f.label, href: f.href, sort_order: i }),
                        })
                    )
                );
            }

            toast.success("Opening created successfully!");
            setIsAdding(false);
            setForm(EMPTY_FORM);
            setUploadedFiles([]);
            fetchItems();
        } catch { toast.error("Error creating opening"); }
        finally { setSaving(false); }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setForm(EMPTY_FORM);
        setUploadedFiles([]);
    };

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`Delete "${title}"? This will also delete all its positions, requirements, and downloads.`)) return;
        try {
            const res = await fetch(`/api/careers/${id}`, { method: "DELETE" });
            if (res.ok) { toast.success("Deleted"); fetchItems(); }
            else toast.error("Failed to delete");
        } catch { toast.error("Error deleting"); }
    };

    const handleToggleActive = async (item: Opening) => {
        try {
            const res = await fetch(`/api/careers/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...item, is_active: !item.is_active }),
            });
            if (res.ok) { toast.success(`Opening ${item.is_active ? "hidden" : "activated"}`); fetchItems(); }
            else toast.error("Failed to update");
        } catch { toast.error("Error updating"); }
    };

    const f = (key: keyof typeof form, val: any) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <>
            <Toaster position="top-right" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Career Openings</h1>
                            <p className="text-gray-600 mt-1">Manage job postings shown on the Careers page</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setIsAdding(true); setForm(EMPTY_FORM); setUploadedFiles([]); }}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" /> Add Opening
                    </button>
                </div>

                {/* ── Add Form ── */}
                {isAdding && (
                    <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 space-y-5">
                        <h3 className="text-lg font-semibold text-gray-900">New Career Opening</h3>

                        {/* Core fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={LBL}>Category *</label>
                                <input className={INP} placeholder="e.g. ACADEMIC / CONTRACT" value={form.category} onChange={e => f("category", e.target.value)} />
                            </div>
                            <div>
                                <label className={LBL}>Variant *</label>
                                <select className={INP} value={form.variant} onChange={e => { f("variant", e.target.value); setUploadedFiles([]); }}>
                                    <option value="positions">Positions (table + requirements)</option>
                                    <option value="download">Download (description + files)</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className={LBL}>Title *</label>
                                <input className={INP} placeholder="e.g. FYUGP Assistant Professor" value={form.title} onChange={e => f("title", e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={LBL}>Short Description (shown on listing)</label>
                                <textarea className={INP} rows={2} placeholder="Brief description shown on the careers listing..." value={form.description} onChange={e => f("description", e.target.value)} />
                            </div>
                            <div>
                                <label className={LBL}>Deadline</label>
                                <input className={INP} placeholder='e.g. "March 10, 2026" or "Open Until Filled"' value={form.deadline} onChange={e => f("deadline", e.target.value)} />
                            </div>
                            <div className="flex items-center gap-3 pt-5">
                                <input type="checkbox" id="deadline_open" checked={form.deadline_open} onChange={e => f("deadline_open", e.target.checked)} className="w-4 h-4 accent-[var(--secondary)]" />
                                <label htmlFor="deadline_open" className="text-sm text-gray-700">Mark deadline as open (shows in amber)</label>
                            </div>
                            <div>
                                <label className={LBL}>Sort Order</label>
                                <input type="number" className={INP} value={form.sort_order} onChange={e => f("sort_order", parseInt(e.target.value))} />
                            </div>
                        </div>

                        {/* ── File upload section — only for "download" variant ── */}
                        {form.variant === "download" && (
                            <div className="space-y-3 border-t border-gray-100 pt-5">
                                <p className="text-sm font-semibold text-gray-800">Upload Files <span className="text-red-500">*</span></p>
                                <p className="text-xs text-gray-500">These will appear as download buttons on the careers page. You can upload multiple files.</p>

                                {/* Drop zone */}
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver
                                            ? "border-[var(--primary)] bg-green-50"
                                            : "border-gray-300 hover:border-[var(--primary)] hover:bg-gray-50"
                                        }`}
                                >
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        multiple
                                        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.txt"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                                            <p className="text-sm text-gray-500">Uploading...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <UploadCloud className="w-10 h-10 text-gray-400" />
                                            <p className="text-sm font-medium text-gray-600">Click to choose files or drag & drop</p>
                                            <p className="text-xs text-gray-400">PDF, PNG, JPG, DOC, DOCX, XLS, TXT — up to 10 MB each</p>
                                        </div>
                                    )}
                                </div>

                                {/* Uploaded files list */}
                                {uploadedFiles.length > 0 && (
                                    <div className="space-y-2">
                                        {uploadedFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <FileText className="w-5 h-5 text-green-600 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <input
                                                        className="w-full text-sm font-medium text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-[var(--primary)] pb-0.5"
                                                        value={file.label}
                                                        onChange={e => updateFileLabel(idx, e.target.value)}
                                                        placeholder="Button label..."
                                                    />
                                                    <p className="text-xs text-gray-400 truncate mt-0.5">{file.href}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(idx)}
                                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={handleAdd}
                                disabled={saving || uploading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                            >
                                {saving
                                    ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    : <Save className="w-4 h-4" />}
                                Save
                            </button>
                            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Openings list ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-16 space-y-2">
                            <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
                            <p className="text-gray-500">No career openings yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-semibold text-[var(--secondary)] uppercase tracking-wide">{item.category}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.variant === "positions" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                                                {item.variant}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                                        <p className="text-xs text-gray-400">Deadline: {item.deadline}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            title={item.is_active ? "Hide from public page" : "Show on public page"}
                                            onClick={() => handleToggleActive(item)}
                                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                                        >
                                            {item.is_active
                                                ? <ToggleRight className="w-5 h-5 text-green-600" />
                                                : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                                        </button>
                                        <button
                                            onClick={() => router.push(`/sys-ops/master-data/careers/${item.id}`)}
                                            className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                        >
                                            <Edit2 className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id, item.title)}
                                            className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                        <button
                                            onClick={() => router.push(`/sys-ops/master-data/careers/${item.id}`)}
                                            className="p-2 text-gray-400 hover:text-gray-600"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
