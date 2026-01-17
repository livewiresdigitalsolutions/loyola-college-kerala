"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Download,
  Mail,
  User,
  GraduationCap,
  FileText,
  BookOpen,
  Trash2,
  MapPin,
  Phone,
  Home,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

interface FormData {
  id: number;
  user_email: string;
  program_level_id: number;
  degree_id: number;
  course_id: number;
  second_preference_course_id: number;
  third_preference_course_id: number;
  exam_center_id: number;
  full_name: string;
  gender: string;
  dob: string;
  mobile: string;
  email: string;
  aadhaar: string;
  nationality: string;
  religion: string;
  category: string;
  seat_reservation_quota: string;
  caste: string;
  mother_tongue: string;
  nativity: string;
  blood_group: string;
  father_name: string;
  father_mobile: string;
  father_education: string;
  father_occupation: string;
  mother_name: string;
  mother_mobile: string;
  mother_education: string;
  mother_occupation: string;
  annual_family_income: number | string;
  parent_mobile: string;
  parent_email: string;
  address: string;
  communication_address: string;
  communication_city: string;
  communication_state: string;
  communication_district: string;
  communication_pincode: string;
  communication_country: string;
  permanent_address: string;
  permanent_city: string;
  permanent_state: string;
  permanent_district: string;
  permanent_pincode: string;
  permanent_country: string;
  city: string;
  state: string;
  pincode: string;
  is_disabled: string;
  disability_type: string;
  disability_percentage: number | string;
  dependent_of: string;
  seeking_admission_under_quota: string;
  scholarship_or_fee_concession: string;
  hostel_accommodation_required: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  emergency_contact_mobile: string;
  tenth_board: string;
  tenth_school: string;
  tenth_year: string;
  tenth_percentage: string;
  tenth_subjects: string;
  twelfth_board: string;
  twelfth_school: string;
  twelfth_year: string;
  twelfth_percentage: string;
  twelfth_stream: string;
  twelfth_subjects: string;
  ug_university: string;
  ug_college: string;
  ug_degree: string;
  ug_year: string;
  ug_percentage: string;
  pg_university: string;
  pg_college: string;
  pg_degree: string;
  pg_year: string;
  pg_percentage: string;
  previous_gap: string;
  extracurricular: string;
  achievements: string;
  form_status: string;
  payment_status: string;
  payment_id: string;
  payment_amount: number | string;
  updated_at: string;
  created_at: string;
  submitted_at: string;
  academic_year: string;
  academicMarks?: AcademicMark[];
}

interface ProgramDetails {
  program: string;
  degree: string;
  course: string;
  secondPreference: string;
  thirdPreference: string;
  examCenter: string;
}

interface SubjectMark {
  id: number;
  subject_name: string;
  marks_obtained: number;
  max_marks: number;
  grade: string;
  percentage: number;
  subject_order: number;
}

interface AcademicMark {
  id: number;
  qualification_level: string;
  register_number: string;
  board_or_university: string;
  school_or_college: string;
  year_of_passing: string;
  percentage_or_cgpa: string;
  stream_or_degree: string;
  subjects?: SubjectMark[];
}

const generateApplicationId = (
  programLevelId: number,
  degreeId: number,
  courseId: number,
  dbId: number
): string => {
  const paddedId = String(dbId).padStart(3, "0");
  const paddedCourseId = String(courseId).padStart(2, "0");
  return `LCSS${programLevelId}${degreeId}${paddedCourseId}2026${paddedId}`;
};

export default function AdmissionDetail() {
  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  const [formData, setFormData] = useState<FormData | null>(null);
  const [programDetails, setProgramDetails] = useState<ProgramDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormData();
  }, [email]);

  const fetchFormData = async () => {
    setLoading(true);
    try {
      const url = `/api/sys-ops/admissions/${encodeURIComponent(email)}`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        if (result.data) {
          setFormData(result.data);
          await fetchProgramDetails(
            result.data.program_level_id,
            result.data.degree_id,
            result.data.course_id,
            result.data.second_preference_course_id,
            result.data.third_preference_course_id,
            result.data.exam_center_id
          );
        } else {
          toast.error("Application not found");
          setTimeout(() => router.push("/sys-ops/admissions"), 2000);
        }
      } else {
        toast.error(result.error || "Failed to load application");
        setTimeout(() => router.push("/sys-ops/admissions"), 2000);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Error loading application");
      setTimeout(() => router.push("/sys-ops/admissions"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramDetails = async (
    programId: number,
    degreeId: number,
    courseId: number,
    secondPrefId: number,
    thirdPrefId: number,
    examCenterId: number
  ) => {
    try {
      const [programRes, degreeRes, courseRes, examCenterRes] =
        await Promise.all([
          fetch("/api/programs"),
          fetch(`/api/degrees?program_id=${programId}`),
          fetch(`/api/courses?degree_id=${degreeId}`),
          examCenterId ? fetch("/api/exam-centers") : null,
        ]);

      const [programs, degrees, courses, examCenters] = await Promise.all([
        programRes.json(),
        degreeRes.json(),
        courseRes.json(),
        examCenterRes ? examCenterRes.json() : [],
      ]);

      const program = programs.find((p: any) => p.id === programId);
      const degree = degrees.find((d: any) => d.id === degreeId);
      const course = courses.find((c: any) => c.id === courseId);
      const secondPref = courses.find((c: any) => c.id === secondPrefId);
      const thirdPref = courses.find((c: any) => c.id === thirdPrefId);
      const examCenter = examCenterId
        ? examCenters.find((e: any) => e.id === examCenterId)
        : null;

      const examCenterDisplay = examCenter
        ? examCenter.location
          ? `${examCenter.centre_name} - ${examCenter.location}`
          : examCenter.centre_name
        : "N/A";

      setProgramDetails({
        program: program?.discipline || "N/A",
        degree: degree?.degree_name || "N/A",
        course: course?.course_name || "N/A",
        secondPreference: secondPref?.course_name || "N/A",
        thirdPreference: thirdPref?.course_name || "N/A",
        examCenter: examCenterDisplay,
      });
    } catch (error) {
      console.error("Error fetching program details:", error);
    }
  };

  const handleDownload = () => {
    router.push(`/application-preview?email=${encodeURIComponent(email)}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this admission?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/sys-ops/admissions/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Admission deleted successfully");
        router.push("/sys-ops/admissions");
      } else {
        toast.error("Failed to delete admission");
      }
    } catch (error) {
      toast.error("Error deleting admission");
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
        <p className="text-gray-500">Application not found</p>
      </div>
    );
  }

  const applicationId = generateApplicationId(
    formData.program_level_id,
    formData.degree_id,
    formData.course_id,
    formData.id
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/sys-ops/admissions")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {formData.full_name || "Application Details"}
              </h1>
              <p className="text-gray-600 mt-1">
                Application ID:{" "}
                <span className="font-mono font-semibold text-primary">
                  {applicationId}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge
              status={
                formData.payment_status === "completed"
                  ? "Completed"
                  : formData.form_status || "Draft"
              }
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
            <FileText className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Application Summary</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Application ID
              </p>
              <p className="text-2xl font-bold font-mono">{applicationId}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Database ID
              </p>
              <p className="text-xl font-semibold">#{formData.id}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Applicant Name
              </p>
              <p className="text-xl font-semibold">
                {formData.full_name || "Not provided"}
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
                {formData.mobile || "Not provided"}
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
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Payment Status
              </p>
              <p className="text-lg font-semibold capitalize">
                {formData.payment_status || "Pending"}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Academic Year
              </p>
              <p className="text-lg font-medium">
                {formData.academic_year || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Program Details */}
        {programDetails && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">
                Program Details
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoField label="Program Level" value={programDetails.program} />
              <InfoField label="Degree" value={programDetails.degree} />
              <InfoField
                label="First Preference Course"
                value={programDetails.course}
              />
              <InfoField
                label="Second Preference Course"
                value={programDetails.secondPreference}
              />
              <InfoField
                label="Third Preference Course"
                value={programDetails.thirdPreference}
              />
              <InfoField
                label="Exam Center"
                value={programDetails.examCenter}
              />
            </div>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Personal Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField label="Full Name" value={formData.full_name} />
            <InfoField label="Gender" value={formData.gender} />
            <InfoField label="Date of Birth" value={formData.dob} />
            <InfoField label="Mobile" value={formData.mobile} />
            <InfoField label="Email" value={formData.email} />
            <InfoField label="Aadhaar Number" value={formData.aadhaar} />
            <InfoField label="Nationality" value={formData.nationality} />
            <InfoField label="Religion" value={formData.religion} />
            <InfoField label="Category" value={formData.category} />
            <InfoField label="Caste" value={formData.caste} />
            <InfoField label="Mother Tongue" value={formData.mother_tongue} />
            <InfoField label="Nativity" value={formData.nativity} />
            <InfoField label="Blood Group" value={formData.blood_group} />
            <InfoField
              label="Seat Reservation Quota"
              value={formData.seat_reservation_quota}
              className="md:col-span-2 lg:col-span-3"
            />
          </div>
        </div>

        {/* Parent Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Parent/Guardian Details
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-lg pb-2 border-b">
                Father Details
              </h3>
              <div className="space-y-4">
                <InfoField label="Name" value={formData.father_name} />
                <InfoField label="Mobile" value={formData.father_mobile} />
                <InfoField
                  label="Education"
                  value={formData.father_education}
                />
                <InfoField
                  label="Occupation"
                  value={formData.father_occupation}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-lg pb-2 border-b">
                Mother Details
              </h3>
              <div className="space-y-4">
                <InfoField label="Name" value={formData.mother_name} />
                <InfoField label="Mobile" value={formData.mother_mobile} />
                <InfoField
                  label="Education"
                  value={formData.mother_education}
                />
                <InfoField
                  label="Occupation"
                  value={formData.mother_occupation}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
            <InfoField
              label="Annual Family Income"
              value={
                formData.annual_family_income
                  ? `₹${parseFloat(
                      formData.annual_family_income.toString()
                    ).toLocaleString()}`
                  : "N/A"
              }
            />
            <InfoField label="Parent Mobile" value={formData.parent_mobile} />
            <InfoField label="Parent Email" value={formData.parent_email} />
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Home className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-lg pb-2 border-b">
                Communication Address
              </h3>
              <InfoField
                label="Address"
                value={formData.communication_address}
              />
              <InfoField label="City" value={formData.communication_city} />
              <InfoField
                label="District"
                value={formData.communication_district}
              />
              <InfoField label="State" value={formData.communication_state} />
              <InfoField
                label="Pincode"
                value={formData.communication_pincode}
              />
              <InfoField
                label="Country"
                value={formData.communication_country}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-lg pb-2 border-b">
                Permanent Address
              </h3>
              <InfoField label="Address" value={formData.permanent_address} />
              <InfoField label="City" value={formData.permanent_city} />
              <InfoField label="District" value={formData.permanent_district} />
              <InfoField label="State" value={formData.permanent_state} />
              <InfoField label="Pincode" value={formData.permanent_pincode} />
              <InfoField label="Country" value={formData.permanent_country} />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Phone className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Emergency Contact
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <InfoField label="Name" value={formData.emergency_contact_name} />
            <InfoField
              label="Relation"
              value={formData.emergency_contact_relation}
            />
            <InfoField
              label="Mobile"
              value={formData.emergency_contact_mobile}
            />
          </div>
        </div>

        {/* Educational Qualifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Academic Records
            </h2>
          </div>

          {/* Educational Qualifications from academic_marks table */}
          {formData.academicMarks && formData.academicMarks.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">
                  Academic Records
                </h2>
              </div>

              {formData.academicMarks.map((mark) => (
                <div key={mark.id} className="mb-8 last:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                    {mark.qualification_level === "10th" && "10th Standard"}
                    {mark.qualification_level === "12th" && "12th Standard"}
                    {mark.qualification_level === "ug" && "Undergraduate (UG)"}
                    {mark.qualification_level === "pg" && "Postgraduate (PG)"}
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InfoField
                      label="Register Number"
                      value={mark.register_number}
                    />
                    <InfoField
                      label={
                        mark.qualification_level === "10th" ||
                        mark.qualification_level === "12th"
                          ? "Board"
                          : "University"
                      }
                      value={mark.board_or_university}
                    />
                    <InfoField
                      label={
                        mark.qualification_level === "10th" ||
                        mark.qualification_level === "12th"
                          ? "School"
                          : "College"
                      }
                      value={mark.school_or_college}
                    />
                    <InfoField
                      label="Year of Passing"
                      value={mark.year_of_passing}
                    />
                    <InfoField
                      label="Percentage/CGPA"
                      value={mark.percentage_or_cgpa}
                    />
                    {mark.stream_or_degree && (
                      <InfoField
                        label={
                          mark.qualification_level === "12th"
                            ? "Stream"
                            : "Degree"
                        }
                        value={mark.stream_or_degree}
                      />
                    )}
                  </div>

                  {/* Subject-wise marks for 12th standard */}
                  {mark.qualification_level === "12th" &&
                    mark.subjects &&
                    mark.subjects.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-semibold text-gray-700 mb-4">
                          Subject-wise Marks
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                  Subject
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                  Marks Obtained
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                  Max Marks
                                </th>
                                {mark.subjects[0].grade && (
                                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                    Grade
                                  </th>
                                )}
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                  Percentage
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {mark.subjects.map((subject, index) => (
                                <tr
                                  key={subject.id}
                                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                  <td className="py-3 px-4 text-sm text-gray-900">
                                    {subject.subject_name}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-600">
                                    {subject.marks_obtained || "N/A"}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-600">
                                    {subject.max_marks || "N/A"}
                                  </td>
                                  {subject.grade && (
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                      {subject.grade}
                                    </td>
                                  )}
                                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    {subject.percentage
                                      ? `${subject.percentage}%`
                                      : "N/A"}
                                  </td>
                                </tr>
                              ))}
                              {/* Total Row */}
                              <tr className="bg-green-50 border-t-2 border-green-600 font-semibold">
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  Total
                                </td>
                                <td className="py-3 px-4 text-sm text-green-700">
                                  {mark.subjects
                                    .reduce(
                                      (sum, s) =>
                                        sum +
                                        parseFloat(
                                          s.marks_obtained?.toString() || "0"
                                        ),
                                      0
                                    )
                                    .toFixed(2)}
                                </td>
                                <td className="py-3 px-4 text-sm text-green-700">
                                  {mark.subjects
                                    .reduce(
                                      (sum, s) =>
                                        sum +
                                        parseFloat(
                                          s.max_marks?.toString() || "0"
                                        ),
                                      0
                                    )
                                    .toFixed(2)}
                                </td>
                                {mark.subjects[0].grade && (
                                  <td className="py-3 px-4 text-sm text-green-700">
                                    -
                                  </td>
                                )}
                                <td className="py-3 px-4 text-sm font-bold text-green-700">
                                  {(() => {
                                    const totalMarks = mark.subjects.reduce(
                                      (sum, s) =>
                                        sum +
                                        parseFloat(
                                          s.marks_obtained?.toString() || "0"
                                        ),
                                      0
                                    );
                                    const totalMax = mark.subjects.reduce(
                                      (sum, s) =>
                                        sum +
                                        parseFloat(
                                          s.max_marks?.toString() || "0"
                                        ),
                                      0
                                    );
                                    return totalMax > 0
                                      ? `${(
                                          (totalMarks / totalMax) *
                                          100
                                        ).toFixed(2)}%`
                                      : "N/A";
                                  })()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Additional Information
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField
              label="Disabled"
              value={formData.is_disabled === "yes" ? "Yes" : "No"}
            />
            {formData.is_disabled === "yes" && (
              <>
                <InfoField
                  label="Disability Type"
                  value={formData.disability_type}
                />
                <InfoField
                  label="Disability Percentage"
                  value={
                    formData.disability_percentage
                      ? `${formData.disability_percentage}%`
                      : "N/A"
                  }
                />
              </>
            )}
            <InfoField
              label="Dependent Of"
              value={
                formData.dependent_of !== "none"
                  ? formData.dependent_of
                  : "None"
              }
            />
            <InfoField
              label="Seeking Admission Under Quota"
              value={
                formData.seeking_admission_under_quota === "yes" ? "Yes" : "No"
              }
            />
            <InfoField
              label="Scholarship/Fee Concession"
              value={
                formData.scholarship_or_fee_concession === "yes" ? "Yes" : "No"
              }
            />
            <InfoField
              label="Hostel Accommodation Required"
              value={
                formData.hostel_accommodation_required === "yes" ? "Yes" : "No"
              }
            />
          </div>

          {formData.previous_gap && (
            <div className="mt-6">
              <InfoField
                label="Previous Gap in Education"
                value={formData.previous_gap}
              />
            </div>
          )}

          {formData.extracurricular && (
            <div className="mt-6">
              <InfoField
                label="Extracurricular Activities"
                value={formData.extracurricular}
              />
            </div>
          )}

          {formData.achievements && (
            <div className="mt-6">
              <InfoField label="Achievements" value={formData.achievements} />
            </div>
          )}
        </div>

        {/* Payment & Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Payment & Timeline
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField label="Payment ID" value={formData.payment_id} />
            <InfoField
              label="Payment Amount"
              value={
                formData.payment_amount
                  ? `₹${parseFloat(formData.payment_amount.toString()).toFixed(
                      2
                    )}`
                  : "N/A"
              }
            />
            <InfoField
              label="Submitted At"
              value={
                formData.submitted_at
                  ? new Date(formData.submitted_at).toLocaleString()
                  : "Not Submitted"
              }
            />
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
      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 font-medium">
        {value || "N/A"}
      </div>
    </div>
  );
}
