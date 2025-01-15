// @/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { executeQuery } from "@/lib/db";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";

// Interfaces
interface UserRow extends RowDataPacket {
  UserID: number;
  Email: string;
  PasswordHash: string;
  FirstName: string;
  LastName: string; 
  Role: string;
}

interface LoginResponse {
  token: string;
}

// Validation schema
const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginInput = z.infer<typeof LoginSchema>;

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData: LoginInput = LoginSchema.parse(body);

    // Query database for user
    const users = await executeQuery<UserRow[]>(
      'SELECT UserID, Email, PasswordHash, FirstName, LastName, Role FROM Users WHERE Email = ?',
      [validatedData.email]
    );

    // Check if user exists
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    const user = users[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(
      validatedData.password,
      user.PasswordHash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Contraseña incorrecta." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        UserID: user.UserID,
        Email: user.Email,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Role: user.Role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Return success response
    const response: LoginResponse = {
      token,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Correo electrónico o contraseña inválidos." },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
