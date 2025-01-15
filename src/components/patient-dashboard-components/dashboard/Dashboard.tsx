import React from 'react'
import Appointments from './Appointments'
import HealthSummary from './HealthSummary'
import QuickActions from './QuickActions'
import ProfessionalCatalog from './ProfessionalCatalog'

export interface User {
  FirstName: string
  LastName: string
  Email: string
  Role: string
}

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ProfessionalCatalog isProfessional={false} />
      <Appointments />
      <HealthSummary />
      <QuickActions />
    </div>
  )
}

