"use client";

import React, { useState } from "react";
import { useJournalAuth } from "../../_components/AuthContext";
import { toast, Toaster } from "react-hot-toast";
import { Loader2, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, refresh } = useJournalAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    salutation: user?.salutation || "",
    first_name: user?.first_name || "",
    middle_name: user?.middle_name || "",
    last_name: user?.last_name || "",
    designation: user?.designation || "",
    affiliation: user?.affiliation || "",
    country: user?.country || "",
    state: user?.state || "",
    city: user?.city || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
  });

  // Update form when user data loads
  React.useEffect(() => {
    if (user) {
      setForm({
        salutation: user.salutation || "",
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        designation: user.designation || "",
        affiliation: user.affiliation || "",
        country: user.country || "",
        state: user.state || "",
        city: user.city || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/journals/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
        await refresh();
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 text-sm";

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Edit Profile</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Update your personal information
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email (read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</label>
              <input type="email" value={user?.email || ""} disabled className={inputClass + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Salutation</label>
                <select value={form.salutation} onChange={(e) => setForm({ ...form, salutation: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-3">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">First Name</label>
                <input type="text" required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Middle Name</label>
                <input type="text" value={form.middle_name} onChange={(e) => setForm({ ...form, middle_name: e.target.value })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Name</label>
                <input type="text" required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Designation</label>
                <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Affiliation</label>
                <input type="text" value={form.affiliation} onChange={(e) => setForm({ ...form, affiliation: e.target.value })} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</label>
                <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">State</label>
                <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">City</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Bio</label>
              <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A brief bio about yourself" className={inputClass + " resize-none"} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</label>
              <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass + " resize-none"} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-fit mt-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
