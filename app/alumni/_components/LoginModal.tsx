'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, X, ArrowLeft } from 'lucide-react'
import { useAlumniAuth } from './AlumniAuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

type View = 'login' | 'register' | 'forgot' | 'otp'

const countries: string[] = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
  'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
  'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
  'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica',
  'Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt',
  'El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon',
  'Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana',
  'Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel',
  'Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos',
  'Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi',
  'Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova',
  'Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands',
  'New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau',
  'Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania',
  'Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino',
  'Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
  'Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden',
  'Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago',
  'Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States',
  'Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAlumniAuth()
  const [view, setView] = useState<View>('login')
  const [loading, setLoading] = useState(false)

  // Login
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Register
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regCountry, setRegCountry] = useState('')
  const [regCity, setRegCity] = useState('')
  const [regError, setRegError] = useState('')

  // Forgot / OTP
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')

  const inputClass = 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1a5632] focus:ring-2 focus:ring-[#1a5632]/20 outline-none transition text-gray-900 text-sm'

  const handleClose = () => {
    setView('login')
    setLoginError(''); setRegError(''); setForgotError(''); setForgotSuccess('')
    onClose()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)
    try {
      const res = await fetch('/api/alumni/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      login({ name: data.name, email: data.email })
      handleClose()
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    if (regPassword.length < 6) { setRegError('Password must be at least 6 characters.'); return }
    if (regPassword !== regConfirmPassword) { setRegError('Passwords do not match.'); return }
    if (regPhone && !/^\d{10,15}$/.test(regPhone)) { setRegError('Enter a valid phone number (10–15 digits).'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/alumni/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, phone: regPhone, country: regCountry, city: regCity }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      login({ name: data.name, email: data.email })
      handleClose()
    } catch (err) {
      setRegError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError(''); setForgotSuccess('')
    setLoading(true)
    try {
      const res = await fetch('/api/alumni/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP')
      setForgotSuccess('OTP sent! Check your email inbox.')
      setView('otp')
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setLoading(true)
    try {
      const res = await fetch('/api/alumni/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid OTP')
      setForgotSuccess('OTP verified! You may now reset your password.')
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-h-[92vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
          <X size={20} />
        </button>

        {/* ── LOGIN ── */}
        {view === 'login' && (
          <>
            <div className="flex justify-center mb-6">
              <Image src="/assets/loyolalogogreen.png" alt="Loyola College" width={200} height={56} className="h-12 w-auto" />
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Alumni Login</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to your alumni account</p>
            </div>
            {loginError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{loginError}</div>}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input id="modal-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input id="modal-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#1a5632] focus:ring-[#1a5632]" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button type="button" onClick={() => setView('forgot')} className="text-[#1a5632] hover:underline font-medium">Forgot password?</button>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#1a5632] hover:bg-[#154a2b] disabled:opacity-60 text-white py-3 rounded-lg font-semibold text-sm transition-all">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-gray-400">Not a member yet?</span></div>
            </div>
            <button onClick={() => setView('register')} className="block w-full text-center py-3 border-2 border-[#1a5632] text-[#1a5632] rounded-lg font-semibold text-sm hover:bg-[#1a5632]/5 transition-all">Register</button>
          </>
        )}

        {/* ── REGISTER ── */}
        {view === 'register' && (
          <>
            <button onClick={() => setView('login')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-4 transition"><ArrowLeft size={15} /> Back to Login</button>
            <h2 className="text-xl font-bold text-[#1a5632] mb-6">New Alumni Registration</h2>
            {regError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{regError}</div>}
            <form onSubmit={handleRegister} className="space-y-4">
              <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Your name" required className={inputClass} />
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Email" required className={inputClass} />
              <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Password" required minLength={6} className={inputClass} />
              <input type="password" value={regConfirmPassword} onChange={e => setRegConfirmPassword(e.target.value)} placeholder="Confirm password" required className={inputClass} />
              <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="Phone number" className={inputClass} />
              <select value={regCountry} onChange={e => setRegCountry(e.target.value)} className={`${inputClass} ${!regCountry ? 'text-gray-400' : ''}`}>
                <option value="">Select your country</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" value={regCity} onChange={e => setRegCity(e.target.value)} placeholder="Your city" className={inputClass} />
              <div className="flex items-center justify-end gap-4 pt-2">
                <button type="submit" disabled={loading} className="bg-[#1a5632] hover:bg-[#154a2b] disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#1a5632]/25">
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <button type="button" onClick={() => setView('login')} className="text-gray-500 hover:text-gray-700 text-sm font-medium transition">Close</button>
              </div>
            </form>
          </>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {view === 'forgot' && (
          <>
            <button onClick={() => setView('login')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-4 transition"><ArrowLeft size={15} /> Back to Login</button>
            <h2 className="text-xl font-bold text-[#1a5632] mb-2">Forgot Password</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your registered email to receive an OTP.</p>
            {forgotError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{forgotError}</div>}
            {forgotSuccess && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{forgotSuccess}</div>}
            <form onSubmit={handleSendOTP} className="space-y-4">
              <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="your@email.com" required className={inputClass} />
              <button type="submit" disabled={loading} className="w-full bg-[#1a5632] hover:bg-[#154a2b] disabled:opacity-60 text-white py-3 rounded-lg font-semibold text-sm transition-all">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {/* ── OTP VERIFY ── */}
        {view === 'otp' && (
          <>
            <button onClick={() => setView('forgot')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-4 transition"><ArrowLeft size={15} /> Back</button>
            <h2 className="text-xl font-bold text-[#1a5632] mb-2">Enter OTP</h2>
            <p className="text-gray-500 text-sm mb-6">We sent a 6-digit OTP to <strong>{forgotEmail}</strong>.</p>
            {forgotError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{forgotError}</div>}
            {forgotSuccess && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{forgotSuccess}</div>}
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <input type="text" value={forgotOtp} onChange={e => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit OTP" maxLength={6} required className={`${inputClass} text-center text-xl tracking-widest font-bold`} />
              <button type="submit" disabled={loading} className="w-full bg-[#1a5632] hover:bg-[#154a2b] disabled:opacity-60 text-white py-3 rounded-lg font-semibold text-sm transition-all">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button type="button" onClick={handleSendOTP} className="w-full text-[#1a5632] hover:underline text-sm">Resend OTP</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
