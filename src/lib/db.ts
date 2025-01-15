// @/lib/db.ts

import mysql, { Pool, PoolConnection, RowDataPacket, FieldPacket } from 'mysql2/promise';

// Crear el pool de conexiones
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para obtener una conexión del pool
const getConnection = async (): Promise<PoolConnection> => {
  try {
    const connection: PoolConnection = await pool.getConnection();
    console.log('Conexión exitosa a la base de datos');
    return connection;
  } catch (err) {
    console.error('Error al obtener la conexión de la base de datos:', err);
    throw new Error('Error al obtener la conexión');
  }
};

// Función para ejecutar una consulta SQL genérica
const executeQuery = async <T extends RowDataPacket[]>(
  query: string, 
  params: any[] = []
): Promise<T> => {
  let connection: PoolConnection | null = null;
  try {
    // Obtener una conexión
    connection = await getConnection();

    // Ejecutar la consulta
    const [rows]: [T, FieldPacket[]] = await connection.execute(query, params);

    // Devolver las filas de la consulta
    return rows;
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    throw new Error('Error al ejecutar la consulta');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Exportar las funciones para usarlas en el resto de la app
export { getConnection, executeQuery };