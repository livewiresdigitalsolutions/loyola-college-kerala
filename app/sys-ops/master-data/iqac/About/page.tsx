// app/sys-ops/master-data/iqac/About/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Plus, Upload, Pencil, X, Check, User, Users } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Coordinator { id: number; name: string; role: string; image_url: string; display_order: number; is_active: boolean; }
interface Member { id: number; role: string; name: string; department?: string; category?: string; display_order: number; is_active: boolean; }

type Tab = "coordinators" | "members";
const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "coordinators", label: "Coordinator Photos", icon: User },
    { key: "members", label: "IQAC Members", icon: Users },
];

const API = (type: string, extras = "") => `/api/iqac/About?type=${type}${extras}`;

function useData<T>(type: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const refresh = async () => {
        setLoading(true);
        try {
            const r = await fetch(API(type, "&includeInactive=true"));
            const d = await r.json();
            if (d.success) setData(d.data || []);
            else toast.error(d.error || "Failed to load");
        } catch { toast.error("Failed to load"); }
        finally { setLoading(false); }
    };
    useEffect(() => { refresh(); }, []);
    return { data, loading, refresh };
}

function StatusBadge({ active, onToggle }: { active: boolean; onToggle: () => void }) {
    return (
        <button onClick={onToggle} className={`text-xs px-2 py-1 rounded-full ${active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {active ? "Active" : "Inactive"}
        </button>
    );
}

// ─── Coordinators Tab ─────────────────────────────────────────────────────────
function CoordinatorsTab() {
    const { data: coords, loading, refresh } = useData<Coordinator>("coordinators");
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({ name: "", role: "", display_order: "0", is_active: true });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!f.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
        if (f.size > 5 * 1024 * 1024) { toast.error("Max file size is 5MB"); return; }
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleUpload = async () => {
        if (!file || !form.name) { toast.error("Photo and name are required"); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("name", form.name);
            fd.append("role", form.role);
            fd.append("display_order", form.display_order);
            fd.append("is_active", form.is_active.toString());
            const r = await fetch("/api/iqac/About/upload", { method: "POST", body: fd });
            const d = await r.json();
            if (d.success) {
                toast.success("Coordinator uploaded");
                setShowForm(false); setFile(null); setPreview("");
                setForm({ name: "", role: "", display_order: "0", is_active: true });
                refresh();
            } else toast.error(d.error || "Upload failed");
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this coordinator photo?")) return;
        try {
            const r = await fetch(`/api/iqac/About?type=coordinators&id=${id}`, { method: "DELETE" });
            const d = await r.json();
            if (d.success) { toast.success("Deleted"); refresh(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed to delete"); }
    };

    const handleToggle = async (id: number, current: boolean) => {
        try {
            await fetch(API("coordinators"), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_active: !current }) });
            refresh();
        } catch { toast.error("Failed"); }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{coords.length} coordinator(s)</p>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]">
                    <Plus className="w-4 h-4" /> Add Coordinator
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-5">
                    <h3 className="font-bold mb-4">Upload Coordinator Photo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* File Upload */}
                        <div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-[#342D87] transition-colors">
                                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="coord-upload" />
                                <label htmlFor="coord-upload" className="cursor-pointer flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Click to select photo</span>
                                    <span className="text-xs text-gray-400">Max 5MB · JPG, PNG, WebP</span>
                                </label>
                            </div>
                            {preview && (
                                <div className="mt-3 flex justify-center">
                                    <div className="relative w-28 h-36 overflow-hidden rounded shadow">
                                        <Image src={preview} alt="Preview" fill className="object-cover object-top" />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Fields */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                                <input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" placeholder="e.g. Fr. Biju SJ" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Role / Designation</label>
                                <input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" placeholder="e.g. IQAC Coordinator" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Display Order</label>
                                <input type="number" className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="coord_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                                <label htmlFor="coord_active" className="text-sm text-gray-700">Active</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleUpload} disabled={uploading || !file || !form.name} className="flex items-center gap-2 bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">
                            {uploading ? "Uploading..." : <><Upload className="w-4 h-4" /> Upload</>}
                        </button>
                        <button onClick={() => { setShowForm(false); setFile(null); setPreview(""); }} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            {/* Grid of coordinator photos */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />)}
                </div>
            ) : coords.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No coordinator photos yet.</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {coords.map(c => (
                        <div key={c.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="relative h-40 bg-gray-100">
                                <Image src={c.image_url} alt={c.name} fill className="object-cover object-top" />
                            </div>
                            <div className="p-3">
                                <p className="font-semibold text-sm text-gray-900 leading-tight">{c.name}</p>
                                {c.role && <p className="text-xs text-gray-500 mt-0.5">{c.role}</p>}
                                <div className="flex items-center justify-between mt-2">
                                    <StatusBadge active={c.is_active} onToggle={() => handleToggle(c.id, c.is_active)} />
                                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Members Tab ──────────────────────────────────────────────────────────────
const MEMBER_CATEGORIES = [
    { value: "general", label: "Management / Key Roles" },
    { value: "arts", label: "Member of the Dept. of Arts" },
    { value: "science", label: "Member of the Dept. of Science" },
    { value: "admin", label: "Administrative Expert" },
    { value: "alumni", label: "Alumni" },
    { value: "student", label: "Student Representative" },
    { value: "local", label: "Local Society Representative" },
    { value: "industry", label: "Industry / Employer" },
];

function MembersTab() {
    const { data: members, loading, refresh } = useData<Member>("members");
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Member>>({});
    const [form, setForm] = useState({ role: "", name: "", department: "", category: "general", display_order: "0", is_active: true });

    const handleAdd = async () => {
        if (!form.name) { toast.error("Name is required"); return; }
        setSaving(true);
        try {
            const r = await fetch(API("members"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, display_order: parseInt(form.display_order) }) });
            const d = await r.json();
            if (d.success) { toast.success("Member added"); setShowForm(false); setForm({ role: "", name: "", department: "", category: "general", display_order: "0", is_active: true }); refresh(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed"); }
        finally { setSaving(false); }
    };

    const handleUpdate = async (id: number) => {
        try {
            const r = await fetch(API("members"), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...editForm }) });
            const d = await r.json();
            if (d.success) { toast.success("Updated"); setEditingId(null); refresh(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed"); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this member?")) return;
        try {
            const r = await fetch(`/api/iqac/About?type=members&id=${id}`, { method: "DELETE" });
            const d = await r.json();
            if (d.success) { toast.success("Deleted"); refresh(); }
            else toast.error(d.error || "Failed");
        } catch { toast.error("Failed"); }
    };

    const handleToggle = async (id: number, current: boolean) => {
        try {
            await fetch(API("members"), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_active: !current }) });
            refresh();
        } catch { toast.error("Failed"); }
    };

    // Group members by category for display
    const grouped = MEMBER_CATEGORIES.map(cat => ({
        ...cat,
        items: members.filter(m => (m.category || "general") === cat.value),
    })).filter(g => g.items.length > 0 || showForm);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{members.length} member(s)</p>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a2470]">
                    <Plus className="w-4 h-4" /> Add Member
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-5">
                    <h3 className="font-bold mb-4">Add IQAC Member</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                            <input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" placeholder="e.g. Dr. George Thomas SJ" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Role / Position</label>
                            <input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" placeholder="e.g. Chairperson" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Department / Designation</label>
                            <input className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" placeholder="e.g. Principal" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                            <select className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                {MEMBER_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Display Order</label>
                            <input type="number" className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#342D87]" value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" id="mem_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                            <label htmlFor="mem_active" className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleAdd} disabled={saving} className="bg-[#342D87] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? "Saving..." : "Add Member"}</button>
                        <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="rounded-xl border border-gray-200 overflow-hidden"><div className="text-center py-12 text-gray-400">Loading...</div></div>
            ) : members.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No members yet. Add your first member above.</div>
            ) : (
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Department</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Order</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {members.map(m => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium max-w-[180px]">
                                        {editingId === m.id
                                            ? <input className="w-full border rounded px-2 py-1 text-sm" value={editForm.name ?? m.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                            : m.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 max-w-[140px]">
                                        {editingId === m.id
                                            ? <input className="w-full border rounded px-2 py-1 text-sm" value={editForm.role ?? m.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} />
                                            : (m.role || "—")}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 max-w-[180px] text-xs">
                                        {editingId === m.id
                                            ? <input className="w-full border rounded px-2 py-1 text-sm" value={editForm.department ?? m.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} />
                                            : (m.department || "—")}
                                    </td>
                                    <td className="px-4 py-3 text-xs">
                                        {editingId === m.id
                                            ? <select className="border rounded px-2 py-1 text-sm" value={editForm.category ?? m.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                                                {MEMBER_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                            </select>
                                            : <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{MEMBER_CATEGORIES.find(c => c.value === (m.category || "general"))?.label || m.category}</span>}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{m.display_order}</td>
                                    <td className="px-4 py-3"><StatusBadge active={m.is_active} onToggle={() => handleToggle(m.id, m.is_active)} /></td>
                                    <td className="px-4 py-3">
                                        {editingId === m.id
                                            ? <div className="flex gap-1">
                                                <button onClick={() => handleUpdate(m.id)} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs"><Check className="w-3 h-3" /> Save</button>
                                                <button onClick={() => setEditingId(null)} className="bg-gray-200 px-3 py-1 rounded text-xs"><X className="w-3 h-3" /></button>
                                            </div>
                                            : <div className="flex gap-2">
                                                <button onClick={() => { setEditingId(m.id); setEditForm(m); }} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                            </div>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AboutAdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>("coordinators");
    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <div>
                <h1 className="text-3xl font-bold text-gray-900">IQAC — Coordinator & Members</h1>
                <p className="text-gray-600 mt-1">Manage coordinator photos and IQAC member details</p>
            </div>
            <div className="border-b border-gray-200">
                <nav className="flex gap-0 overflow-x-auto">
                    {TABS.map(({ key, label, icon: Icon }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === key ? "border-[#342D87] text-[#342D87] bg-indigo-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                            <Icon className="w-4 h-4" />{label}
                        </button>
                    ))}
                </nav>
            </div>
            {activeTab === "coordinators" && <CoordinatorsTab />}
            {activeTab === "members" && <MembersTab />}
        </div>
    );
}
