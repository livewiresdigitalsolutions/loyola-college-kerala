// app/sys-ops/master-data/les/counselors/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Counselor {
  id: number;
  name: string;
  specialization: string;
  image: string;
}

export default function LesCounselorsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", specialization: "", image: "" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/les/counselors");
      if (res.ok) {
        const data = await res.json();
        setItems(data.counselors || data);
      }
    } catch { toast.error("Failed to load counselors"); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    try {
      const res = await fetch("/api/les/counselors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { toast.success("Counselor added"); setFormData({ name: "", specialization: "", image: "" }); setIsAdding(false); fetchItems(); }
      else toast.error("Failed to add");
    } catch { toast.error("Error adding counselor"); }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    try {
      const res = await fetch(`/api/les/counselors/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { toast.success("Updated"); setEditingId(null); setFormData({ name: "", specialization: "", image: "" }); fetchItems(); }
      else toast.error("Failed to update");
    } catch { toast.error("Error updating"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this counselor?")) return;
    try {
      const res = await fetch(`/api/les/counselors/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Deleted"); fetchItems(); } else toast.error("Failed to delete");
    } catch { toast.error("Error deleting"); }
  };

  const startEdit = (item: Counselor) => { setEditingId(item.id); setFormData({ name: item.name, specialization: item.specialization || "", image: item.image || "" }); setIsAdding(false); };
  const cancelEdit = () => { setEditingId(null); setIsAdding(false); setFormData({ name: "", specialization: "", image: "" }); };

  const renderForm = (onSave: () => void) => (
    <div className="flex flex-col gap-3">
      <input type="text" placeholder="Counselor name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
      <input type="text" placeholder="Specialization" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
      <input type="text" placeholder="Image URL (optional)" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
      <div className="flex gap-3">
        <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save className="w-4 h-4" />Save</button>
        <button onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"><X className="w-4 h-4" />Cancel</button>
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <div><h1 className="text-3xl font-bold text-gray-900">LES Counselors</h1><p className="text-gray-600 mt-1">Manage counselors and their specializations</p></div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: "", specialization: "", image: "" }); }} className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"><Plus className="w-4 h-4" />Add Counselor</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {isAdding && (<div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"><h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Counselor</h3>{renderForm(handleAdd)}</div>)}
          {loading ? (<div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div></div>)
          : items.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500">No counselors found</p></div>)
          : (<div className="space-y-3">{items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              {editingId === item.id ? (<div className="flex-1">{renderForm(() => handleUpdate(item.id))}</div>) : (<>
                <div className="flex items-center gap-4">
                  <img src={item.image || "/assets/defaultprofile.png"} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  <div><p className="font-semibold text-gray-900">{item.name}</p><p className="text-sm text-gray-500">{item.specialization}</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Edit2 className="w-4 h-4" />Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" />Delete</button>
                </div>
              </>)}
            </div>
          ))}</div>)}
        </div>
      </div>
    </>
  );
}
