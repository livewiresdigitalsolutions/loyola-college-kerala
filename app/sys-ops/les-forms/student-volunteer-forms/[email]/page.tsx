// app/sys-ops/volunteers/[email]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Download,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  MessageSquare,
  Trash2,
} from "lucide-react";
import StatusBadge from "../../../components/StatusBadge";

interface VolunteerData {
  id: number;
  user_email: string;
  name: string;
  gender: string;
  contact_number: string;
  address: string;
  email: string;
  age: string;
  educational_qualification: string;
  institute_name: string;
  institute_address: string;
  program_preference: string;
  duration: string;
  form_status: string;
  payment_status?: string;
  payment_id?: string;
  payment_amount?: number | string;
  updated_at: string;
  created_at: string;
  submitted_at?: string;
}

interface ProgramOption {
  id: number;
  name: string;
}

const generateVolunteerId = (dbId: number): string => {
  const paddedId = String(dbId).padStart(4, "0");
  return `VOLS${paddedId}`;
};

export default function VolunteerDetail() {
  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  const [formData, setFormData] = useState<VolunteerData | null>(null);
  const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormData();
    fetchProgramOptions();
  }, [email]);

  const fetchProgramOptions = async () => {
    try {
      const response = await fetch("/api/volunteer-programs");
      const data = await response.json();
      setProgramOptions(data);
    } catch (error) {
    }
  };

  const fetchFormData = async () => {
    setLoading(true);
    try {
      const url = `/api/sys-ops/volunteers/${encodeURIComponent(email)}`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        if (result.data) {
          setFormData(result.data);
        } else {
          toast.error("Volunteer application not found");
          setTimeout(() => router.push("/sys-ops/volunteers"), 2000);
        }
      } else {
        toast.error(result.error || "Failed to load volunteer application");
        setTimeout(() => router.push("/sys-ops/volunteers"), 2000);
      }
    } catch (error) {
      toast.error("Error loading volunteer application");
      setTimeout(() => router.push("/sys-ops/volunteers"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    router.push(`/volunteer-preview?email=${encodeURIComponent(email)}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this volunteer application?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/sys-ops/volunteers/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Volunteer application deleted successfully");
        router.push("/sys-ops/volunteers");
      } else {
        toast.error("Failed to delete volunteer application");
      }
    } catch (error) {
      toast.error("Error deleting volunteer application");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Volunteer application not found</p>
      </div>
    );
  }

  const volunteerId = generateVolunteerId(formData.id);
  const programName = programOptions.find(p => p.id === parseInt(formData.program_preference || "0"))?.name || formData.program_preference || "N/A";

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/sys-ops/volunteers")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {formData.name || "Volunteer Details"}
              </h1>
              <p className="text-gray-600 mt-1">
                Volunteer ID:{" "}
                <span className="font-mono font-semibold text-primary">
                  {volunteerId}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge
              status={formData.form_status || "Draft"}
            />
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-gray-200 p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Volunteer Summary</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Volunteer ID</p>
              <p className="text-2xl font-bold font-mono">{volunteerId}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Database ID</p>
              <p className="text-xl font-semibold">#{formData.id}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Name</p>
              <p className="text-xl font-semibold">{formData.name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Email</p>
              <p className="text-lg font-medium truncate">{formData.user_email}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Contact</p>
              <p className="text-lg font-medium">{formData.contact_number || "Not provided"}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Form Status</p>
              <p className="text-lg font-semibold capitalize">{formData.form_status || "Draft"}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Program</p>
              <p className="text-lg font-semibold">{programName}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Duration</p>
              <p className="text-lg font-medium">{formData.duration || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField label="Full Name" value={formData.name} />
            <InfoField label="Gender" value={formData.gender} />
            <InfoField label="Age" value={formData.age} />
            <InfoField label="Contact Number" value={formData.contact_number} />
            <InfoField label="Email" value={formData.email} />
            <InfoField label="Address" value={formData.address} className="md:col-span-2 lg:col-span-3" />
          </div>
        </div>

        {/* Educational Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Educational Information</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField label="Educational Qualification" value={formData.educational_qualification} />
            <InfoField label="Institute Name" value={formData.institute_name} />
            <InfoField label="Institute Address" value={formData.institute_address} className="md:col-span-2 lg:col-span-3" />
          </div>
        </div>

        {/* Program Preference */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Program Preference</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoField label="Preferred Program" value={programName} className="md:col-span-2" />
            <InfoField label="Duration" value={formData.duration} className="md:col-span-2" />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Timeline
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formData.submitted_at && (
              <InfoField
                label="Submitted At"
                value={new Date(formData.submitted_at).toLocaleString()}
              />
            )}
            <InfoField
              label="Created At"
              value={new Date(formData.created_at).toLocaleString()}
            />
            <InfoField
              label="Last Updated"
              value={new Date(formData.updated_at).toLocaleString()}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function InfoField({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number | null | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 font-medium min-h-[3.5rem] flex items-center">
        {value || "N/A"}
      </div>
    </div>
  );
}
