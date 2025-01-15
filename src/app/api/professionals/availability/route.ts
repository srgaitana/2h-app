import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// Obtener la disponibilidad de un profesional
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ProfessionalID = searchParams.get('ProfessionalID'); // Verifica que este valor esté presente

  if (!ProfessionalID) {
    console.log('Error: ID del profesional no proporcionado');
    return NextResponse.json({ error: 'El ID del profesional es obligatorio.' }, { status: 400 });
  }

  try {
    const query = `
      SELECT AvailabilityID, AvailabilityDate, StartTime, EndTime 
      FROM ProfessionalAvailability 
      WHERE ProfessionalID = ?;
    `;
    const availability = await executeQuery(query, [ProfessionalID]);

    console.log('Datos de disponibilidad obtenidos:', JSON.stringify(availability, null, 2));

    if (!availability || availability.length === 0) {
      console.log('No se encontró disponibilidad para el profesional ID:', ProfessionalID);
      return NextResponse.json({ availability: [] });
    }

    return NextResponse.json({ availability });
  } catch (error) {
    console.error('Error al obtener la disponibilidad:', error);
    return NextResponse.json({ error: 'Error al obtener la disponibilidad.' }, { status: 500 });
  }
}

// Crear una nueva entrada de disponibilidad
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Se esperaba un array de disponibilidades.' }, { status: 400 });
    }

    // Validación de fecha no pasada
    const currentDate = new Date();

    // Crear un array para almacenar las disponibilidades a agregar
    const valuesToInsert = [];

    // Verificar cada disponibilidad
    for (const { ProfessionalID, AvailabilityDate, StartTime, EndTime } of body) {
      const availabilityDate = new Date(AvailabilityDate); // Convertir el valor de la fecha a Date

      // Validar si la fecha es en el futuro
      if (availabilityDate < currentDate) {
        return NextResponse.json({ error: `No se puede agregar disponibilidad en fechas pasadas. (${AvailabilityDate})` }, { status: 400 });
      }

      // Verificar si ya existe la disponibilidad (considerando la fecha y el horario)
      const checkQuery = `
        SELECT * FROM ProfessionalAvailability
        WHERE ProfessionalID = ? AND AvailabilityDate = ? AND StartTime = ? AND EndTime = ?;
      `;
      const existingAvailability = await executeQuery(checkQuery, [ProfessionalID, AvailabilityDate, StartTime, EndTime]);

      if (existingAvailability.length === 0) {
        // Si no existe, añadir la disponibilidad a la lista de inserciones
        valuesToInsert.push([ProfessionalID, AvailabilityDate, StartTime, EndTime]);
      } else {
        console.log(`Disponibilidad ya existe para la fecha ${AvailabilityDate} de ${StartTime} a ${EndTime}, ignorando...`);
      }
    }

    // Si no hay nuevas disponibilidades, responder con un mensaje
    if (valuesToInsert.length === 0) {
      return NextResponse.json({ message: 'Todas las disponibilidades ya estaban agregadas.', status: 200 });
    }

    // Proceder con la inserción solo de las nuevas disponibilidades
    const placeholders = valuesToInsert.map(() => '(?, ?, ?, ?)').join(',');
    const query = `
      INSERT INTO ProfessionalAvailability (ProfessionalID, AvailabilityDate, StartTime, EndTime) 
      VALUES ${placeholders}
    `;
    const result = await executeQuery(query, valuesToInsert.flat());

    return NextResponse.json({ message: 'Disponibilidades agregadas con éxito.', result }, { status: 201 });
  } catch (error) {
    console.error('Error al agregar la disponibilidad:', error);
    return NextResponse.json({ error: 'Error al agregar la disponibilidad.' }, { status: 500 });
  }
}

// Eliminar disponibilidad de un profesional
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { ProfessionalID } = body;

    if (!ProfessionalID) {
      console.log('Error: ProfessionalID no proporcionado');
      return NextResponse.json({ error: 'El ID del profesional es obligatorio.' }, { status: 400 });
    }

    const query = `
      DELETE FROM ProfessionalAvailability WHERE ProfessionalID = ?;
    `;
    const result = await executeQuery(query, [ProfessionalID]);

    return NextResponse.json({ message: 'Disponibilidades eliminadas con éxito.', result }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar la disponibilidad:', error);
    return NextResponse.json({ error: 'Error al eliminar la disponibilidad.' }, { status: 500 });
  }
}
