import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Star, MapPin, Briefcase } from 'lucide-react';
import Logo from '@/components/Logo';

interface ProfessionalCataloguePopUpProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor: 'green' | 'blue';
  title?: string;
  description?: string;
  professionalName?: string;
  specialty?: string;
  location?: string;
  rating?: number;
  yearsExperience?: number;
  imageUrl?: string;
}

export default function ProfessionalCataloguePopUp({
  isOpen,
  onClose,
  themeColor = 'blue',
  title = 'Necesitas una cuenta para ver el perfil completo',
  description = 'Para acceder a toda la información y contactar al profesional, debes iniciar sesión o crear una cuenta.',
  professionalName = 'Dr. Juan Pérez',
  specialty = 'Medicina General',
  location = 'Madrid, España',
  rating = 4.8,
  yearsExperience = 12,
  imageUrl = '/default-avatar.jpg'
}: ProfessionalCataloguePopUpProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogin = () => {
    router.push('/login');
    onClose();
  };

  const handleRegister = () => {
    router.push('/register?role=patient');
    onClose();
  };

  if (!isOpen) return null;

  const themeColors = {
    primary: themeColor === 'green' 
      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    text: themeColor === 'green' ? 'text-green-600' : 'text-blue-600'
  };

  const isProfessionalMode = themeColor === 'green';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-xl max-w-md w-full p-6 
          transform transition-all duration-200 ease-in-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          shadow-xl`}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="text-center mb-6">
            {isProfessionalMode ? (
              <>
                <div className="flex items-center gap-4 mb-6 text-left">
                  <img 
                    src={imageUrl} 
                    alt={professionalName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-green-100"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{professionalName}</h2>
                    <p className="text-sm text-green-600 font-medium">{specialty}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{location}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1 text-green-600">
                      <Star size={16} />
                      <span className="font-semibold">{rating}</span>
                    </div>
                    <p className="text-gray-600 mt-1">Calificación</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1 text-green-600">
                      <Briefcase size={16} />
                      <span className="font-semibold">{yearsExperience} años</span>
                    </div>
                    <p className="text-gray-600 mt-1">Experiencia</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <Logo size={60} color={themeColor} lineColor="#FFFFFF" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-sm text-gray-600 mb-4">{description}</p>
              </>
            )}
          </div>

          {!isProfessionalMode && (
            <div className="text-left text-sm text-gray-600 space-y-2 mb-6">
              <p>✨ Beneficios de crear una cuenta:</p>
              <ul className="list-disc list-inside">
                <li>Acceso a profesionales calificados</li>
                <li>Agenda citas fácilmente</li>
                <li>Recibe recordatorios importantes</li>
                <li>Gestiona tus consultas</li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          
          {isProfessionalMode ? (
            <>
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ver perfil completo
              </button>
              <button
                onClick={handleRegister}
                className="px-4 py-2 text-sm border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                Contactar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className={`px-4 py-2 text-sm border rounded-lg ${themeColors.text} border-gray-300 hover:bg-gray-50`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={handleRegister}
                className={`px-4 py-2 text-sm text-white rounded-lg ${themeColors.primary}`}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}