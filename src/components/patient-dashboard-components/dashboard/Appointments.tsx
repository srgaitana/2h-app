'use client'

import { useState } from "react"
import { Calendar, Clock, Search, Filter, Eye, RotateCcw, ChevronLeft, ChevronRight, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    doctor: "Dr. Jane Smith",
    specialization: "Cardiologist",
    date: "2023-06-15",
    time: "10:00 AM",
    status: "Próxima",
  },
  {
    id: 2,
    doctor: "Dr. John Doe",
    specialization: "Dermatologist",
    date: "2023-06-10",
    time: "2:30 PM",
    status: "Próxima",
  },
  {
    id: 3,
    doctor: "Dr. Emily Brown",
    specialization: "Neurologist",
    date: "2023-05-20",
    time: "11:15 AM",
    status: "Pasada",
  },
  {
    id: 4,
    doctor: "Dr. Michael Johnson",
    specialization: "Orthopedist",
    date: "2023-05-05",
    time: "3:00 PM",
    status: "Pasada",
  },
  {
    id: 5,
    doctor: "Dr. Sarah Lee",
    specialization: "Pediatrician",
    date: "2023-06-20",
    time: "9:30 AM",
    status: "Próxima",
  },
  {
    id: 6,
    doctor: "Dr. Robert Wilson",
    specialization: "Ophthalmologist",
    date: "2023-04-25",
    time: "1:45 PM",
    status: "Pasada",
  },
  {
    id: 7,
    doctor: "Dr. Lisa Anderson",
    specialization: "Gynecologist",
    date: "2023-06-25",
    time: "11:00 AM",
    status: "Próxima",
  },
  {
    id: 8,
    doctor: "Dr. David Taylor",
    specialization: "Urologist",
    date: "2023-05-15",
    time: "10:30 AM",
    status: "Pasada",
  },
]

export default function AppointmentList() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const appointmentsPerPage = 5
  const router = useRouter()

  const filteredAppointments = mockAppointments
    .filter((appointment) => {
      if (filter === "all") return true
      return appointment.status === filter
    })
    .filter(
      (appointment) =>
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const indexOfLastAppointment = currentPage * appointmentsPerPage
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleViewDetails = (id: number) => {
    console.log(`Ver detalles de la cita ${id}`)
    // Implementar la lógica para ver detalles de la cita
  }

  const handleReschedule = (id: number) => {
    console.log(`Reprogramar cita ${id}`)
    // Implementar la lógica para reprogramar la cita
  }

  const handleAttendAppointment = (id: number) => {
    console.log(`Asistir a la cita ${id}`)
    router.push(`/patient/appointment-attendance/`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 md:p-10 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Mis Citas</h1>
          <p className="text-xl md:text-2xl">Gestiona tus citas médicas</p>
        </div>

        <div className="p-6 md:p-10 space-y-8">
          {/* Filtros y Búsqueda */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-blue-600" />
              <select
                className="border-2 border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todas las citas</option>
                <option value="Próxima">Próximas</option>
                <option value="Pasada">Pasadas</option>
              </select>
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar por doctor o especialidad"
                className="w-full border-2 border-blue-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-blue-400" />
            </div>
          </div>

          {/* Lista de Citas */}
          <div className="space-y-4">
            {currentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-blue-50 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0"
              >
                <div>
                  <h3 className="font-semibold text-lg text-blue-800">{appointment.doctor}</h3>
                  <p className="text-blue-600">{appointment.specialization}</p>
                  <div className="flex items-center space-x-2 text-sm text-blue-500">
                    <Calendar className="w-4 h-4" />
                    <span>{appointment.date}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewDetails(appointment.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" /> Ver
                  </button>
                  {appointment.status === "Próxima" && (
                    <>
                      <button
                        onClick={() => handleReschedule(appointment.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-300 flex items-center"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" /> Reprogramar
                      </button>
                      <button
                        onClick={() => handleAttendAppointment(appointment.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300 flex items-center"
                      >
                        <LogIn className="w-4 h-4 mr-1" /> Asistir
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-6">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {Array.from({ length: Math.ceil(filteredAppointments.length / appointmentsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === index + 1
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredAppointments.length / appointmentsPerPage)}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}