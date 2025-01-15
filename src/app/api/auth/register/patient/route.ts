import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Interfaces para tipado de respuestas de la base de datos
interface UserRow extends RowDataPacket {
  UserID: number;
}

// Definición del esquema para los datos del paciente
const patientSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Formato de correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'La contraseña debe incluir al menos un número y una letra'),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{8,}$/, 'Formato de teléfono inválido'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  gender: z.enum(['masculino', 'femenino', 'otro'], {
    errorMap: () => ({ message: 'El género debe ser masculino, femenino u otro' })
  }),
  genderIdentity: z.string().min(1).max(100).optional()
});

// Esquema refinado con validación cruzada
const patientSchemaWithRefinements = patientSchema.superRefine((data, ctx) => {
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
    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    
    // Validar los datos de entrada
    const validatedData = patientSchemaWithRefinements.parse(body);
    
    // Verificar si el correo ya existe
    const existingUsers = await executeQuery<UserRow[]>(
      'SELECT UserID FROM Users WHERE Email = ?',
      [validatedData.email]
    );
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'El correo electrónico ya está registrado' },
        { status: 409 }
      );
    }
    
    // Transformar género de español a inglés
    const genderMap: Record<string, string> = {
      'masculino': 'male',
      'femenino': 'female',
      'otro': 'other'
    };
    
    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);
    
    // Insertar nuevo usuario
    const result = await executeQuery<UserRow[]>(
      `INSERT INTO Users (
        FirstName, LastName, Email, PasswordHash, 
        PhoneNumber, DateOfBirth, Gender, GenderIdentity, Role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Patient')`,
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
    
    // Para obtener el ID del usuario insertado
    const newUserResult = await executeQuery<UserRow[]>(
      'SELECT LAST_INSERT_ID() as UserID'
    );
    
    // Retornar el ID del usuario creado
    return NextResponse.json(
      { userId: newUserResult[0].UserID },
      { status: 201 }
    );
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Error al registrar paciente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}