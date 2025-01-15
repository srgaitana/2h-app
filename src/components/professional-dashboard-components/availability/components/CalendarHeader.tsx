import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  onChangeMonth: (increment: number) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, onChangeMonth }) => {
  return (
    <div className="flex justify-between items-center mb-4 bg-white rounded-lg shadow p-4">
      <button
        onClick={() => onChangeMonth(-1)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Mes anterior"
      >
        <ChevronLeft className="w-6 h-6 text-secondary" />
      </button>
      <h2 className="text-2xl font-bold text-text">
        {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
      </h2>
      <button
        onClick={() => onChangeMonth(1)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Mes siguiente"
      >
        <ChevronRight className="w-6 h-6 text-secondary" />
      </button>
    </div>
  );
};

export default CalendarHeader;

