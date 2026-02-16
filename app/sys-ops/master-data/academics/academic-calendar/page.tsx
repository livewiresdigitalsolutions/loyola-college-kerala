"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, Download, FileText, ChevronUp, ChevronDown } from "lucide-react";

interface CalendarItem {
  id: number;
  academic_year: string;
  title: string;
  description: string;
  pdf_url: string;
  published_date: string;
  sort_order: number;
}

const defaultForm = {
  academic_year: "", title: "", description: "", pdf_url: "",
  published_date: new Date().toISOString().split("T")[0],
};

export default function AcademicCalendarManagement() {
  const router = useRouter();
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CalendarItem | null>(null);
  const [form, setForm] = useState(defaultForm);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/academics/academic-calendar");
      if (res.ok) setItems(await res.json());
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    const current = items[index];
    const swap = items[swapIndex];
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
        body: JSON.stringify({ table: "academic-calendar", items: updates }),
      });
      if (!res.ok) throw new Error();
      fetchData();
    } catch { toast.error("Failed to reorder"); }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/academics/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, pdf_url: url }));
      toast.success("PDF uploaded");
    } catch { toast.error("Upload failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/academics/academic-calendar/${editing.id}` : "/api/academics/academic-calendar";
      const method = editing ? "PUT" : "POST";
      const payload = { ...form, sort_order: editing?.sort_order ?? items.length };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Updated successfully" : "Calendar item added");
      setShowForm(false); setEditing(null); setForm(defaultForm);
      fetchData();
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this calendar item?")) return;
    try {
      const res = await fetch(`/api/academics/academic-calendar/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted"); fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const openEdit = (item: CalendarItem) => {
    setEditing(item);
    setForm({
      academic_year: item.academic_year, title: item.title,
      description: item.description || "", pdf_url: item.pdf_url || "",
      published_date: item.published_date ? item.published_date.split("T")[0] : new Date().toISOString().split("T")[0],
    });
    setShowForm(true);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/sys-ops/master-data/academics")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1><p className="text-gray-600 text-sm">Manage academic calendar documents ({items.length} items)</p></div>
        </div>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Calendar
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{editing ? "Edit" : "Add"} Calendar Item</h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Academic Year (e.g., 2025-2026)" value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2 border rounded-lg md:col-span-2" rows={3} />
            <input type="date" value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PDF Document</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                  <Upload className="w-4 h-4" /> Upload PDF
                  <input type="file" accept=".pdf,application/pdf" onChange={handlePdfUpload} className="hidden" />
                </label>
                {form.pdf_url && (
                  <a href={form.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <FileText className="w-4 h-4" /> View PDF
                  </a>
                )}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-2">
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
              <th className="text-left p-4 text-sm font-medium text-gray-600">Academic Year</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Title</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Published</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">PDF</th>
              <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex flex-col items-center gap-0.5">
                    <button onClick={() => handleReorder(i, "up")} disabled={i === 0} className={`p-0.5 rounded ${i === 0 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => handleReorder(i, "down")} disabled={i === items.length - 1} className={`p-0.5 rounded ${i === items.length - 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronDown className="w-4 h-4" /></button>
                  </div>
                </td>
                <td className="p-4"><span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">{item.academic_year}</span></td>
                <td className="p-4"><div className="font-medium">{item.title}</div>{item.description && <div className="text-xs text-gray-400 truncate max-w-xs">{item.description}</div>}</td>
                <td className="p-4 text-sm text-gray-500">{item.published_date ? new Date(item.published_date).toLocaleDateString() : "-"}</td>
                <td className="p-4">
                  {item.pdf_url ? (
                    <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><Download className="w-4 h-4" /> Download</a>
                  ) : <span className="text-gray-400 text-sm">No PDF</span>}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600 ml-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No calendar items yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
