// app/sys-ops/master-data/les/partners/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface Partner {
  id: number;
  name: string;
  location: string;
  logo: string;
}

export default function LesPartnersPage() {
  const router = useRouter();
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", location: "", logo: "" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/les/partners");
      if (res.ok) setItems(await res.json());
    } catch { toast.error("Failed to load partners"); }
    finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/les/upload", { method: "POST", body });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, logo: data.url }));
        toast.success("Logo uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch { toast.error("Error uploading logo"); }
    finally { setUploading(false); }
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    try {
      const res = await fetch("/api/les/partners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { toast.success("Partner added"); setFormData({ name: "", location: "", logo: "" }); setIsAdding(false); fetchItems(); }
      else toast.error("Failed to add");
    } catch { toast.error("Error adding partner"); }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    try {
      const res = await fetch(`/api/les/partners/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { toast.success("Updated"); setEditingId(null); setFormData({ name: "", location: "", logo: "" }); fetchItems(); }
      else toast.error("Failed to update");
    } catch { toast.error("Error updating"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this partner?")) return;
    try {
      const res = await fetch(`/api/les/partners/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Deleted"); fetchItems(); } else toast.error("Failed to delete");
    } catch { toast.error("Error deleting"); }
  };

  const startEdit = (item: Partner) => { setEditingId(item.id); setFormData({ name: item.name, location: item.location || "", logo: item.logo || "" }); setIsAdding(false); };
  const cancelEdit = () => { setEditingId(null); setIsAdding(false); setFormData({ name: "", location: "", logo: "" }); };

  const renderForm = (onSave: () => void) => (
    <div className="flex flex-col gap-3">
      <input type="text" placeholder="Organization name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
      <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
      {/* Logo Upload */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50">
            <Upload className="w-4 h-4" />{uploading ? "Uploading..." : "Upload Logo"}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          {formData.logo && <img src={formData.logo} alt="Preview" className="w-10 h-10 rounded object-contain border bg-white p-1" />}
        </div>
        <input type="text" placeholder="Or paste logo URL" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none w-full text-sm" />
      </div>
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
            <div><h1 className="text-3xl font-bold text-gray-900">LES Partners</h1><p className="text-gray-600 mt-1">Manage partner organizations</p></div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: "", location: "", logo: "" }); }} className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"><Plus className="w-4 h-4" />Add Partner</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {isAdding && (<div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"><h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Partner</h3>{renderForm(handleAdd)}</div>)}
          {loading ? (<div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div></div>)
          : items.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500">No partners found</p></div>)
          : (<div className="space-y-3">{items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              {editingId === item.id ? (<div className="flex-1">{renderForm(() => handleUpdate(item.id))}</div>) : (<>
                <div className="flex items-center gap-4">
                  {item.logo && <img src={item.logo} alt={item.name} className="w-10 h-10 rounded object-contain border bg-white p-1" />}
                  <div><p className="font-semibold text-gray-900">{item.name}</p><p className="text-sm text-gray-500">{item.location}</p></div>
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
