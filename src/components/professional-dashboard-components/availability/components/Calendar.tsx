import React from 'react';
import { useCalendar } from '../utils/calendarUtils';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import TimeSlots from './TimeSlots';
import AvailabilityTimeline from './AvailabilityTimeline';


interface Professional {
  ProfessionalID: number;
  SpecialtyID: number;
  Experience: string;
  LicenseNumber: string;
  Education: string;
  ConsultationFee: number;
  ProfessionalStatus: string;
  SpecialtyName: string;
}

interface CalendarProps {
  professional: Professional;
}

const Calendar: React.FC<CalendarProps> = ({ professional }) => {
  const {
    currentDate,
    selectedDate,
    availabilities,
    getCalendarDates,
    changeMonth,
    selectDate,
    formatTime,
    generateTimeSlots,
    toggleAvailability,
    deleteAllAvailabilities,
    confirmAvailabilities,
    generateSummary,
  } = useCalendar(new Date(), professional.ProfessionalID);

  const calendarDates = getCalendarDates(currentDate.getFullYear(), currentDate.getMonth());
  const timeSlots = generateTimeSlots();
  const summary = generateSummary();

  const handleDateClick = (date: Date) => {
    selectDate(date);
  };

  const handleTimeClick = (startTime: string, endTime: string) => {
    if (selectedDate && selectedDate >= new Date()) {
      const dateString = selectedDate.toISOString().split('T')[0];
      toggleAvailability(dateString, startTime, endTime);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las disponibilidades futuras?')) {
      deleteAllAvailabilities();
    }
  };

  const handleConfirm = () => {
    if (window.confirm('¿Estás seguro de que quieres confirmar estas disponibilidades?')) {
      confirmAvailabilities();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-background">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 space-y-4">
          <CalendarHeader currentDate={currentDate} onChangeMonth={changeMonth} />
          <CalendarGrid 
            calendarDates={calendarDates} 
            onDateClick={handleDateClick} 
            selectedDate={selectedDate} 
          />
        </div>
        <div className="lg:w-1/2 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-xl font-bold text-text mb-4">
              {selectedDate
                ? `Selecciona horas para ${selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                : 'Selecciona una fecha para ver las horas disponibles'}
            </h3>
            {selectedDate && (
              <TimeSlots
                timeSlots={timeSlots}
                selectedDate={selectedDate}
                availabilities={availabilities}
                onTimeClick={handleTimeClick}
                formatTime={formatTime}
              />
            )}
          </div>
        </div>
      </div>
      <AvailabilityTimeline
        summary={summary}
        formatTime={formatTime}
        onDeleteAll={handleDeleteAll}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Calendar;