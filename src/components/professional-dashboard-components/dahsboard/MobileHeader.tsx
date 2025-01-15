import React from 'react'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/Logo'

interface MobileHeaderProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

export default function MobileHeader({ menuOpen, setMenuOpen }: MobileHeaderProps) {
  return (
    <header className="md:hidden bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Logo size={40} color="white" lineColor='#16a34a'/>
          <h1 className='text-white text-2xl font-semibold'>Healthy App</h1>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white hover:bg-green-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}

