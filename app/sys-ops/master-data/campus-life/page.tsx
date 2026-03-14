"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import {
    Plus, Edit2, Trash2, Save, X, ArrowLeft,
    ToggleLeft, ToggleRight, UploadCloud, ImageIcon,
} from "lucide-react";

interface CampusItem {
    id: number;
    title: string;
    description: string;
    image_url: string;
    is_active: boolean;
    sort_order: number;
}

const EMPTY_FORM = {
    title: "",
    description: "",
    image_url: "",
    sort_order: 0,
};

const INP = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none";
const LBL = "block text-xs font-semibold text-gray-600 mb-1";

export default function CampusLifeAdminPage() {
    const router = useRouter();
    const [items, setItems] = useState<CampusItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/campus-life?all=1");
            if (res.ok) setItems(await res.json());
            else toast.error("Failed to load");
        } catch { toast.error("Network error"); }
        finally { setLoading(false); }
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/campus-life/upload", { method: "POST", body: fd });
            if (!res.ok) { const e = await res.json(); toast.error(e.error || "Upload failed"); return; }
            const { url } = await res.json();
            setForm(prev => ({ ...prev, image_url: url }));
            toast.success("Image uploaded!");
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) uploadFile(f);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) uploadFile(f);
    };

    const handleAdd = async () => {
        if (!form.title.trim()) { toast.error("Title is required"); return; }
        if (!form.image_url) { toast.error("Please upload an image"); return; }
        setSaving(true);
        try {
            const res = await fetch("/api/campus-life", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Item added!");
                setIsAdding(false);
                setForm(EMPTY_FORM);
                fetchItems();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to create");
            }
        } catch { toast.error("Error creating item"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`Delete "${title}"?`)) return;
        const res = await fetch(`/api/campus-life/${id}`, { method: "DELETE" });
        if (res.ok) { toast.success("Deleted"); fetchItems(); }
        else toast.error("Failed to delete");
    };

    const handleToggle = async (item: CampusItem) => {
        const res = await fetch(`/api/campus-life/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...item, is_active: !item.is_active }),
        });
        if (res.ok) { toast.success(item.is_active ? "Hidden" : "Activated"); fetchItems(); }
        else toast.error("Failed to update");
    };

    const f = (k: keyof typeof form, v: any) => setForm(prev => ({ ...prev, [k]: v }));

    return (
        <>
            <Toaster position="top-right" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Campus Life</h1>
                            <p className="text-gray-600 mt-1">Manage campus facility images and descriptions</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setIsAdding(true); setForm(EMPTY_FORM); }}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90"
                    >
                        <Plus className="w-4 h-4" /> Add Item
                    </button>
                </div>

                {/* Add Form */}
                {isAdding && (
                    <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 space-y-5">
                        <h3 className="text-lg font-semibold text-gray-900">New Campus Facility</h3>

                        {/* Image Upload */}
                        <div>
                            <label className={LBL}>Image <span className="text-red-500">*</span></label>
                            <div
                                onClick={() => fileRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragOver ? "border-[var(--primary)] bg-green-50" : "border-gray-300 hover:border-[var(--primary)] hover:bg-gray-50"
                                    }`}
                            >
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                                        <p className="text-sm text-gray-500">Uploading...</p>
                                    </div>
                                ) : form.image_url ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="relative w-40 h-28 rounded-lg overflow-hidden border border-gray-200">
                                            <Image src={form.image_url} alt="Preview" fill className="object-cover" />
                                        </div>
                                        <p className="text-xs text-green-600 font-medium">✓ Uploaded — click to replace</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <UploadCloud className="w-9 h-9 text-gray-400" />
                                        <p className="text-sm font-medium text-gray-600">Click to choose an image or drag & drop</p>
                                        <p className="text-xs text-gray-400">JPG, PNG, WebP — up to 10 MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className={LBL}>Title <span className="text-red-500">*</span></label>
                                <input className={INP} placeholder="e.g. Library" value={form.title} onChange={e => f("title", e.target.value)} />
                            </div>
                            <div>
                                <label className={LBL}>Sort Order</label>
                                <input type="number" className={INP} value={form.sort_order} onChange={e => f("sort_order", parseInt(e.target.value))} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={LBL}>Description</label>
                                <textarea className={INP} rows={3} placeholder="Description shown next to the image..." value={form.description} onChange={e => f("description", e.target.value)} />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleAdd} disabled={saving || uploading} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60">
                                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                Save
                            </button>
                            <button onClick={() => { setIsAdding(false); setForm(EMPTY_FORM); }} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="py-16 text-center space-y-2">
                            <ImageIcon className="w-10 h-10 text-gray-300 mx-auto" />
                            <p className="text-gray-500">No campus items yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                                    {/* Thumbnail */}
                                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                        {item.image_url && (
                                            <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                                        {item.description && (
                                            <p className="text-xs text-gray-400 truncate">{item.description}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button title={item.is_active ? "Hide" : "Show"} onClick={() => handleToggle(item)} className="p-2 rounded-lg hover:bg-gray-100">
                                            {item.is_active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                                        </button>
                                        <button onClick={() => router.push(`/sys-ops/master-data/campus-life/${item.id}`)} className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm">
                                            <Edit2 className="w-4 h-4" /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(item.id, item.title)} className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm">
                                            <Trash2 className="w-4 h-4" /> Delete
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
