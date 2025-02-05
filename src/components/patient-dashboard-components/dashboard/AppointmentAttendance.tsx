import { useState } from "react"
import { Clock, FileText, User, PhoneCall, MessageCircle, ThumbsUp, AlertCircle } from "lucide-react"

// Mock data
const appointmentData = {
  doctor: "Dr. Jane Smith",
  specialization: "Cardiologist",
  date: "Monday, June 5, 2023",
  time: "10:00 AM",
  status: "En espera",
  estimatedWaitTime: 15,
}

export default function AppointmentAttendance() {
  const [showFeedback, setShowFeedback] = useState(false)

  const handleContactStaff = () => {
    console.log("Contacting staff...")
    // Implement staff contact functionality
  }

  const handleViewMedicalHistory = () => {
    console.log("Viewing medical history...")
    // Implement medical history view
  }

  const handleUpdateInfo = () => {
    console.log("Updating personal information...")
    // Implement personal info update
  }

  const handleLeaveFeedback = () => {
    setShowFeedback(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 md:p-10 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Su Cita Médica</h1>
          <p className="text-xl md:text-2xl">
            {appointmentData.doctor} - {appointmentData.specialization}
          </p>
        </div>

        <div className="p-6 md:p-10 space-y-8">
          {/* Appointment Information */}
          <div className="bg-blue-50 rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Detalles de la Cita</h2>
            <div className="flex items-center text-blue-700">
              <Clock className="w-6 h-6 mr-3" />
              <span>
                Fecha y Hora: {appointmentData.date} a las {appointmentData.time}
              </span>
            </div>
            <div className="flex items-center text-blue-700">
              <AlertCircle className="w-6 h-6 mr-3" />
              <span>Estado: {appointmentData.status}</span>
            </div>
            <div className="flex items-center text-blue-700">
              <Clock className="w-6 h-6 mr-3" />
              <span>Tiempo estimado de espera: {appointmentData.estimatedWaitTime} minutos</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleViewMedicalHistory}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FileText className="mr-2 h-5 w-5" /> Ver Historial Médico
            </button>
            <button
              onClick={handleUpdateInfo}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <User className="mr-2 h-5 w-5" /> Actualizar Información Personal
            </button>
            <button
              onClick={handleContactStaff}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PhoneCall className="mr-2 h-5 w-5" /> Contactar al Personal
            </button>
            <button
              onClick={handleLeaveFeedback}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <MessageCircle className="mr-2 h-5 w-5" /> Dejar Comentarios
            </button>
          </div>

          {/* Important Instructions */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Por favor, mantenga su mascarilla puesta en todo momento y respete el distanciamiento social. Si tiene
                  algún síntoma de COVID-19, informe al personal inmediatamente.
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          {showFeedback && (
            <div className="mt-6 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dejar Comentarios</h3>
              <textarea
                rows={4}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Comparta su experiencia con nosotros..."
              ></textarea>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ThumbsUp className="mr-2 h-5 w-5" /> Enviar Comentarios
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

