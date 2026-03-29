'use client'

import React, { useState, useEffect } from 'react'
import { Smartphone, Building2, ShieldCheck, ChevronDown, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import LimitedPhoneInput from '../../_components/PhoneNumberInput'

const PRESET_AMOUNTS = [500, 1000, 2500, 5000]

const FUND_OPTIONS = [
  { value: 'general', label: 'General Fund', description: 'Support our overall mission and daily operations.' },
  { value: 'education', label: 'Education Fund', description: 'Support educational programs for underprivileged students.' },
  { value: 'counselling', label: 'Counselling Services', description: 'Fund mental health and counselling initiatives.' },
  { value: 'community', label: 'Community Development', description: 'Support community upliftment projects.' },
]

// Declare Razorpay type for the checkout modal
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function DonateForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Modal State
  const statusParam = searchParams.get('status')
  const [showModal, setShowModal] = useState(!!statusParam)
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)

  useEffect(() => {
    if (showModal) {
      verifyPayment()
    }
  }, [showModal])

  const verifyPayment = async () => {
    try {
      if (statusParam === 'failure') {
        setVerified(false)
        setVerifying(false)
        return
      }

      let txnid = searchParams.get('txnid')
      let email = searchParams.get('email')

      if (!txnid) txnid = localStorage.getItem('les_donate_pending_txnid')
      if (!email) email = localStorage.getItem('les_donate_pending_email')

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

  const [donationType] = useState<'one-time' | 'recurring'>('one-time')
  const [selectedFund, setSelectedFund] = useState('general')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500)
  const [customAmount, setCustomAmount] = useState('')
  const [isFundOpen, setIsFundOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Donor info
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorPhone, setDonorPhone] = useState('')

  const currentFund = FUND_OPTIONS.find((f) => f.value === selectedFund)

  const getFinalAmount = (): number => {
    if (customAmount) return parseFloat(customAmount)
    return selectedAmount || 0
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setSelectedAmount(null)
  }

  const validateForm = (): boolean => {
    const amount = getFinalAmount()
    if (!amount || amount <= 0) {
      toast.error('Please select or enter a donation amount')
      return false
    }
    if (!donorName.trim()) {
      toast.error('Please enter your name')
      return false
    }
    if (/\d/.test(donorName)) {
      toast.error('Name should not contain numbers')
      return false
    }
    if (!donorEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
      toast.error('Please enter a valid email address')
      return false
    }
    if (!donorPhone || donorPhone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid phone number')
      return false
    }
    return true
  }


  // ─── Easebuzz Payment ───
  const handleEasebuzzPayment = async () => {
    if (!validateForm()) return

    const amount = getFinalAmount()
    setIsProcessing(true)

    try {
      // Store pending info for callback
      localStorage.setItem('les_donate_pending_email', donorEmail.trim())

      const res = await fetch('/api/les/donate/easebuzz-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          fund: selectedFund,
          donationType,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          donorPhone: donorPhone.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok && data.success && data.paymentUrl) {
        // Store txnid for verification after redirect
        localStorage.setItem('les_donate_pending_txnid', data.txnid)
        window.location.href = data.paymentUrl
      } else {
        toast.error(data.error || data.message || 'Failed to initiate payment')
        setIsProcessing(false)
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <section className="bg-[#F6F6EE]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT — Donation Form Card */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d4a33] mb-8">
              Make a Donation
            </h2>


            {/* Fund Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I want to support
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsFundOpen(!isFundOpen)}
                  className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-left hover:border-[#0d4a33]/40 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{currentFund?.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{currentFund?.description}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${
                      isFundOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {isFundOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {FUND_OPTIONS.map((fund) => (
                      <button
                        key={fund.value}
                        onClick={() => {
                          setSelectedFund(fund.value)
                          setIsFundOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-[#0d4a33]/5 transition-colors cursor-pointer ${
                          selectedFund === fund.value ? 'bg-[#0d4a33]/10' : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-800">{fund.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{fund.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Amount (INR)
              </label>
              <div className="grid grid-cols-4 gap-3 mb-3">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      selectedAmount === amount
                        ? 'bg-[#0d4a33] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ₹{amount.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter custom amount"
                  className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0d4a33] focus:ring-1 focus:ring-[#0d4a33]/20 transition-all"
                />
              </div>
            </div>

            {/* Donor Information */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Information
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value.replace(/[0-9]/g, ''))}
                  placeholder="Full Name *"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0d4a33] focus:ring-1 focus:ring-[#0d4a33]/20 transition-all"
                />
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="Email Address *"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0d4a33] focus:ring-1 focus:ring-[#0d4a33]/20 transition-all"
                />
                <div className="w-full border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0d4a33] focus-within:ring-1 focus-within:ring-[#0d4a33]/20 transition-all">
                  <PhoneInput
                    defaultCountry="IN"
                    international
                    countryCallingCodeEditable={false}
                    limitMaxLength={true}
                    value={donorPhone}
                    onChange={(value) => setDonorPhone(value || '')}
                    placeholder="Phone Number *"
                    className="w-full px-4 py-3 bg-white border-none outline-none [&>input]:outline-none [&>input]:bg-transparent [&>input]:text-sm"
                    inputComponent={LimitedPhoneInput}
                  />
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mt-8">
              <button
                onClick={handleEasebuzzPayment}
                disabled={isProcessing}
                className="w-full flex items-center justify-center py-4 px-4 bg-[#0d4a33] text-white rounded-xl hover:bg-[#0b3d2b] transition-colors shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="font-semibold text-base tracking-wide uppercase">Pay</span>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT — Bank Details & QR Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Code Card */}
            <div className="bg-[#0d4a33] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-5 h-5" />
                <h3 className="text-lg font-bold">Scan to Donate</h3>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-white rounded-xl p-4 mx-auto w-fit mb-4">
                <svg width="160" height="160" viewBox="0 0 160 160" className="block">
                  <rect width="160" height="160" fill="white" />
                  <rect x="10" y="10" width="40" height="40" rx="4" fill="#0d4a33" />
                  <rect x="16" y="16" width="28" height="28" rx="2" fill="white" />
                  <rect x="22" y="22" width="16" height="16" rx="1" fill="#0d4a33" />
                  <rect x="110" y="10" width="40" height="40" rx="4" fill="#0d4a33" />
                  <rect x="116" y="16" width="28" height="28" rx="2" fill="white" />
                  <rect x="122" y="22" width="16" height="16" rx="1" fill="#0d4a33" />
                  <rect x="10" y="110" width="40" height="40" rx="4" fill="#0d4a33" />
                  <rect x="16" y="116" width="28" height="28" rx="2" fill="white" />
                  <rect x="22" y="122" width="16" height="16" rx="1" fill="#0d4a33" />
                  <rect x="60" y="10" width="8" height="8" fill="#0d4a33" />
                  <rect x="76" y="10" width="8" height="8" fill="#0d4a33" />
                  <rect x="92" y="10" width="8" height="8" fill="#0d4a33" />
                  <rect x="60" y="26" width="8" height="8" fill="#0d4a33" />
                  <rect x="84" y="26" width="8" height="8" fill="#0d4a33" />
                  <rect x="60" y="42" width="8" height="8" fill="#0d4a33" />
                  <rect x="76" y="42" width="8" height="8" fill="#0d4a33" />
                  <rect x="92" y="42" width="8" height="8" fill="#0d4a33" />
                  <rect x="10" y="60" width="8" height="8" fill="#0d4a33" />
                  <rect x="26" y="60" width="8" height="8" fill="#0d4a33" />
                  <rect x="42" y="60" width="8" height="8" fill="#0d4a33" />
                  <rect x="60" y="60" width="8" height="8" fill="#0d4a33" />
                  <rect x="76" y="60" width="8" height="8" fill="#0d4a33" />
                  <rect x="92" y="60" width="8" height="8" fill="#0d4a33" />
                  <rect x="110" y="60" width="8" height="8" fill="#0d4a33" />
                  <rect x="126" y="60" width="8" height="8" fill="#0d4a33" />
                  <rect x="142" y="60" width="8" height="8" fill="#0d4a33" />
                  <rect x="10" y="76" width="8" height="8" fill="#0d4a33" />
                  <rect x="42" y="76" width="8" height="8" fill="#0d4a33" />
                  <rect x="60" y="76" width="8" height="8" fill="#0d4a33" />
                  <rect x="84" y="76" width="8" height="8" fill="#0d4a33" />
                  <rect x="110" y="76" width="8" height="8" fill="#0d4a33" />
                  <rect x="142" y="76" width="8" height="8" fill="#0d4a33" />
                  <rect x="10" y="92" width="8" height="8" fill="#0d4a33" />
                  <rect x="26" y="92" width="8" height="8" fill="#0d4a33" />
                  <rect x="42" y="92" width="8" height="8" fill="#0d4a33" />
                  <rect x="60" y="92" width="8" height="8" fill="#0d4a33" />
                  <rect x="76" y="92" width="8" height="8" fill="#0d4a33" />
                  <rect x="92" y="92" width="8" height="8" fill="#0d4a33" />
                  <rect x="110" y="92" width="8" height="8" fill="#0d4a33" />
                  <rect x="126" y="92" width="8" height="8" fill="#0d4a33" />
                  <rect x="142" y="92" width="8" height="8" fill="#0d4a33" />
                  <rect x="60" y="110" width="8" height="8" fill="#0d4a33" />
                  <rect x="76" y="110" width="8" height="8" fill="#0d4a33" />
                  <rect x="110" y="110" width="8" height="8" fill="#0d4a33" />
                  <rect x="142" y="110" width="8" height="8" fill="#0d4a33" />
                  <rect x="60" y="126" width="8" height="8" fill="#0d4a33" />
                  <rect x="92" y="126" width="8" height="8" fill="#0d4a33" />
                  <rect x="110" y="126" width="8" height="8" fill="#0d4a33" />
                  <rect x="126" y="126" width="8" height="8" fill="#0d4a33" />
                  <rect x="60" y="142" width="8" height="8" fill="#0d4a33" />
                  <rect x="76" y="142" width="8" height="8" fill="#0d4a33" />
                  <rect x="92" y="142" width="8" height="8" fill="#0d4a33" />
                  <rect x="110" y="142" width="8" height="8" fill="#0d4a33" />
                  <rect x="142" y="142" width="8" height="8" fill="#0d4a33" />
                </svg>
              </div>

              <p className="text-sm text-white/70 text-center">
                Scan with GPay, PhonePe, Paytm or any UPI app
              </p>
            </div>

            {/* Bank Transfer Details */}
            <div className="bg-[#0d4a33] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-5">
                <Building2 className="w-5 h-5" />
                <h3 className="text-lg font-bold">Bank Transfer Details</h3>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Account Name', value: 'Loyola Extension Services' },
                  { label: 'Account Number', value: '1234 5678 9012 3456' },
                  { label: 'IFSC Code', value: 'SBIN0010043' },
                  { label: 'Bank Name', value: 'State Bank of India' },
                  { label: 'Branch', value: 'Sreekaryam' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-start py-2 border-b border-white/10 last:border-0"
                  >
                    <span className="text-sm text-white/60">{item.label}</span>
                    <span className="text-sm font-medium text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Exemption */}
            <div className="bg-[#e8f5ec] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#0d4a33]" />
                <h3 className="text-lg font-bold text-[#0d4a33]">Tax Exemption</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                All donations to Loyola Extension Services are eligible for tax exemption under
                Section 80G of the Income Tax Act.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                You will receive an 80G compliant receipt via email within 5-7 working days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative animate-in fade-in zoom-in duration-300">
            {verifying ? (
              <div className="py-12">
                <Loader2 className="w-12 h-12 text-[#0d4a33] animate-spin mx-auto mb-4" />
                <p className="text-lg text-gray-700 font-medium">Verifying your payment...</p>
                <p className="text-sm text-gray-500 mt-2">Please do not close this window</p>
              </div>
            ) : verified && transactionData ? (
              <>
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-green-700 mb-3">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  Your donation was successful. Thank you for supporting our cause!
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left space-y-2">
                  <p className="text-sm text-green-800 flex justify-between">
                    <span className="font-semibold">Transaction ID:</span>
                    <span className="font-mono">{transactionData.txnid}</span>
                  </p>
                  <p className="text-sm text-green-800 flex justify-between">
                    <span className="font-semibold">Amount:</span>
                    <span className="font-bold">₹{transactionData.amount}</span>
                  </p>
                  {transactionData.fund && (
                    <p className="text-sm text-green-800 flex justify-between">
                      <span className="font-semibold">Fund:</span>
                      <span className="capitalize">{transactionData.fund}</span>
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  An 80G tax exemption receipt will be sent to your email within 5-7 working days.
                </p>

                <button
                  onClick={() => {
                    setShowModal(false)
                    router.push('/les/donate')
                  }}
                  className="w-full py-3 bg-[#0d4a33] text-white rounded-xl hover:bg-[#0b3d2b] transition-colors font-semibold"
                >
                  Close & Done
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <XCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-red-700 mb-3">Payment Failed</h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t verify your payment or the transaction failed. If the amount was deducted, please contact us.
                </p>
                <button
                  onClick={() => {
                    setShowModal(false)
                    router.push('/les/donate')
                  }}
                  className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
