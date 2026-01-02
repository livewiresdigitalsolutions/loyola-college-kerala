// app/sys-ops/components/RecentApplications.tsx
"use client";

interface RecentApplicationsProps {
  data: Array<{
    full_name: string;
    email: string;
    program: string;
    course: string;
    payment_status: string;
    form_status: string;
    created_at: string;
  }>;
}

export default function RecentApplications({ data }: RecentApplicationsProps) {
  const getStatusBadge = (paymentStatus: string, formStatus: string) => {
    if (paymentStatus === "completed") {
      return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Submitted</span>;
    }
    if (paymentStatus === "pending") {
      return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Payment Pending</span>;
    }
    return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Draft</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Applicant</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Program</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((app, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{app.full_name}</p>
                  <p className="text-sm text-gray-600">{app.email}</p>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">{app.program}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{app.course}</td>
              <td className="py-3 px-4">{getStatusBadge(app.payment_status, app.form_status)}</td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {new Date(app.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <p className="text-center text-gray-500 py-8">No recent applications</p>
      )}
    </div>
  );
}
