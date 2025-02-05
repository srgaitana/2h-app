import React from 'react'
import { Plus, Search, MessageSquare } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Acciones Rápidas</h2>
      <div className="space-y-3">
        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 font-medium flex items-center justify-center">
          <Plus className="mr-2 h-4 w-4" />
          Agendar Nueva Cita
        </button>
        <button className="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded-lg hover:bg-blue-200 transition duration-300 font-medium flex items-center justify-center">
          <Search className="mr-2 h-4 w-4" />
          Buscar Profesionales
        </button>
        <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-300 font-medium flex items-center justify-center">
          <MessageSquare className="mr-2 h-4 w-4" />
          Contactar Soporte
        </button>
      </div>
    </div>
  )
}

