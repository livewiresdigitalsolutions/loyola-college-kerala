import React from 'react'
import LesNavbar from './_components/Navbar'
import { JournalAuthProvider } from './_components/AuthContext'

interface LesLayoutProps {
  children: React.ReactNode
}

export default function LesLayout({ children }: LesLayoutProps) {
  return (
    <JournalAuthProvider>
      <LesNavbar />
      {children}
    </JournalAuthProvider>
  )
}
