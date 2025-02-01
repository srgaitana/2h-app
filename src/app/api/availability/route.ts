import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(req: Request) {
  try {
    // Extrae los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const professionalId = searchParams.get("professionalId");

    // Construcción dinámica del query
    let query = `
      SELECT pa.AvailabilityID, pa.ProfessionalID, u.FirstName, u.LastName, s.SpecialtyName, 
             pa.AvailabilityDate, pa.StartTime, pa.EndTime
      FROM ProfessionalAvailability pa
      JOIN HealthcareProfessionals hp ON pa.ProfessionalID = hp.ProfessionalID
      JOIN Users u ON hp.UserID = u.UserID
      JOIN Specialties s ON hp.SpecialtyID = s.SpecialtyID
    `;
    
    const params: any[] = [];

    if (professionalId) {
      query += ` WHERE pa.ProfessionalID = ?`;
      params.push(professionalId);
    }

    query += ` ORDER BY pa.AvailabilityDate, pa.StartTime;`;

    // Ejecuta la consulta
    const availability = await executeQuery(query, params);

    // Retorna los datos en formato JSON
    return NextResponse.json({ success: true, data: availability ?? [] });

  } catch (error: any) {
    console.error("Error fetching availability:", error);
    
    return NextResponse.json(
      { success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
