"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Download,
  Mail,
  User,
  Calendar,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Trash2,
} from "lucide-react";
import StatusBadge from "../../../components/StatusBadge";

interface AppointmentData {
  id: number;
  user_email: string;
  name: string;
  gender: string;
  address: string;
  mobile_number: string;
  email: string;
  age: string;
  counseling_date: string;
  counseling_staff: string;
  counseling_slot: string;
  message: string;
  description_of_concern: string;
  form_status: string;
  payment_status?: string;
  payment_id?: string;
  payment_amount?: number | string;
  updated_at: string;
  created_at: string;
  submitted_at?: string;
}

const generateAppointmentId = (dbId: number): string => {
  const paddedId = String(dbId).padStart(4, "0");
  return `APPT${paddedId}`;
};

export default function AppointmentDetail() {
  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  const [formData, setFormData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormData();
  }, [email]);

  const fetchFormData = async () => {
    setLoading(true);
    try {
      const url = `/api/sys-ops/appointments/${encodeURIComponent(email)}`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        if (result.data) {
          setFormData(result.data);
        } else {
          toast.error("Appointment not found");
          setTimeout(() => router.push("/sys-ops/appointments"), 2000);
        }
      } else {
        toast.error(result.error || "Failed to load appointment");
        setTimeout(() => router.push("/sys-ops/appointments"), 2000);
      }
    } catch (error) {
      toast.error("Error loading appointment");
      setTimeout(() => router.push("/sys-ops/appointments"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    router.push(`/appointment-preview?email=${encodeURIComponent(email)}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/sys-ops/appointments/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Appointment deleted successfully");
        router.push("/sys-ops/appointments");
      } else {
        toast.error("Failed to delete appointment");
      }
    } catch (error) {
      toast.error("Error deleting appointment");
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
        <p className="text-gray-500">Appointment not found</p>
      </div>
    );
  }

  const appointmentId = generateAppointmentId(formData.id);

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/sys-ops/appointments")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {formData.name || "Appointment Details"}
              </h1>
              <p className="text-gray-600 mt-1">
                Appointment ID:{" "}
                <span className="font-mono font-semibold text-primary">
                  {appointmentId}
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

        {/* Application Summary Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-gray-200 p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Appointment Summary</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Appointment ID
              </p>
              <p className="text-2xl font-bold font-mono">{appointmentId}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Database ID
              </p>
              <p className="text-xl font-semibold">#{formData.id}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Client Name
              </p>
              <p className="text-xl font-semibold">
                {formData.name || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Email</p>
              <p className="text-lg font-medium truncate">
                {formData.user_email}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Mobile</p>
              <p className="text-lg font-medium">
                {formData.mobile_number || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Form Status
              </p>
              <p className="text-lg font-semibold capitalize">
                {formData.form_status || "Draft"}
              </p>
            </div>
            {formData.counseling_date && (
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  Counseling Date
                </p>
                <p className="text-lg font-semibold">
                  {new Date(formData.counseling_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Personal Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField label="Full Name" value={formData.name} />
            <InfoField label="Gender" value={formData.gender} />
            <InfoField label="Age" value={formData.age} />
            <InfoField label="Mobile Number" value={formData.mobile_number} />
            <InfoField label="Email" value={formData.email} />
            <InfoField label="Address" value={formData.address} className="md:col-span-2 lg:col-span-3" />
          </div>
        </div>

        {/* Counseling Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Counseling Details
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField label="Counseling Date" value={formData.counseling_date} />
            <InfoField label="Counseling Staff" value={formData.counseling_staff} />
            <InfoField label="Counseling Slot" value={formData.counseling_slot} />
          </div>
        </div>

        {/* Messages & Concerns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Messages & Concerns
            </h2>
          </div>

          <div className="space-y-6">
            {formData.message && (
              <div>
                <InfoField label="Message" value={formData.message} className="md:col-span-2 lg:col-span-3" />
              </div>
            )}
            {formData.description_of_concern && (
              <div>
                <InfoField 
                  label="Description of Concern" 
                  value={formData.description_of_concern} 
                  className="md:col-span-2 lg:col-span-3"
                />
              </div>
            )}
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

// Helper Component
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
