import React from 'react';
import { Availability } from '../utils/calendarUtils';

interface TimeSlotsProps {
  timeSlots: { startTime: string; endTime: string }[];
  selectedDate: Date | null;
  availabilities: Availability[];
  onTimeClick: (startTime: string, endTime: string) => void;
  formatTime: (time: string) => string;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ timeSlots, selectedDate, availabilities, onTimeClick, formatTime }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1 sm:gap-2 mt-4">
      {timeSlots.map(({ startTime, endTime }) => {
        const isAvailable = selectedDate && availabilities.some(
          a => a.AvailabilityDate.split('T')[0] === selectedDate.toISOString().split('T')[0] && 
               a.StartTime === startTime && a.EndTime === endTime
        );
        const isPast = selectedDate && selectedDate < new Date();
        return (
          <button
            key={startTime}
            onClick={() => onTimeClick(startTime, endTime)}
            disabled={selectedDate ? selectedDate < new Date() : false}
            className={`p-1 sm:p-2 rounded-md sm:rounded-lg border text-xs sm:text-sm transition-colors duration-200 flex items-center justify-center h-8 sm:h-10 md:h-12 ${
              isPast
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isAvailable
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'border-secondary text-secondary hover:bg-secondary hover:text-white'
            }`}
          >
            {formatTime(startTime)}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlots;

