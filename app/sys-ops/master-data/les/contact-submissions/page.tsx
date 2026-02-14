// app/sys-ops/master-data/les/contact-submissions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContactSubmission {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at?: string;
}

export default function LesContactSubmissionsPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/les/contact");
      if (res.ok) setItems(await res.json());
    } catch { toast.error("Failed to load submissions"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this submission?")) return;
    try {
      const res = await fetch(`/api/les/contact/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Deleted"); fetchItems(); } else toast.error("Failed to delete");
    } catch { toast.error("Error deleting"); }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
            <p className="text-gray-600 mt-1">View messages submitted via the LES contact form</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div></div>
          ) : items.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-500">No contact submissions found</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Phone</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Subject</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Message</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.first_name} {item.last_name}</td>
                      <td className="px-4 py-3 text-gray-600">{item.email}</td>
                      <td className="px-4 py-3 text-gray-600">{item.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{item.subject}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{item.message}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs">
                          <Trash2 className="w-3 h-3" />Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
