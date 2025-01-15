'use client' 

import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { redirect } from 'next/navigation'
import Layout from '@/components/professional-dashboard-components/dahsboard/Layout'
import Calendar from '@/components/professional-dashboard-components/availability/components/Calendar'

interface User {
  FirstName: string;
  LastName: string;
  Email: string;
  Role: string;
  UserID: number; 
}

interface Professional {
  ProfessionalID: number;
  SpecialtyID: number;
  Experience: string;
  LicenseNumber: string;
  Education: string;
  ConsultationFee: number;
  ProfessionalStatus: string;
  SpecialtyName: string;
}

export default function ProfessionalAvailability() {
  const [user, setUser] = useState<User | null>(null)
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)
  const [professionalLoading, setProfessionalLoading] = useState(true)
  const [professionalError, setProfessionalError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      redirect('/login')
    }

    try {
      const decodedToken = jwtDecode(token) as User
      setUser(decodedToken)
      console.log(decodedToken)

      if (decodedToken.Role !== 'Healthcare Professional') {
        throw new Error('Unauthorized access')
      }

      // Fetch para obtener los datos del profesional
      fetchProfessionalData(decodedToken.UserID)
    } catch (error) {
      console.error('Error decoding token:', error)
      redirect('/login')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProfessionalData = async (userId: number) => {
    try {
      const response = await fetch(`/api/professionals/professional?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch professional data')
      }
      const professionalData = await response.json()
      console.log(professionalData)
      setProfessional(professionalData.professional)
    } catch (error) {
      setProfessionalError('Error fetching professional data')
      console.error(error)
    } finally {
      setProfessionalLoading(false)
    }
  }

  if (loading || professionalLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-green-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-green-400 h-20 w-20 mb-4"></div>
          <div className="h-4 bg-green-400 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-green-400 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!user || !professional) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-red-50">
        <p className="text-red-600">Professional data is missing. Please contact support.</p>
      </div>
    )
  }

  console.log("JAJA, EL PROFESSIONAL ID ES --> "+ professional.ProfessionalID)
  return (
    <Layout>
      <Calendar professional={professional} />
    </Layout>
  )
}
