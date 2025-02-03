import React from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { Calendar, Users, Settings, User, LogOut, Clock, FileText, DollarSign, Bell } from 'lucide-react'

interface SidebarProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

const menuItems = [
  { id: 'dashboard', icon: Calendar, label: 'Dashboard', path: '/professional/dashboard' },
  { id: 'availability', icon: Clock, label: 'Disponibilidad', path: '/professional/availability' },
  { id: 'appointments', icon: Users, label: 'Gestión de citas', path: '/professional/appointments' },
  { id: 'records', icon: FileText, label: 'Registros Médicos', path: '/professional/records' },
  { id: 'billing', icon: DollarSign, label: 'Facturación', path: '/professional/billing' },
  { id: 'notifications', icon: Bell, label: 'Notificaciones', path: '/professional/notifications' },
  { id: 'profile', icon: User, label: 'Perfil', path: '/professional/profile' },
]

export default function Sidebar({ menuOpen, setMenuOpen }: SidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleNavigation = (path: string) => {
    setMenuOpen(false)  // Cerrar el menú al hacer click en un item
    router.push(path)    // Navegar a la ruta indicada
  }

  return (
    <>
      <aside className={`${menuOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white bg-opacity-80 backdrop-blur-lg shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
        <div className="flex gap-4 p-4 bg-gradient-to-r from-green-600 to-teal-600">
          <Logo size={40} color="white" lineColor='#16a34a'/>
          <h1 className='text-white text-2xl font-semibold'>Healthy App</h1>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}  // Llamar a handleNavigation con la ruta correcta
              className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 text-gray-600 hover:bg-green-50 hover:text-green-800`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        <button 
          onClick={handleLogout}
          className="m-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </button>
      </aside>
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black opacity-50 md:hidden" onClick={() => setMenuOpen(false)}></div>
      )}
    </>
  )
}
