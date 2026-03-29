// app/sys-ops/master-data/Students-engagements/college-union/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
    Trash2, Plus, Upload, Pencil, X, Check,
    Users, FileText, Activity, Image as ImageIcon, BookOpen,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const LG = "#13432C";
const LG_DARK = "#0f3324";
const BASE = "/api/students/college-union";

type Tab = "organizing-team" | "union-reports" | "accordion-activities" | "accordion-arts" | "gallery";

interface TeamMember { id: number; name: string; role: string; subtitle: string; image_url: string; is_advisor: boolean; display_order: number; is_active: boolean; }
interface Report { id: number; title: string; pdf_url: string; display_order: number; is_active: boolean; }
interface AccordionItem { id: number; title: string; content: string; section: string; display_order: number; is_active: boolean; }
interface OtherActivity { id: number; text: string; display_order: number; is_active: boolean; }
interface GalleryImg { id: number; image_url: string; alt_text: string; display_order: number; is_active: boolean; }

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

export default function CollegeUnionAdmin() {
    const [activeTab, setActiveTab] = useState<Tab>("organizing-team");

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "organizing-team", label: "Organizing Team", icon: <Users className="w-4 h-4" /> },
        { id: "union-reports", label: "Union Reports", icon: <FileText className="w-4 h-4" /> },
        { id: "accordion-activities", label: "Activities", icon: <Activity className="w-4 h-4" /> },
        { id: "accordion-arts", label: "Arts & Sports", icon: <BookOpen className="w-4 h-4" /> },
        { id: "gallery", label: "Gallery", icon: <ImageIcon className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">College Union Management</h1>
                <p className="text-gray-600 mt-1">Manage all College Union content — team, reports, accordions, and gallery</p>
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
            {activeTab === "union-reports" && <UnionReportsTab />}
            {activeTab === "accordion-activities" && <AccordionTab type="accordion-activities" label="Activities" sectionNote="Manage main activity items and 'Other Activities' bullet points." />}
            {activeTab === "accordion-arts" && <AccordionTab type="accordion-arts" label="Arts & Sports" sectionNote="Manage Arts Day and Sports Day sections." />}
            {activeTab === "gallery" && <GalleryTab />}
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
    const [newForm, setNewForm] = useState({ name: "", role: "", subtitle: "", is_advisor: false, display_order: 0, is_active: true });
    const fileRef = useRef<HTMLInputElement>(null);

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
            fd.append("subtitle", newForm.subtitle);
            fd.append("is_advisor", String(newForm.is_advisor));
            fd.append("display_order", String(newForm.display_order));
            fd.append("is_active", String(newForm.is_active));
            const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Member added"); setShowAdd(false); setFile(null); setPreview(""); setNewForm({ name: "", role: "", subtitle: "", is_advisor: false, display_order: 0, is_active: true }); load(); }
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
                <GreenBtn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Member</GreenBtn>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Team Member</h2>
                    <div>
                        <label htmlFor="cu-ot-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                            {preview
                                ? <img src={preview} alt="" className="w-28 h-28 rounded-full object-cover mb-2 shadow" />
                                : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm text-gray-600">Click to upload photo</span><span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5 MB)</span></>}
                            {preview && <span className="text-xs text-gray-400 mt-1">{file?.name}</span>}
                        </label>
                        <input id="cu-ot-upload" ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value.replace(/[0-9]/g, "") })} placeholder="e.g. Dr. Pramod S K" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.role} onChange={e => setNewForm({ ...newForm, role: e.target.value.replace(/[^a-zA-Z\s]/g, "") })} placeholder="e.g. COLLEGE UNION STAFF ADVISOR" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (optional)</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.subtitle} onChange={e => setNewForm({ ...newForm, subtitle: e.target.value })} placeholder="e.g. Assistant Professor, Psychology" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.display_order} onChange={e => setNewForm({ ...newForm, display_order: parseInt(e.target.value || "0") })} />
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                            <input type="checkbox" id="cu-ot-advisor" checked={newForm.is_advisor} onChange={e => setNewForm({ ...newForm, is_advisor: e.target.checked })} />
                            <label htmlFor="cu-ot-advisor" className="text-sm text-gray-700">Staff Advisor (displayed prominently)</label>
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                            <input type="checkbox" id="cu-ot-active" checked={newForm.is_active} onChange={e => setNewForm({ ...newForm, is_active: e.target.checked })} />
                            <label htmlFor="cu-ot-active" className="text-sm text-gray-700">Active</label>
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
                            <div className={`rounded-full overflow-hidden bg-gray-200 shadow ring-2 ring-white ${item.is_advisor ? "w-32 h-32" : "w-24 h-24"}`}>
                                <img src={item.image_url || "/assets/defaultprofile.png"} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="p-4">
                            {editingId === item.id ? (
                                <div className="space-y-2">
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.name ?? ""} onChange={e => setEditForm({ ...editForm, name: e.target.value.replace(/[0-9]/g, "") })} placeholder="Name" />
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.role ?? ""} onChange={e => setEditForm({ ...editForm, role: e.target.value.replace(/[^a-zA-Z\s]/g, "") })} placeholder="Role" />
                                    <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editForm.subtitle ?? ""} onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })} placeholder="Subtitle (optional)" />
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs"><Check className="w-3 h-3" /> Save</button>
                                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {item.is_advisor && <span className="text-[9px] uppercase tracking-widest font-bold bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full block text-center mb-2">Staff Advisor</span>}
                                    <p className="font-semibold text-sm text-center" style={{ color: LG }}>{item.name}</p>
                                    <p className="text-[10.5px] text-gray-400 uppercase tracking-wide text-center mt-0.5">{item.role}</p>
                                    {item.subtitle && <p className="text-[10px] text-gray-400 text-center mt-0.5">{item.subtitle}</p>}
                                    <div className="flex items-center justify-between mt-3">
                                        <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ name: item.name, role: item.role, subtitle: item.subtitle }); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
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
// TAB: UNION REPORTS
// ══════════════════════════════════════════════════════════════════════════════
function UnionReportsTab() {
    const [items, setItems] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const load = async () => {
        setLoading(true);
        try { const r = await fetch(`${BASE}?type=union-reports&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!file || !newTitle.trim()) { toast.error("Title and PDF required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("type", "union-reports");
            fd.append("title", newTitle);
            fd.append("display_order", String(items.length));
            const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) { toast.success("Report added"); setNewTitle(""); setFile(null); setShowAdd(false); load(); }
            else toast.error(d.error || "Failed");
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this report? The PDF will also be removed.")) return;
        const r = await fetch(`${BASE}?type=union-reports&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: Report) => {
        const r = await fetch(`${BASE}?type=union-reports`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editTitle.trim()) return;
        const r = await fetch(`${BASE}?type=union-reports`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, title: editTitle }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <GreenBtn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Report</GreenBtn>
            </div>

            {showAdd && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                    <h2 className="font-bold text-lg">Add Union Report</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Report Title *</label>
                        <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Union Report 2024-25" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PDF File *</label>
                        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                        {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
                    </div>
                    <div className="flex gap-3">
                        <GreenBtn onClick={handleAdd} disabled={uploading}><Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload & Save"}</GreenBtn>
                        <button onClick={() => { setShowAdd(false); setNewTitle(""); setFile(null); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 w-24">Status</th>
                            <th className="px-4 py-3 w-24"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-800">
                                    {editingId === item.id
                                        ? <input className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSaveEdit()} autoFocus />
                                        : <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline flex items-center gap-2"><FileText className="w-4 h-4" />{item.title}</a>}
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
                                            <button onClick={() => { setEditingId(item.id); setEditTitle(item.title); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan={3} className="text-center py-12 text-gray-400">No reports yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: ACCORDION (Activities OR Arts & Sports)
// ══════════════════════════════════════════════════════════════════════════════
function AccordionTab({ type, label, sectionNote }: { type: "accordion-activities" | "accordion-arts"; label: string; sectionNote: string }) {
    const [items, setItems] = useState<AccordionItem[]>([]);
    const [otherItems, setOtherItems] = useState<OtherActivity[]>([]); // only for activities
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showAddOther, setShowAddOther] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingOtherId, setEditingOtherId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<AccordionItem>>({});
    const [editOtherText, setEditOtherText] = useState("");
    const [newForm, setNewForm] = useState({ title: "", content: "" });
    const [newOtherText, setNewOtherText] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${BASE}?type=${type}&all=true`);
            const d = await r.json();
            if (d.success) setItems(d.data || []);
            if (type === "accordion-activities") {
                const r2 = await fetch(`${BASE}?type=accordion-other&all=true`);
                const d2 = await r2.json();
                if (d2.success) setOtherItems(d2.data || []);
            }
        } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, [type]);

    const handleAdd = async () => {
        if (!newForm.title.trim() || !newForm.content.trim()) { toast.error("Title and content required"); return; }
        const r = await fetch(`${BASE}?type=${type}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: newForm.title, content: newForm.content, display_order: items.length, is_active: 1 }) });
        const d = await r.json();
        if (d.success) { toast.success("Item added"); setNewForm({ title: "", content: "" }); setShowAdd(false); load(); }
        else toast.error(d.error || "Failed");
    };

    const handleAddOther = async () => {
        if (!newOtherText.trim()) { toast.error("Text required"); return; }
        const r = await fetch(`${BASE}?type=accordion-other`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: newOtherText.trim(), display_order: otherItems.length, is_active: 1 }) });
        const d = await r.json();
        if (d.success) { toast.success("Added"); setNewOtherText(""); setShowAddOther(false); load(); }
        else toast.error(d.error || "Failed");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this item?")) return;
        const r = await fetch(`${BASE}?type=${type}&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleDeleteOther = async (id: number) => {
        if (!confirm("Delete this item?")) return;
        const r = await fetch(`${BASE}?type=accordion-other&id=${id}`, { method: "DELETE" });
        const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed");
    };

    const handleToggle = async (item: AccordionItem) => {
        const r = await fetch(`${BASE}?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        const r = await fetch(`${BASE}?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...editForm }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingId(null); load(); } else toast.error(d.error || "Failed");
    };

    const handleSaveEditOther = async () => {
        if (!editingOtherId) return;
        const r = await fetch(`${BASE}?type=accordion-other`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingOtherId, text: editOtherText }) });
        const d = await r.json(); if (d.success) { toast.success("Updated"); setEditingOtherId(null); load(); } else toast.error(d.error || "Failed");
    };

    if (loading) return <p className="text-gray-500 py-8">Loading...</p>;

    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-500">{sectionNote}</p>

            {/* Main items */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-gray-800">{label} Items</h2>
                    <GreenBtn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Item</GreenBtn>
                </div>

                {showAdd && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4">
                        <h3 className="font-bold text-lg">Add {label} Item</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })} placeholder="Section title" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                            <textarea rows={6} className="w-full border border-gray-300 rounded p-2 text-sm" value={newForm.content} onChange={e => setNewForm({ ...newForm, content: e.target.value })} placeholder="Section body text..." />
                        </div>
                        <div className="flex gap-3">
                            <GreenBtn onClick={handleAdd}>Save</GreenBtn>
                            <button onClick={() => { setShowAdd(false); setNewForm({ title: "", content: "" }); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {items.map(item => (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow p-5">
                            {editingId === item.id ? (
                                <div className="space-y-3">
                                    <input className="w-full border border-gray-300 rounded p-2 text-sm font-semibold" value={editForm.title ?? ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                                    <textarea rows={6} className="w-full border border-gray-300 rounded p-2 text-sm" value={editForm.content ?? ""} onChange={e => setEditForm({ ...editForm, content: e.target.value })} />
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm"><Check className="w-3.5 h-3.5" /> Save</button>
                                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm"><X className="w-3.5 h-3.5" /> Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleToggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                                            <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title, content: item.content }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm line-clamp-3">{item.content}</p>
                                </>
                            )}
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-center text-gray-400 py-8">No items yet.</p>}
                </div>
            </div>

            {/* Other Activities (only for Activities tab) */}
            {type === "accordion-activities" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-gray-800">Other Activities (Bullet Points)</h2>
                        <GreenBtn onClick={() => setShowAddOther(true)}><Plus className="w-4 h-4" /> Add Item</GreenBtn>
                    </div>

                    {showAddOther && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow p-4 space-y-3">
                            <textarea rows={2} className="w-full border border-gray-300 rounded p-2 text-sm" value={newOtherText} onChange={e => setNewOtherText(e.target.value)} placeholder="e.g. Republic Day Observance" />
                            <div className="flex gap-3">
                                <GreenBtn onClick={handleAddOther}>Save</GreenBtn>
                                <button onClick={() => { setShowAddOther(false); setNewOtherText(""); }} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Activity Text</th>
                                    <th className="px-4 py-3 w-24"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {otherItems.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-700">
                                            {editingOtherId === item.id
                                                ? <textarea rows={2} className="w-full border border-gray-300 rounded p-1.5 text-sm" value={editOtherText} onChange={e => setEditOtherText(e.target.value)} autoFocus />
                                                : item.text}
                                        </td>
                                        <td className="px-4 py-3">
                                            {editingOtherId === item.id ? (
                                                <div className="flex gap-2">
                                                    <button onClick={handleSaveEditOther} className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs"><Check className="w-3 h-3" /> Save</button>
                                                    <button onClick={() => setEditingOtherId(null)} className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded text-xs"><X className="w-3 h-3" /> Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setEditingOtherId(item.id); setEditOtherText(item.text); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => handleDeleteOther(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {otherItems.length === 0 && <tr><td colSpan={2} className="text-center py-8 text-gray-400">No other activities yet.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
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
            fd.append("alt_text", altText || "College Union Gallery");
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
                <label htmlFor="cu-gallery-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors w-full min-h-[160px]">
                    {preview
                        ? <img src={preview} alt="" className="w-full object-cover rounded-lg max-h-[200px]" />
                        : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm font-medium text-gray-600">{file ? file.name : "Click to upload"}</span><span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5 MB)</span></>}
                    {preview && <span className="text-xs text-gray-400 mt-2 pb-2">{file?.name}</span>}
                </label>
                <input id="cu-gallery-upload" type="file" accept="image/jpeg,image/png,image/webp,image/jpg" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                        <input className="w-full border border-gray-300 rounded p-2 text-sm" value={altText} onChange={e => setAltText(e.target.value)} placeholder="e.g. College Union Inauguration 2024" />
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
                {items.length === 0 && <p className="col-span-full text-center text-gray-400 py-16">No images yet.</p>}
            </div>
        </div>
    );
}
