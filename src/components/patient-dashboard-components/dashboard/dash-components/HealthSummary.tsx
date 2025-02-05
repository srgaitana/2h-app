import React from 'react'
import { Activity } from 'lucide-react'

export default function HealthSummary() {
  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Resumen de Salud</h2>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">Última consulta</p>
          <p className="font-medium text-gray-800">15 de mayo, 2023</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Próxima cita</p>
          <p className="font-medium text-gray-800">22 de junio, 2023</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Medicamentos activos</p>
          <p className="font-medium text-gray-800">2</p>
        </div>
      </div>
      <button className="mt-4 w-full bg-blue-100 text-blue-800 py-2 px-4 rounded-lg hover:bg-blue-200 transition duration-300 font-medium flex items-center justify-center">
        <Activity className="mr-2 h-4 w-4" />
        Ver historial médico completo
      </button>
    </div>
  )
}

