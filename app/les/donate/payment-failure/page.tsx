'use client'

import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function DonatePaymentFailure() {
  return (
    <div className="bg-[#F6F6EE] min-h-screen">
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-red-700 mb-3">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            Your donation payment could not be processed. No amount has been deducted from your account.
          </p>

          <div className="space-y-3">
            <Link
              href="/les/donate"
              className="block w-full py-3 bg-[#0d4a33] text-white rounded-xl hover:bg-[#0b3d2b] transition-colors font-semibold text-center"
            >
              Try Again
            </Link>
            <Link
              href="/les/contact"
              className="block w-full py-3 bg-white border-2 border-[#0d4a33]/20 text-[#0d4a33] rounded-xl hover:border-[#0d4a33]/40 transition-colors font-semibold text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
