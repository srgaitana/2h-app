import React from 'react'
import { Calendar } from 'lucide-react'

export default function UpcomingAppointments() {
  // Mock data - replace with actual data fetching
  const appointments = [
    { id: 1, patientName: 'Juan Pérez', date: '2023-06-15T10:00:00', status: 'Confirmada' },
    { id: 2, patientName: 'María García', date: '2023-06-18T14:30:00', status: 'Pendiente' },
  ]

  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
        <Calendar className="mr-2" />
        Próximas Citas
      </h2>
      {appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="pb-4 border-b last:border-b-0 last:pb-0">
              <p className="font-medium text-gray-800">{appointment.patientName}</p>
              <p className="text-sm text-gray-600">
                {new Date(appointment.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                appointment.status === 'Confirmada' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {appointment.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No hay citas programadas.</p>
      )}
    </div>
  )
}

