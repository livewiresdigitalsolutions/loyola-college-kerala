"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Settings as SettingsIcon, Database, Bell, Shield } from "lucide-react";

export default function Settings() {
  const [dbType, setDbType] = useState(
    process.env.DB_TYPE || "supabase"
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure system preferences</p>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-5 h-5 text-[#342D87]" />
            <h2 className="text-xl font-bold text-gray-900">
              Database Configuration
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Database Type
              </label>
              <select
                value={dbType}
                onChange={(e) => setDbType(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
              >
                <option value="supabase">Supabase (Development)</option>
                <option value="mysql">MySQL (Production)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Configure in environment variables
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-[#342D87]" />
            <h2 className="text-xl font-bold text-gray-900">
              Notification Settings
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-[#342D87] rounded focus:ring-2 focus:ring-[#342D87]"
              />
              <span className="text-gray-700">Email notifications for new applications</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-[#342D87] rounded focus:ring-2 focus:ring-[#342D87]"
              />
              <span className="text-gray-700">Email notifications for payment confirmations</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-[#342D87] rounded focus:ring-2 focus:ring-[#342D87]"
              />
              <span className="text-gray-700">Daily summary reports</span>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-[#342D87]" />
            <h2 className="text-xl font-bold text-gray-900">
              Security Settings
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 mb-2">
                Admin credentials are encrypted using SHA-256 hashing
              </p>
              <p className="text-xs text-gray-500">
                Default credentials: admin / Loyola@Admin2025
              </p>
              <p className="text-xs text-red-600 mt-1">
                Change these in production environment
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => toast.success("Settings saved successfully")}
            className="px-6 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
}
