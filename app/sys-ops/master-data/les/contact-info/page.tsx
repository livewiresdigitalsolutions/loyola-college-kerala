// app/sys-ops/master-data/les/contact-info/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContactInfo {
  email: string[];
  phone: string[];
  address: string;
  officeHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export default function LesContactInfoPage() {
  const router = useRouter();
  const [data, setData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    emails: "",
    phones: "",
    office_hours_weekdays: "",
    office_hours_saturday: "",
    office_hours_sunday: "",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/les/contact-info");
      if (res.ok) {
        const d = await res.json();
        setData(d);
        if (d) {
          setFormData({
            address: d.address || "",
            emails: Array.isArray(d.email) ? d.email.join(", ") : d.email || "",
            phones: Array.isArray(d.phone) ? d.phone.join(", ") : d.phone || "",
            office_hours_weekdays: d.officeHours?.weekdays || "",
            office_hours_saturday: d.officeHours?.saturday || "",
            office_hours_sunday: d.officeHours?.sunday || "",
          });
        }
      }
    } catch { toast.error("Failed to load contact info"); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        address: formData.address,
        emails: formData.emails.split(",").map(s => s.trim()).filter(Boolean),
        phones: formData.phones.split(",").map(s => s.trim()).filter(Boolean),
        office_hours_weekdays: formData.office_hours_weekdays,
        office_hours_saturday: formData.office_hours_saturday,
        office_hours_sunday: formData.office_hours_sunday,
      };
      // Use PUT on [id]/1 if data exists, else POST
      const method = data ? "PUT" : "POST";
      const url = data ? "/api/les/contact-info/1" : "/api/les/contact-info";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success("Contact info saved"); fetchData(); }
      else toast.error("Failed to save");
    } catch { toast.error("Error saving"); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-3xl font-bold text-gray-900">LES Contact Info</h1><p className="text-gray-600 mt-1">Manage organization contact details</p></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div></div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emails (comma separated)</label>
              <input type="text" value={formData.emails} onChange={(e) => setFormData({ ...formData, emails: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phones (comma separated)</label>
              <input type="text" value={formData.phones} onChange={(e) => setFormData({ ...formData, phones: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weekday Hours</label>
                <input type="text" value={formData.office_hours_weekdays} onChange={(e) => setFormData({ ...formData, office_hours_weekdays: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Saturday Hours</label>
                <input type="text" value={formData.office_hours_saturday} onChange={(e) => setFormData({ ...formData, office_hours_saturday: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sunday Hours</label>
                <input type="text" value={formData.office_hours_sunday} onChange={(e) => setFormData({ ...formData, office_hours_sunday: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none" />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" />{saving ? "Saving..." : "Save Contact Info"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
