"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, ChevronUp, ChevronDown, Download, Star } from "lucide-react";

interface JournalIssue {
  id: number;
  volume: string;
  issue: string;
  year: string;
  title: string;
  pdf_url: string;
  cover_image: string;
  is_current: boolean;
  sort_order: number;
}

export default function IssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<JournalIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    volume: "", issue: "", year: "", title: "", pdf_url: "", cover_image: "", is_current: false,
  });
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/journals/issues");
      const data = await res.json();
      if (Array.isArray(data)) setIssues(data);
    } catch { toast.error("Failed to load"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ volume: "", issue: "", year: "", title: "", pdf_url: "", cover_image: "", is_current: false });
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (item: JournalIssue) => {
    setForm({
      volume: item.volume || "", issue: item.issue || "", year: item.year || "",
      title: item.title || "", pdf_url: item.pdf_url || "", cover_image: item.cover_image || "",
      is_current: !!item.is_current,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.volume || !form.issue || !form.year) { toast.error("Volume, issue, and year are required"); return; }
    try {
      const url = editingId ? `/api/journals/issues/${editingId}` : "/api/journals/issues";
      const method = editingId ? "PUT" : "POST";
      const body = { ...form, sort_order: editingId ? undefined : issues.length };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast.success(editingId ? "Updated!" : "Added!");
      resetForm();
      fetchData();
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this issue?")) return;
    try {
      const res = await fetch(`/api/journals/issues/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted!");
      fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "pdf_url" | "cover_image") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/journals/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) { setForm({ ...form, [field]: data.url }); toast.success("Uploaded!"); }
      else throw new Error(data.error);
    } catch (err: any) { toast.error(err?.message || "Upload failed"); }
    setUploading(false);
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= issues.length) return;
    const current = issues[index];
    const swap = issues[swapIndex];
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
        body: JSON.stringify({ table: "journal-issues", items: updates }),
      });
      if (!res.ok) throw new Error();
      fetchData();
    } catch { toast.error("Failed to reorder"); }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/sys-ops/master-data/journals")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journal Issues</h1>
            <p className="text-gray-600 text-sm">Manage journal volumes and issues</p>
          </div>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Issue
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{editingId ? "Edit" : "Add"} Issue</h2>
              <button onClick={resetForm}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Volume *</label>
                  <input value={form.volume} onChange={e => setForm({ ...form, volume: e.target.value })} placeholder="e.g. 17" className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Issue *</label>
                  <input value={form.issue} onChange={e => setForm({ ...form, issue: e.target.value })} placeholder="e.g. 1" className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year *</label>
                  <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="e.g. 2025" className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title (optional)</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Optional descriptive title" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PDF</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload PDF"}
                    <input type="file" accept=".pdf" onChange={e => handleFileUpload(e, "pdf_url")} className="hidden" />
                  </label>
                  {form.pdf_url && <input value={form.pdf_url} onChange={e => setForm({ ...form, pdf_url: e.target.value })} className="flex-1 border rounded-lg px-3 py-2 text-xs" />}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_current" checked={form.is_current} onChange={e => setForm({ ...form, is_current: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="is_current" className="text-sm font-medium">Mark as current issue</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editingId ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issues Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Volume/Issue</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Year</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">PDF</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {issues.map((item, i) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => handleReorder(i, "up")} disabled={i === 0} className={`p-0.5 rounded ${i === 0 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => handleReorder(i, "down")} disabled={i === issues.length - 1} className={`p-0.5 rounded ${i === issues.length - 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronDown className="w-4 h-4" /></button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">Vol. {item.volume}, Issue {item.issue}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.year}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.title || "—"}</td>
                <td className="px-4 py-3">
                  {item.pdf_url ? (
                    <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  ) : <span className="text-xs text-gray-400">No PDF</span>}
                </td>
                <td className="px-4 py-3">
                  {item.is_current ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600"><Star className="w-3.5 h-3.5 fill-amber-400" /> Current</span>
                  ) : <span className="text-xs text-gray-400">Archive</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {issues.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No issues found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
