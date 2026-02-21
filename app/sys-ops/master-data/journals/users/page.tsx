"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Loader2, Users, Search, ToggleLeft, ToggleRight } from "lucide-react";

interface JournalUser {
  id: number;
  salutation: string;
  first_name: string;
  last_name: string;
  email: string;
  designation: string;
  affiliation: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<JournalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/journals/admin?type=users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    `${u.first_name} ${u.last_name} ${u.email} ${u.affiliation || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Journal Registered Users</h1>

        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, affiliation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Affiliation</th>
                    <th className="px-4 py-3 text-left">Registered</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">
                        {user.salutation ? `${user.salutation} ` : ""}{user.first_name} {user.last_name}
                        {user.designation && (
                          <span className="block text-xs text-gray-400">{user.designation}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.affiliation || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Total: {filteredUsers.length} users
        </p>
      </div>
    </>
  );
}
