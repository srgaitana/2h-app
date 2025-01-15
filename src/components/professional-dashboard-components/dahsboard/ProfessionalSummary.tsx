import React from 'react'
import { User } from './Dashboard'

interface ProfessionalSummaryProps {
  user: User
}

export default function ProfessionalSummary({ user }: ProfessionalSummaryProps) {
  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-green-700 mb-4">Resumen Profesional</h2>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">Nombre</p>
          <p className="font-medium text-gray-800">{user.FirstName} {user.LastName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium text-gray-800">{user.Email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Rol</p>
          <p className="font-medium text-gray-800">{user.Role}</p>
        </div>
      </div>
    </div>
  )
}

