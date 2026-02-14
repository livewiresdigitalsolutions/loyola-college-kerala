"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, ChevronUp, ChevronDown } from "lucide-react";

interface BoardMember {
  id: number;
  name: string;
  role: string;
  designation: string;
  affiliation: string;
  email: string;
  phone: string;
  image: string;
  category: string;
  sort_order: number;
}

export default function BoardMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", role: "", designation: "", affiliation: "",
    email: "", phone: "", image: "", category: "editorial",
  });
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/journals/board-members");
      const data = await res.json();
      if (Array.isArray(data)) setMembers(data);
    } catch { toast.error("Failed to load"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ name: "", role: "", designation: "", affiliation: "", email: "", phone: "", image: "", category: "editorial" });
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (m: BoardMember) => {
    setForm({
      name: m.name || "", role: m.role || "", designation: m.designation || "",
      affiliation: m.affiliation || "", email: m.email || "", phone: m.phone || "",
      image: m.image || "", category: m.category || "editorial",
    });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("Name is required"); return; }
    try {
      const url = editingId ? `/api/journals/board-members/${editingId}` : "/api/journals/board-members";
      const method = editingId ? "PUT" : "POST";
      const body = { ...form, sort_order: editingId ? undefined : members.length };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast.success(editingId ? "Updated!" : "Added!");
      resetForm();
      fetchData();
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this board member?")) return;
    try {
      const res = await fetch(`/api/journals/board-members/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted!");
      fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/journals/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) { setForm({ ...form, image: data.url }); toast.success("Image uploaded!"); }
      else throw new Error();
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const filtered = filteredMembers;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= filtered.length) return;
    const current = filtered[index];
    const swap = filtered[swapIndex];
    const updates = [
      { id: current.id, sort_order: swap.sort_order },
      { id: swap.id, sort_order: current.sort_order },
    ];
    if (current.sort_order === swap.sort_order) {
      updates[0].sort_order = swapIndex;
      updates[1].sort_order = index;
    }
    try {
      const res = await fetch("/api/academics/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "journal-board-members", items: updates }),
      });
      if (!res.ok) throw new Error();
      fetchData();
    } catch { toast.error("Failed to reorder"); }
  };

  const filteredMembers = filterCategory === "all" ? members : members.filter(m => m.category === filterCategory);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/sys-ops/master-data/journals")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Board Members</h1>
            <p className="text-gray-600 text-sm">Manage editorial and advisory board members</p>
          </div>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[{ key: "all", label: "All" }, { key: "editorial", label: "Editorial" }, { key: "board", label: "Board" }].map(tab => (
          <button key={tab.key} onClick={() => setFilterCategory(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterCategory === tab.key ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >{tab.label}</button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{editingId ? "Edit" : "Add"} Board Member</h2>
              <button onClick={resetForm}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Editor In Chief" className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                    <option value="editorial">Editorial</option>
                    <option value="board">Board Member</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Designation</label>
                <input value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Affiliation</label>
                <input value={form.affiliation} onChange={e => setForm({ ...form, affiliation: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Photo</label>
                <div className="flex items-center gap-3">
                  {form.image && <Image src={form.image} alt="" width={48} height={48} className="w-12 h-12 rounded-full object-cover" />}
                  <label className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {form.image && <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="flex-1 border rounded-lg px-3 py-2 text-xs" />}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editingId ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Member</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredMembers.map((m, i) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => handleReorder(i, "up")} disabled={i === 0} className={`p-0.5 rounded ${i === 0 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => handleReorder(i, "down")} disabled={i === filteredMembers.length - 1} className={`p-0.5 rounded ${i === filteredMembers.length - 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronDown className="w-4 h-4" /></button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {m.image ? <Image src={m.image} alt={m.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">{m.name?.charAt(0)}</div>}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.designation}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.role}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-full ${m.category === "editorial" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{m.category}</span></td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.email}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(m)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(m.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No board members found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
