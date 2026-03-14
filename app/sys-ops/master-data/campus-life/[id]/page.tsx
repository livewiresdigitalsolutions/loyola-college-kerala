"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import { ArrowLeft, Save, UploadCloud } from "lucide-react";

const INP = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none";
const LBL = "block text-xs font-semibold text-gray-600 mb-1";

export default function CampusLifeEditPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [form, setForm] = useState({
        title: "", description: "", image_url: "", is_active: true, sort_order: 0,
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch(`/api/campus-life?all=1`)
            .then(r => r.json())
            .then((items: any[]) => {
                const item = items.find(i => String(i.id) === id);
                if (item) setForm(item);
                else { toast.error("Item not found"); router.back(); }
            })
            .catch(() => { toast.error("Failed to load"); router.back(); })
            .finally(() => setLoading(false));
    }, [id]);

    const uploadFile = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/campus-life/upload", { method: "POST", body: fd });
            if (!res.ok) { const e = await res.json(); toast.error(e.error || "Upload failed"); return; }
            const { url } = await res.json();
            setForm(prev => ({ ...prev, image_url: url }));
            toast.success("Image replaced!");
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    const handleSave = async () => {
        if (!form.title.trim()) { toast.error("Title is required"); return; }
        if (!form.image_url) { toast.error("Image is required"); return; }
        setSaving(true);
        try {
            const res = await fetch(`/api/campus-life/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) { toast.success("Saved!"); }
            else { const e = await res.json(); toast.error(e.error || "Failed to save"); }
        } catch { toast.error("Error saving"); }
        finally { setSaving(false); }
    };

    const f = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]" />
        </div>
    );

    return (
        <>
            <Toaster position="top-right" />
            <div className="space-y-6 max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Campus Item</h1>
                        <p className="text-sm text-gray-500">{form.title}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                    {/* Image Upload */}
                    <div>
                        <label className={LBL}>Image</label>
                        <div
                            onClick={() => fileRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f); }}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragOver ? "border-[var(--primary)] bg-green-50" : "border-gray-300 hover:border-[var(--primary)] hover:bg-gray-50"
                                }`}
                        >
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }} />
                            {uploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm text-gray-500">Uploading...</p>
                                </div>
                            ) : form.image_url ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
                                        <Image src={form.image_url} alt="Preview" fill className="object-cover" />
                                    </div>
                                    <p className="text-xs text-green-600 font-medium">Click or drop to replace image</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <UploadCloud className="w-9 h-9 text-gray-400" />
                                    <p className="text-sm font-medium text-gray-600">Click to upload an image</p>
                                    <p className="text-xs text-gray-400">JPG, PNG, WebP — up to 10 MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={LBL}>Title *</label>
                            <input className={INP} value={form.title} onChange={e => f("title", e.target.value)} />
                        </div>
                        <div>
                            <label className={LBL}>Sort Order</label>
                            <input type="number" className={INP} value={form.sort_order} onChange={e => f("sort_order", parseInt(e.target.value))} />
                        </div>
                        <div className="md:col-span-2">
                            <label className={LBL}>Description</label>
                            <textarea className={INP} rows={4} value={form.description} onChange={e => f("description", e.target.value)} />
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="active" checked={!!form.is_active} onChange={e => f("is_active", e.target.checked)} className="w-4 h-4 accent-green-600" />
                            <label htmlFor="active" className="text-sm text-gray-700">Active (visible on public page)</label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={handleSave} disabled={saving || uploading} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60">
                            {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                        <button onClick={() => router.back()} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
