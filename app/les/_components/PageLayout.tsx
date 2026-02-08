import React from 'react'
import News from './News'
import Contact from './Contact'
import RegistrationForm from './RegistrationForm'

interface PageLayoutProps {
  children: React.ReactNode;
  showNews?: boolean;
  showContact?: boolean;
  showRegistrationForm?: boolean;
  bgColor?: string;
}

export default function PageLayout({ 
  children, 
  showNews = true, 
  showContact = true, 
  showRegistrationForm = true,
  bgColor = 'bg-white'
}: PageLayoutProps) {
  return (
    <div className={bgColor}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT - 2/3 */}
          <main className="lg:col-span-2 order-1">
            {children}
          </main>

          {/* RIGHT SIDEBAR - 1/3 */}
          <aside className="lg:col-span-1 order-2 space-y-6">
            {showNews && <News />}
            
            {showRegistrationForm && <RegistrationForm />}
          </aside>
        </div>
      </div>
    </div>
  )
}

