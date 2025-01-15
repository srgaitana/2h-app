import React from 'react'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/Logo'

interface MobileHeaderProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

export default function MobileHeader({ menuOpen, setMenuOpen }: MobileHeaderProps) {
  return (
    <header className="md:hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        <Logo size={40} color="white" lineColor='#3b82f6'/>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white hover:bg-blue-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}

