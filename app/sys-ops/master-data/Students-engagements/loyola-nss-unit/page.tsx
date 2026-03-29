"use client";

import { useState, useEffect } from "react";
import {
    Trash2, Plus, Upload, Pencil, X, Check,
    Users, Image as ImageIcon, Mail, Phone,
    Activity, Droplet, Tent, List,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const LG = "#13432C";
const LG_DARK = "#0f3324";
const BASE = "/api/students/loyol-nss-unit";

type Tab = "organizing-team" | "content" | "contact";

interface TeamMember { id: number; name: string; role: string; image_url: string; display_order: number; is_active: boolean; }
interface BulletItem { id: number; text: string; display_order: number; is_active: boolean; }
interface ActivityItem { id: number; title: string; date: string; description: string; image_url: string; display_order: number; is_active: boolean; }
interface TextBlock { id: number; content: string; is_active: boolean; }
interface GalleryImg { id: number; image_url: string; alt_text: string; display_order: number; is_active: boolean; }
interface ContactInfo { id: number; name: string; email: string; phone: string; is_active: boolean; }

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

export default function NssUnitAdmin() {
    const [activeTab, setActiveTab] = useState<Tab>("organizing-team");

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "organizing-team", label: "Organizing Committee", icon: <Users className="w-4 h-4" /> },
        { id: "content", label: "Content & Gallery", icon: <Activity className="w-4 h-4" /> },
        { id: "contact", label: "Contact", icon: <Mail className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Loyola NSS Unit Management</h1>
                <p className="text-gray-600 mt-1">Manage all NSS Unit content — committee, activities, blood connect, special camp, gallery &amp; contact</p>
            </div>

            <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap"
                        style={activeTab === t.id
                            ? { borderBottomColor: LG, color: LG }
                            : { borderBottomColor: "transparent", color: "#6b7280" }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {activeTab === "organizing-team" && <OrganizingTeamTab />}
            {activeTab === "content" && <ContentTab />}
            {activeTab === "contact" && <ContactTab />}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: CONTENT (Regular Activities + Activities + Blood Connect + Special Camp + Gallery)
// ══════════════════════════════════════════════════════════════════════════════
function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-200">
            <span style={{ color: LG }}>{icon}</span>
            <h2 className="text-lg font-bold text-gray-800">{label}</h2>
        </div>
    );
}

function ContentTab() {
    return (
        <div className="space-y-12">
            <section>
                <SectionHeading icon={<List className="w-5 h-5" />} label="Regular Activities" />
                <BulletItemsTab type="regular-activities" label="Regular Activities" placeholder="e.g. Orientation Programme" />
            </section>
            <section>
                <SectionHeading icon={<Activity className="w-5 h-5" />} label="Activities" />
                <ActivitiesTab />
            </section>
            <section>
                <SectionHeading icon={<Droplet className="w-5 h-5" />} label="Blood Connect" />
                <TextBlockTab type="blood-connect" label="Blood Connect" />
            </section>
            <section>
                <SectionHeading icon={<Tent className="w-5 h-5" />} label="Special Camp" />
                <div className="space-y-10">
                    <div>
                        <p className="text-sm text-gray-500 mb-4 font-medium">Paragraphs</p>
                        <TextBlockTab type="special-camp" label="Special Camp" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-4 font-medium">Aims of Special Camp</p>
                        <BulletItemsTab type="special-camp-aims" label="Special Camp Aim" placeholder="e.g. To sensitize students about living conditions..." />
                    </div>
                </div>
            </section>
            <section>
                <SectionHeading icon={<ImageIcon className="w-5 h-5" />} label="Gallery" />
                <GalleryTab />
            </section>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: ORGANIZING COMMITTEE
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

    const handleAdd = async () => {
        if (!file || !newForm.name.trim() || !newForm.role.trim()) { toast.error("Image, name, and role are required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file); fd.append("type", "organizing-team");
            fd.append("name", newForm.name); fd.append("role", newForm.role);
            fd.append("display_order", String(newForm.display_order)); fd.append("is_active", String(newForm.is_active));
            const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Member added"); setShowAdd(false); setFile(null); setPreview(""); setNewForm({ name: "", role: "", display_order: 0, is_active: true }); load(); }
            else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this member? Photo will also be removed.")) return;
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
                <GreenBtn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Member</GreenBtn>
            </div>
            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Committee Member</h2>
                    <label htmlFor="nss-ot-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                        {preview ? <img src={preview} alt="" className="w-28 h-28 rounded-full object-cover mb-2 shadow" />
                            : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm text-gray-600">Click to upload photo</span><span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5 MB)</span></>}
                        {preview && <span className="text-xs text-gray-400 mt-1">{file?.name}</span>}
                    </label>
                    <input id="nss-ot-upload" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value.replace(/[0-9]/g, "") })} placeholder="e.g. Dr. Sunil Kumar P" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.role} onChange={e => setNewForm({ ...newForm, role: e.target.value.replace(/[^a-zA-Z\s]/g, "") })} placeholder="e.g. NSS PROGRAMME OFFICER" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} /></div>
                        <div className="flex items-center gap-3 pt-5">
                            <input type="checkbox" id="nss-ot-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="nss-ot-active" className="text-sm text-gray-700">Active</label></div>
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
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.name ?? ""} onChange={e => setEditForm({ ...editForm, name: e.target.value.replace(/[0-9]/g, "") })} placeholder="Name" />
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.role ?? ""} onChange={e => setEditForm({ ...editForm, role: e.target.value.replace(/[^a-zA-Z\s]/g, "") })} placeholder="Role" />
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
                {items.length === 0 && <p className="col-span-full text-center text-gray-400 py-16">No members yet.</p>}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// REUSABLE: BULLET ITEMS TAB (Regular Activities + Special Camp Aims)
// ══════════════════════════════════════════════════════════════════════════════
function BulletItemsTab({ type, label, placeholder }: { type: string; label: string; placeholder: string }) {
    const [items, setItems] = useState<BulletItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newText, setNewText] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");

    const load = async () => {
        setLoading(true);
        try { const r = await fetch(`${BASE}?type=${type}&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, [type]);

    const handleAdd = async () => {
        if (!newText.trim()) { toast.error("Text required"); return; }
        const r = await fetch(`${BASE}?type=${type}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: newText.trim(), display_order: items.length, is_active: 1 }) });
        const d = await r.json(); if (d.success) { toast.success("Added"); setNewText(""); setShowAdd(false); load(); } else toast.error(d.error || "Failed");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this item?")) return;
        const r = await fetch(`${BASE}?type=${type}&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: BulletItem) => {
        const r = await fetch(`${BASE}?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };

    const handleSave = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, text: editText }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <GreenBtn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Item</GreenBtn>
            </div>
            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-4 space-y-3">
                    <h2 className="font-bold text-lg">Add {label} Item</h2>
                    <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newText} onChange={e => setNewText(e.target.value)} placeholder={placeholder} onKeyDown={e => e.key === "Enter" && handleAdd()} autoFocus />
                    <div className="flex gap-3">
                        <GreenBtn onClick={handleAdd}>Save</GreenBtn>
                        <button onClick={() => { setShowAdd(false); setNewText(""); }} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}
            <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Text</th>
                            <th className="px-4 py-3 font-semibold text-gray-700 w-24 text-left">Status</th>
                            <th className="px-4 py-3 w-24"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">
                                    {editingId === item.id
                                        ? <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSave()} autoFocus />
                                        : item.text}
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === item.id ? (
                                        <div className="flex gap-2">
                                            <button onClick={handleSave} className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs font-medium"><Check className="w-3 h-3" /> Save</button>
                                            <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingId(item.id); setEditText(item.text); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan={3} className="text-center py-10 text-gray-400">No items yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: ACTIVITIES (image + title + date + description)
// ══════════════════════════════════════════════════════════════════════════════
function ActivitiesTab() {
    const [items, setItems] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<ActivityItem>>({});
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [newForm, setNewForm] = useState({ title: "", date: "", description: "" });

    const load = async () => {
        setLoading(true);
        try { const r = await fetch(`${BASE}?type=activities&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!file || !newForm.title.trim()) { toast.error("Image and title are required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file); fd.append("type", "activities");
            fd.append("title", newForm.title); fd.append("date", newForm.date);
            fd.append("description", newForm.description); fd.append("display_order", String(items.length));
            const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Activity added"); setShowAdd(false); setFile(null); setPreview(""); setNewForm({ title: "", date: "", description: "" }); load(); }
            else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this activity? Image will also be removed.")) return;
        const r = await fetch(`${BASE}?type=activities&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: ActivityItem) => {
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
                    <label htmlFor="nss-act-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                        {preview ? <img src={preview} alt="" className="w-full max-h-[200px] object-cover rounded-lg" />
                            : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm text-gray-600">Click to upload activity image</span><span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5 MB)</span></>}
                    </label>
                    <input id="nss-act-upload" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })} placeholder="e.g. Blood Donation Camp" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.date} onChange={e => setNewForm({ ...newForm, date: e.target.value })} placeholder="e.g. 15th June 2025" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea rows={4} className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })} placeholder="Activity description..." /></div>
                    </div>
                    <div className="flex gap-3">
                        <GreenBtn onClick={handleAdd} disabled={uploading}>{uploading ? "Saving..." : "Save"}</GreenBtn>
                        <button onClick={() => { setShowAdd(false); setFile(null); setPreview(""); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}
            <div className="space-y-4">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow p-5">
                        {editingId === item.id ? (
                            <div className="space-y-3">
                                <input className="w-full border border-gray-300 rounded p-2 text-sm font-semibold" value={editForm.title ?? ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                                <input className="w-full border border-gray-300 rounded p-2 text-sm" value={editForm.date ?? ""} onChange={e => setEditForm({ ...editForm, date: e.target.value })} placeholder="Date" />
                                <textarea rows={4} className="w-full border border-gray-300 rounded p-2 text-sm" value={editForm.description ?? ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" />
                                <div className="flex gap-2">
                                    <button onClick={handleSaveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm"><Check className="w-3.5 h-3.5" /> Save</button>
                                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm"><X className="w-3.5 h-3.5" /> Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full md:w-[180px] h-[140px] rounded-lg overflow-hidden shrink-0 bg-gray-200">
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title, date: item.date, description: item.description }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                    {item.date && <p className="text-sm text-yellow-600 font-medium mb-2">{item.date}</p>}
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{item.description}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {items.length === 0 && <p className="text-center text-gray-400 py-16">No activities yet.</p>}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// REUSABLE: TEXT BLOCK TAB (Blood Connect)
// ══════════════════════════════════════════════════════════════════════════════
function TextBlockTab({ type, label }: { type: string; label: string }) {
    const [items, setItems] = useState<TextBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newContent, setNewContent] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");

    const load = async () => {
        setLoading(true);
        try { const r = await fetch(`${BASE}?type=${type}&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, [type]);

    const handleAdd = async () => {
        if (!newContent.trim()) { toast.error("Content required"); return; }
        const r = await fetch(`${BASE}?type=${type}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: newContent.trim(), is_active: 1 }) });
        const d = await r.json(); if (d.success) { toast.success("Added"); setNewContent(""); setShowAdd(false); load(); } else toast.error(d.error || "Failed");
    };
    const handleDelete = async (id: number) => {
        if (!confirm("Delete this paragraph?")) return;
        const r = await fetch(`${BASE}?type=${type}&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };
    const handleToggle = async (item: TextBlock) => {
        const r = await fetch(`${BASE}?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };
    const handleSave = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, content: editContent }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <GreenBtn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Paragraph</GreenBtn>
            </div>
            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-5 space-y-3">
                    <h2 className="font-bold text-lg">Add {label} Paragraph</h2>
                    <textarea rows={5} className="w-full border border-gray-300 rounded p-2 text-sm" value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Enter paragraph text..." autoFocus />
                    <div className="flex gap-3">
                        <GreenBtn onClick={handleAdd}>Save</GreenBtn>
                        <button onClick={() => { setShowAdd(false); setNewContent(""); }} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow p-5">
                        {editingId === item.id ? (
                            <div className="space-y-3">
                                <textarea rows={5} className="w-full border border-gray-300 rounded p-2 text-sm" value={editContent} onChange={e => setEditContent(e.target.value)} autoFocus />
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm"><Check className="w-3.5 h-3.5" /> Save</button>
                                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm"><X className="w-3.5 h-3.5" /> Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between gap-4">
                                <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                    <button onClick={() => { setEditingId(item.id); setEditContent(item.content); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {items.length === 0 && <p className="text-center text-gray-400 py-10">No paragraphs yet.</p>}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: SPECIAL CAMP (paragraphs + aims bullet list)
// ══════════════════════════════════════════════════════════════════════════════
function SpecialCampTab() {
    return (
        <div className="space-y-10">
            <div>
                <h2 className="font-bold text-gray-800 text-lg mb-4">Special Camp — Paragraphs</h2>
                <TextBlockTab type="special-camp" label="Special Camp" />
            </div>
            <div>
                <h2 className="font-bold text-gray-800 text-lg mb-4">Aims of Special Camp</h2>
                <BulletItemsTab type="special-camp-aims" label="Special Camp Aim" placeholder="e.g. To sensitize students about living conditions..." />
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
            fd.append("file", file); fd.append("type", "gallery");
            fd.append("alt_text", altText || "NSS Gallery"); fd.append("display_order", String(items.length));
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
                <label htmlFor="nss-gallery-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors w-full min-h-[160px]">
                    {preview ? <img src={preview} alt="" className="w-full object-cover rounded-lg max-h-[200px]" />
                        : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm font-medium text-gray-600">{file ? file.name : "Click to upload"}</span><span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5 MB)</span></>}
                    {preview && <span className="text-xs text-gray-400 mt-2 pb-2">{file?.name}</span>}
                </label>
                <input id="nss-gallery-upload" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
                <div className="flex gap-3 items-end">
                    <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                        <input className="w-full border border-gray-300 rounded p-2 text-sm" value={altText} onChange={e => setAltText(e.target.value)} placeholder="e.g. NSS Special Camp 2024" /></div>
                    <GreenBtn onClick={handleUpload} disabled={uploading || !file} className="whitespace-nowrap shrink-0">
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

// ══════════════════════════════════════════════════════════════════════════════
// TAB: CONTACT
// ══════════════════════════════════════════════════════════════════════════════
function ContactTab() {
    const [items, setItems] = useState<ContactInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<ContactInfo>>({});
    const [newForm, setNewForm] = useState({ name: "", email: "", phone: "", is_active: true });

    const load = async () => {
        setLoading(true);
        try { const r = await fetch(`${BASE}?type=contact&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!newForm.name.trim()) { toast.error("Name is required"); return; }
        if (newForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newForm.email)) { toast.error("Invalid email"); return; }
        const r = await fetch(`${BASE}?type=contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newForm.name, email: newForm.email, phone: newForm.phone, is_active: newForm.is_active ? 1 : 0 }) });
        const d = await r.json(); if (d.success) { toast.success("Contact added"); setNewForm({ name: "", email: "", phone: "", is_active: true }); setShowAdd(false); load(); } else toast.error(d.error || "Failed");
    };
    const handleDelete = async (id: number) => {
        if (!confirm("Delete this contact?")) return;
        const r = await fetch(`${BASE}?type=contact&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };
    const handleToggle = async (item: ContactInfo) => {
        const r = await fetch(`${BASE}?type=contact`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };
    const handleSaveEdit = async () => {
        if (!editingId) return;
        if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) { toast.error("Invalid email"); return; }
        const r = await fetch(`${BASE}?type=contact`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...editForm }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <GreenBtn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Contact</GreenBtn>
            </div>
            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Contact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value.replace(/[0-9]/g, "") })} placeholder="e.g. Dr. Nisha Jolly Nelson" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.email} onChange={e => setNewForm({ ...newForm, email: e.target.value })} placeholder="e.g. nisha@loyola.edu.in" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.phone} onChange={e => setNewForm({ ...newForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit phone" /></div>
                        <div className="flex items-center gap-3 pt-5">
                            <input type="checkbox" id="nss-contact-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="nss-contact-active" className="text-sm text-gray-700">Active</label></div>
                    </div>
                    <div className="flex gap-3">
                        <GreenBtn onClick={handleAdd}>Save</GreenBtn>
                        <button onClick={() => { setShowAdd(false); setNewForm({ name: "", email: "", phone: "", is_active: true }); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}
            <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Phone</th>
                            <th className="px-4 py-3 w-24 text-left font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 w-28"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">
                                    {editingId === item.id ? <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.name ?? ""} onChange={e => setEditForm({ ...editForm, name: e.target.value.replace(/[0-9]/g, "") })} autoFocus /> : item.name}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {editingId === item.id ? <input type="email" className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.email ?? ""} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /> : item.email ? <a href={`mailto:${item.email}`} className="text-[#13432C] hover:underline flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{item.email}</a> : <span className="text-gray-400 text-xs">—</span>}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {editingId === item.id ? <input type="tel" className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.phone ?? ""} onChange={e => setEditForm({ ...editForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} /> : item.phone ? <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{item.phone}</span> : <span className="text-gray-400 text-xs">—</span>}
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
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ name: item.name, email: item.email, phone: item.phone }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">No contacts yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
