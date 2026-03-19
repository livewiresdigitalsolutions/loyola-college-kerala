"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface Donation {
  id: number;
  txnid: string;
  easepayid: string | null;
  amount: string;
  status: string;
  name: string;
  email: string;
  phone: string;
  fund: string;
  donation_type: string;
  gateway: string;
  created_at: string;
}

export default function LesDonationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/sys-ops/les-donations");
      if (res.ok) {
        const data = await res.json();
        setItems(data.donations || []);
      }
    } catch {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.txnid?.toLowerCase().includes(search.toLowerCase()) ||
      item.fund?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Donations & Transactions
            </h1>
            <p className="text-gray-600 mt-1">
              View incoming donation transactions for LES
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50 flex-wrap gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, txn id..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="text-sm text-gray-700 font-medium bg-green-100 px-4 py-2 rounded-lg border border-green-200">
              Successful Transactions:{" "}
              {
                items.filter((i) => i.status.toLowerCase() === "success")
                  .length
              }
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No donation transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Txn ID
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Donor Details
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Type & Fund
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}{" "}
                        {new Date(item.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {item.txnid}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {item.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                          {item.donation_type}
                        </span>
                        <div className="text-gray-600 font-medium capitalize truncate max-w-[150px]">
                          {item.fund}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        ₹ {parseFloat(item.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status.toLowerCase() === "success"
                              ? "bg-green-100 text-green-800"
                              : item.status.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
