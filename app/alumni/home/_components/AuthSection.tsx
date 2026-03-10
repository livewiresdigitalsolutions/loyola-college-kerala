'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { UserPlus, LogIn } from 'lucide-react'

export default function AuthSection() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Sign in:', { email, password })
  }

  return (
    <section className="py-16 bg-[#f5f3ee]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT: Not a member yet? */}
          <div className="flex flex-col justify-center space-y-5">
            <UserPlus className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a5632]">
              Not a member yet?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Join the official Loyola College Alumni Association to stay connected, access exclusive resources, and network with fellow graduates globally.
            </p>
            <div>
              <Link
                href="/alumni/contact"
                className="inline-block bg-[#1a5632] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#154a2b] transition-all"
              >
                Register Now
              </Link>
            </div>
          </div>

          {/* RIGHT: Alumni Sign In */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <LogIn className="w-10 h-10 text-gray-400 mb-5" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Alumni Sign In</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1a5632] focus:ring-2 focus:ring-[#1a5632]/20 outline-none transition text-gray-900 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1a5632] focus:ring-2 focus:ring-[#1a5632]/20 outline-none transition text-gray-900 text-sm bg-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-[#1a5632] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#154a2b] transition-all"
                >
                  Sign In
                </button>
                <Link
                  href="#"
                  className="text-[#1a5632] text-sm font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
