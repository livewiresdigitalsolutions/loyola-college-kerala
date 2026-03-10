"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Users } from "lucide-react";

interface AlumniUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  is_approved: number;
  created_at: string;
}

export default function AlumniUsersAdmin() {
  const router = useRouter();
  const [users, setUsers] = useState<AlumniUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/alumni/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  }, []);


  useEffect(() => { fetchUsers().finally(() => setLoading(false)); }, [fetchUsers]);

  const toggleApproval = async (user: AlumniUser) => {
    await fetch(`/api/alumni/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: user.is_approved ? 0 : 1 }),
    });
    fetchUsers();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/sys-ops/master-data/alumni")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" /> Alumni Users
          </h1>
          <p className="text-gray-500 text-sm">Registered alumni accounts ({users.length} total)</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name","Email","Phone","Country","City","Registered","Status","Action"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-gray-500">{u.phone || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{u.country || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{u.city || "—"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${u.is_approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {u.is_approved ? <><CheckCircle className="w-3 h-3" /> Approved</> : <><XCircle className="w-3 h-3" /> Pending</>}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleApproval(u)} className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${u.is_approved ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                    {u.is_approved ? "Revoke" : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No alumni users registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
