
// "use client";

// import { useEffect, useState } from "react";
// import { toast, Toaster } from "react-hot-toast";
// import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
// import { useRouter } from "next/navigation";

// interface Coordinator {
//   id: number;
//   title: string;
//   name: string;
//   role: string;
// }

// export default function LesCoordinatorsPage() {
//   const router = useRouter();
//   const [items, setItems] = useState<Coordinator[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [formData, setFormData] = useState({ title: "", name: "", role: "" });

//   useEffect(() => { fetchItems(); }, []);

//   const fetchItems = async () => {
//     try {
//       const res = await fetch("/api/les/coordinators");
//       if (res.ok) setItems(await res.json());
//     } catch { toast.error("Failed to load coordinators"); }
//     finally { setLoading(false); }
//   };

//   const handleAdd = async () => {
//     if (!formData.name.trim()) { toast.error("Name is required"); return; }
//     try {
//       const res = await fetch("/api/les/coordinators", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
//       if (res.ok) { toast.success("Coordinator added"); setFormData({ title: "", name: "", role: "" }); setIsAdding(false); fetchItems(); }
//       else toast.error("Failed to add");
//     } catch { toast.error("Error adding coordinator"); }
//   };

//   const handleUpdate = async (id: number) => {
//     if (!formData.name.trim()) { toast.error("Name is required"); return; }
//     try {
//       const res = await fetch(`/api/les/coordinators/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
//       if (res.ok) { toast.success("Updated"); setEditingId(null); setFormData({ title: "", name: "", role: "" }); fetchItems(); }
//       else toast.error("Failed to update");
//     } catch { toast.error("Error updating"); }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Delete this coordinator?")) return;
//     try {
//       const res = await fetch(`/api/les/coordinators/${id}`, { method: "DELETE" });
//       if (res.ok) { toast.success("Deleted"); fetchItems(); } else toast.error("Failed to delete");
//     } catch { toast.error("Error deleting"); }
//   };

//   const startEdit = (item: Coordinator) => { setEditingId(item.id); setFormData({ title: item.title || "", name: item.name, role: item.role || "" }); setIsAdding(false); };
//   const cancelEdit = () => { setEditingId(null); setIsAdding(false); setFormData({ title: "", name: "", role: "" }); };

//   const renderForm = (onSave: () => void) => (
//     <div className="flex flex-col gap-3">
//       <input type="text" placeholder="Title (e.g. Dr., Mr., Ms.)" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
//       <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
//       <input type="text" placeholder="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
//       <div className="flex gap-3">
//         <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save className="w-4 h-4" />Save</button>
//         <button onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"><X className="w-4 h-4" />Cancel</button>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <Toaster position="top-right" />
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
//             <div><h1 className="text-3xl font-bold text-gray-900">LES Coordinators</h1><p className="text-gray-600 mt-1">Manage coordinators and contact persons</p></div>
//           </div>
//           <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ title: "", name: "", role: "" }); }} className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"><Plus className="w-4 h-4" />Add Coordinator</button>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           {isAdding && (<div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"><h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Coordinator</h3>{renderForm(handleAdd)}</div>)}
//           {loading ? (<div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div></div>)
//           : items.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500">No coordinators found</p></div>)
//           : (<div className="space-y-3">{items.map((item) => (
//             <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//               {editingId === item.id ? (<div className="flex-1">{renderForm(() => handleUpdate(item.id))}</div>) : (<>
//                 <div><p className="font-semibold text-gray-900">{item.title} {item.name}</p><p className="text-sm text-gray-500">{item.role}</p></div>
//                 <div className="flex gap-2">
//                   <button onClick={() => startEdit(item)} className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Edit2 className="w-4 h-4" />Edit</button>
//                   <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" />Delete</button>
//                 </div>
//               </>)}
//             </div>
//           ))}</div>)}
//         </div>
//       </div>
//     </>
//   );
// }


// app/sys-ops/master-data/les/coordinators/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Coordinator {
  id: number;
  name: string;
  role: string;
}

export default function LesCoordinatorsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Coordinator[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", role: "" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/les/coordinators");
      if (res.ok) setItems(await res.json());
    } catch { toast.error("Failed to load coordinators"); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    try {
      const res = await fetch("/api/les/coordinators", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { toast.success("Coordinator added"); setFormData({ name: "", role: "" }); setIsAdding(false); fetchItems(); }
      else toast.error("Failed to add");
    } catch { toast.error("Error adding coordinator"); }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    try {
      const res = await fetch(`/api/les/coordinators/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { toast.success("Updated"); setEditingId(null); setFormData({ name: "", role: "" }); fetchItems(); }
      else toast.error("Failed to update");
    } catch { toast.error("Error updating"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this coordinator?")) return;
    try {
      const res = await fetch(`/api/les/coordinators/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Deleted"); fetchItems(); } else toast.error("Failed to delete");
    } catch { toast.error("Error deleting"); }
  };

  const startEdit = (item: Coordinator) => { setEditingId(item.id); setFormData({ name: item.name, role: item.role || "" }); setIsAdding(false); };
  const cancelEdit = () => { setEditingId(null); setIsAdding(false); setFormData({ name: "", role: "" }); };

  const renderForm = (onSave: () => void) => (
    <div className="flex flex-col gap-3">
      <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
      <input type="text" placeholder="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
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
            <div><h1 className="text-3xl font-bold text-gray-900">LES Coordinators</h1><p className="text-gray-600 mt-1">Manage coordinators and contact persons</p></div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: "", role: "" }); }} className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"><Plus className="w-4 h-4" />Add Coordinator</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {isAdding && (<div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"><h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Coordinator</h3>{renderForm(handleAdd)}</div>)}
          {loading ? (<div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div></div>)
          : items.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500">No coordinators found</p></div>)
          : (<div className="space-y-3">{items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              {editingId === item.id ? (<div className="flex-1">{renderForm(() => handleUpdate(item.id))}</div>) : (<>
                <div><p className="font-semibold text-gray-900">{item.name}</p><p className="text-sm text-gray-500">{item.role}</p></div>
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