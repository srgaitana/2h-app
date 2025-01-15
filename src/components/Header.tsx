'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from "./Logo"
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  isProfessional: boolean;
  onToggleProfessional: () => void;
}

export default function Header({ isProfessional, onToggleProfessional }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className={`${isProfessional ? 'bg-green-200' : 'bg-blue-200'}`}>
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Logo size={40} color={isProfessional ? 'green' : 'blue'} />
            <span className={`ml-3 text-xl font-semibold ${isProfessional ? 'text-green-600' : 'text-blue-600'}`}>
              Healthy
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-800 hover:text-blue-600 transition duration-300">Inicio</Link>
            <Link href="/servicios" className="text-gray-800 hover:text-blue-600 transition duration-300">Servicios</Link>
            <Link href="/sobre-nosotros" className="text-gray-800 hover:text-blue-600 transition duration-300">Sobre Nosotros</Link>
            <Link href="/contacto" className="text-gray-800 hover:text-blue-600 transition duration-300">Contacto</Link>
          </div>
          <div className="hidden md:flex space-x-2">
            <button
              onClick={onToggleProfessional}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-500 ${
                isProfessional 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProfessional ? "¿Eres un paciente?" : "¿Eres un profesional de la salud?"}
            </button>
            <button 
              onClick={() => router.push('/login')}
              className={`${
                isProfessional ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-4 py-2 rounded-full transition duration-300`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => router.push('/register')}
              className={`bg-white px-4 py-2 rounded-full border transition duration-300 ${
                isProfessional 
                  ? 'text-green-600 border-green-600 hover:bg-green-50' 
                  : 'text-blue-600 border-blue-600 hover:bg-blue-50'
              }`}
            >
              Registrarse
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-800">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-blue-600 hover:bg-gray-50">Inicio</Link>
            <Link href="/servicios" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-blue-600 hover:bg-gray-50">Servicios</Link>
            <Link href="/sobre-nosotros" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-blue-600 hover:bg-gray-50">Sobre Nosotros</Link>
            <Link href="/contacto" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-blue-600 hover:bg-gray-50">Contacto</Link>
          </div>
          <div className="px-5 py-4 space-y-2">
            <button
              onClick={onToggleProfessional}
              className={`w-full px-4 py-2 rounded-full font-semibold transition-all duration-500 ${
                isProfessional 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProfessional ? "¿Eres un paciente?" : "¿Eres un profesional de la salud?"}
            </button>
            <button 
              onClick={() => router.push('/login')}
              className={`w-full ${
                isProfessional ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-4 py-2 rounded-full transition duration-300`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => router.push('/register')}
              className={`w-full bg-white px-4 py-2 rounded-full border transition duration-300 ${
                isProfessional 
                  ? 'text-green-600 border-green-600 hover:bg-green-50' 
                  : 'text-blue-600 border-blue-600 hover:bg-blue-50'
              }`}
            >
              Registrarse
            </button>
          </div>
        </div>
      )}
    </header>
  )
}