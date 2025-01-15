import { NextResponse } from 'next/server'; 
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Consulta para obtener todos los profesionales y sus datos básicos
    const query = `
      SELECT 
        p.ProfessionalID,
        CONCAT(u.FirstName, ' ', u.LastName) AS FullName,
        s.SpecialtyName,
        p.ConsultationFee,
        p.Status
      FROM HealthcareProfessionals p
      JOIN Users u ON p.UserID = u.UserID
      JOIN Specialties s ON p.SpecialtyID = s.SpecialtyID
    `;

    // Ejecutar la consulta
    const professionals = await executeQuery(query);

    // Devolver la respuesta en formato JSON
    return NextResponse.json({
      success: true,
      data: professionals,
    });
  } catch (error) {
    console.error('Error fetching professionals:', error);

    return NextResponse.json(
      { success: false, message: 'Error fetching professionals' },
      { status: 500 }
    );
  }
}
