"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Pencil, Trash2, Crown, X, Save } from "lucide-react";

interface President {
  id: number;
  year: string;
  president: string;
  secretary: string;
  treasurer: string;
  sort_order: number;
}

export default function AlumniPresidentsAdmin() {
  const router = useRouter();
  const [items, setItems] = useState<President[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<President | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/alumni/presidents");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]) }
  }, []);
  useEffect(() => { fetchItems().finally(() => setLoading(false)); }, [fetchItems]);

  const save = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      const { id, ...body } = modal;
      if (isNew) await fetch("/api/alumni/presidents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      else await fetch(`/api/alumni/presidents/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setModal(null); fetchItems();
    } finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this record?")) return;
    await fetch(`/api/alumni/presidents/${id}`, { method: "DELETE" }); fetchItems();
  };

  const setF = (k: string, v: string) => setModal(prev => prev ? { ...prev, [k]: v } : prev);

  if (loading) return <div className="flex items-center justify-center min-h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/sys-ops/master-data/alumni")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Crown className="w-6 h-6 text-rose-600" /> Alumni Presidents</h1>
            <p className="text-gray-500 text-sm">{items.length} records</p>
          </div>
        </div>
        <button onClick={() => { setModal({ id: 0, year: "", president: "", secretary: "", treasurer: "", sort_order: 0 }); setIsNew(true); }} className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition">
          <Plus className="w-4 h-4" /> Add Year
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{["Year","President","Secretary","Treasurer","Actions"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{item.year}</td>
                <td className="px-4 py-3 text-gray-700">{item.president || "—"}</td>
                <td className="px-4 py-3 text-gray-700">{item.secretary || "—"}</td>
                <td className="px-4 py-3 text-gray-700">{item.treasurer || "—"}</td>
                <td className="px-4 py-3"><div className="flex gap-2">
                  <button onClick={() => { setModal({ ...item }); setIsNew(false); }} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No records yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{isNew ? "Add Year" : "Edit Record"}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[["Year","year"],["President","president"],["Secretary","secretary"],["Treasurer","treasurer"]].map(([label,k]) => (
                <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input type="text" value={(modal as any)[k] || ""} onChange={e => setF(k, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" /></div>
              ))}
            </div>
            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
                <Save className="w-4 h-4" />{saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
