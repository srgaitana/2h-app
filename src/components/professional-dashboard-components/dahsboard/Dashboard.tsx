import React, { useEffect, useState } from 'react'; 
import UpcomingAppointments from './UpcomingAppointments';
import ProfessionalSummary from './ProfessionalSummary';
import QuickActions from './QuickActions';
import Billing from './Billing';
import Reviews from './Reviews';
import DoctorProfile from '../profile/DoctorProfile';

// Interface para los datos del usuario
export interface User {
  FirstName: string;
  LastName: string;
  Email: string;
  Role: string;
  UserID: number; // ID del usuario
}

// Interface para los datos del profesional
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

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [professionalData, setProfessionalData] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        const response = await fetch(`/api/professionals/professional?userId=${user.UserID}`);
        if (!response.ok) {
          throw new Error('No se pudo obtener los datos del profesional');
        }
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setProfessionalData(data.professional); // Tipo ya validado
        }
      } catch (error) {
        setError('Hubo un error al obtener los datos del profesional');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionalData();
  }, [user.UserID]);

  if (loading) {
    return <p>Cargando datos del profesional...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (user.Role !== 'Healthcare Professional') {
    return <p>No tienes acceso a este panel.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <ProfessionalSummary user={user} />
      <UpcomingAppointments />
      <Billing />
      <Reviews />
      <QuickActions />
    </div>
  );
}
