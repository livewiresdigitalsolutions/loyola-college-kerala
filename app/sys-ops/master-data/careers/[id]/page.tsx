"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
    ArrowLeft, Save, Plus, Trash2, Edit2, X, CheckCircle, UploadCloud, FileText, Link2,
} from "lucide-react";
import { useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
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
    application_open_till: string;
    apply_link: string;
    extended_till: string;
    body_description: string;
    note: string;
}
interface Position { id: number; discipline: string; count: number; sort_order: number; }
interface Requirement { id: number; text: string; sort_order: number; }
interface Download { id: number; label: string; href: string; sort_order: number; }

type Tab = "details" | "positions" | "requirements" | "downloads";

const INP = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none";
const LBL = "block text-xs font-semibold text-gray-600 mb-1";
const BTN_PRIMARY = "flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm";
const BTN_GRAY = "flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CareerOpeningDetailPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const [opening, setOpening] = useState<Opening | null>(null);
    const [form, setForm] = useState<Partial<Opening>>({});
    const [tab, setTab] = useState<Tab>("details");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Sub-lists
    const [positions, setPositions] = useState<Position[]>([]);
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [downloads, setDownloads] = useState<Download[]>([]);

    useEffect(() => { fetchOpening(); }, [id]);

    const fetchOpening = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/careers/${id}`);
            if (!res.ok) { toast.error("Opening not found"); router.back(); return; }
            const data = await res.json();
            setOpening(data);
            setForm(data);
            setPositions(data.positions || []);
            setRequirements(data.requirements || []);
            setDownloads(data.downloads || []);
        } catch { toast.error("Failed to load"); }
        finally { setLoading(false); }
    };

    const saveDetails = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/careers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) { toast.success("Details saved"); fetchOpening(); }
            else toast.error("Failed to save");
        } catch { toast.error("Error saving"); }
        finally { setSaving(false); }
    };

    const f = (key: keyof Opening, val: any) => setForm(prev => ({ ...prev, [key]: val }));

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]" />
        </div>
    );

    if (!opening) return null;

    const tabs: { key: Tab; label: string; show: boolean }[] = [
        { key: "details", label: "Details", show: true },
        { key: "positions", label: "Positions", show: opening.variant === "positions" },
        { key: "requirements", label: "Requirements", show: opening.variant === "positions" },
        { key: "downloads", label: "Downloads", show: opening.variant === "download" },
    ];

    return (
        <>
            <Toaster position="top-right" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <p className="text-xs text-[var(--secondary)] font-semibold uppercase tracking-wide">{opening.category}</p>
                            <h1 className="text-2xl font-bold text-gray-900">{opening.title}</h1>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${opening.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {opening.is_active ? "Active" : "Hidden"}
                    </span>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 flex gap-1">
                    {tabs.filter(t => t.show).map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t.key
                                ? "border-[var(--primary)] text-[var(--primary)]"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab: Details ── */}
                {tab === "details" && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={LBL}>Category</label>
                                <input className={INP} value={form.category || ""} onChange={e => f("category", e.target.value)} />
                            </div>
                            <div>
                                <label className={LBL}>Variant</label>
                                <select className={INP} value={form.variant || "positions"} onChange={e => f("variant", e.target.value)}>
                                    <option value="positions">Positions (table + requirements)</option>
                                    <option value="download">Download (description + PDFs)</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className={LBL}>Title</label>
                                <input className={INP} value={form.title || ""} onChange={e => f("title", e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={LBL}>Short Description (listing)</label>
                                <textarea className={INP} rows={2} value={form.description || ""} onChange={e => f("description", e.target.value)} />
                            </div>
                            <div>
                                <label className={LBL}>Deadline</label>
                                <input className={INP} value={form.deadline || ""} onChange={e => f("deadline", e.target.value)} />
                            </div>
                            <div className="flex items-center gap-3 pt-5">
                                <input type="checkbox" id="dl_open" checked={!!form.deadline_open} onChange={e => f("deadline_open", e.target.checked)} className="w-4 h-4 accent-[var(--secondary)]" />
                                <label htmlFor="dl_open" className="text-sm text-gray-700">Open deadline (shows in amber)</label>
                            </div>
                            <div className="flex items-center gap-3 pt-5">
                                <input type="checkbox" id="active" checked={!!form.is_active} onChange={e => f("is_active", e.target.checked)} className="w-4 h-4 accent-green-600" />
                                <label htmlFor="active" className="text-sm text-gray-700">Active (visible on public page)</label>
                            </div>
                            <div>
                                <label className={LBL}>Sort Order</label>
                                <input type="number" className={INP} value={form.sort_order ?? 0} onChange={e => f("sort_order", parseInt(e.target.value))} />
                            </div>

                            {/* Positions variant extra fields */}
                            {form.variant === "positions" && <>
                                <div>
                                    <label className={LBL}>Application Open Till</label>
                                    <input className={INP} placeholder="March 10, 2026" value={form.application_open_till || ""} onChange={e => f("application_open_till", e.target.value)} />
                                </div>
                                <div>
                                    <label className={LBL}>Apply Link</label>
                                    <input className={INP} placeholder="https://..." value={form.apply_link || ""} onChange={e => f("apply_link", e.target.value)} />
                                </div>
                            </>}

                            {/* Download variant extra fields */}
                            {form.variant === "download" && <>
                                <div>
                                    <label className={LBL}>Extended Till</label>
                                    <input className={INP} placeholder="March 17, 2026" value={form.extended_till || ""} onChange={e => f("extended_till", e.target.value)} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={LBL}>Body Description</label>
                                    <textarea className={INP} rows={3} value={form.body_description || ""} onChange={e => f("body_description", e.target.value)} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={LBL}>Note (optional)</label>
                                    <input className={INP} placeholder="Note: Please affix..." value={form.note || ""} onChange={e => f("note", e.target.value)} />
                                </div>
                            </>}
                        </div>
                        <button onClick={saveDetails} disabled={saving} className={BTN_PRIMARY}>
                            {saving ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Details
                        </button>
                    </div>
                )}

                {/* ── Tab: Positions ── */}
                {tab === "positions" && (
                    <SubListPanel
                        title="Open Positions"
                        subtitle="Disciplines and vacancy counts shown in the modal"
                        items={positions}
                        renderRow={(p, onEdit, onDelete) => (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{p.discipline}</p>
                                    <p className="text-xs text-gray-500">Vacancies: {p.count}</p>
                                </div>
                                <ActionButtons onEdit={onEdit} onDelete={onDelete} />
                            </div>
                        )}
                        renderForm={(val, setVal, onSave, onCancel, isEdit) => (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                    <label className={LBL}>Discipline</label>
                                    <input className={INP} placeholder="e.g. Psychology" value={val.discipline || ""} onChange={e => setVal({ ...val, discipline: e.target.value })} />
                                </div>
                                <div>
                                    <label className={LBL}>Count</label>
                                    <input type="number" className={INP} value={val.count ?? 1} onChange={e => setVal({ ...val, count: parseInt(e.target.value) })} />
                                </div>
                                <FormActions onSave={onSave} onCancel={onCancel} />
                            </div>
                        )}
                        onAdd={(val) => fetch(`/api/careers/${id}/positions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(val) })}
                        onUpdate={(item, val) => fetch(`/api/careers/${id}/positions/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, ...val }) })}
                        onDelete={(item) => fetch(`/api/careers/${id}/positions/${item.id}`, { method: "DELETE" })}
                        onRefresh={fetchOpening}
                    />
                )}

                {/* ── Tab: Requirements ── */}
                {tab === "requirements" && (
                    <SubListPanel
                        title="Requirements"
                        subtitle="Bullet points shown in the modal requirements card"
                        items={requirements}
                        renderRow={(r, onEdit, onDelete) => (
                            <div className="flex items-center justify-between">
                                <p className="text-gray-800 text-sm">{r.text}</p>
                                <ActionButtons onEdit={onEdit} onDelete={onDelete} />
                            </div>
                        )}
                        renderForm={(val, setVal, onSave, onCancel) => (
                            <div className="space-y-3">
                                <div>
                                    <label className={LBL}>Requirement Text</label>
                                    <input className={INP} placeholder="e.g. Strong Communication Skills" value={val.text || ""} onChange={e => setVal({ ...val, text: e.target.value })} />
                                </div>
                                <FormActions onSave={onSave} onCancel={onCancel} />
                            </div>
                        )}
                        onAdd={(val) => fetch(`/api/careers/${id}/requirements`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(val) })}
                        onUpdate={(item, val) => fetch(`/api/careers/${id}/requirements/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, ...val }) })}
                        onDelete={(item) => fetch(`/api/careers/${id}/requirements/${item.id}`, { method: "DELETE" })}
                        onRefresh={fetchOpening}
                    />
                )}

                {/* ── Tab: Downloads ── */}
                {tab === "downloads" && (
                    <SubListPanel
                        title="Download Links"
                        subtitle="Upload a file (PDF, PNG, DOC, etc.) — visitors can download it from the careers page"
                        items={downloads}
                        renderRow={(d, onEdit, onDelete) => (
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-900 text-sm">{d.label}</p>
                                    <a
                                        href={d.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-blue-500 hover:underline truncate block max-w-xs"
                                    >
                                        {d.href}
                                    </a>
                                </div>
                                <ActionButtons onEdit={onEdit} onDelete={onDelete} />
                            </div>
                        )}
                        renderForm={(val, setVal, onSave, onCancel) => (
                            <DownloadForm val={val} setVal={setVal} onSave={onSave} onCancel={onCancel} />
                        )}
                        onAdd={(val) => fetch(`/api/careers/${id}/downloads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(val) })}
                        onUpdate={(item, val) => fetch(`/api/careers/${id}/downloads/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, ...val }) })}
                        onDelete={(item) => fetch(`/api/careers/${id}/downloads/${item.id}`, { method: "DELETE" })}
                        onRefresh={fetchOpening}
                    />
                )}
            </div>
        </>
    );
}

// ─── Generic sub-list panel ───────────────────────────────────────────────────
function SubListPanel<T extends { id: number }>({
    title, subtitle, items,
    renderRow, renderForm,
    onAdd, onUpdate, onDelete, onRefresh,
}: {
    title: string; subtitle: string; items: T[];
    renderRow: (item: T, onEdit: () => void, onDelete: () => void) => React.ReactNode;
    renderForm: (val: any, setVal: (v: any) => void, onSave: () => void, onCancel: () => void, isEdit: boolean) => React.ReactNode;
    onAdd: (val: any) => Promise<Response>;
    onUpdate: (item: T, val: any) => Promise<Response>;
    onDelete: (item: T) => Promise<Response>;
    onRefresh: () => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formVal, setFormVal] = useState<any>({});

    const handleAdd = async () => {
        const res = await onAdd(formVal);
        if (res.ok) { toast.success("Added"); setIsAdding(false); setFormVal({}); onRefresh(); }
        else toast.error("Failed to add");
    };
    const handleUpdate = async (item: T) => {
        const res = await onUpdate(item, formVal);
        if (res.ok) { toast.success("Updated"); setEditingId(null); setFormVal({}); onRefresh(); }
        else toast.error("Failed to update");
    };
    const handleDelete = async (item: T) => {
        if (!confirm("Delete this item?")) return;
        const res = await onDelete(item);
        if (res.ok) { toast.success("Deleted"); onRefresh(); }
        else toast.error("Failed to delete");
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
                <button
                    onClick={() => { setIsAdding(true); setEditingId(null); setFormVal({}); }}
                    className="flex items-center gap-2 px-3 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 text-xs"
                >
                    <Plus className="w-3.5 h-3.5" /> Add
                </button>
            </div>

            {isAdding && (
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                    {renderForm(formVal, setFormVal, handleAdd, () => { setIsAdding(false); setFormVal({}); }, false)}
                </div>
            )}

            {items.length === 0 && !isAdding ? (
                <div className="py-10 text-center text-sm text-gray-400">No items yet. Click Add to get started.</div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {items.map(item => (
                        <div key={item.id} className="px-6 py-4">
                            {editingId === item.id ? (
                                renderForm(formVal, setFormVal, () => handleUpdate(item), () => { setEditingId(null); setFormVal({}); }, true)
                            ) : (
                                renderRow(item, () => { setEditingId(item.id); setFormVal({ ...item }); setIsAdding(false); }, () => handleDelete(item))
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    return (
        <div className="flex gap-2 shrink-0 ml-4">
            <button onClick={onEdit} className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs">
                <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
            <button onClick={onDelete} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs">
                <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
        </div>
    );
}

function FormActions({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
    return (
        <div className="flex gap-2">
            <button onClick={onSave} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs">
                <CheckCircle className="w-3.5 h-3.5" /> Save
            </button>
            <button onClick={onCancel} className="flex items-center gap-1 px-3 py-1.5 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-xs">
                <X className="w-3.5 h-3.5" /> Cancel
            </button>
        </div>
    );
}

// ─── Download form with file upload ──────────────────────────────────────────
function DownloadForm({
    val, setVal, onSave, onCancel,
}: {
    val: any;
    setVal: (v: any) => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const uploadFile = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/careers/upload', { method: 'POST', body: fd });
            if (!res.ok) {
                const err = await res.json();
                toast.error(err.error || 'Upload failed');
                return;
            }
            const { url, originalName } = await res.json();
            // Auto-fill label from filename if empty, always set href to uploaded URL
            setVal({
                ...val,
                href: url,
                label: val.label || originalName,
            });
            toast.success('File uploaded!');
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    };

    const INP2 = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none";
    const LBL2 = "block text-xs font-semibold text-gray-600 mb-1";

    return (
        <div className="space-y-4">
            {/* File upload zone */}
            <div>
                <label className={LBL2}>Upload File</label>
                <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragOver
                            ? 'border-[var(--primary)] bg-green-50'
                            : 'border-gray-300 hover:border-[var(--primary)] hover:bg-gray-50'
                        }`}
                >
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.txt"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-gray-500">Uploading...</p>
                        </div>
                    ) : val.href && !val.href.startsWith('#') ? (
                        <div className="flex flex-col items-center gap-2">
                            <FileText className="w-8 h-8 text-green-600" />
                            <p className="text-xs font-medium text-green-700">File uploaded ✓</p>
                            <p className="text-xs text-gray-400 truncate max-w-xs">{val.href}</p>
                            <p className="text-xs text-gray-400">Click or drop to replace</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <UploadCloud className="w-8 h-8 text-gray-400" />
                            <p className="text-sm font-medium text-gray-600">Click to choose a file or drag & drop</p>
                            <p className="text-xs text-gray-400">PDF, PNG, JPG, DOC, DOCX, XLS, TXT — up to 10 MB</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Label */}
            <div>
                <label className={LBL2}>Button Label (shown on the modal)</label>
                <input
                    className={INP2}
                    placeholder='e.g. "Download Notification (PDF)"'
                    value={val.label || ""}
                    onChange={e => setVal({ ...val, label: e.target.value })}
                />
            </div>

            {/* Manual URL fallback */}
            <details className="text-xs text-gray-400">
                <summary className="cursor-pointer flex items-center gap-1 select-none">
                    <Link2 className="w-3 h-3" /> Or enter a URL manually
                </summary>
                <input
                    className={`${INP2} mt-2`}
                    placeholder="https://... or /files/notification.pdf"
                    value={val.href || ""}
                    onChange={e => setVal({ ...val, href: e.target.value })}
                />
            </details>

            <FormActions onSave={onSave} onCancel={onCancel} />
        </div>
    );
}
