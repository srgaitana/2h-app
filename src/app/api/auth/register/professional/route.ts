import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { executeQuery, getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Interfaces for database response types
interface UserRow extends RowDataPacket {
  UserID: number;
}

interface SpecialtyRow extends RowDataPacket {
  SpecialtyID: number;
  SpecialtyName: string;
}

// Schema definition for professional registration
const professionalSchema = z.object({
  firstName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  email: z.string()
    .email('Formato de correo electrónico inválido')
    .max(255, 'El correo electrónico no puede exceder 255 caracteres'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'La contraseña debe incluir al menos un número y una letra'),
  phoneNumber: z.string()
    .regex(/^\+?[\d\s-]{8,}$/, 'Formato de teléfono inválido')
    .max(15, 'El número de teléfono no puede exceder 15 caracteres'),
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  gender: z.enum(['masculino', 'femenino', 'otro'], {
    errorMap: () => ({ message: 'El género debe ser masculino, femenino u otro' })
  }),
  genderIdentity: z.string().min(1).max(100).optional(),
  specialization: z.enum(['Medicina General', 'Psicología'], {
    errorMap: () => ({ message: 'La especialización debe ser Medicina General o Psicología' })
  }),
  licenseNumber: z.string()
    .min(1, 'El número de licencia es requerido')
    .max(50, 'El número de licencia no puede exceder 50 caracteres')
});

// Schema with cross-field validation
const professionalSchemaWithRefinements = professionalSchema.superRefine((data, ctx) => {
  if (data.gender === 'otro' && !data.genderIdentity) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'GenderIdentity es requerido cuando el género es "otro"',
      path: ['genderIdentity']
    });
  }
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input data
    const validatedData = professionalSchemaWithRefinements.parse(body);
    
    // Check if email already exists
    const existingUsers = await executeQuery<UserRow[]>(
      'SELECT UserID FROM Users WHERE Email = ?',
      [validatedData.email]
    );
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { errors: [{ field: 'email', message: 'El correo electrónico ya está registrado' }] },
        { status: 409 }
      );
    }
    
    // Check if license number already exists
    const existingLicense = await executeQuery<UserRow[]>(
      'SELECT hp.ProfessionalID FROM HealthcareProfessionals hp WHERE hp.LicenseNumber = ?',
      [validatedData.licenseNumber]
    );
    
    if (existingLicense.length > 0) {
      return NextResponse.json(
        { errors: [{ field: 'licenseNumber', message: 'El número de licencia ya está registrado' }] },
        { status: 409 }
      );
    }
    
    // Get specialty ID
    const specialty = await executeQuery<SpecialtyRow[]>(
      'SELECT SpecialtyID FROM Specialties WHERE SpecialtyName = ?',
      [validatedData.specialization]
    );
    
    if (specialty.length === 0) {
      return NextResponse.json(
        { errors: [{ field: 'specialization', message: 'Especialización no válida' }] },
        { status: 400 }
      );
    }
    
    // Transform gender from Spanish to English
    const genderMap: Record<string, string> = {
      'masculino': 'male',
      'femenino': 'female',
      'otro': 'other'
    };
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);
    
    // Start transaction
    const connection = await getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert user
      const [userResult] = await connection.execute(
        `INSERT INTO Users (
          FirstName, LastName, Email, PasswordHash,
          PhoneNumber, DateOfBirth, Gender, GenderIdentity, Role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Healthcare Professional')`,
        [
          validatedData.firstName,
          validatedData.lastName,
          validatedData.email,
          hashedPassword,
          validatedData.phoneNumber,
          validatedData.dateOfBirth,
          genderMap[validatedData.gender],
          validatedData.genderIdentity || null,
        ]
      );
      
      // Get inserted user ID
      const userId = (userResult as any).insertId;
      
      // Insert healthcare professional
      await connection.execute(
        `INSERT INTO HealthcareProfessionals (
          UserID, SpecialtyID, LicenseNumber, Status
        ) VALUES (?, ?, ?, 'Available')`,
        [
          userId,
          specialty[0].SpecialtyID,
          validatedData.licenseNumber
        ]
      );
      
      // Commit transaction
      await connection.commit();
      
      return NextResponse.json(
        { userId },
        { status: 201 }
      );
      
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Map Zod errors to field errors
      const errors = error.errors.map(err => ({
        field: err.path[0].toString(),
        message: err.message
      }));
      
      return NextResponse.json(
        { errors },
        { status: 400 }
      );
    }
    
    console.error('Error al registrar profesional:', error);
    return NextResponse.json(
      { errors: [{ field: 'general', message: 'Error interno del servidor' }] },
      { status: 500 }
    );
  }
}