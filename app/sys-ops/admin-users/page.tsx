"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";

interface AdminUser {
  id: number;
  username: string;
  role: string;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
  can_edit: boolean; // New permission field
}

export default function AdminUsers() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
    role: "admin",
    can_edit: true, // Default to true
    masterKey: "",
  });

  const [editAdmin, setEditAdmin] = useState({
    username: "",
    role: "",
    can_edit: true,
    is_active: true,
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/sys-ops/admin-users");
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
      } else {
        toast.error("Failed to load admin users");
      }
    } catch (error) {
      toast.error("Error loading admin users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdmin.username || !newAdmin.password) {
      toast.error("Username and password are required");
      return;
    }

    if (newAdmin.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const response = await fetch("/api/sys-ops/auth/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Admin user created successfully");
        setShowCreateModal(false);
        setNewAdmin({
          username: "",
          password: "",
          role: "admin",
          can_edit: true,
          masterKey: "",
        });
        fetchAdmins();
      } else {
        toast.error(data.error || "Failed to create admin");
      }
    } catch (error) {
      toast.error("Error creating admin user");
    }
  };

  const handleOpenEditModal = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setEditAdmin({
      username: admin.username,
      role: admin.role,
      can_edit: admin.can_edit,
      is_active: admin.is_active,
    });
    setShowEditModal(true);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingAdmin) return;

    try {
      const response = await fetch(`/api/sys-ops/admin-users/${editingAdmin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editAdmin),
      });

      if (response.ok) {
        toast.success("Admin user updated successfully");
        setShowEditModal(false);
        setEditingAdmin(null);
        fetchAdmins();
      } else {
        toast.error("Failed to update admin user");
      }
    } catch (error) {
      toast.error("Error updating admin user");
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/sys-ops/admin-users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
      });

      if (response.ok) {
        toast.success(
          `Admin ${!currentStatus ? "activated" : "deactivated"} successfully`
        );
        fetchAdmins();
      } else {
        toast.error("Failed to update admin status");
      }
    } catch (error) {
      toast.error("Error updating admin status");
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (
      !confirm(
        `Are you sure you want to delete admin user "${username}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/sys-ops/admin-users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Admin user deleted successfully");
        fetchAdmins();
      } else {
        toast.error("Failed to delete admin user");
      }
    } catch (error) {
      toast.error("Error deleting admin user");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
            <p className="text-gray-600 mt-1">
              Manage system administrator accounts
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Admin
          </button>
        </div>

        {/* Admin List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No admin users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Username
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Permissions
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Created
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Last Login
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {admin.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#342D87] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {admin.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {admin.username}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Shield
                            className={`w-4 h-4 ${
                              admin.role === "super_admin"
                                ? "text-purple-600"
                                : admin.role === "admin"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {admin.role.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {admin.can_edit ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            <Edit className="w-3 h-3" />
                            Can Edit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                            <Eye className="w-3 h-3" />
                            View Only
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {admin.is_active ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <UserCheck className="w-4 h-4" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 text-sm">
                            <UserX className="w-4 h-4" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {admin.last_login
                          ? new Date(admin.last_login).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(admin)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleActive(admin.id, admin.is_active)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              admin.is_active
                                ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                            title={
                              admin.is_active
                                ? "Deactivate user"
                                : "Activate user"
                            }
                          >
                            {admin.is_active ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(admin.id, admin.username)
                            }
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Admins
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {admins.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Admins
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {admins.filter((a) => a.is_active).length}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Super Admins
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {admins.filter((a) => a.role === "super_admin").length}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create New Admin User
            </h2>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={newAdmin.username}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, username: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password * (min 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                    placeholder="Enter password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAdmin.can_edit}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, can_edit: e.target.checked })
                    }
                    className="w-4 h-4 text-[#342D87] border-gray-300 rounded focus:ring-[#342D87]"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Grant edit permissions
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Allow this user to edit content (recommended for viewers)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Master Key *
                </label>
                <input
                  type="password"
                  value={newAdmin.masterKey}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, masterKey: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                  placeholder="Enter master key"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Required for security. Set in .env.local
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewAdmin({
                      username: "",
                      password: "",
                      role: "admin",
                      can_edit: true,
                      masterKey: "",
                    });
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors font-semibold"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && editingAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Admin User
            </h2>

            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editAdmin.username}
                  onChange={(e) =>
                    setEditAdmin({ ...editAdmin, username: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={editAdmin.role}
                  onChange={(e) =>
                    setEditAdmin({ ...editAdmin, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editAdmin.can_edit}
                    onChange={(e) =>
                      setEditAdmin({ ...editAdmin, can_edit: e.target.checked })
                    }
                    className="w-4 h-4 text-[#342D87] border-gray-300 rounded focus:ring-[#342D87]"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Grant edit permissions
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editAdmin.is_active}
                    onChange={(e) =>
                      setEditAdmin({ ...editAdmin, is_active: e.target.checked })
                    }
                    className="w-4 h-4 text-[#342D87] border-gray-300 rounded focus:ring-[#342D87]"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Active
                  </span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAdmin(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors font-semibold"
                >
                  Update Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
