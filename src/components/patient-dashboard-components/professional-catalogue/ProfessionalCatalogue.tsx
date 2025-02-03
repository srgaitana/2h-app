"use client"

import { useState, useEffect } from "react"
import { Search, Star, DollarSign } from "lucide-react"
import {
  format,
  parseISO,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns"
import { es } from "date-fns/locale"
import { createPortal } from "react-dom"

interface Professional {
  ProfessionalID: number
  FullName: string
  SpecialtyName: string
  ConsultationFee: number
  Status: string
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

interface ProfessionalCatalogProps {
  isProfessional: boolean
}

function AvailabilityCalendar({
  availability,
  onClose,
  onDateSelect,
  selectedDate,
}: {
  availability: Availability[]
  onClose: () => void
  onDateSelect: (date: Date | null) => void
  selectedDate: Date | null
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | null>(null)

  const handleDateSelect = (date: Date) => {
    setSelectedTimeBlock(null)
    onDateSelect(date)
  }

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="text-blue-600 hover:text-blue-800">
        &lt;
      </button>
      <h2 className="text-xl font-bold text-blue-800">{format(currentMonth, "MMMM yyyy", { locale: es })}</h2>
      <button onClick={() => setCurrentMonth(addDays(currentMonth, 30))} className="text-blue-600 hover:text-blue-800">
        &gt;
      </button>
    </div>
  )

  const renderDays = () => {
    const days = []
    const startDate = startOfWeek(currentMonth)

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-bold text-blue-600">
          {format(addDays(startDate, i), "EEEEEE", { locale: es })}
        </div>,
      )
    }

    return <div className="grid grid-cols-7 gap-1 mb-2">{days}</div>
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const isAvailable = availability.some((a) => isSameDay(parseISO(a.AvailabilityDate), cloneDay))
        days.push(
          <div
            key={day.toString()}
            className={`p-2 text-center cursor-pointer rounded-full ${
              !isSameMonth(day, monthStart)
                ? "text-gray-400"
                : isSameDay(day, selectedDate || new Date())
                  ? "bg-blue-500 text-white"
                  : ""
            } ${isAvailable ? "bg-blue-100 hover:bg-blue-200" : ""}`}
            onClick={() => isAvailable && handleDateSelect(cloneDay)}
          >
            {format(day, "d")}
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>,
      )
      days = []
    }
    return <div className="mb-4">{rows}</div>
  }

  const getTimeBlocks = (date: Date): TimeBlock[] => {
    return availability
      .filter((a) => isSameDay(parseISO(a.AvailabilityDate), date))
      .map((a) => ({
        start: a.StartTime.slice(0, 5),
        end: a.EndTime.slice(0, 5),
        id: a.AvailabilityID,
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
                    selectedTimeBlock?.id === block.id
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
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
              console.log(
                `Cita confirmada: ${format(selectedDate!, "dd/MM/yyyy")} de ${selectedTimeBlock.start} a ${selectedTimeBlock.end}`,
              )
              onClose()
            }}
          >
            Confirmar cita: {selectedDate && format(selectedDate, "dd/MM/yyyy")} de {selectedTimeBlock.start} a{" "}
            {selectedTimeBlock.end}
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
    document.body,
  )
}

async function fetchAvailability(professionalId: number): Promise<Availability[]> {
  try {
    const response = await fetch(`/api/availability?professionalId=${professionalId}`)
    if (!response.ok) throw new Error("Error al obtener la disponibilidad")
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : []
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error)
    return []
  }
}

export default function ProfessionalCatalog({ isProfessional }: ProfessionalCatalogProps) {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availability, setAvailability] = useState<Availability[]>([])

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await fetch("/api/professionals")
        if (!response.ok) {
          throw new Error("Failed to fetch professionals")
        }
        const data = await response.json()
        if (data.success) {
          setProfessionals(data.data)
        } else {
          throw new Error(data.message || "Unknown error occurred")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfessionals()
  }, [])

  useEffect(() => {
    if (selectedProfessional !== null) {
      fetchAvailability(selectedProfessional).then(setAvailability)
    }
  }, [selectedProfessional])

  const filteredProfessionals = professionals.filter(
    (pro) =>
      pro.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.SpecialtyName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const themeColor = isProfessional ? "green" : "blue"

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div
          className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${themeColor === "green" ? "border-green-500" : "border-blue-500"} mx-auto`}
        ></div>
        <p className="mt-2 text-sm text-gray-600">Cargando profesionales...</p>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-6xl mx-auto">
      <h2 className={`text-xl font-bold mb-4 ${isProfessional ? "text-green-600" : "text-blue-600"}`}>
        {isProfessional ? "Profesionales similares" : "Profesionales disponibles"}
      </h2>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Buscar por nombre o especialidad"
          className={`w-full p-2 pr-8 text-sm text-gray-900 border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 ease-in-out ${
            themeColor === "green" ? "focus:ring-green-500" : "focus:ring-blue-500"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeColor === "green" ? "text-green-500" : "text-blue-500"}`}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredProfessionals.map((pro) => (
          <div
            key={pro.ProfessionalID}
            className={`p-3 rounded-md shadow-sm border-l-4 ${themeColor === "green" ? "border-green-500" : "border-blue-500"} h-full flex flex-col justify-between`}
          >
            <h3 className="font-semibold">{pro.FullName}</h3>
            {pro.SpecialtyName && (
              <p className="text-sm text-gray-600">
                {pro.SpecialtyName} • {Math.floor(Math.random() * 20) + 1} años de experiencia
              </p>
            )}
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {(Math.random() * (5 - 4) + 4).toFixed(1)}
              </span>
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                {pro.ConsultationFee?.toLocaleString() ?? "200.000"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  pro.Status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {pro.Status === "Available" ? "Disponible" : "No disponible"}
              </span>
            </div>
            {!isProfessional && (
              <button
                onClick={() => setSelectedProfessional(pro.ProfessionalID)}
                className={`mt-2 w-full py-1 px-2 rounded text-white text-sm font-medium transition-colors duration-300 ${
                  themeColor === "green" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Agendar cita
              </button>
            )}
          </div>
        ))}
      </div>
      {filteredProfessionals.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No se encontraron profesionales que coincidan con tu búsqueda.</p>
      )}
      {selectedProfessional !== null && (
        <AvailabilityCalendar
          availability={availability}
          onClose={() => {
            setSelectedProfessional(null)
            setSelectedDate(null)
          }}
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
}

