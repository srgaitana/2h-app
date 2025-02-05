import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Validar y obtener datos del cuerpo
    const body = await req.json();
    const { patientId, professionalId, date, startTime, endTime, type, reason } = body;
    
    // Validar campos requeridos
    if (!patientId || !professionalId || !date || !startTime || !endTime || !type || !reason) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: patientId, professionalId, date, startTime, endTime, type, reason' },
        { status: 400 }
      );
    }

    // Convertir fecha a formato SQL
    const [day, month, year] = date.split('/');
    const sqlDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const appointmentDateTime = `${sqlDate} ${startTime}:00`;

    // 1. Verificar disponibilidad
    const availabilityQuery = `
      SELECT AvailabilityID FROM ProfessionalAvailability
      WHERE ProfessionalID = ? AND AvailabilityDate = ?
      AND StartTime = ? AND EndTime = ?
    `;
    const availability = await executeQuery(availabilityQuery, [
      professionalId,
      sqlDate,
      startTime,
      endTime
    ]);

    if (availability.length === 0) {
      return NextResponse.json(
        { error: 'El horario seleccionado ya no está disponible' },
        { status: 409 }
      );
    }

    // 2. Obtener tarifa del profesional
    const feeQuery = `
      SELECT ConsultationFee FROM HealthcareProfessionals
      WHERE ProfessionalID = ?
    `;
    const professional = await executeQuery(feeQuery, [professionalId]);
    
    if (!professional[0]?.ConsultationFee) {
      return NextResponse.json(
        { error: 'El profesional no tiene tarifa configurada' },
        { status: 400 }
      );
    }
    const consultationFee = professional[0].ConsultationFee;

    // 3. Crear cita
    const appointmentQuery = `
      INSERT INTO Appointments 
        (UserID, ProfessionalID, AppointmentDate, Status, Type, Reason, ConsultationFee)
      VALUES (?, ?, ?, 'Confirmed', ?, ?, ?)
    `;
    const appointmentResult: any = await executeQuery(appointmentQuery, [
      patientId,
      professionalId,
      appointmentDateTime,
      type,
      reason,
      consultationFee
    ]);

    // 4. Crear registro de facturación
    const billingQuery = `
      INSERT INTO Billing 
        (AppointmentID, ProfessionalID, UserID, Amount, PaymentMethod, PaymentDate, Status)
      VALUES (?, ?, ?, ?, 'Pending', NOW(), 'Pending')
    `;
    await executeQuery(billingQuery, [
      appointmentResult.insertId,
      professionalId,
      patientId,
      consultationFee
    ]);

    // 5. Eliminar disponibilidad usada
    await executeQuery(
      'DELETE FROM ProfessionalAvailability WHERE AvailabilityID = ?',
      [availability[0].AvailabilityID]
    );

    return NextResponse.json(
      { message: 'Cita y facturación creadas exitosamente', appointmentId: appointmentResult.insertId },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error al crear cita:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}