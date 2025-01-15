'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const [isProfessional, setIsProfessional] = useState(false);

  const toggleRole = () => {
    setIsProfessional(prevState => !prevState);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden lg:block">
        <Header isProfessional={isProfessional} onToggleProfessional={toggleRole} />
      </div>
      <main className={`flex-grow transition-colors duration-700 ${
        isProfessional ? 'bg-gradient-to-b from-green-100 to-green-300' : 'bg-gradient-to-b from-blue-100 to-white'
      }`}>
        <SplashScreen isProfessional={isProfessional} toggleRole={toggleRole} />
      </main>
      <div className="hidden lg:block">
        <Footer isProfessional={isProfessional} />
      </div>
    </div>
  )
}