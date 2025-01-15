import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(req: Request) {
  // Obtener el UserID desde los parámetros de la consulta (query params)
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  // Validar si el UserID es un número válido
  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json(
      { error: 'El UserID proporcionado no es válido.' },
      { status: 400 }
    );
  }

  try {
    // Consulta para obtener los datos del profesional de salud basado en el UserID y Role
    const query = `
      SELECT 
        u.UserID, u.FirstName, u.LastName, u.Email, u.PhoneNumber, 
        hp.ProfessionalID, hp.SpecialtyID, hp.Experience, hp.LicenseNumber, 
        hp.Education, hp.ConsultationFee, hp.Status AS ProfessionalStatus,
        s.SpecialtyName
      FROM Users u
      INNER JOIN HealthcareProfessionals hp ON u.UserID = hp.UserID
      INNER JOIN Specialties s ON hp.SpecialtyID = s.SpecialtyID
      WHERE u.UserID = ? AND u.Role = 'Healthcare Professional'
    `;

    const results = await executeQuery(query, [userId]);

    // Validar si se encontró el profesional
    if (results.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró un profesional de salud con el UserID proporcionado.' },
        { status: 404 }
      );
    }

    // Devolver los datos del profesional
    return NextResponse.json({ professional: results[0] });
  } catch (error) {
    console.error('Error al obtener el profesional de salud:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al obtener el profesional de salud.' },
      { status: 500 }
    );
  }
}
