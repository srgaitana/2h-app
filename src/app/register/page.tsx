'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfessionalRegistrationForm from '@/components/ProfessionalRegistrationForm';
import PatientRegistrationForm from '@/components/PatientRegistrationForm';

export default function RegistrationWrapper() {
  const searchParams = useSearchParams();
  const [isProfessional, setIsProfessional] = useState(false);

  useEffect(() => {
    // Get the role from URL parameters
    const role = searchParams.get('role');
    setIsProfessional(role === 'professional');
  }, [searchParams]);

  const toggleRole = () => {
    setIsProfessional(prevState => !prevState);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden lg:block">
        <Header isProfessional={isProfessional} onToggleProfessional={toggleRole} />
      </div>
      <div className="flex flex-col min-h-screen">
        {isProfessional ? (
          <ProfessionalRegistrationForm />
        ) : (
          <PatientRegistrationForm />
        )}
      </div>
      <div className="hidden lg:block">
        <Footer isProfessional={isProfessional} />
      </div>
    </div>
  );
}