// app/sys-ops/master-data/loyola-mentoring-programme/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Pencil, X, Check, Users, BookOpen } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const LG = "#13432C";
const LG_DARK = "#0f3324";

function GreenBtn({ onClick, disabled, children, className = "" }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode; className?: string }) {
    return (
        <button onClick={onClick} disabled={disabled}
            className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${className}`}
            style={{ backgroundColor: LG }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = LG_DARK)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = LG)}>
            {children}
        </button>
    );
}

type Tab = "organizing-team" | "sessions";

interface TeamMember {
    id: number; name: string; role: string; image_url: string;
    display_order: number; is_active: boolean;
}
interface Session {
    id: number; date: string; batch: string; description: string; report_link: string;
    display_order: number; is_active: boolean;
}

const BASE = "/api/students/loyola-mentoring-programme";

export default function LmpAdmin() {
    const [activeTab, setActiveTab] = useState<Tab>("organizing-team");
    const tabs = [
        { id: "organizing-team" as Tab, label: "Organizing Team", icon: <Users className="w-4 h-4" /> },
        { id: "sessions" as Tab, label: "Mentoring Sessions", icon: <BookOpen className="w-4 h-4" /> },
    ];
    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">LMP Management</h1>
                <p className="text-gray-600 mt-1">Loyola Mentoring Programme — manage content</p>
            </div>
            <div className="flex gap-1 border-b border-gray-200">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px"
                        style={activeTab === t.id ? { borderBottomColor: LG, color: LG } : { borderBottomColor: "transparent", color: "#6b7280" }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>
            {activeTab === "organizing-team" && <OrganizingTeamTab />}
            {activeTab === "sessions" && <SessionsTab />}
        </div>
    );
}

// ── Upload Box ────────────────────────────────────────────────────────────────
function UploadBox({ id, preview, file, onChange }: { id: string; preview: string; file: File | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div>
            <label htmlFor={id} className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                {preview
                    ? <img src={preview} alt="" className="w-28 h-28 rounded-full object-cover mb-2 shadow" />
                    : <><Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">Click to upload photo</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5 MB)</span></>
                }
                {preview && <span className="text-xs text-gray-400 mt-1">{file?.name}</span>}
            </label>
            <input id={id} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onChange} />
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// ORGANIZING TEAM TAB
// ══════════════════════════════════════════════════════════════════════════════
function OrganizingTeamTab() {
    const [items, setItems] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [newForm, setNewForm] = useState({ name: "", role: "", display_order: 0, is_active: true });

    const load = async () => {
        setLoading(true);
        try { const r = await fetch(`${BASE}?type=organizing-team&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]; if (!f) return;
        setFile(f); setPreview(URL.createObjectURL(f));
    };

    const textOnly = (v: string) => /^[a-zA-Z\s]*$/.test(v);

    const handleAdd = async () => {
        if (!file || !newForm.name || !newForm.role) { toast.error("Photo, name and role required"); return; }
        if (!textOnly(newForm.name)) { toast.error("Name must contain only letters"); return; }
        if (!textOnly(newForm.role)) { toast.error("Role must contain only letters"); return; }
        setUploading(true);
        try {
            const fd = new FormData(); fd.append("file", file);
            Object.entries(newForm).forEach(([k, v]) => fd.append(k, String(v)));
            const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Member added"); setShowAdd(false); setFile(null); setPreview(""); setNewForm({ name: "", role: "", display_order: 0, is_active: true }); load(); }
            else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this member?")) return;
        const r = await fetch(`${BASE}?type=organizing-team&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: TeamMember) => {
        const r = await fetch(`${BASE}?type=organizing-team`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        if (editForm.name !== undefined && !textOnly(editForm.name)) { toast.error("Name must contain only letters"); return; }
        if (editForm.role !== undefined && !textOnly(editForm.role)) { toast.error("Role must contain only letters"); return; }
        const r = await fetch(`${BASE}?type=organizing-team`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...editForm }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <GreenBtn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Member</GreenBtn>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Team Member</h2>
                    <UploadBox id="lmp-ot-upload" preview={preview} file={file} onChange={onFile} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.name} onChange={e => { if (/^[a-zA-Z\s]*$/.test(e.target.value)) setNewForm({ ...newForm, name: e.target.value }); }} placeholder="e.g. Andrew Michael" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.role} onChange={e => { if (/^[a-zA-Z\s]*$/.test(e.target.value)) setNewForm({ ...newForm, role: e.target.value }); }} placeholder="e.g. MENTORING COORDINATOR" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                            <input type="checkbox" id="lmp-ot-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="lmp-ot-active" className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <GreenBtn onClick={handleAdd} disabled={uploading}>{uploading ? "Saving..." : "Save"}</GreenBtn>
                        <button onClick={() => { setShowAdd(false); setFile(null); setPreview(""); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                        <div className="flex justify-center pt-6 pb-2 bg-gray-50">
                            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 shadow ring-2 ring-white">
                                <img src={item.image_url || "/assets/defaultprofile.png"} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="p-4">
                            {editingId === item.id ? (
                                <div className="space-y-2">
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.name ?? ""} onChange={e => { if (/^[a-zA-Z\s]*$/.test(e.target.value)) setEditForm({ ...editForm, name: e.target.value }); }} placeholder="Name" />
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.role ?? ""} onChange={e => { if (/^[a-zA-Z\s]*$/.test(e.target.value)) setEditForm({ ...editForm, role: e.target.value }); }} placeholder="Role" />
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs"><Check className="w-3 h-3" /> Save</button>
                                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="font-semibold text-sm text-center" style={{ color: LG }}>{item.name}</p>
                                    <p className="text-[10.5px] text-gray-400 uppercase tracking-wide text-center mt-0.5">{item.role}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ name: item.name, role: item.role }); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="col-span-full text-center text-gray-400 py-16">No team members yet.</p>}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// SESSIONS TAB
// ══════════════════════════════════════════════════════════════════════════════
function SessionsTab() {
    const [items, setItems] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Session>>({});
    const [newForm, setNewForm] = useState({ date: "", batch: "", description: "", report_link: "", display_order: 0, is_active: true });

    const load = async () => {
        setLoading(true);
        try { const r = await fetch(`${BASE}?type=sessions&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const isValidUrl = (v: string) => { try { new URL(v); return true; } catch { return false; } };

    const handleAdd = async () => {
        if (!newForm.date || !newForm.batch || !newForm.description) { toast.error("Date, batch and description required"); return; }
        if (newForm.report_link && !isValidUrl(newForm.report_link)) { toast.error("Report Link must be a valid URL (e.g. https://...)"); return; }
        const r = await fetch(`${BASE}?type=sessions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newForm, is_active: newForm.is_active ? 1 : 0 }) });
        const d = await r.json();
        if (d.success) { toast.success("Session added"); setShowAdd(false); setNewForm({ date: "", batch: "", description: "", report_link: "", display_order: 0, is_active: true }); load(); }
        else toast.error(d.error || "Failed");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this session?")) return;
        const r = await fetch(`${BASE}?type=sessions&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: Session) => {
        const r = await fetch(`${BASE}?type=sessions`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        if (editForm.report_link && !isValidUrl(editForm.report_link)) { toast.error("Report Link must be a valid URL (e.g. https://...)"); return; }
        const r = await fetch(`${BASE}?type=sessions`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...editForm }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <GreenBtn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Session</GreenBtn>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Mentoring Session</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date / Period *</label>
                            <input type="date" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.date} onChange={e => setNewForm({ ...newForm, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.batch} onChange={e => setNewForm({ ...newForm, batch: e.target.value })} placeholder="e.g. 2024-26 Batch" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea rows={4} className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Report Link (Google Form URL)</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.report_link} onChange={e => setNewForm({ ...newForm, report_link: e.target.value })} placeholder="https://forms.google.com/..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="sess-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="sess-active" className="text-sm text-gray-700">Active (visible on page)</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <GreenBtn onClick={handleAdd}>Save</GreenBtn>
                        <button onClick={() => setShowAdd(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow p-5">
                        {editingId === item.id ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                                        <input type="date" className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.date ?? ""} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Batch</label>
                                        <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.batch ?? ""} onChange={e => setEditForm({ ...editForm, batch: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                        <textarea rows={4} className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.description ?? ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Report Link</label>
                                        <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.report_link ?? ""} onChange={e => setEditForm({ ...editForm, report_link: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleSaveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs"><Check className="w-3 h-3" /> Save</button>
                                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-3 flex-wrap mb-3">
                                        <span className="inline-flex items-center gap-1.5 text-white text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: LG }}>{item.date}</span>
                                        <span className="inline-flex items-center gap-1.5 bg-[#F9FAEE] border border-[#DCE092] text-xs font-semibold px-3 py-1 rounded-full" style={{ color: LG }}>{item.batch}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                        <button onClick={() => { setEditingId(item.id); setEditForm({ date: item.date, batch: item.batch, description: item.description, report_link: item.report_link }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                                {item.report_link && item.report_link !== "#" && (
                                    <a href={item.report_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold mt-3 hover:underline" style={{ color: LG }}>
                                        🔗 Submit Report
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {items.length === 0 && <p className="text-center text-gray-400 py-16">No sessions yet.</p>}
            </div>
        </div>
    );
}
