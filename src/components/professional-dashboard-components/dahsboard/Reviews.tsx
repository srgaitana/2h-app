import React from 'react'
import { Star, ThumbsUp } from 'lucide-react'

const reviewsData = [
  { id: 1, patientName: 'Ana García', rating: 5, comment: 'Excelente atención, muy profesional.' },
  { id: 2, patientName: 'Carlos Rodríguez', rating: 4, comment: 'Buen servicio, recomendado.' },
  { id: 3, patientName: 'Laura Martínez', rating: 5, comment: 'Muy satisfecha con la consulta.' },
]

export default function Reviews() {
  const averageRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length

  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
        <Star className="mr-2" fill="currentColor" />
        Reseñas de Pacientes
      </h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Calificación promedio</p>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-green-600 mr-2">{averageRating.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      </div>
      <ul className="space-y-4">
        {reviewsData.map((review) => (
          <li key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <p className="font-medium text-gray-800">{review.patientName}</p>
            <div className="flex items-center my-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                  fill="currentColor"
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">{review.comment}</p>
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full py-2 px-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition duration-300 font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
        <ThumbsUp className="mr-2 h-4 w-4" />
        Ver Todas las Reseñas
      </button>
    </div>
  )
}
