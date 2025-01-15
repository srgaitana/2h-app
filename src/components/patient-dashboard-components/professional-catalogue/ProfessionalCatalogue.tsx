'use client'

import React, { useState, useEffect } from 'react'
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { createPortal } from 'react-dom'

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

interface Availability {
  AvailabilityID: number
  AvailabilityDate: string
  StartTime: string
  EndTime: string
}

interface TimeBlock {
  start: string
  end: string
  id: number
}

// Datos de ejemplo de profesionales
const professionals: Professional[] = [
  {
    ProfessionalID: 1,
    SpecialtyID: 1,
    Experience: "10 años",
    LicenseNumber: "MED12345",
    Education: "Universidad de Medicina de Madrid",
    ConsultationFee: 150,
    ProfessionalStatus: "Activo",
    SpecialtyName: "Cardiología"
  },
  {
    ProfessionalID: 2,
    SpecialtyID: 2,
    Experience: "8 años",
    LicenseNumber: "MED67890",
    Education: "Universidad de Barcelona",
    ConsultationFee: 130,
    ProfessionalStatus: "Activo",
    SpecialtyName: "Dermatología"
  },
  {
    ProfessionalID: 3,
    SpecialtyID: 3,
    Experience: "12 años",
    LicenseNumber: "MED24680",
    Education: "Universidad de Valencia",
    ConsultationFee: 120,
    ProfessionalStatus: "Activo",
    SpecialtyName: "Pediatría"
  }
]

async function fetchAvailability(professionalId: number): Promise<Availability[]> {
  // Simular una llamada a la API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Datos de ejemplo
  return [
    {
      "AvailabilityID": 116,
      "AvailabilityDate": "2025-01-15T05:00:00.000Z",
      "StartTime": "07:00:00",
      "EndTime": "07:30:00"
    },
    {
      "AvailabilityID": 117,
      "AvailabilityDate": "2025-01-15T05:00:00.000Z",
      "StartTime": "07:30:00",
      "EndTime": "08:00:00"
    },
    {
      "AvailabilityID": 118,
      "AvailabilityDate": "2025-01-15T05:00:00.000Z",
      "StartTime": "08:00:00",
      "EndTime": "08:30:00"
    },
    {
      "AvailabilityID": 119,
      "AvailabilityDate": "2025-01-16T05:00:00.000Z",
      "StartTime": "09:00:00",
      "EndTime": "09:30:00"
    },
    {
      "AvailabilityID": 120,
      "AvailabilityDate": "2025-01-16T05:00:00.000Z",
      "StartTime": "09:30:00",
      "EndTime": "10:00:00"
    }
  ]
}

function ProfessionalCard({ professional, onShowAvailability }: { professional: Professional, onShowAvailability: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="bg-blue-600 p-4">
        <h2 className="text-xl font-semibold text-white">Dr. {professional.ProfessionalID}</h2>
      </div>
      <div className="p-4">
        <p className="text-blue-800 font-medium mb-2">{professional.SpecialtyName}</p>
        <p className="text-gray-600 mb-1">Experiencia: {professional.Experience}</p>
        <p className="text-gray-600 mb-1">Educación: {professional.Education}</p>
        <p className="text-gray-600 mb-4">Precio: ${professional.ConsultationFee}</p>
        <div className="flex justify-between">
          <button
            onClick={onShowAvailability}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Ver disponibilidad
          </button>
          <button
            className="border border-blue-500 text-blue-500 hover:bg-blue-50 font-bold py-2 px-4 rounded transition duration-300"
          >
            Solicitar cita
          </button>
        </div>
      </div>
    </div>
  )
}

function AvailabilityCalendar({ availability, onClose, onDateSelect, selectedDate }: { availability: Availability[], onClose: () => void, onDateSelect: (date: Date | null) => void, selectedDate: Date | null }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | null>(null)

  const handleDateSelect = (date: Date) => {
    setSelectedTimeBlock(null)
    onDateSelect(date)
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="text-blue-600 hover:text-blue-800">&lt;</button>
        <h2 className="text-xl font-bold text-blue-800">{format(currentMonth, 'MMMM yyyy', { locale: es })}</h2>
        <button onClick={() => setCurrentMonth(addDays(currentMonth, 30))} className="text-blue-600 hover:text-blue-800">&gt;</button>
      </div>
    )
  }

  const renderDays = () => {
    const dateFormat = 'EEEEEE'
    const days = []
    let startDate = startOfWeek(currentMonth)

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-bold text-blue-600">
          {format(addDays(startDate, i), dateFormat, { locale: es })}
        </div>
      )
    }

    return <div className="grid grid-cols-7 gap-1 mb-2">{days}</div>
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = 'd'
    const rows = []

    let days = []
    let day = startDate
    let formattedDate = ''

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat)
        const cloneDay = day
        const isAvailable = availability.some(a => isSameDay(parseISO(a.AvailabilityDate), cloneDay))
        days.push(
          <div
            key={day.toString()}
            className={`p-2 text-center cursor-pointer rounded-full ${
              !isSameMonth(day, monthStart)
                ? 'text-gray-400'
                : isSameDay(day, selectedDate || new Date())
                ? 'bg-blue-500 text-white'
                : ''
            } ${isAvailable ? 'bg-blue-100 hover:bg-blue-200' : ''}`}
            onClick={() => isAvailable && handleDateSelect(cloneDay)}
          >
            {formattedDate}
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      )
      days = []
    }
    return <div className="mb-4">{rows}</div>
  }

  const getTimeBlocks = (date: Date): TimeBlock[] => {
    return availability
      .filter(a => isSameDay(parseISO(a.AvailabilityDate), date))
      .map(a => ({
        start: a.StartTime.slice(0, 5),
        end: a.EndTime.slice(0, 5),
        id: a.AvailabilityID
      }))
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Seleccionar fecha y hora</h2>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
        {selectedDate && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Bloques de tiempo disponibles:</h3>
            <div className="grid grid-cols-2 gap-2">
              {getTimeBlocks(selectedDate).map((block) => (
                <button
                  key={block.id}
                  className={`p-2 rounded text-sm ${
                    selectedTimeBlock?.id === block.id ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                  onClick={() => setSelectedTimeBlock(block)}
                >
                  {block.start} - {block.end}
                </button>
              ))}
            </div>
          </div>
        )}
        {selectedTimeBlock && (
          <button
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            onClick={() => {
              console.log(`Cita confirmada: ${format(selectedDate!, 'dd/MM/yyyy')} de ${selectedTimeBlock.start} a ${selectedTimeBlock.end}`)
              onClose()
            }}
          >
            Confirmar cita: {selectedDate && format(selectedDate, 'dd/MM/yyyy')} de {selectedTimeBlock.start} a {selectedTimeBlock.end}
          </button>
        )}
        <button
          className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>,
    document.body
  )
}

export default function MedicalAppointments() {
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availability, setAvailability] = useState<Availability[]>([])

  useEffect(() => {
    if (selectedProfessional !== null) {
      fetchAvailability(selectedProfessional).then(setAvailability)
    }
  }, [selectedProfessional])

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date)
  }

  return (
    <main className="min-h-screen bg-blue-50">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Profesionales Médicos Disponibles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((professional) => (
            <ProfessionalCard
              key={professional.ProfessionalID}
              professional={professional}
              onShowAvailability={() => setSelectedProfessional(professional.ProfessionalID)}
            />
          ))}
        </div>
        {selectedProfessional !== null && (
          <AvailabilityCalendar
            availability={availability}
            onClose={() => setSelectedProfessional(null)}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </main>
  )
}