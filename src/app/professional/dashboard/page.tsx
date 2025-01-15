//@/app/professional/dashboard/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { redirect } from 'next/navigation'
import Dashboard, { User } from '@/components/professional-dashboard-components/dahsboard/Dashboard'
import Layout from '@/components/professional-dashboard-components/dahsboard/Layout'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      redirect('/login')
    }

    try {
      const decodedToken = jwtDecode(token) as User
      setUser(decodedToken)
      console.log(decodedToken)
      // Here you would typically fetch additional user data based on the decoded token
      if (decodedToken.Role !== 'Healthcare Professional') {
        throw new Error('Unauthorized access')
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      redirect('/login')
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
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

  if (!user) {
    console.log("no user")
    return null // or return a loading state, or redirect to login
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Bienvenido, Dr. {user.LastName}</h1>
      <Dashboard user={user} />
    </Layout>
  )
}

