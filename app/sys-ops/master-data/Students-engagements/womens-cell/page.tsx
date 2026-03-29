"use client";
import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Pencil, X, Check, Users, Image as ImageIcon, Mail, Phone, FileText, Calendar, Activity, BookOpen } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const LG = "#13432C", LGD = "#0f3324", BASE = "/api/students/womens-cell";
type Tab = "team" | "content" | "contact";

function Btn({ onClick, disabled, children, cls = "" }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode; cls?: string }) {
  return <button onClick={onClick} disabled={disabled} className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${cls}`} style={{ backgroundColor: LG }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = LGD)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = LG)}>{children}</button>;
}

interface TM { id: number; name: string; role: string; image_url: string; display_order: number; is_active: boolean; }
interface NewsItem { id: number; title: string; date: string; description: string; display_order: number; is_active: boolean; }
interface MediaItem { id: number; title: string; date?: string; subtitle?: string; description?: string; image_url: string; display_order: number; is_active: boolean; }
interface GalleryImg { id: number; image_url: string; alt_text: string; display_order: number; is_active: boolean; }
interface Report { id: number; title: string; file_url: string; display_order: number; is_active: boolean; }
interface TextItem { id: number; content: string; image_url?: string; display_order: number; is_active: boolean; }
interface ContactInfo { id: number; name: string; email: string; phone: string; is_active: boolean; }

function useCrud<T>(type: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { const r = await fetch(`${BASE}?type=${type}&all=true`); const d = await r.json(); if (d.success) setItems(d.data || []); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [type]);
  const del = async (id: number, label = "Delete?") => { if (!confirm(label)) return; const r = await fetch(`${BASE}?type=${type}&id=${id}`, { method: "DELETE" }); const d = await r.json(); if (d.success) { toast.success("Deleted"); load(); } else toast.error(d.error || "Failed"); };
  const toggle = async (item: any) => { const r = await fetch(`${BASE}?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) }); const d = await r.json(); if (d.success) { toast.success("Updated"); load(); } else toast.error(d.error || "Failed"); };
  const update = async (id: number, data: Record<string, any>) => { const r = await fetch(`${BASE}?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...data }) }); const d = await r.json(); if (d.success) { toast.success("Saved"); load(); return true; } else { toast.error(d.error || "Failed"); return false; } };
  const add = async (data: Record<string, any>) => { const r = await fetch(`${BASE}?type=${type}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const d = await r.json(); if (d.success) { toast.success("Added"); load(); return true; } else { toast.error(d.error || "Failed"); return false; } };
  return { items, loading, load, del, toggle, update, add };
}

// ── Team Tab ─────────────────────────────────────────────────────────────────
function TeamTab() {
  const { items, loading, load, del, toggle } = useCrud<TM>("team");
  const [showAdd, setShowAdd] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ name: "", role: "", display_order: 0 });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<TM>>({});

  const handleAdd = async () => {
    if (!file || !form.name.trim() || !form.role.trim()) { toast.error("Image, name and role required"); return; }
    const fd = new FormData(); fd.append("file", file); fd.append("type", "team");
    fd.append("name", form.name); fd.append("role", form.role); fd.append("display_order", String(form.display_order));
    const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd }); const d = await r.json();
    if (d.success) { toast.success("Added"); setShowAdd(false); setFile(null); setPreview(""); setForm({ name: "", role: "", display_order: 0 }); load(); } else toast.error(d.error || "Failed");
  };
  const saveEdit = async () => {
    if (!editId) return; const r = await fetch(`${BASE}?type=team`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...editForm }) });
    const d = await r.json(); if (d.success) { toast.success("Updated"); setEditId(null); load(); } else toast.error(d.error || "Failed");
  };
  if (loading) return <p className="text-gray-500 py-8">Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Btn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Member</Btn></div>
      {showAdd && (
        <div className="bg-white rounded-xl border p-6 space-y-4 shadow">
          <h2 className="font-bold text-lg">Add Committee Member</h2>
          <label htmlFor="wc-team-file" className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer">
            {preview ? <img src={preview} className="w-28 h-28 rounded-full object-cover mb-2" /> : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm text-gray-600">Upload photo (max 5MB)</span></>}
          </label>
          <input id="wc-team-file" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input className="w-full border rounded p-2 text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value.replace(/[0-9]/g, "") })} placeholder="Dr. Nisha Jolly Nelson" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Role *</label><input className="w-full border rounded p-2 text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value.replace(/[^a-zA-Z\s]/g, "") })} placeholder="COORDINATOR" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label><input type="number" className="w-full border rounded p-2 text-sm" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value || "0") })} /></div>
          </div>
          <div className="flex gap-3"><Btn onClick={handleAdd}>Save</Btn><button onClick={() => { setShowAdd(false); setFile(null); setPreview(""); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl border shadow overflow-hidden">
            <div className="flex justify-center pt-6 pb-2 bg-gray-50"><div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 ring-2 ring-white shadow"><img src={item.image_url || "/assets/defaultprofile.png"} className="w-full h-full object-cover" /></div></div>
            <div className="p-4">
              {editId === item.id ? (
                <div className="space-y-2">
                  <input className="w-full border rounded p-1.5 text-sm" value={editForm.name ?? ""} onChange={e => setEditForm({ ...editForm, name: e.target.value.replace(/[0-9]/g, "") })} placeholder="Name" />
                  <input className="w-full border rounded p-1.5 text-sm" value={editForm.role ?? ""} onChange={e => setEditForm({ ...editForm, role: e.target.value.replace(/[^a-zA-Z\s]/g, "") })} placeholder="Role" />
                  <div className="flex gap-2"><button onClick={saveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs"><Check className="w-3 h-3" /> Save</button><button onClick={() => setEditId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs"><X className="w-3 h-3" /> Cancel</button></div>
                </div>
              ) : (
                <>
                  <p className="font-semibold text-sm text-center" style={{ color: LG }}>{item.name}</p>
                  <p className="text-[10.5px] text-gray-400 uppercase tracking-wide text-center mt-0.5">{item.role}</p>
                  <div className="flex items-center justify-between mt-3">
                    <button onClick={() => toggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditId(item.id); setEditForm({ name: item.name, role: item.role }); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => del(item.id, "Delete this member?")} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
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

// ── Generic image+text section (Activities / Events) ─────────────────────────
function MediaSection({ type, label, hasDate }: { type: string; label: string; hasDate: boolean }) {
  const { items, loading, load, del, toggle } = useCrud<MediaItem>(type);
  const [showAdd, setShowAdd] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ title: "", date: "", subtitle: "", description: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<MediaItem>>({});

  const handleAdd = async () => {
    if (!file || !form.title.trim()) { toast.error("Image and title required"); return; }
    const fd = new FormData(); fd.append("file", file); fd.append("type", type);
    fd.append("title", form.title); fd.append("display_order", String(items.length));
    if (hasDate) fd.append("date", form.date); else fd.append("subtitle", form.subtitle);
    fd.append("description", form.description);
    const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd }); const d = await r.json();
    if (d.success) { toast.success("Added"); setShowAdd(false); setFile(null); setPreview(""); setForm({ title: "", date: "", subtitle: "", description: "" }); load(); } else toast.error(d.error || "Failed");
  };
  const saveEdit = async () => {
    if (!editId) return; const r = await fetch(`${BASE}?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...editForm }) });
    const d = await r.json(); if (d.success) { toast.success("Updated"); setEditId(null); load(); } else toast.error(d.error || "Failed");
  };
  if (loading) return <p className="text-gray-500 py-4">Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Btn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add {label}</Btn></div>
      {showAdd && (
        <div className="bg-white rounded-xl border p-6 space-y-4 shadow">
          <h2 className="font-bold text-lg">Add {label}</h2>
          <label htmlFor={`wc-${type}-file`} className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer">
            {preview ? <img src={preview} className="w-full max-h-[180px] object-cover rounded-lg" /> : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm text-gray-600">Upload image (max 5MB)</span></>}
          </label>
          <input id={`wc-${type}-file`} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input className="w-full border rounded p-2 text-sm" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            {hasDate ? <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input className="w-full border rounded p-2 text-sm" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="e.g. March 2025" /></div>
              : <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label><input className="w-full border rounded p-2 text-sm" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>}
            {hasDate && <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} className="w-full border rounded p-2 text-sm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>}
          </div>
          <div className="flex gap-3"><Btn onClick={handleAdd}>Save</Btn><button onClick={() => { setShowAdd(false); setFile(null); setPreview(""); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl border shadow p-5">
            {editId === item.id ? (
              <div className="space-y-3">
                <input className="w-full border rounded p-2 text-sm font-semibold" value={editForm.title ?? ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                {hasDate ? <><input className="w-full border rounded p-2 text-sm" value={editForm.date ?? ""} onChange={e => setEditForm({ ...editForm, date: e.target.value })} placeholder="Date" /><textarea rows={3} className="w-full border rounded p-2 text-sm" value={editForm.description ?? ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" /></>
                  : <input className="w-full border rounded p-2 text-sm" value={editForm.subtitle ?? ""} onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })} placeholder="Subtitle" />}
                <div className="flex gap-2"><button onClick={saveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm"><Check className="w-3.5 h-3.5" /> Save</button><button onClick={() => setEditId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm"><X className="w-3.5 h-3.5" /> Cancel</button></div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-[160px] h-[120px] rounded-lg overflow-hidden shrink-0 bg-gray-200"><img src={item.image_url} alt={item.title} className="w-full h-full object-cover" /></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                      <button onClick={() => { setEditId(item.id); setEditForm(hasDate ? { title: item.title, date: item.date, description: item.description } : { title: item.title, subtitle: item.subtitle }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => del(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  {hasDate && item.date && <p className="text-sm text-yellow-600 font-medium mb-1">{item.date}</p>}
                  {hasDate ? <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p> : <p className="text-sm text-gray-600">{item.subtitle}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 py-10">No {label.toLowerCase()} yet.</p>}
      </div>
    </div>
  );
}

// ── News Section ──────────────────────────────────────────────────────────────
function NewsSection() {
  const { items, loading, load, del, toggle } = useCrud<NewsItem>("news");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", description: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<NewsItem>>({});

  const handleAdd = async () => {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    const r = await fetch(`${BASE}?type=news`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: form.title, date: form.date, description: form.description, display_order: items.length, is_active: 1 }) });
    const d = await r.json(); if (d.success) { toast.success("Added"); setShowAdd(false); setForm({ title: "", date: "", description: "" }); load(); } else toast.error(d.error || "Failed");
  };
  const saveEdit = async () => {
    if (!editId) return; const r = await fetch(`${BASE}?type=news`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...editForm }) });
    const d = await r.json(); if (d.success) { toast.success("Updated"); setEditId(null); load(); } else toast.error(d.error || "Failed");
  };
  if (loading) return <p className="text-gray-500 py-4">Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Btn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Announcement</Btn></div>
      {showAdd && (
        <div className="bg-white rounded-xl border p-5 space-y-3 shadow">
          <h2 className="font-bold text-lg">Add Announcement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input className="w-full border rounded p-2 text-sm" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" className="w-full border rounded p-2 text-sm" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} className="w-full border rounded p-2 text-sm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div className="flex gap-3"><Btn onClick={handleAdd}>Save</Btn><button onClick={() => setShowAdd(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      <div className="bg-white rounded-xl border shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th><th className="text-left px-4 py-3 font-semibold text-gray-700 w-32">Date</th><th className="px-4 py-3 w-24 text-left font-semibold text-gray-700">Status</th><th className="px-4 py-3 w-24"></th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{editId === item.id ? <input className="w-full border rounded p-1.5 text-sm" value={editForm.title ?? ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} autoFocus /> : item.title}</td>
                <td className="px-4 py-3 text-gray-600">{editId === item.id ? <input type="date" className="w-full border rounded p-1.5 text-sm" value={editForm.date ?? ""} onChange={e => setEditForm({ ...editForm, date: e.target.value })} /> : item.date}</td>
                <td className="px-4 py-3"><button onClick={() => toggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button></td>
                <td className="px-4 py-3">{editId === item.id ? <div className="flex gap-2"><button onClick={saveEdit} className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs"><Check className="w-3 h-3" /> Save</button><button onClick={() => setEditId(null)} className="flex items-center gap-1 text-gray-500 px-2 py-1 rounded text-xs"><X className="w-3 h-3" /> Cancel</button></div> : <div className="flex gap-2"><button onClick={() => { setEditId(item.id); setEditForm({ title: item.title, date: item.date, description: item.description }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => del(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button></div>}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-gray-400">No announcements yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Admin Structure Section ───────────────────────────────────────────────────
function AdminStructureSection() {
  const { items, loading, load } = useCrud<TextItem>("admin-structure");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const current = items[0] || null;

  const handleUpload = async () => {
    if (!file) { toast.error("Select an image"); return; }
    setUploading(true);
    const fd = new FormData(); fd.append("file", file); fd.append("type", "admin-structure");
    if (current) fd.append("id", String(current.id));
    const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd }); const d = await r.json();
    setUploading(false);
    if (d.success) { toast.success("Updated"); setFile(null); setPreview(""); load(); } else toast.error(d.error || "Failed");
  };

  if (loading) return <p className="text-gray-500 py-4">Loading...</p>;
  return (
    <div className="space-y-4">
      {current && <div className="rounded-lg overflow-hidden bg-gray-100 max-w-xl"><img src={current.image_url} alt="Admin Structure" className="w-full h-auto object-contain" /></div>}
      <div className="bg-white rounded-xl border p-5 space-y-3 shadow max-w-xl">
        <label className="block text-sm font-medium text-gray-700">{current ? "Replace Image" : "Upload Image"}</label>
        <label htmlFor="wc-admin-struct-file" className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer">
          {preview ? <img src={preview} className="w-full max-h-[200px] object-contain rounded" /> : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm text-gray-600">Click to upload (max 5MB)</span></>}
        </label>
        <input id="wc-admin-struct-file" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
        <Btn onClick={handleUpload} disabled={uploading || !file}><Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload"}</Btn>
      </div>
    </div>
  );
}

// ── Complaint Response Section ─────────────────────────────────────────────────
function ComplaintResponseSection() {
  const { items, loading, load, del, toggle } = useCrud<TextItem>("complaint-response");
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleAdd = async () => {
    if (!newText.trim()) { toast.error("Text required"); return; }
    const r = await fetch(`${BASE}?type=complaint-response`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: newText.trim(), display_order: items.length, is_active: 1 }) });
    const d = await r.json(); if (d.success) { toast.success("Added"); setNewText(""); setShowAdd(false); load(); } else toast.error(d.error || "Failed");
  };
  const saveEdit = async () => {
    if (!editId) return; const r = await fetch(`${BASE}?type=complaint-response`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, content: editText }) });
    const d = await r.json(); if (d.success) { toast.success("Updated"); setEditId(null); load(); } else toast.error(d.error || "Failed");
  };
  if (loading) return <p className="text-gray-500 py-4">Loading...</p>;
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Manage the response/info shown in the "Register a Complaint" section.</p>
      <div className="flex justify-end"><Btn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Response</Btn></div>
      {showAdd && (
        <div className="bg-white rounded-xl border p-5 space-y-3 shadow">
          <textarea rows={4} className="w-full border rounded p-2 text-sm" value={newText} onChange={e => setNewText(e.target.value)} placeholder="Enter response text..." autoFocus />
          <div className="flex gap-3"><Btn onClick={handleAdd}>Save</Btn><button onClick={() => { setShowAdd(false); setNewText(""); }} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl border shadow p-5">
            {editId === item.id ? (
              <div className="space-y-3">
                <textarea rows={4} className="w-full border rounded p-2 text-sm" value={editText} onChange={e => setEditText(e.target.value)} autoFocus />
                <div className="flex gap-2"><button onClick={saveEdit} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm"><Check className="w-3.5 h-3.5" /> Save</button><button onClick={() => setEditId(null)} className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded text-sm"><X className="w-3.5 h-3.5" /> Cancel</button></div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
                  <button onClick={() => { setEditId(item.id); setEditText(item.content); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => del(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 py-10">No response text yet.</p>}
      </div>
    </div>
  );
}

// ── Reports Section ───────────────────────────────────────────────────────────
function ReportsSection() {
  const { items, loading, load, del, toggle } = useCrud<Report>("reports");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title.trim()) { toast.error("PDF and title required"); return; }
    setUploading(true);
    const fd = new FormData(); fd.append("file", file); fd.append("type", "reports"); fd.append("title", title); fd.append("display_order", String(items.length));
    const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd }); const d = await r.json();
    setUploading(false);
    if (d.success) { toast.success("Uploaded"); setFile(null); setTitle(""); load(); } else toast.error(d.error || "Failed");
  };

  if (loading) return <p className="text-gray-500 py-4">Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border p-5 space-y-3 shadow">
        <h3 className="font-semibold text-gray-800">Upload PDF Report</h3>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input className="w-full border rounded p-2 text-sm" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Women Cell Report – 2024" /></div>
        <label htmlFor="wc-report-file" className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer">
          <FileText className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm text-gray-600">{file ? file.name : "Click to upload PDF (max 20MB)"}</span>
        </label>
        <input id="wc-report-file" type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
        <Btn onClick={handleUpload} disabled={uploading || !file}><Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload"}</Btn>
      </div>
      <div className="bg-white rounded-xl border shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th><th className="text-left px-4 py-3 font-semibold text-gray-700 w-24">Status</th><th className="px-4 py-3 w-24"></th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-[#13432C] hover:underline flex items-center gap-2"><FileText className="w-4 h-4" />{item.title}</a></td>
                <td className="px-4 py-3"><button onClick={() => toggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button></td>
                <td className="px-4 py-3 text-right"><button onClick={() => del(item.id, "Delete this report? File will be permanently removed.")} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="text-center py-10 text-gray-400">No reports yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Gallery Section ───────────────────────────────────────────────────────────
function GallerySection() {
  const { items, loading, load, del, toggle } = useCrud<GalleryImg>("gallery");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) { toast.error("Select an image"); return; }
    setUploading(true);
    const fd = new FormData(); fd.append("file", file); fd.append("type", "gallery"); fd.append("alt_text", altText || "Women Cell Gallery"); fd.append("display_order", String(items.length));
    const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd }); const d = await r.json();
    setUploading(false);
    if (d.success) { toast.success("Uploaded"); setFile(null); setPreview(""); setAltText(""); load(); } else toast.error(d.error || "Failed");
  };

  if (loading) return <p className="text-gray-500 py-4">Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border p-5 space-y-3 shadow">
        <h3 className="font-semibold text-gray-800">Upload Gallery Image</h3>
        <label htmlFor="wc-gallery-file" className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer">
          {preview ? <img src={preview} className="w-full max-h-[200px] object-cover rounded" /> : <><Upload className="w-10 h-10 text-gray-400 mb-2" /><span className="text-sm text-gray-600">{file ? file.name : "Click to upload (max 5MB)"}</span></>}
        </label>
        <input id="wc-gallery-file" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
        <div className="flex gap-3 items-end">
          <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label><input className="w-full border rounded p-2 text-sm" value={altText} onChange={e => setAltText(e.target.value)} placeholder="e.g. Women's Day 2024" /></div>
          <Btn onClick={handleUpload} disabled={uploading || !file} cls="shrink-0"><Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload"}</Btn>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl border shadow overflow-hidden group">
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden"><img src={item.image_url} alt={item.alt_text} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
            <div className="p-2 flex items-center justify-between">
              <button onClick={() => toggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button>
              <button onClick={() => del(item.id, "Delete this image?")} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-center text-gray-400 py-16">No images yet.</p>}
      </div>
    </div>
  );
}

// ── Contact Section ───────────────────────────────────────────────────────────
function ContactSection() {
  const { items, loading, load, del, toggle } = useCrud<ContactInfo>("contact");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", is_active: true });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ContactInfo>>({});

  const handleAdd = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Invalid email"); return; }
    const r = await fetch(`${BASE}?type=contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, is_active: form.is_active ? 1 : 0 }) });
    const d = await r.json(); if (d.success) { toast.success("Added"); setShowAdd(false); setForm({ name: "", email: "", phone: "", is_active: true }); load(); } else toast.error(d.error || "Failed");
  };
  const saveEdit = async () => {
    if (!editId) return; const r = await fetch(`${BASE}?type=contact`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...editForm }) });
    const d = await r.json(); if (d.success) { toast.success("Updated"); setEditId(null); load(); } else toast.error(d.error || "Failed");
  };
  if (loading) return <p className="text-gray-500 py-4">Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Btn onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Contact</Btn></div>
      {showAdd && (
        <div className="bg-white rounded-xl border p-5 space-y-4 shadow">
          <h2 className="font-bold text-lg">Add Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input className="w-full border rounded p-2 text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value.replace(/[0-9]/g, "") })} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="w-full border rounded p-2 text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" className="w-full border rounded p-2 text-sm" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit" /></div>
          </div>
          <div className="flex gap-3"><Btn onClick={handleAdd}>Save</Btn><button onClick={() => setShowAdd(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      <div className="bg-white rounded-xl border shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th><th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th><th className="text-left px-4 py-3 font-semibold text-gray-700">Phone</th><th className="px-4 py-3 w-24 text-left font-semibold text-gray-700">Status</th><th className="px-4 py-3 w-24"></th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{editId === item.id ? <input className="w-full border rounded p-1.5 text-sm" value={editForm.name ?? ""} onChange={e => setEditForm({ ...editForm, name: e.target.value.replace(/[0-9]/g, "") })} autoFocus /> : item.name}</td>
                <td className="px-4 py-3 text-gray-600">{editId === item.id ? <input type="email" className="w-full border rounded p-1.5 text-sm" value={editForm.email ?? ""} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /> : item.email ? <a href={`mailto:${item.email}`} className="text-[#13432C] hover:underline flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{item.email}</a> : <span className="text-gray-400">—</span>}</td>
                <td className="px-4 py-3 text-gray-600">{editId === item.id ? <input type="tel" className="w-full border rounded p-1.5 text-sm" value={editForm.phone ?? ""} onChange={e => setEditForm({ ...editForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} /> : item.phone ? <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{item.phone}</span> : <span className="text-gray-400">—</span>}</td>
                <td className="px-4 py-3"><button onClick={() => toggle(item)} className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.is_active ? "Active" : "Inactive"}</button></td>
                <td className="px-4 py-3">{editId === item.id ? <div className="flex gap-2"><button onClick={saveEdit} className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs"><Check className="w-3 h-3" /> Save</button><button onClick={() => setEditId(null)} className="text-gray-500 px-2 py-1 rounded text-xs"><X className="w-3 h-3" /></button></div> : <div className="flex gap-2"><button onClick={() => { setEditId(item.id); setEditForm({ name: item.name, email: item.email, phone: item.phone }); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => del(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button></div>}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">No contacts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Section Heading helper ─────────────────────────────────────────────────────
function SH({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-200"><span style={{ color: LG }}>{icon}</span><h2 className="text-lg font-bold text-gray-800">{label}</h2></div>;
}

// ── Content Tab ───────────────────────────────────────────────────────────────
function ContentTab() {
  return (
    <div className="space-y-12">
      <section><SH icon={<ImageIcon className="w-5 h-5" />} label="Administrative Structure" /><AdminStructureSection /></section>
      <section><SH icon={<FileText className="w-5 h-5" />} label="Reports" /><ReportsSection /></section>
      <section><SH icon={<Calendar className="w-5 h-5" />} label="News / Announcements" /><NewsSection /></section>
      <section><SH icon={<Activity className="w-5 h-5" />} label="Activities" /><MediaSection type="activities" label="Activity" hasDate={true} /></section>
      <section><SH icon={<BookOpen className="w-5 h-5" />} label="Events" /><MediaSection type="events" label="Event" hasDate={false} /></section>
      <section><SH icon={<ImageIcon className="w-5 h-5" />} label="Gallery" /><GallerySection /></section>
      <section><SH icon={<Users className="w-5 h-5" />} label="Complaint Response Text" /><ComplaintResponseSection /></section>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WomensCellAdmin() {
  const [activeTab, setActiveTab] = useState<Tab>("team");
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "team", label: "Organizing Committee", icon: <Users className="w-4 h-4" /> },
    { id: "content", label: "Content & Gallery", icon: <Activity className="w-4 h-4" /> },
    { id: "contact", label: "Contact", icon: <Mail className="w-4 h-4" /> },
  ];
  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div><h1 className="text-3xl font-bold text-gray-900">Women's Cell Management</h1><p className="text-gray-600 mt-1">Manage committee, accordion content, gallery &amp; contact</p></div>
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap" style={activeTab === t.id ? { borderBottomColor: LG, color: LG } : { borderBottomColor: "transparent", color: "#6b7280" }}>{t.icon} {t.label}</button>)}
      </div>
      {activeTab === "team" && <TeamTab />}
      {activeTab === "content" && <ContentTab />}
      {activeTab === "contact" && <ContactSection />}
    </div>
  );
}
