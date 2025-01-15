'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Clock, User, MessageSquare, CreditCard, Bell, Settings, LogOut, Search } from 'lucide-react';
import Logo from '@/components/Logo';

interface SidebarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', icon: Calendar, label: 'Dashboard', href: '/patient/dashboard' },
  { id: 'professionals', icon: User, label: 'Profesionales', href: '/patient/professionals' },
  { id: 'appointments', icon: Clock, label: 'Mis Citas', href: '/patient/appointments' },
  { id: 'messages', icon: MessageSquare, label: 'Mensajes', href: '/patient/messages' },
  { id: 'billing', icon: CreditCard, label: 'Facturación', href: '/patient/billing' },
  { id: 'notifications', icon: Bell, label: 'Notificaciones', href: '/patient/notifications' },
  { id: 'settings', icon: Settings, label: 'Configuración', href: '/patient/settings' },
  { id: 'profile', icon: User, label: 'Perfil', href: '/patient/profile' },
];

export default function Sidebar({ menuOpen, setMenuOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/login');
  };

  return (
    <>
      <aside
        className={`${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-center h-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <Logo size={40} color={'white'} lineColor='#3b82f6'/>
          <h1 className="text-white text-2xl font-semibold ml-4">Healthy App</h1>
        </div>
        <nav className="mt-5">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center mt-4 py-2 px-6 ${
                pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
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
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

