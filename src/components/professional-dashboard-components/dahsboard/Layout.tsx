import React, { useState } from 'react'
import Sidebar from './Sidebar'
import MobileHeader from './MobileHeader'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="flex-1 flex flex-col">
        <MobileHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main className="flex-1 p-4 md:p-8 relative overflow-y-auto max-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
