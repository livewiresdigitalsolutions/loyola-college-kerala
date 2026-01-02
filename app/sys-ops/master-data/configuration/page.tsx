"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfig, ConfigValue } from "@/app/hooks/useConfig";

export default function ConfigurationPage() {
  const router = useRouter();
  const { config, loading, updateConfig, createConfig, deleteConfig } = useConfig();
  const [isAdding, setIsAdding] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: "",
    data_type: "string",
  });

  const configs = Array.isArray(config) ? config : config ? [config] : [];

  const handleAdd = async () => {
    if (!formData.key.trim() || !formData.value.trim()) {
      toast.error("Please fill in key and value");
      return;
    }

    const result = await createConfig(
      formData.key,
      formData.value,
      formData.description,
      formData.data_type
    );

    if (result.success) {
      toast.success("Configuration added successfully");
      setFormData({ key: "", value: "", description: "", data_type: "string" });
      setIsAdding(false);
    } else {
      toast.error(result.error || "Failed to add configuration");
    }
  };

  const handleUpdate = async (key: string) => {
    if (!formData.value.trim()) {
      toast.error("Please fill in value");
      return;
    }

    const result = await updateConfig(
      key,
      formData.value,
      formData.description,
      formData.data_type
    );

    if (result.success) {
      toast.success("Configuration updated successfully");
      setEditingKey(null);
      setFormData({ key: "", value: "", description: "", data_type: "string" });
    } else {
      toast.error(result.error || "Failed to update configuration");
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return;

    const result = await deleteConfig(key);

    if (result.success) {
      toast.success("Configuration deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete configuration");
    }
  };

  const startEdit = (config: ConfigValue) => {
    setEditingKey(config.key);
    setFormData({
      key: config.key,
      value: config.value,
      description: config.description || "",
      data_type: config.data_type || "string",
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setIsAdding(false);
    setFormData({ key: "", value: "", description: "", data_type: "string" });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuration Settings</h1>
              <p className="text-gray-600 mt-1">Manage application configuration values</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingKey(null);
              setFormData({ key: "", value: "", description: "", data_type: "string" });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Configuration
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Add New Row */}
                  {isAdding && (
                    <tr className="bg-blue-50 hover:bg-blue-100 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder="Key"
                          value={formData.key}
                          onChange={(e) =>
                            setFormData({ ...formData, key: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder="Value"
                          value={formData.value}
                          onChange={(e) =>
                            setFormData({ ...formData, value: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder="Description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.data_type}
                          onChange={(e) =>
                            setFormData({ ...formData, data_type: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none text-sm"
                        >
                          <option value="string">String</option>
                          <option value="integer">Integer</option>
                          <option value="boolean">Boolean</option>
                          <option value="json">JSON</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleAdd}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Data Rows */}
                  {configs.length === 0 && !isAdding ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No configurations found. Click "Add Configuration" to create one.
                      </td>
                    </tr>
                  ) : (
                    configs.map((config) => (
                      <tr
                        key={config.key}
                        className={`hover:bg-gray-50 transition-colors ${
                          editingKey === config.key ? "bg-yellow-50" : ""
                        }`}
                      >
                        {/* Key Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {config.key}
                          </span>
                        </td>

                        {/* Value Column */}
                        <td className="px-6 py-4">
                          {editingKey === config.key ? (
                            <input
                              type="text"
                              value={formData.value}
                              onChange={(e) =>
                                setFormData({ ...formData, value: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none text-sm"
                            />
                          ) : (
                            <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                              {config.value}
                            </span>
                          )}
                        </td>

                        {/* Description Column */}
                        <td className="px-6 py-4">
                          {editingKey === config.key ? (
                            <input
                              type="text"
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                              }
                              placeholder="Description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none text-sm"
                            />
                          ) : (
                            <span className="text-sm text-gray-600">
                              {config.description || "-"}
                            </span>
                          )}
                        </td>

                        {/* Type Column */}
                        <td className="px-6 py-4">
                          {editingKey === config.key ? (
                            <select
                              value={formData.data_type}
                              onChange={(e) =>
                                setFormData({ ...formData, data_type: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none text-sm"
                            >
                              <option value="string">String</option>
                              <option value="integer">Integer</option>
                              <option value="boolean">Boolean</option>
                              <option value="json">JSON</option>
                            </select>
                          ) : (
                            <span className="text-xs text-gray-500 uppercase font-medium">
                              {config.data_type || "string"}
                            </span>
                          )}
                        </td>

                        {/* Actions Column */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {editingKey === config.key ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdate(config.key)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Save className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => startEdit(config)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(config.key)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
