import React from 'react'
import AlumniNavbar from './_components/Navbar'
import { AlumniAuthProvider } from './_components/AlumniAuthContext'

interface AlumniLayoutProps {
  children: React.ReactNode
}

export default function AlumniLayout({ children }: AlumniLayoutProps) {
  return (
    <AlumniAuthProvider>
      <AlumniNavbar />
      {children}
    </AlumniAuthProvider>
  )
}
