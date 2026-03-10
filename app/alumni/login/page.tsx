'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function AlumniLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate authentication
    console.log('Login submitted:', { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d3d2b] via-[#1a5632] to-[#2d7a4a] px-4 py-20">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F0B129]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/alumni/home"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Alumni Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/assets/loyolalogogreen.png"
              alt="Loyola College"
              width={200}
              height={56}
              className="h-12 w-auto"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Alumni Login</h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to your alumni account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1a5632] focus:ring-2 focus:ring-[#1a5632]/20 outline-none transition text-gray-900 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1a5632] focus:ring-2 focus:ring-[#1a5632]/20 outline-none transition text-gray-900 text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[#1a5632] focus:ring-[#1a5632]" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="#" className="text-[#1a5632] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#1a5632] hover:bg-[#154a2b] text-white py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg shadow-[#1a5632]/25 hover:shadow-[#1a5632]/40"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400">Not a member yet?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href="/alumni/contact"
            className="block w-full text-center py-3 border-2 border-[#1a5632] text-[#1a5632] rounded-lg font-semibold text-sm hover:bg-[#1a5632]/5 transition-all duration-300"
          >
            Register as Alumni
          </Link>
        </div>
      </div>
    </div>
  )
}
