import React from 'react';
import { CalendarDate } from '../utils/calendarUtils';

interface CalendarGridProps {
  calendarDates: CalendarDate[];
  onDateClick: (date: Date) => void;
  selectedDate: Date | null;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ calendarDates, onDateClick, selectedDate }) => {
  const renderCalendarDate = (calendarDate: CalendarDate) => {
    const isSelected = selectedDate?.toDateString() === calendarDate.date.toDateString();
    const baseClasses = "p-2 rounded-full text-center cursor-pointer transition-colors duration-200";
    const colorClasses = calendarDate.isPast
      ? "text-gray-400"
      : calendarDate.isToday
      ? "bg-primary text-white hover:bg-primary-dark"
      : calendarDate.hasAvailability
      ? "bg-secondary text-white hover:bg-secondary-dark"
      : calendarDate.isCurrentMonth
      ? "hover:bg-gray-200"
      : "text-gray-400";
    const selectedClasses = isSelected ? "ring-2 ring-primary ring-offset-2" : "";

    return (
      <div
        key={calendarDate.date.toISOString()}
        className={`${baseClasses} ${colorClasses} ${selectedClasses}`}
        onClick={() => onDateClick(calendarDate.date)}
      >
        {calendarDate.date.getDate()}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center font-semibold text-text">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDates.map(renderCalendarDate)}
      </div>
    </div>
  );
};

export default CalendarGrid;

