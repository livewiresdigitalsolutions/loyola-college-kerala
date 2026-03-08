// app/sys-ops/master-data/Students-engagements/loyola-ethnographic-theatre/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Trash2, Plus, Upload, Pencil, X, Check,
    Users, Tag, Activity, Image as ImageIcon,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// Loyola Green — defined once so it's always applied via inline style, not Tailwind
const LG = "#13432C";
const LG_DARK = "#0f3324";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "organizing-team" | "themes" | "activities" | "gallery";

interface TeamMember { id: number; name: string; role: string; image_url: string; display_order: number; is_active: boolean; }
interface Theme { id: number; theme: string; display_order: number; is_active: boolean; }
interface LetActivity { id: number; date: string; description: string; display_order: number; is_active: boolean; }
interface GalleryImg { id: number; image_url: string; alt_text: string; display_order: number; is_active: boolean; }

const BASE = "/api/students/loyola-ethnographic-theatre";

// Reusable green button
function GreenBtn({ onClick, disabled, children, className = "" }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode; className?: string }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${className}`}
            style={{ backgroundColor: LG }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = LG_DARK)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = LG)}
        >
            {children}
        </button>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LetAdmin() {
    const [activeTab, setActiveTab] = useState<Tab>("organizing-team");

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "organizing-team", label: "Organizing Team", icon: <Users className="w-4 h-4" /> },
        { id: "themes", label: "Suggested Themes", icon: <Tag className="w-4 h-4" /> },
        { id: "activities", label: "Activities", icon: <Activity className="w-4 h-4" /> },
        { id: "gallery", label: "Gallery", icon: <ImageIcon className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">LET Management</h1>
                <p className="text-gray-600 mt-1">Loyola Ethnographic Theatre — manage all content</p>
            </div>

            <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap"
                        style={activeTab === t.id
                            ? { borderBottomColor: LG, color: LG }
                            : { borderBottomColor: "transparent", color: "#6b7280" }
                        }>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {activeTab === "organizing-team" && <OrganizingTeamTab />}
            {activeTab === "themes" && <ThemesTab />}
            {activeTab === "activities" && <ActivitiesTab />}
            {activeTab === "gallery" && <GalleryTab />}
        </div>
    );
}

// ── Shared: image upload box ───────────────────────────────────────────────────
function ImageUploadBox({
    id, preview, file, onChange, shape = "rect",
}: {
    id: string; preview: string; file: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    shape?: "circle" | "rect";
}) {
    return (
        <div>
            <label htmlFor={id} className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer transition-colors hover:border-gray-400">
                {preview ? (
                    shape === "circle"
                        ? <img src={preview} alt="" className="w-28 h-28 rounded-full object-cover mb-2 shadow" />
                        : <img src={preview} alt="" className="w-full h-36 object-cover mb-2 rounded-lg" />
                ) : (
                    <>
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">{file ? file.name : "Click to upload"}</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5 MB)</span>
                    </>
                )}
                {preview && <span className="text-xs text-gray-400 mt-1">{file?.name}</span>}
            </label>
            <input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/jpg" className="hidden" onChange={onChange} />
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: ORGANIZING TEAM
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
        const f = e.target.files?.[0];
        if (!f) return;
        if (!f.type.startsWith("image/")) { toast.error("Select an image"); return; }
        setFile(f); setPreview(URL.createObjectURL(f));
    };

    const handleAdd = async () => {
        if (!file || !newForm.name || !newForm.role) { toast.error("Image, name and role are required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("type", "organizing-team");
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
        const r = await fetch(`${BASE}?type=organizing-team`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...editForm }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <GreenBtn onClick={() => setShowAdd(true)}>
                    <Plus className="w-4 h-4" /> Add Member
                </GreenBtn>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Team Member</h2>
                    <ImageUploadBox id="let-ot-upload" preview={preview} file={file} onChange={onFile} shape="circle" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value })} placeholder="e.g. Fr.Dr. Saji S.J" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.role} onChange={e => setNewForm({ ...newForm, role: e.target.value })} placeholder="e.g. STAFF CO-ORDINATOR" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                            <input type="checkbox" id="let-ot-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="let-ot-active" className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <GreenBtn onClick={handleAdd} disabled={uploading} className="text-sm px-5 py-2">{uploading ? "Saving..." : "Save"}</GreenBtn>
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
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.name ?? ""} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.role ?? ""} onChange={e => setEditForm({ ...editForm, role: e.target.value })} placeholder="Role" />
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
// TAB: SUGGESTED THEMES
// ══════════════════════════════════════════════════════════════════════════════
function ThemesTab() {
    const [items, setItems] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTheme, setEditTheme] = useState("");
    const [newTheme, setNewTheme] = useState("");

    const load = async () => {
        setLoading(true);
        try { const r = await fetch(`${BASE}?type=themes&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!newTheme.trim()) { toast.error("Theme text required"); return; }
        const r = await fetch(`${BASE}?type=themes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ theme: newTheme.trim(), display_order: items.length, is_active: 1 }) });
        const d = await r.json();
        if (d.success) { toast.success("Theme added"); setNewTheme(""); setShowAdd(false); load(); }
        else toast.error(d.error || "Failed");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this theme?")) return;
        const r = await fetch(`${BASE}?type=themes&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: Theme) => {
        const r = await fetch(`${BASE}?type=themes`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=themes`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, theme: editTheme }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <GreenBtn onClick={() => setShowAdd(true)}>
                    <Plus className="w-4 h-4" /> Add Theme
                </GreenBtn>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Suggested Theme</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theme / Issue *</label>
                        <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newTheme} onChange={e => setNewTheme(e.target.value)} placeholder="e.g. Waste management" onKeyDown={e => e.key === "Enter" && handleAdd()} />
                    </div>
                    <div className="flex gap-3">
                        <GreenBtn onClick={handleAdd} className="text-sm px-5 py-2">Save</GreenBtn>
                        <button onClick={() => { setShowAdd(false); setNewTheme(""); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
                <div className="flex flex-wrap gap-3">
                    {items.map(item => (
                        <div key={item.id} className="group relative">
                            {editingId === item.id ? (
                                <div className="flex items-center gap-2 border rounded-full px-3 py-1.5" style={{ borderColor: LG }}>
                                    <input className="text-sm border-0 outline-none w-36" value={editTheme} onChange={e => setEditTheme(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSaveEdit()} autoFocus />
                                    <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-700"><Check className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
                                </div>
                            ) : (
                                <span
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 border rounded-full text-sm font-medium"
                                    style={item.is_active ? { borderColor: LG, color: LG } : { borderColor: "#d1d5db", color: "#9ca3af" }}
                                >
                                    {item.theme}
                                    <button onClick={() => { setEditingId(item.id); setEditTheme(item.theme); }} className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 ml-1 transition-opacity"><Pencil className="w-3 h-3" /></button>
                                    <button onClick={() => handleToggle(item)} className="opacity-0 group-hover:opacity-100 ml-0.5 transition-opacity">
                                        <span className={`text-[10px] font-bold ${item.is_active ? "text-green-500" : "text-gray-400"}`}>{item.is_active ? "●" : "○"}</span>
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-gray-400 text-sm">No themes yet. Add your first theme!</p>}
                </div>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: ACTIVITIES
// ══════════════════════════════════════════════════════════════════════════════
function ActivitiesTab() {
    const [items, setItems] = useState<LetActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<LetActivity>>({});
    const [newForm, setNewForm] = useState({ date: "", description: "", display_order: 0, is_active: true });

    const load = async () => {
        setLoading(true);
        try { const r = await fetch(`${BASE}?type=activities&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!newForm.date || !newForm.description) { toast.error("Date and description required"); return; }
        const r = await fetch(`${BASE}?type=activities`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newForm, is_active: newForm.is_active ? 1 : 0 }) });
        const d = await r.json();
        if (d.success) { toast.success("Activity added"); setShowAdd(false); setNewForm({ date: "", description: "", display_order: 0, is_active: true }); load(); }
        else toast.error(d.error || "Failed");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this activity?")) return;
        const r = await fetch(`${BASE}?type=activities&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: LetActivity) => {
        const r = await fetch(`${BASE}?type=activities`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=activities`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...editForm }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <GreenBtn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Activity</GreenBtn>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Activity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date / Period *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.date} onChange={e => setNewForm({ ...newForm, date: e.target.value })} placeholder="e.g. 30th October 2020" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea rows={2} className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })} placeholder="e.g. Film screening & Review of the award-winning short film" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="act-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="act-active" className="text-sm text-gray-700">Active (visible on page)</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <GreenBtn onClick={handleAdd} className="text-sm px-5 py-2">Save</GreenBtn>
                        <button onClick={() => setShowAdd(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 w-[200px]">Date</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Description</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 w-24">Status</th>
                            <th className="px-4 py-3 w-24"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-500 font-medium align-top">
                                    {editingId === item.id ? <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.date ?? ""} onChange={e => setEditForm({ ...editForm, date: e.target.value })} /> : item.date}
                                </td>
                                <td className="px-4 py-3 text-gray-700 font-medium">
                                    {editingId === item.id ? <textarea rows={2} className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.description ?? ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} /> : item.description}
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === item.id ? (
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveEdit} className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs font-medium"><Check className="w-3 h-3" /> Save</button>
                                            <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ date: item.date, description: item.description }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-gray-400">No activities yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: GALLERY
// ══════════════════════════════════════════════════════════════════════════════
function GalleryTab() {
    const [items, setItems] = useState<GalleryImg[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [altText, setAltText] = useState("");

    const load = async () => {
        setLoading(true);
        try { const r = await fetch(`${BASE}?type=gallery&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleUpload = async () => {
        if (!file) { toast.error("Select an image first"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("type", "gallery");
            fd.append("alt_text", altText || "LET Gallery");
            fd.append("display_order", String(items.length));
            const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Uploaded"); setFile(null); setPreview(""); setAltText(""); load(); }
            else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this image?")) return;
        const r = await fetch(`${BASE}?type=gallery&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: GalleryImg) => {
        const r = await fetch(`${BASE}?type=gallery`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                <h2 className="font-bold text-lg">Upload Gallery Image</h2>

                <label htmlFor="let-gal-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors w-full" style={{ minHeight: 160 }}>
                    {preview
                        ? <img src={preview} alt="" className="w-full object-cover rounded-lg" style={{ maxHeight: 200 }} />
                        : <>
                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-gray-600">{file ? file.name : "Click to upload"}</span>
                            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5 MB)</span>
                        </>
                    }
                    {preview && <span className="text-xs text-gray-400 mt-2 pb-2">{file?.name}</span>}
                </label>
                <input id="let-gal-upload" type="file" accept="image/jpeg,image/png,image/webp,image/jpg" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />

                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                        <input className="w-full border border-gray-300 rounded p-2 text-sm" value={altText} onChange={e => setAltText(e.target.value)} placeholder="e.g. LET Film Screening 2023" />
                    </div>
                    <GreenBtn onClick={handleUpload} disabled={uploading || !file} className="text-sm px-5 py-2 whitespace-nowrap shrink-0">
                        <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Image"}
                    </GreenBtn>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden group">
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                            <img src={item.image_url} alt={item.alt_text} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-3">
                            <p className="text-xs text-gray-500 truncate mb-2">{item.alt_text}</p>
                            <div className="flex items-center justify-between">
                                <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="col-span-full text-center text-gray-400 py-16">No images yet.</p>}
            </div>
        </div>
    );
}
