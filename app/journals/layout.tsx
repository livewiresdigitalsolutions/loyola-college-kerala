import React from 'react'
import LesNavbar from './_components/Navbar'

interface LesLayoutProps {
  children: React.ReactNode
}

export default function LesLayout({ children }: LesLayoutProps) {
  return (
    <>
      <LesNavbar />
      {children}
    </>
  )
}
