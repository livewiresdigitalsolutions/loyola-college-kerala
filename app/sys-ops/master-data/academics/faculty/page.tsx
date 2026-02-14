"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, ChevronUp, ChevronDown } from "lucide-react";

interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  phone: string;
  image: string;
  department: string;
  category: string;
  sort_order: number;
}

const defaultForm = {
  name: "", designation: "", qualification: "", specialization: "",
  email: "", phone: "", image: "/assets/defaultprofile.png",
  department: "", category: "Teaching",
};

export default function FacultyManagement() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FacultyMember | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [filterDept, setFilterDept] = useState("All");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/academics/faculty");
      if (res.ok) setFaculty(await res.json());
    } catch { toast.error("Failed to load faculty"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const departments = ["All", ...Array.from(new Set(faculty.map((f) => f.department).filter(Boolean)))] as string[];
  const filtered = filterDept === "All" ? faculty : faculty.filter((f) => f.department === filterDept);

  const handleReorder = async (index: number, direction: "up" | "down") => {
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
        body: JSON.stringify({ table: "faculty", items: updates }),
      });
      if (!res.ok) throw new Error();
      fetchData();
    } catch { toast.error("Failed to reorder"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/academics/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/academics/faculty/${editing.id}` : "/api/academics/faculty";
      const method = editing ? "PUT" : "POST";
      const payload = { ...form, sort_order: editing?.sort_order ?? faculty.length };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Faculty updated" : "Faculty added");
      setShowForm(false); setEditing(null); setForm(defaultForm);
      fetchData();
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this faculty member?")) return;
    try {
      const res = await fetch(`/api/academics/faculty/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted"); fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const openEdit = (f: FacultyMember) => {
    setEditing(f);
    setForm({ name: f.name, designation: f.designation, qualification: f.qualification || "", specialization: f.specialization || "", email: f.email || "", phone: f.phone || "", image: f.image || "/assets/defaultprofile.png", department: f.department || "", category: f.category || "Teaching" });
    setShowForm(true);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/sys-ops/master-data/academics")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-gray-900">Faculty & Staffs</h1><p className="text-gray-600 text-sm">Manage faculty members ({faculty.length} total)</p></div>
        </div>
      </div>

      {/* Filters + Add */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {departments.length > 2 && (
          <div className="flex gap-2 flex-wrap">
            {departments.map((d) => (
              <button key={d} onClick={() => setFilterDept(d)} className={`px-3 py-1.5 rounded-lg text-sm ${filterDept === d ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}>{d}</button>
            ))}
          </div>
        )}
        <button onClick={() => { setEditing(null); setForm(defaultForm); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Faculty
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{editing ? "Edit" : "Add"} Faculty Member</h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input required placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border rounded-lg">
              <option value="Teaching">Teaching</option>
              <option value="Non-Teaching">Non-Teaching</option>
            </select>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border"><Image src={form.image} alt="Preview" fill className="object-cover" /></div>
                <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"><Upload className="w-4 h-4" /> Upload<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
              </div>
            </div>
            <div className="lg:col-span-3 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editing ? "Update" : "Add"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-600 w-16">Order</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Image</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Name</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Designation</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Department</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Category</th>
              <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr key={f.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex flex-col items-center gap-0.5">
                    <button onClick={() => handleReorder(i, "up")} disabled={i === 0} className={`p-0.5 rounded ${i === 0 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => handleReorder(i, "down")} disabled={i === filtered.length - 1} className={`p-0.5 rounded ${i === filtered.length - 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronDown className="w-4 h-4" /></button>
                  </div>
                </td>
                <td className="p-4"><div className="relative w-10 h-10 rounded-full overflow-hidden"><Image src={f.image || "/assets/defaultprofile.png"} alt={f.name} fill className="object-cover" /></div></td>
                <td className="p-4"><div className="font-medium">{f.name}</div><div className="text-xs text-gray-400">{f.qualification}</div></td>
                <td className="p-4 text-sm text-gray-600">{f.designation}</td>
                <td className="p-4 text-sm text-gray-500">{f.department || "-"}</td>
                <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${f.category === "Teaching" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>{f.category}</span></td>
                <td className="p-4 text-right">
                  <button onClick={() => openEdit(f)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(f.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600 ml-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No faculty members found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
