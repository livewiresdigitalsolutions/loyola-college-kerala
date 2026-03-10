'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AlumniUser {
  name: string
  email: string
}

interface AlumniAuthContextType {
  user: AlumniUser | null
  loading: boolean
  login: (user: AlumniUser) => void
  logout: () => Promise<void>
}

const AlumniAuthContext = createContext<AlumniAuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
})

export function AlumniAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AlumniUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verify session via cookie on mount
    fetch('/api/alumni/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = (userData: AlumniUser) => {
    setUser(userData)
  }

  const logout = async () => {
    await fetch('/api/alumni/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AlumniAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AlumniAuthContext.Provider>
  )
}

export function useAlumniAuth() {
  return useContext(AlumniAuthContext)
}
