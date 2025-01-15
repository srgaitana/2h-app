'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Link from 'next/link';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'masculino' | 'femenino' | 'otro';
  genderIdentity?: string;
}

interface ServerError {
  field: string;
  message: string;
}

export default function PatientRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'masculino',
    genderIdentity: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (serverErrors[id]) {
      setServerErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleRoleChange = () => {
    router.push('/register?role=professional');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);
    setServerErrors({});

    const userPayload = {
      ...formData,
      genderIdentity: formData.gender === 'otro' ? formData.genderIdentity : undefined,
    };

    try {
      const response = await fetch('/api/auth/register/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
        setMessageType('success');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          const errorMap: Record<string, string> = {};
          result.errors.forEach((error: ServerError) => {
            errorMap[error.field] = error.message;
          });
          setServerErrors(errorMap);
          setMessage('Por favor, corrige los errores en el formulario.');
        } else {
          setMessage(result.error || 'Error en el registro');
        }
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error en la solicitud de registro:', error);
      setMessage('Hubo un error al procesar la solicitud. Intenta de nuevo más tarde.');
      setMessageType('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size={100} color="blue" />
          <h1 className="text-3xl font-bold text-blue-600 mt-4">
            Registro de Paciente
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {message && (
            <div className={`mb-6 text-center p-3 rounded-lg ${messageType === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
              <p className={`text-sm font-bold ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                Nombre
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${serverErrors.firstName ? 'border-red-500' : ''}`}
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Ingresa tu nombre"
              />
              {serverErrors.firstName && <p className="text-red-500 text-xs italic">{serverErrors.firstName}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                Apellido
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${serverErrors.lastName ? 'border-red-500' : ''}`}
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Ingresa tu apellido"
              />
              {serverErrors.lastName && <p className="text-red-500 text-xs italic">{serverErrors.lastName}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${serverErrors.email ? 'border-red-500' : ''}`}
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ejemplo@correo.com"
              />
              {serverErrors.email && <p className="text-red-500 text-xs italic">{serverErrors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Contraseña
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${serverErrors.password ? 'border-red-500' : ''}`}
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Crea una contraseña segura"
              />
              {serverErrors.password && <p className="text-red-500 text-xs italic">{serverErrors.password}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                Teléfono
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${serverErrors.phoneNumber ? 'border-red-500' : ''}`}
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+123 456 7890"
              />
              {serverErrors.phoneNumber && <p className="text-red-500 text-xs italic">{serverErrors.phoneNumber}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
                Fecha de Nacimiento
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${serverErrors.dateOfBirth ? 'border-red-500' : ''}`}
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
              {serverErrors.dateOfBirth && <p className="text-red-500 text-xs italic">{serverErrors.dateOfBirth}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                Género
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${serverErrors.gender ? 'border-red-500' : ''}`}
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una opción</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
              {serverErrors.gender && <p className="text-red-500 text-xs italic">{serverErrors.gender}</p>}
            </div>

            {formData.gender === 'otro' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genderIdentity">
                  Género Personalizado
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${serverErrors.genderIdentity ? 'border-red-500' : ''}`}
                  id="genderIdentity"
                  type="text"
                  value={formData.genderIdentity || ''}
                  onChange={handleInputChange}
                  placeholder="Especifica tu género"
                />
                {serverErrors.genderIdentity && <p className="text-red-500 text-xs italic">{serverErrors.genderIdentity}</p>}
              </div>
            )}

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="py-2 px-4 rounded text-gray-700 font-bold bg-gray-200 hover:bg-gray-300 focus:outline-none focus:shadow-outline"
              >
                Regresar
              </button>
              <button
                type="submit"
                className="py-2 px-4 rounded text-white font-bold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Registrar
              </button>
            </div>

            <div className="text-center mt-6 lg:hidden">
              <button
                type="button"
                onClick={handleRoleChange}
                className="w-full mb-4 px-6 py-2 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700"
              >
                ¿Eres un profesional?
              </button>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-blue-600 hover:underline">
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}