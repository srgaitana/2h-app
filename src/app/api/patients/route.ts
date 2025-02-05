import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

interface PatientDetails extends RowDataPacket {
  UserID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  DateOfBirth: string;
  Gender: string;
  Status: string;
}

interface JwtPayload {
  UserID: number;
  Role: string;
}

export async function GET(req: NextRequest) {
  try {
    // 1. Verificar autenticación
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // 3. Validar rol
    if (decoded.Role !== 'Patient') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Obtener datos del paciente
    const query = `
      SELECT 
        UserID, FirstName, LastName, Email, 
        PhoneNumber, DateOfBirth, Gender, Status
      FROM Users 
      WHERE UserID = ?
    `;
    
    const result = await executeQuery<PatientDetails[]>(query, [decoded.UserID]);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // 5. Formatear respuesta
    const patientData = {
      ...result[0],
      DateOfBirth: result[0].DateOfBirth ? new Date(result[0].DateOfBirth).toISOString().split('T')[0] : null
    };

    return NextResponse.json(patientData, { status: 200 });

  } catch (error: any) {
    // Manejar errores
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}