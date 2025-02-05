import React from 'react'
import { Calendar, Clock } from 'lucide-react'

export default function Appointments() {
  // Mock data - replace with actual data fetching
  const appointments = [
    { id: 1, doctor: 'Dr. Smith', specialty: 'Cardiology', date: '2023-06-15T10:00:00', status: 'Confirmed' },
    { id: 2, doctor: 'Dr. Johnson', specialty: 'Dermatology', date: '2023-06-18T14:30:00', status: 'Pending' },
  ]

  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Próximas Citas</h2>
      {appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="pb-4 border-b last:border-b-0 last:pb-0">
              <p className="font-medium text-gray-800">{appointment.doctor}</p>
              <p className="text-sm text-gray-600">{appointment.specialty}</p>
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
                appointment.status === 'Confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {appointment.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No tienes citas programadas.</p>
      )}
      <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 font-medium flex items-center justify-center">
        <Clock className="mr-2 h-4 w-4" />
        Ver todas las citas
      </button>
    </div>
  )
}

