import React from 'react'
import { DollarSign, CreditCard, FileText } from 'lucide-react'

const billingData = {
  pendingPayments: 3,
  totalAmount: 1500,
  currency: 'USD',
}

export default function Billing() {
  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
        <DollarSign className="mr-2" />
        Facturación
      </h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Pagos pendientes</p>
          <p className="font-medium text-gray-800">{billingData.pendingPayments}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Monto total pendiente</p>
          <p className="font-medium text-gray-800">
            {billingData.currency} {billingData.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <button className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          <CreditCard className="mr-2 h-4 w-4" />
          Procesar Pagos
        </button>
        <button className="w-full py-2 px-4 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition duration-300 font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          <FileText className="mr-2 h-4 w-4" />
          Ver Historial de Facturación
        </button>
      </div>
    </div>
  )
}

