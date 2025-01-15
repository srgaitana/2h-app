// @/components/Logo.tsx 
import React from 'react';

interface LogoProps {
  size?: number;
  color?: 'green' | 'blue' | string; // Colores base 'green' y 'blue', o cualquier valor de string para color arbitrario
  lineColor?: string; // Color de la línea configurable
}

const Logo: React.FC<LogoProps> = ({
  size = 40,
  color = 'blue', // Valor predeterminado es 'blue'
  lineColor = '#F9F9F9', // Valor predeterminado para color de la línea
}) => {
  // Determina el color de fondo basado en el valor de `color`
  const backgroundColor = color === 'green' ? '#16a34a' : color === 'blue' ? '#3B82F6' : color;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill={backgroundColor} />
      <path d="M30 50H70" stroke={lineColor} strokeWidth="8" strokeLinecap="round" />
      <path d="M50 30L50 70" stroke={lineColor} strokeWidth="8" strokeLinecap="round" />
      <path d="M30 30L70 70" stroke={lineColor} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;