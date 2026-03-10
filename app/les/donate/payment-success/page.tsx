'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function DonateSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)

  useEffect(() => {
    verifyPayment()
  }, [])

  const verifyPayment = async () => {
    try {
      let txnid = searchParams.get('txnid')
      let email = searchParams.get('email')

      if (!txnid) {
        txnid = localStorage.getItem('les_donate_pending_txnid')
      }
      if (!email) {
        email = localStorage.getItem('les_donate_pending_email')
      }

      if (!txnid) {
        setVerifying(false)
        return
      }

      const response = await fetch('/api/les/donate/verify-easebuzz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txnid, email }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setVerified(true)
        setTransactionData(result.transaction)
        localStorage.removeItem('les_donate_pending_txnid')
        localStorage.removeItem('les_donate_pending_email')
      } else {
        setVerified(false)
      }
    } catch {
      setVerified(false)
    } finally {
      setVerifying(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#0d4a33] animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Verifying your donation payment...</p>
          <p className="text-sm text-gray-500 mt-2">Please do not close this window</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {verified && transactionData ? (
          <>
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-green-700 mb-3">Thank You!</h1>
            <p className="text-gray-600 mb-6">
              Your donation has been received successfully. Thank you for supporting our cause.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left space-y-2">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Transaction ID:</span>{' '}
                <span className="font-mono">{transactionData.txnid}</span>
              </p>
              {transactionData.easepayid && (
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Payment ID:</span>{' '}
                  <span className="font-mono">{transactionData.easepayid}</span>
                </p>
              )}
              <p className="text-sm text-green-800">
                <span className="font-semibold">Amount:</span> ₹{transactionData.amount}
              </p>
              {transactionData.fund && (
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Fund:</span>{' '}
                  <span className="capitalize">{transactionData.fund}</span>
                </p>
              )}
              {transactionData.mode && (
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Payment Mode:</span>{' '}
                  <span className="uppercase">{transactionData.mode}</span>
                </p>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-6">
              An 80G tax exemption receipt will be sent to your email within 5-7 working days.
            </p>

            <Link
              href="/les/donate"
              className="inline-block w-full py-3 bg-[#0d4a33] text-white rounded-xl hover:bg-[#0b3d2b] transition-colors font-semibold text-center"
            >
              Back to Donate Page
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-red-700 mb-3">Verification Failed</h1>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t verify your donation payment. If the amount was deducted, please contact us.
            </p>

            <Link
              href="/les/donate"
              className="inline-block w-full py-3 bg-[#0d4a33] text-white rounded-xl hover:bg-[#0b3d2b] transition-colors font-semibold text-center"
            >
              Try Again
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function DonatePaymentSuccess() {
  return (
    <div className="bg-[#F6F6EE] min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#0d4a33] animate-spin" />
          </div>
        }
      >
        <DonateSuccessContent />
      </Suspense>
    </div>
  )
}
