// app/sys-ops/master-data/les/counselors/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Upload, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Counselor {
  id: number;
  name: string;
  specialization: string;
  image: string;
}

interface Slot {
  id: number;
  label: string;
  value: string;
}

export default function LesCounselorsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Counselor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", specialization: "", image: "" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Slot state
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
  const [slotStartTime, setSlotStartTime] = useState("");
  const [slotEndTime, setSlotEndTime] = useState("");

  useEffect(() => { fetchItems(); fetchSlots(); }, []);

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

  const fetchSlots = async () => {
    try {
      const res = await fetch("/api/les/slots");
      if (res.ok) setSlots(await res.json());
    } catch { toast.error("Failed to load slots"); }
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
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success("Image uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch { toast.error("Error uploading image"); }
    finally { setUploading(false); }
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

  // Helper to format 24h time to 12h AM/PM
  const formatTime12h = (time24: string): string => {
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const buildSlotData = () => {
    if (!slotStartTime || !slotEndTime) { toast.error("Both start and end times are required"); return null; }
    if (slotEndTime <= slotStartTime) { toast.error("End time must be after start time"); return null; }
    const label = `${formatTime12h(slotStartTime)} - ${formatTime12h(slotEndTime)}`;
    const value = `${slotStartTime}-${slotEndTime}`;
    return { label, value };
  };

  // Slot handlers
  const handleAddSlot = async () => {
    const data = buildSlotData();
    if (!data) return;
    try {
      const res = await fetch("/api/les/slots", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast.success("Slot added"); setSlotStartTime(""); setSlotEndTime(""); setIsAddingSlot(false); fetchSlots(); }
      else toast.error("Failed to add slot");
    } catch { toast.error("Error adding slot"); }
  };

  const handleUpdateSlot = async (id: number) => {
    const data = buildSlotData();
    if (!data) return;
    try {
      const res = await fetch(`/api/les/slots/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast.success("Slot updated"); setEditingSlotId(null); setSlotStartTime(""); setSlotEndTime(""); fetchSlots(); }
      else toast.error("Failed to update slot");
    } catch { toast.error("Error updating slot"); }
  };

  const handleDeleteSlot = async (id: number) => {
    if (!confirm("Delete this slot?")) return;
    try {
      const res = await fetch(`/api/les/slots/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Slot deleted"); fetchSlots(); } else toast.error("Failed to delete slot");
    } catch { toast.error("Error deleting slot"); }
  };

  const startEdit = (item: Counselor) => { setEditingId(item.id); setFormData({ name: item.name, specialization: item.specialization || "", image: item.image || "" }); setIsAdding(false); };
  const cancelEdit = () => { setEditingId(null); setIsAdding(false); setFormData({ name: "", specialization: "", image: "" }); };

  const startEditSlot = (slot: Slot) => {
    setEditingSlotId(slot.id); setIsAddingSlot(false);
    // Parse start/end from value format "09:00-10:00"
    if (slot.value && slot.value.includes('-')) {
      const parts = slot.value.split('-');
      setSlotStartTime(parts[0]); setSlotEndTime(parts[1]);
    } else { setSlotStartTime(""); setSlotEndTime(""); }
  };
  const cancelEditSlot = () => { setEditingSlotId(null); setIsAddingSlot(false); setSlotStartTime(""); setSlotEndTime(""); };

  const renderForm = (onSave: () => void) => (
    <div className="flex flex-col gap-3">
      <input type="text" placeholder="Counselor name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
      <input type="text" placeholder="Specialization" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
      {/* Image Upload */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50">
            <Upload className="w-4 h-4" />{uploading ? "Uploading..." : "Upload Image"}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          {formData.image && <img src={formData.image} alt="Preview" className="w-10 h-10 rounded-full object-cover border" />}
        </div>
        <input type="text" placeholder="Or paste image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none w-full text-sm" />
      </div>
      <div className="flex gap-3">
        <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save className="w-4 h-4" />Save</button>
        <button onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"><X className="w-4 h-4" />Cancel</button>
      </div>
    </div>
  );

  const renderSlotForm = (onSave: () => void) => (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Start Time</label>
          <input type="time" value={slotStartTime} onChange={(e) => setSlotStartTime(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">End Time</label>
          <input type="time" value={slotEndTime} onChange={(e) => setSlotEndTime(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
        </div>
      </div>
      {slotStartTime && slotEndTime && slotEndTime > slotStartTime && (
        <p className="text-sm text-gray-500">Preview: <span className="font-medium text-gray-700">{formatTime12h(slotStartTime)} - {formatTime12h(slotEndTime)}</span></p>
      )}
      <div className="flex gap-3">
        <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save className="w-4 h-4" />Save</button>
        <button onClick={cancelEditSlot} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"><X className="w-4 h-4" />Cancel</button>
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
            <div><h1 className="text-3xl font-bold text-gray-900">LES Counselors & Slots</h1><p className="text-gray-600 mt-1">Manage counselors, specializations, and counselling time slots</p></div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: "", specialization: "", image: "" }); }} className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"><Plus className="w-4 h-4" />Add Counselor</button>
        </div>

        {/* Counselors Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Counselors</h2>
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

        {/* Counselling Time Slots Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#342D87]" />
              <h2 className="text-xl font-bold text-gray-800">Counselling Time Slots</h2>
            </div>
            <button onClick={() => { setIsAddingSlot(true); setEditingSlotId(null); setSlotStartTime(""); setSlotEndTime(""); }} className="flex items-center gap-2 px-3 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors text-sm"><Plus className="w-4 h-4" />Add Slot</button>
          </div>

          {isAddingSlot && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Time Slot</h3>
              {renderSlotForm(handleAddSlot)}
            </div>
          )}

          {slots.length === 0 ? (
            <div className="text-center py-8"><p className="text-gray-500">No time slots configured</p></div>
          ) : (
            <div className="space-y-3">{slots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                {editingSlotId === slot.id ? (
                  <div className="flex-1">{renderSlotForm(() => handleUpdateSlot(slot.id))}</div>
                ) : (<>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">{slot.label}</p>
                      {slot.value !== slot.label && <p className="text-sm text-gray-500">Value: {slot.value}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditSlot(slot)} className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Edit2 className="w-4 h-4" />Edit</button>
                    <button onClick={() => handleDeleteSlot(slot.id)} className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" />Delete</button>
                  </div>
                </>)}
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </>
  );
}
