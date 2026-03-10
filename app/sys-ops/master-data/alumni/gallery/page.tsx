"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";

interface GalleryItem {
  id: number;
  image_url: string;
  caption: string;
  sort_order: number;
}

export default function AlumniGalleryAdmin() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/alumni/gallery");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]) }
  }, []);

  useEffect(() => { fetchItems().finally(() => setLoading(false)); }, [fetchItems]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/alumni/upload", { method: "POST", body: fd });
      const data = await res.json();
      await fetch("/api/alumni/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: data.url, caption }),
      });
      setCaption("");
      fetchItems();
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/alumni/gallery/${id}`, { method: "DELETE" });
    fetchItems();
  };

  if (loading) return <div className="flex items-center justify-center min-h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/sys-ops/master-data/alumni")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ImageIcon className="w-6 h-6 text-blue-600" /> Alumni Gallery</h1>
            <p className="text-gray-500 text-sm">{items.length} images</p>
          </div>
        </div>
      </div>

      {/* Upload section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Add New Image</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption (optional)" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
            <Upload className="w-4 h-4" />{uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="aspect-square relative">
              <Image src={item.image_url} alt={item.caption || "Gallery"} fill className="object-cover" />
            </div>
            {item.caption && <p className="px-2 py-1.5 text-xs text-gray-600 truncate">{item.caption}</p>}
            <button onClick={() => deleteItem(item.id)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No gallery images yet. Upload the first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
