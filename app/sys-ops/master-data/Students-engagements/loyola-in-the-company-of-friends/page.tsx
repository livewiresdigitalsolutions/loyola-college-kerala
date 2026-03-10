// app/sys-ops/master-data/Students-engagements/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Trash2, Plus, Upload, Pencil, X, Check,
    Users, Activity, Trophy, CalendarDays, Image as ImageIcon,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "organizing-team" | "activities" | "achievements" | "events" | "gallery";

interface TeamMember { id: number; name: string; role: string; image_url: string; display_order: number; is_active: boolean; }
interface Activity { id: number; date: string; description: string; display_order: number; is_active: boolean; }
interface Achievement { id: number; title: string; date: string; description: string; image_url: string; display_order: number; is_active: boolean; }
interface LitcofEvent { id: number; title: string; date: string; description: string; image_url: string; display_order: number; is_active: boolean; }
interface GalleryImg { id: number; image_url: string; alt_text: string; display_order: number; is_active: boolean; }

const BASE = "/api/students/loyola-in-the-company-of-friends";
const apiUrl = (type: Tab, extra = "") => `${BASE}${extra}?type=${type}`;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LitcofAdmin() {
    const [activeTab, setActiveTab] = useState<Tab>("organizing-team");

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "organizing-team", label: "Organizing Team", icon: <Users className="w-4 h-4" /> },
        { id: "activities", label: "Activities", icon: <Activity className="w-4 h-4" /> },
        { id: "achievements", label: "Achievements", icon: <Trophy className="w-4 h-4" /> },
        { id: "events", label: "Events", icon: <CalendarDays className="w-4 h-4" /> },
        { id: "gallery", label: "Gallery", icon: <ImageIcon className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">LITCOF Management</h1>
                <p className="text-gray-600 mt-1">Loyola In The Company Of Friends — manage all content</p>
            </div>

            <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === t.id ? "border-[#342D87] text-[#342D87]" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {activeTab === "organizing-team" && <OrganizingTeamTab />}
            {activeTab === "activities" && <ActivitiesTab />}
            {activeTab === "achievements" && <AchievementsTab />}
            {activeTab === "events" && <EventsTab />}
            {activeTab === "gallery" && <GalleryTab />}
        </div>
    );
}

// ── Shared: image upload input ─────────────────────────────────────────────────
function ImageUploadBox({
    id, preview, file, onChange, shape = "rect",
}: {
    id: string; preview: string; file: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    shape?: "circle" | "rect";
}) {
    return (
        <div>
            <label htmlFor={id} className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-[#342D87] transition-colors">
                {preview ? (
                    shape === "circle"
                        ? <img src={preview} alt="" className="w-28 h-28 rounded-full object-cover mb-2 shadow" />
                        : <img src={preview} alt="" className="w-full h-36 object-cover mb-2 rounded-lg" />
                ) : (
                    <>
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">{file ? file.name : "Click to upload"}</span>
                        <span className="text-xs text-gray-400 mt-1">Accepted: JPG, PNG, WEBP (max 5 MB)</span>
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
        try { const r = await fetch(apiUrl("organizing-team") + "&all=true"); const d = await r.json(); if (d.success) setItems(d.data || []); }
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
            Object.entries(newForm).forEach(([k, v]) => fd.append(k, String(v)));
            const r = await fetch(apiUrl("organizing-team", "/upload"), { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Member added"); setShowAdd(false); setFile(null); setPreview(""); setNewForm({ name: "", role: "", display_order: 0, is_active: true }); load(); }
            else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this member?")) return;
        const r = await fetch(`${BASE}?type=organizing-team&id=${id}`, { method: "DELETE" });
        const d = await r.json();
        if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: TeamMember) => {
        const r = await fetch(`${BASE}?type=organizing-team`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json();
        if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=organizing-team`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...editForm }) });
        const d = await r.json();
        if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470] transition-colors">
                    <Plus className="w-4 h-4" /> Add Member
                </button>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Team Member</h2>
                    <ImageUploadBox id="ot-upload" preview={preview} file={file} onChange={onFile} shape="circle" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value })} placeholder="e.g. Dr. Sunil Kumar P" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.role} onChange={e => setNewForm({ ...newForm, role: e.target.value })} placeholder="e.g. STAFF COORDINATOR" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                            <input type="checkbox" id="ot-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="ot-active" className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} disabled={uploading} className="bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#2a2470] disabled:opacity-50">{uploading ? "Saving..." : "Save"}</button>
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
                                    <p className="font-semibold text-sm text-[#13432C] text-center">{item.name}</p>
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
// TAB: ACTIVITIES
// ══════════════════════════════════════════════════════════════════════════════
function ActivitiesTab() {
    const [items, setItems] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Activity>>({});
    const [newForm, setNewForm] = useState({ date: "", description: "", display_order: 0, is_active: true });

    const load = async () => { setLoading(true); try { const r = await fetch(apiUrl("activities") + "&all=true"); const d = await r.json(); if (d.success) setItems(d.data || []); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!newForm.date || !newForm.description) { toast.error("Date and description required"); return; }
        const r = await fetch(`${BASE}?type=activities`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newForm, is_active: newForm.is_active ? 1 : 0 }) });
        const d = await r.json();
        if (d.success) { toast.success("Activity added"); setShowAdd(false); setNewForm({ date: "", description: "", display_order: 0, is_active: true }); load(); }
        else toast.error(d.error || "Failed");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete?")) return;
        const r = await fetch(`${BASE}?type=activities&id=${id}`, { method: "DELETE" });
        const d = await r.json();
        if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: Activity) => {
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
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470] transition-colors"><Plus className="w-4 h-4" /> Add Activity</button>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Activity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.date} onChange={e => setNewForm({ ...newForm, date: e.target.value })} placeholder="e.g. 24th Jan 2025" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea rows={2} className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="act-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="act-active" className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} className="bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#2a2470]">Save</button>
                        <button onClick={() => setShowAdd(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 w-[180px]">Date</th>
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
// SHARED: Image+text tab (Achievements / Events)
// ══════════════════════════════════════════════════════════════════════════════
function ImageTextTab({ tabType, label }: { tabType: "achievements" | "events"; label: string }) {
    const [items, setItems] = useState<(Achievement | LitcofEvent)[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Achievement | LitcofEvent>>({});
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [newForm, setNewForm] = useState({ title: "", date: "", description: "", display_order: 0, is_active: true });

    const load = async () => { setLoading(true); try { const r = await fetch(apiUrl(tabType) + "&all=true"); const d = await r.json(); if (d.success) setItems(d.data || []); } finally { setLoading(false); } };
    useEffect(() => { load(); }, [tabType]);

    const onFile = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } };

    const handleAdd = async () => {
        if (!file || !newForm.title) { toast.error("Image and title required"); return; }
        setUploading(true);
        try {
            const fd = new FormData(); fd.append("file", file);
            Object.entries(newForm).forEach(([k, v]) => fd.append(k, String(v)));
            const r = await fetch(apiUrl(tabType, "/upload"), { method: "POST", body: fd }); const d = await r.json();
            if (d.success) { toast.success(`${label} added`); setShowAdd(false); setFile(null); setPreview(""); setNewForm({ title: "", date: "", description: "", display_order: 0, is_active: true }); load(); }
            else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(`Delete this ${label.toLowerCase()}?`)) return;
        const r = await fetch(`${BASE}?type=${tabType}&id=${id}`, { method: "DELETE" }); const d = await r.json();
        if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: any) => {
        const r = await fetch(`${BASE}?type=${tabType}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=${tabType}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...editForm }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470] transition-colors"><Plus className="w-4 h-4" /> Add {label}</button>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add {label}</h2>
                    <ImageUploadBox id={`${tabType}-upload`} preview={preview} file={file} onChange={onFile} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.date} onChange={e => setNewForm({ ...newForm, date: e.target.value })} placeholder="e.g. 27th February 2021" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea rows={3} className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                            <input type="checkbox" id={`${tabType}-active`} checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor={`${tabType}-active`} className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} disabled={uploading} className="bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#2a2470] disabled:opacity-50">{uploading ? "Saving..." : "Save"}</button>
                        <button onClick={() => { setShowAdd(false); setFile(null); setPreview(""); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {(items as any[]).map((item: any) => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow p-4">
                        {editingId === item.id ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Title</label><input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.title ?? ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} /></div>
                                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Date</label><input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={(editForm as any).date ?? ""} onChange={e => setEditForm({ ...editForm, date: e.target.value } as any)} /></div>
                                    <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-600 mb-1">Description</label><textarea rows={3} className="w-full border border-gray-300 rounded p-1.5 text-sm" value={(editForm as any).description ?? ""} onChange={e => setEditForm({ ...editForm, description: e.target.value } as any)} /></div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleSaveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs"><Check className="w-3 h-3" /> Save</button>
                                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                    <img src={item.image_url || "/assets/defaultprofile.png"} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                                            {item.date && <p className="text-xs text-amber-600 font-medium mt-0.5">{item.date}</p>}
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title, date: item.date, description: item.description }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {items.length === 0 && <p className="text-center text-gray-400 py-16">No {label.toLowerCase()} yet.</p>}
            </div>
        </div>
    );
}

function AchievementsTab() { return <ImageTextTab tabType="achievements" label="Achievement" />; }
function EventsTab() { return <ImageTextTab tabType="events" label="Event" />; }

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

    const load = async () => { setLoading(true); try { const r = await fetch(apiUrl("gallery") + "&all=true"); const d = await r.json(); if (d.success) setItems(d.data || []); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleUpload = async () => {
        if (!file) { toast.error("Select an image first"); return; }
        setUploading(true);
        try {
            const fd = new FormData(); fd.append("file", file); fd.append("alt_text", altText || "LITCOF Gallery"); fd.append("display_order", String(items.length));
            const r = await fetch(apiUrl("gallery", "/upload"), { method: "POST", body: fd }); const d = await r.json();
            if (d.success) { toast.success("Uploaded"); setFile(null); setPreview(""); setAltText(""); load(); } else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete image?")) return;
        const r = await fetch(`${BASE}?type=gallery&id=${id}`, { method: "DELETE" }); const d = await r.json();
        if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
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

                {/* Upload box — full width, fixed height */}
                <label htmlFor="gal-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#342D87] transition-colors w-full" style={{ minHeight: 160 }}>
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
                <input id="gal-upload" type="file" accept="image/jpeg,image/png,image/webp,image/jpg" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />

                {/* Alt text + button — full width row */}
                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                        <input className="w-full border border-gray-300 rounded p-2 text-sm" value={altText} onChange={e => setAltText(e.target.value)} placeholder="e.g. LITCOF Annual Meet 2024" />
                    </div>
                    <button onClick={handleUpload} disabled={uploading || !file} className="flex items-center gap-2 bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#2a2470] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0">
                        <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Image"}
                    </button>
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
