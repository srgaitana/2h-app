import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validar si el correo fue proporcionado
    if (!email) {
      return NextResponse.json({ message: 'Por favor proporciona un correo electrónico.' }, { status: 400 });
    }

    // Buscar al usuario en la base de datos
    const query = 'SELECT UserID FROM Users WHERE Email = ?';
    const users = await executeQuery(query, [email]);

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'No se encontró un usuario con el correo proporcionado.' },
        { status: 404 }
      );
    }

    // Obtener el UserID del usuario encontrado
    const userID = users[0].UserID;

    // Eliminar el token anterior si existe
    const deleteTokenQuery = 'DELETE FROM PasswordResets WHERE UserID = ?';
    await executeQuery(deleteTokenQuery, [userID]);

    // Generar un token de recuperación (simulado aquí)
    const recoveryToken = Math.random().toString(36).substr(2);

    // Guardar el nuevo token en la base de datos (en la tabla PasswordResets)
    const saveTokenQuery = `
      INSERT INTO PasswordResets (UserID, Token, ExpiresAt)
      VALUES (?, ?, NOW() + INTERVAL 1 HOUR)
    `;
    await executeQuery(saveTokenQuery, [userID, recoveryToken]);

    // Simular el envío del correo electrónico
    console.log(`Enlace de recuperación generado para ${email}: https://healthybyhex.com/reset-password?token=${recoveryToken}`);

    return NextResponse.json({
      message: 'Si el correo está registrado, se enviará un enlace de recuperación.',
    });
  } catch (error) {
    console.error('Error en la recuperación de contraseña:', error);
    return NextResponse.json(
      { message: 'Hubo un error al procesar tu solicitud. Por favor, intenta más tarde.' },
      { status: 500 }
    );
  }
}
