// app/sys-ops/master-data/Students-engagements/em-and-bio-diversity/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Trash2, Plus, Upload, Pencil, X, Check,
    Users, Image as ImageIcon, Mail, Phone,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const LG = "#13432C";
const LG_DARK = "#0f3324";
const BASE = "/api/students/em-and-bio-diversity";

type Tab = "organizing-team" | "gallery" | "contact";

interface TeamMember { id: number; name: string; role: string; image_url: string; display_order: number; is_active: boolean; }
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

export default function EmBioDiversityAdmin() {
    const [activeTab, setActiveTab] = useState<Tab>("organizing-team");

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "organizing-team", label: "Organizing Committee", icon: <Users className="w-4 h-4" /> },
        { id: "gallery", label: "Gallery", icon: <ImageIcon className="w-4 h-4" /> },
        { id: "contact", label: "Contact Details", icon: <Mail className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">EM & Bio Diversity Management</h1>
                <p className="text-gray-600 mt-1">Manage organizing committee, gallery images, and contact details</p>
            </div>

            <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap"
                        style={activeTab === t.id
                            ? { borderBottomColor: LG, color: LG }
                            : { borderBottomColor: "transparent", color: "#6b7280" }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {activeTab === "organizing-team" && <OrganizingTeamTab />}
            {activeTab === "gallery" && <GalleryTab />}
            {activeTab === "contact" && <ContactTab />}
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

    const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!f.type.startsWith("image/")) { toast.error("Select an image"); return; }
        setFile(f); setPreview(URL.createObjectURL(f));
    };

    const handleAdd = async () => {
        if (!file || !newForm.name.trim() || !newForm.role.trim()) { toast.error("Image, name, and role are required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("type", "organizing-team");
            fd.append("name", newForm.name);
            fd.append("role", newForm.role);
            fd.append("display_order", String(newForm.display_order));
            fd.append("is_active", String(newForm.is_active));
            const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Member added"); setShowAdd(false); setFile(null); setPreview(""); setNewForm({ name: "", role: "", display_order: 0, is_active: true }); load(); }
            else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this member? Their photo will also be removed.")) return;
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
                    <div>
                        <label htmlFor="embd-ot-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                            {preview
                                ? <img src={preview} alt="" className="w-28 h-28 rounded-full object-cover mb-2 shadow" />
                                : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm text-gray-600">Click to upload photo</span><span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5 MB)</span></>}
                            {preview && <span className="text-xs text-gray-400 mt-1">{file?.name}</span>}
                        </label>
                        <input id="embd-ot-upload" type="file" accept="image/*" className="hidden" onChange={onFile} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value.replace(/[0-9]/g, "") })} placeholder="e.g. Dr. Anitha S" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.role} onChange={e => setNewForm({ ...newForm, role: e.target.value.replace(/[^a-zA-Z\s]/g, "") })} placeholder="e.g. COORDINATOR" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="flex items-center gap-3 pt-5">
                            <input type="checkbox" id="embd-ot-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="embd-ot-active" className="text-sm text-gray-700">Active</label>
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
                {items.length === 0 && <p className="col-span-full text-center text-gray-400 py-16">No committee members yet.</p>}
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
            fd.append("alt_text", altText || "EM Bio Diversity Gallery");
            fd.append("display_order", String(items.length));
            const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Uploaded"); setFile(null); setPreview(""); setAltText(""); load(); }
            else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this image? It will be permanently removed.")) return;
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
                <label htmlFor="embd-gallery-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors w-full min-h-[160px]">
                    {preview
                        ? <img src={preview} alt="" className="w-full object-cover rounded-lg max-h-[200px]" />
                        : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm font-medium text-gray-600">{file ? file.name : "Click to upload"}</span><span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5 MB)</span></>}
                    {preview && <span className="text-xs text-gray-400 mt-2 pb-2">{file?.name}</span>}
                </label>
                <input id="embd-gallery-upload" type="file" accept="image/jpeg,image/png,image/webp,image/jpg" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                        <input className="w-full border border-gray-300 rounded p-2 text-sm" value={altText} onChange={e => setAltText(e.target.value)} placeholder="e.g. Bio Diversity Park — Thanal" />
                    </div>
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
                {items.length === 0 && <p className="col-span-full text-center text-gray-400 py-16">No gallery images yet.</p>}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: CONTACT DETAILS
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
        if (newForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newForm.email)) { toast.error("Invalid email address"); return; }
        const r = await fetch(`${BASE}?type=contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newForm.name, email: newForm.email, phone: newForm.phone, is_active: newForm.is_active ? 1 : 0 }) });
        const d = await r.json();
        if (d.success) { toast.success("Contact added"); setNewForm({ name: "", email: "", phone: "", is_active: true }); setShowAdd(false); load(); }
        else toast.error(d.error || "Failed");
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value.replace(/[0-9]/g, "") })} placeholder="e.g. Dr. Anitha S" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.email} onChange={e => setNewForm({ ...newForm, email: e.target.value })} placeholder="e.g. anitha@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.phone} onChange={e => setNewForm({ ...newForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit phone number" />
                        </div>
                        <div className="flex items-center gap-3 pt-5">
                            <input type="checkbox" id="embd-contact-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="embd-contact-active" className="text-sm text-gray-700">Active</label>
                        </div>
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
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 w-24">Status</th>
                            <th className="px-4 py-3 w-28"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">
                                    {editingId === item.id
                                        ? <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.name ?? ""} onChange={e => setEditForm({ ...editForm, name: e.target.value.replace(/[0-9]/g, "") })} autoFocus />
                                        : item.name}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {editingId === item.id
                                        ? <input type="email" className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.email ?? ""} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                                        : item.email
                                            ? <a href={`mailto:${item.email}`} className="text-[#13432C] hover:underline flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{item.email}</a>
                                            : <span className="text-gray-400 text-xs">—</span>}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {editingId === item.id
                                        ? <input type="tel" className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.phone ?? ""} onChange={e => setEditForm({ ...editForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
                                        : item.phone
                                            ? <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{item.phone}</span>
                                            : <span className="text-gray-400 text-xs">—</span>}
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
