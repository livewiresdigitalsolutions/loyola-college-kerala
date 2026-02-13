// app/sys-ops/master-data/les/gallery/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
}

export default function LesGalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ src: "", alt: "" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/les/gallery");
      if (res.ok) setItems(await res.json());
    } catch { toast.error("Failed to load gallery"); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!formData.src.trim()) { toast.error("Image source is required"); return; }
    try {
      const res = await fetch("/api/les/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { toast.success("Gallery image added"); setFormData({ src: "", alt: "" }); setIsAdding(false); fetchItems(); }
      else toast.error("Failed to add");
    } catch { toast.error("Error adding image"); }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.src.trim()) { toast.error("Image source is required"); return; }
    try {
      const res = await fetch(`/api/les/gallery/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { toast.success("Updated"); setEditingId(null); setFormData({ src: "", alt: "" }); fetchItems(); }
      else toast.error("Failed to update");
    } catch { toast.error("Error updating"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this gallery image?")) return;
    try {
      const res = await fetch(`/api/les/gallery/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Deleted"); fetchItems(); } else toast.error("Failed to delete");
    } catch { toast.error("Error deleting"); }
  };

  const startEdit = (item: GalleryItem) => { setEditingId(item.id); setFormData({ src: item.src, alt: item.alt || "" }); setIsAdding(false); };
  const cancelEdit = () => { setEditingId(null); setIsAdding(false); setFormData({ src: "", alt: "" }); };

  const renderForm = (onSave: () => void) => (
    <div className="flex flex-col gap-3">
      <input type="text" placeholder="Image URL" value={formData.src} onChange={(e) => setFormData({ ...formData, src: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
      <input type="text" placeholder="Alt text" value={formData.alt} onChange={(e) => setFormData({ ...formData, alt: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
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
            <div><h1 className="text-3xl font-bold text-gray-900">LES Gallery</h1><p className="text-gray-600 mt-1">Manage gallery images</p></div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ src: "", alt: "" }); }} className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"><Plus className="w-4 h-4" />Add Image</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {isAdding && (<div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"><h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Gallery Image</h3>{renderForm(handleAdd)}</div>)}
          {loading ? (<div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div></div>)
          : items.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500">No gallery images found</p></div>)
          : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {editingId === item.id ? (<div className="p-4">{renderForm(() => handleUpdate(item.id))}</div>) : (<>
                <div className="h-48 bg-gray-100"><img src={item.src} alt={item.alt} className="w-full h-full object-cover" /></div>
                <div className="p-3 flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate flex-1">{item.alt || "No description"}</p>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </>)}
            </div>
          ))}</div>)}
        </div>
      </div>
    </>
  );
}
