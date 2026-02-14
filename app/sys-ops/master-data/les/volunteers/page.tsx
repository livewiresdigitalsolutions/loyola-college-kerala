"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Volunteer {
  id: number;
  name: string;
  gender: string;
  contact_number: string;
  address: string;
  email: string;
  age: string;
  qualification: string;
  institution_name: string;
  institution_address: string;
  programme: string;
  duration: string;
}

export default function LesVolunteersPage() {
  const router = useRouter();
  const [items, setItems] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/les/volunteers");
      if (res.ok) setItems(await res.json());
    } catch { toast.error("Failed to load volunteers"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this registration?")) return;
    try {
      const res = await fetch(`/api/les/volunteers/${id}`, { method: "DELETE" });
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
            <h1 className="text-3xl font-bold text-gray-900">Volunteer Registrations</h1>
            <p className="text-gray-600 mt-1">View submitted volunteer/internship registration forms</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div></div>
          ) : items.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-500">No volunteer registrations found</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Gender</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Contact</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Age</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Qualification</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Institution</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Programme</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Duration</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-gray-600">{item.gender}</td>
                      <td className="px-4 py-3 text-gray-600">{item.contact_number}</td>
                      <td className="px-4 py-3 text-gray-600">{item.email}</td>
                      <td className="px-4 py-3 text-gray-600">{item.age}</td>
                      <td className="px-4 py-3 text-gray-600">{item.qualification}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{item.institution_name}</td>
                      <td className="px-4 py-3 text-gray-600">{item.programme}</td>
                      <td className="px-4 py-3 text-gray-600">{item.duration}</td>
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
