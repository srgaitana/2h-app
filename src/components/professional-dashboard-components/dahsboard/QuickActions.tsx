import React from 'react'
import { Plus, Users, Clock } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-green-700 mb-4">Acciones Rápidas</h2>
      <div className="space-y-3">
        <button className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition duration-300 font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          <Plus className="mr-2 h-4 w-4" /> Agendar Nueva Cita
        </button>
        <button className="w-full py-2 px-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition duration-300 font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          <Users className="mr-2 h-4 w-4" /> Ver Todos los Pacientes
        </button>
        <button className="w-full py-2 px-4 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition duration-300 font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          <Clock className="mr-2 h-4 w-4" /> Gestionar Disponibilidad
        </button>
      </div>
    </div>
  )
}

