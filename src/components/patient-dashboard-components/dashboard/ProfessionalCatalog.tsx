'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, Star, DollarSign } from 'lucide-react'

interface Professional {
  ProfessionalID: number
  FullName: string
  SpecialtyName: string
  ConsultationFee: number
  Status: string
}

interface ProfessionalCatalogProps {
  isProfessional: boolean
}

export default function ProfessionalCatalog({ isProfessional }: ProfessionalCatalogProps) {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await fetch('/api/professionals')
        if (!response.ok) {
          throw new Error('Failed to fetch professionals')
        }
        const data = await response.json()
        if (data.success) {
          setProfessionals(data.data)
        } else {
          throw new Error(data.message || 'Unknown error occurred')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfessionals()
  }, [])

  const filteredProfessionals = professionals.filter(pro => 
    pro.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pro.SpecialtyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const themeColor = isProfessional ? 'green' : 'blue'

  if (isLoading) {
    return <div className="text-center py-4">
      <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${themeColor === 'green' ? 'border-green-500' : 'border-blue-500'} mx-auto`}></div>
      <p className="mt-2 text-sm text-gray-600">Cargando profesionales...</p>
    </div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className={`text-xl font-bold mb-4 ${isProfessional ? 'text-green-600' : 'text-blue-600'}`}>
        {isProfessional ? 'Profesionales similares' : 'Profesionales disponibles'}
      </h2>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Buscar por nombre o especialidad"
          className={`w-full p-2 pr-8 text-sm text-gray-900 border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 ease-in-out ${
            themeColor === 'green' ? 'focus:ring-green-500' : 'focus:ring-blue-500'
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeColor === 'green' ? 'text-green-500' : 'text-blue-500'}`} />
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredProfessionals.map((pro) => (
          <div key={pro.ProfessionalID} className={`p-3 rounded-md shadow-sm border-l-4 ${themeColor === 'green' ? 'border-green-500' : 'border-blue-500'}`}>
            <h3 className="font-semibold">{pro.FullName}</h3>
            {pro.SpecialtyName && (
              <p className="text-sm text-gray-600">
                {pro.SpecialtyName} • {Math.floor(Math.random() * 20) + 1} años de experiencia
              </p>
            )}
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {(Math.random() * (5 - 4) + 4).toFixed(1)}
              </span>
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                {pro.ConsultationFee?.toLocaleString() ?? "200.000"}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                pro.Status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {pro.Status === 'Available' ? 'Disponible' : 'No disponible'}
              </span>
            </div>
            {!isProfessional && (
              <button className={`mt-2 w-full py-1 px-2 rounded text-white text-sm font-medium transition-colors duration-300 ${
                themeColor === 'green' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}>
                Agendar cita
              </button>
            )}
          </div>
        ))}
      </div>
      {filteredProfessionals.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No se encontraron profesionales que coincidan con tu búsqueda.</p>
      )}
    </div>
  )
}

