"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, CreditCard, User, Phone, MessageSquare } from "lucide-react"

// Mock data
const mockPatientData = {
  fullName: "Alice Johnson",
  phoneNumber: "+1 (555) 123-4567",
}

const mockAppointmentData = {
  date: "Monday, June 5, 2023",
  time: "10:00 AM",
  fee: "$150",
}

const mockDoctorData = {
  name: "Dr. Jane Smith",
  specialization: "Cardiologist",
}

interface PatientData {
  fullName: string
  phoneNumber: string
}

export default function PatientAppointmentPage() {
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [reason, setReason] = useState("")

  useEffect(() => {
    // Simulating API call with mock data
    const fetchPatientData = () => {
      setTimeout(() => {
        setPatientData(mockPatientData)
      }, 1000) // Simulate a 1 second delay
    }

    fetchPatientData()
  }, [])

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting appointment data:", { patientData, reason, appointmentData: mockAppointmentData })
    // Here you would typically send this data to your backend
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 md:p-10 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Appointment Booking</h1>
          <p className="text-xl md:text-2xl">
            {mockDoctorData.name} - {mockDoctorData.specialization}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          {/* Appointment Summary */}
          <div className="bg-blue-50 rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Appointment Summary</h2>
            <div className="flex items-center text-blue-700">
              <Calendar className="w-6 h-6 mr-3" />
              <span>Date: {mockAppointmentData.date}</span>
            </div>
            <div className="flex items-center text-blue-700">
              <Clock className="w-6 h-6 mr-3" />
              <span>Time: {mockAppointmentData.time}</span>
            </div>
            <div className="flex items-center text-blue-700">
              <CreditCard className="w-6 h-6 mr-3" />
              <span>Consultation Fee: {mockAppointmentData.fee}</span>
            </div>
          </div>

          {/* Patient Information Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-blue-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={patientData?.fullName || "Loading..."}
                    readOnly
                    className="bg-gray-100 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-blue-700">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={patientData?.phoneNumber || "Loading..."}
                    readOnly
                    className="bg-gray-100 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-medium text-blue-700">
                Reason for Visit
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                </div>
                <textarea
                  name="reason"
                  id="reason"
                  rows={3}
                  value={reason}
                  onChange={handleReasonChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Please briefly describe your reason for the visit"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              onClick={() => alert("Payment Successful!")}
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

