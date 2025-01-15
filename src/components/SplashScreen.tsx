'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {  FaHeartbeat,  FaCalendarAlt,  FaUserMd,  FaMobileAlt,  FaStethoscope,  FaBriefcaseMedical,  FaClipboardCheck,  FaHospitalAlt,  FaChevronLeft,  FaChevronRight, } from 'react-icons/fa';
import Logo from './Logo';
import ProfessionalsCatalog from './ProfessionalsCatalog';

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SplashScreenProps {
  isProfessional: boolean;
  toggleRole: () => void;
}

const patientOnboardingSteps: OnboardingStep[] = [
  { icon: <FaHeartbeat className="text-5xl text-blue-500 mb-4" />, title: 'Cuida tu salud', description: 'Accede a profesionales de la salud en cualquier momento y lugar.' },
  { icon: <FaCalendarAlt className="text-5xl text-green-500 mb-4" />, title: 'Agenda fácilmente', description: 'Programa citas con médicos de manera rápida y sencilla.' },
  { icon: <FaUserMd className="text-5xl text-purple-500 mb-4" />, title: 'Consultas virtuales', description: 'Realiza videoconsultas desde la comodidad de tu hogar.' },
  { icon: <FaMobileAlt className="text-5xl text-red-500 mb-4" />, title: 'Todo en tu móvil', description: 'Gestiona tu salud desde tu smartphone con nuestra app intuitiva.' },
];

const professionalOnboardingSteps: OnboardingStep[] = [
  { icon: <FaStethoscope className="text-5xl text-green-600 mb-4" />, title: 'Atiende pacientes', description: 'Conéctate con pacientes y brinda atención médica en línea.' },
  { icon: <FaBriefcaseMedical className="text-5xl text-blue-600 mb-4" />, title: 'Administra citas', description: 'Gestiona tus horarios y citas de manera organizada.' },
  { icon: <FaClipboardCheck className="text-5xl text-purple-600 mb-4" />, title: 'Historial médico', description: 'Accede a la información médica de tus pacientes.' },
  { icon: <FaHospitalAlt className="text-5xl text-red-600 mb-4" />, title: 'Consultas en línea', description: 'Realiza consultas virtuales de forma rápida y segura.' },
];

const OnboardingStepCard: React.FC<{ step: OnboardingStep; fadeIn: boolean }> = ({ step, fadeIn }) => (
  <div className={`bg-white rounded-lg shadow-xl p-6 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
    {step.icon}
    <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
    <p className="text-gray-600">{step.description}</p>
  </div>
);

const SplashScreen: React.FC<SplashScreenProps> = ({ isProfessional, toggleRole }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const currentOnboardingSteps = isProfessional ? professionalOnboardingSteps : patientOnboardingSteps;

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [isProfessional]);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(goToNextStep, 6000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleStepChange = (newStep: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentStep(newStep);
      setFadeIn(true);
    }, 500);
  };

  const goToNextStep = () => handleStepChange((currentStep + 1) % currentOnboardingSteps.length);
  const goToPrevStep = () => handleStepChange((currentStep - 1 + currentOnboardingSteps.length) % currentOnboardingSteps.length);

  const handleRegisterClick = () => {
    router.push(`/register?role=${isProfessional ? 'professional' : 'patient'}`);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 lg:p-8 ${isProfessional ? 'bg-green-100' : 'bg-blue-100'}`}>
      <div className="w-full max-w-md lg:max-w-7xl">
        <header className="text-center mb-8 flex flex-col items-center">
          <Logo size={80} color={isProfessional ? 'green' : 'blue'} />
          <h1 className={`text-3xl font-bold ${isProfessional ? 'text-green-600' : 'text-blue-600'} mt-4`}>Healthy</h1>
          <p className="text-gray-600 mt-2">Tu salud, en tus manos</p>
        </header>

        {/* Onboarding Steps */}
        <section className="mb-8">
          {/* Mobile view */}
          <div className="lg:hidden">
            <OnboardingStepCard step={currentOnboardingSteps[currentStep]} fadeIn={fadeIn} />
            <div className="mt-4 flex justify-between items-center">
              <button onClick={goToPrevStep} className="p-2 rounded-full bg-gray-100 text-gray-600" aria-label="Anterior">
                <FaChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex space-x-2">
                {currentOnboardingSteps.map((_, index) => (
                  <span key={index} className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-gray-800' : 'bg-gray-300'}`} />
                ))}
              </div>
              <button onClick={goToNextStep} className="p-2 rounded-full bg-gray-100 text-gray-600" aria-label="Siguiente">
                <FaChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Desktop view */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
            {currentOnboardingSteps.map((step, index) => (
              <OnboardingStepCard key={index} step={step} fadeIn={true} />
            ))}
          </div>
        </section>

        {/* Professional Catalogue */}
        <div className="container mx-auto p-4">
          <h1 className={`text-center text-2xl font-bold mb-4 ${isProfessional ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700'}`}>{isProfessional ? 'Mira perfiles como el tuyo' : '¡Solicita una cita!'}</h1>
          <ProfessionalsCatalog isProfessional={isProfessional} />
        </div>

        {/* Actions */}
        <div className="lg:hidden space-y-4 max-w-md mx-auto lg:space-y-0 lg:space-x-4 lg:justify-center">
          <button
            onClick={toggleRole}
            className={`w-full lg:w-auto px-6 py-2 rounded-full font-semibold text-white ${isProfessional ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isProfessional ? '¿Eres un paciente?' : '¿Eres un profesional de la salud?'}
          </button>
          <button 
            onClick={handleRegisterClick}
            className={`w-full lg:w-auto font-bold py-3 px-6 rounded-full text-white ${isProfessional ? 'bg-green-600' : 'bg-blue-600'}`}
          >
            Crear Cuenta
          </button>
          <button
            onClick={() => router.push('/login')}
            className={`w-full lg:w-auto font-bold py-3 px-6 border-2 rounded-full ${isProfessional ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600'}`}
          >
            Iniciar Sesión
          </button>
        </div>

        <footer className="text-xs lg:hidden text-gray-500 text-center mt-6">
          Al crear una cuenta, aceptas nuestros{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Política de Privacidad
          </a>
          .
        </footer>
      </div>
    </div>
  );
};

export default SplashScreen;

