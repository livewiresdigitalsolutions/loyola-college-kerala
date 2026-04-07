"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Search, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface PendingPayment {
  id: number;
  user_email: string;
  full_name: string;
  mobile: string;
  payment_status: string;
  payment_id: string | null;
  payment_amount: number | null;
  form_status: string;
  created_at: string;
  submitted_at: string | null;
  updated_at: string;
}

interface VerifyResult {
  email: string;
  status: "success" | "failed" | "pending";
  message: string;
  txnid?: string;
  amount?: string;
  paymentId?: string;
}

export default function PaymentStatusPage() {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [manualTxnid, setManualTxnid] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verifyResults, setVerifyResults] = useState<Record<string, VerifyResult>>({});
  const [txnInputs, setTxnInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/sys-ops/payment-status");
      if (response.ok) {
        const data = await response.json();
        setPendingPayments(data.data || []);
      } else {
        toast.error("Failed to load pending payments");
      }
    } catch {
      toast.error("Error loading payment data");
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (email: string, txnid: string) => {
    if (!txnid.trim()) {
      toast.error("Please enter a Transaction ID (txnid) to verify");
      return;
    }
    setVerifying(email);
    try {
      const response = await fetch("/api/payment/verify-easebuzz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txnid: txnid.trim(), email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setVerifyResults((prev) => ({
          ...prev,
          [email]: {
            email,
            status: "success",
            message: "Payment verified and updated successfully",
            txnid: result.transaction?.txnid,
            amount: result.transaction?.amount,
            paymentId: result.transaction?.easepayid,
          },
        }));
        toast.success(`Payment verified for ${email}`);
        // Refresh the list after a short delay
        setTimeout(fetchPendingPayments, 1500);
      } else {
        const errMsg = result.error || "Verification failed";
        setVerifyResults((prev) => ({
          ...prev,
          [email]: {
            email,
            status: result.status === "pending" ? "pending" : "failed",
            message: errMsg,
          },
        }));
        toast.error(errMsg);
      }
    } catch {
      setVerifyResults((prev) => ({
        ...prev,
        [email]: { email, status: "failed", message: "Network error during verification" },
      }));
      toast.error("Verification request failed");
    } finally {
      setVerifying(null);
    }
  };

  const handleManualVerify = () => {
    if (!manualTxnid.trim() || !manualEmail.trim()) {
      toast.error("Both email and Transaction ID are required");
      return;
    }
    verifyPayment(manualEmail.trim(), manualTxnid.trim());
  };

  const filteredPayments = pendingPayments.filter(
    (p) =>
      !searchEmail ||
      p.user_email.toLowerCase().includes(searchEmail.toLowerCase()) ||
      (p.full_name || "").toLowerCase().includes(searchEmail.toLowerCase())
  );

  const getStatusIcon = (result: VerifyResult) => {
    if (result.status === "success") return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (result.status === "pending") return <Clock className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Status</h1>
          <p className="text-gray-600 mt-1">
            Manually verify and update payment status for applications where the payment gateway callback may have failed.
          </p>
        </div>

        {/* Manual Verification Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-800">Manual Payment Verification</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            If you have the Easebuzz Transaction ID (txnid) from the payment gateway dashboard, enter it here to verify and update the application status.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Applicant email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
            />
            <input
              type="text"
              placeholder="Transaction ID (e.g. TXN1712345678901)"
              value={manualTxnid}
              onChange={(e) => setManualTxnid(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
            />
            <button
              onClick={handleManualVerify}
              disabled={verifying === manualEmail}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm font-medium disabled:opacity-50"
            >
              {verifying === manualEmail ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Verify Payment
            </button>
          </div>
          {manualEmail && verifyResults[manualEmail] && (
            <div className={`mt-3 flex items-start gap-2 p-3 rounded-lg text-sm ${
              verifyResults[manualEmail].status === "success"
                ? "bg-green-50 text-green-700"
                : verifyResults[manualEmail].status === "pending"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
            }`}>
              {getStatusIcon(verifyResults[manualEmail])}
              <div>
                <p className="font-medium">{verifyResults[manualEmail].message}</p>
                {verifyResults[manualEmail].paymentId && (
                  <p className="text-xs mt-0.5">Payment ID: {verifyResults[manualEmail].paymentId} | Amount: ₹{verifyResults[manualEmail].amount}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pending Payments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Applications with Pending / Incomplete Payment
              <span className="ml-2 text-sm font-normal text-gray-500">({pendingPayments.length} records)</span>
            </h2>
            <button
              onClick={fetchPendingPayments}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="font-medium">No pending payments found</p>
              <p className="text-sm mt-1">All submitted applications have completed payment status.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Name / Email</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Mobile</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Form Status</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Payment Status</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Applied On</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Transaction ID</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => {
                    const result = verifyResults[payment.user_email];
                    return (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-900">{payment.full_name || "N/A"}</p>
                          <p className="text-xs text-gray-500">{payment.user_email}</p>
                        </td>
                        <td className="py-3 px-3 text-gray-600">{payment.mobile || "N/A"}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            payment.form_status === "submitted"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {payment.form_status || "draft"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            payment.payment_status === "completed"
                              ? "bg-green-100 text-green-700"
                              : payment.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {payment.payment_status || "not paid"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-500 text-xs">
                          {payment.created_at
                            ? new Date(payment.created_at).toLocaleDateString("en-IN")
                            : "N/A"}
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            placeholder="Enter txnid..."
                            value={txnInputs[payment.user_email] ?? (payment.payment_id?.startsWith("TXN") ? payment.payment_id : "")}
                            onChange={(e) =>
                              setTxnInputs((prev) => ({ ...prev, [payment.user_email]: e.target.value }))
                            }
                            className="w-44 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-primary focus:border-transparent outline-none"
                          />
                          {result && (
                            <div className={`flex items-center gap-1 mt-1 text-xs ${
                              result.status === "success" ? "text-green-600" : result.status === "pending" ? "text-yellow-600" : "text-red-600"
                            }`}>
                              {getStatusIcon(result)}
                              <span className="truncate max-w-[160px]">{result.message}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() =>
                              verifyPayment(
                                payment.user_email,
                                txnInputs[payment.user_email] ?? (payment.payment_id?.startsWith("TXN") ? payment.payment_id! : "")
                              )
                            }
                            disabled={verifying === payment.user_email}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-xs font-medium disabled:opacity-50"
                          >
                            {verifying === payment.user_email ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                            Verify
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
