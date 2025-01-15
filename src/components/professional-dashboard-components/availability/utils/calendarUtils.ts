import { useState, useEffect } from 'react';

export type Availability = {
  AvailabilityID: number;
  AvailabilityDate: string;
  StartTime: string;
  EndTime: string;
};

export type CalendarDate = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  hasAvailability: boolean;
};

export type TimeBlock = {
  start: string;
  end: string;
};

export type DaySummary = {
  date: string;
  blocks: TimeBlock[];
  totalHours: number;
};

export const useCalendar = (
  initialDate: Date = new Date(), 
  professionalId: number // Add professional ID as a parameter
  ) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getCalendarDates = (year: number, month: number): CalendarDate[] => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const today = new Date();

    const calendarDates: CalendarDate[] = [];

    // Add days from previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      calendarDates.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isPast: date < today,
        hasAvailability: false,
      });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      calendarDates.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < today,
        hasAvailability: availabilities.some(a => a.AvailabilityDate.split('T')[0] === date.toISOString().split('T')[0]),
      });
    }

    // Add days from next month
    const remainingDays = 42 - calendarDates.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      calendarDates.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isPast: false,
        hasAvailability: false,
      });
    }

    return calendarDates;
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + increment, 1));
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
        const endTime = minute === 30 
          ? `${(hour + 1).toString().padStart(2, '0')}:00:00`
          : `${hour.toString().padStart(2, '0')}:30:00`;
        slots.push({ startTime, endTime });
      }
    }
    return slots;
  };

  const toggleAvailability = (date: string, startTime: string, endTime: string) => {
    setAvailabilities(prevAvailabilities => {
      const existingAvailabilityIndex = prevAvailabilities.findIndex(
        a => a.AvailabilityDate.split('T')[0] === date && a.StartTime === startTime && a.EndTime === endTime
      );
      if (existingAvailabilityIndex !== -1) {
        return prevAvailabilities.filter((_, index) => index !== existingAvailabilityIndex);
      } else {
        const newAvailability: Availability = {
          AvailabilityID: Date.now(), // Use timestamp as a temporary ID
          AvailabilityDate: date, // Use just the date string (YYYY-MM-DD)
          StartTime: startTime,
          EndTime: endTime
        };
        return [...prevAvailabilities, newAvailability];
      }
    });
  };

  const deleteAllAvailabilities = async () => {
    try {
      const response = await fetch('/api/professionals/availability', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ProfessionalID: professionalId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete availabilities');
      }

      // Clear local state after successful deletion
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setAvailabilities(prevAvailabilities => 
        prevAvailabilities.filter(availability => {
          const availabilityDate = new Date(availability.AvailabilityDate);
          return availabilityDate < today;
        })
      );
    } catch (error) {
      console.error('Error deleting availabilities:', error);
      setError('Failed to delete availabilities');
    }
  };

  const confirmAvailabilities = async () => {
    try {
      // Prepare availabilities for API call
      const availabilitiesToSend = availabilities.map(avail => ({
        ProfessionalID: professionalId,
        AvailabilityDate: avail.AvailabilityDate.split('T')[0], // Extract just the date
        StartTime: avail.StartTime,
        EndTime: avail.EndTime
      }));

      const response = await fetch('/api/professionals/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(availabilitiesToSend)
      });

      if (!response.ok) {
        throw new Error('Failed to confirm availabilities');
      }

      const result = await response.json();
      alert('Availabilities confirmed successfully');
      console.log('Availabilities confirmed:', result);
    } catch (error) {
      console.error('Error confirming availabilities:', error);
      setError('Failed to confirm availabilities');
    }
  };

  const isConsecutive = (time1: string, time2: string): boolean => {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    const time1Minutes = h1 * 60 + m1;
    const time2Minutes = h2 * 60 + m2;
    return time2Minutes - time1Minutes === 30;
  };

  const generateSummary = () => {
    const summary = availabilities.reduce((acc, curr) => {
      const date = new Date(curr.AvailabilityDate);
      const dateString = date.toISOString().split('T')[0];

      if (!acc[dateString]) {
        acc[dateString] = {
          date: dateString,
          times: [],
          blocks: [],
          totalHours: 0
        };
      }

      const timeString = `${curr.StartTime.slice(0, -3)}`;
      acc[dateString].times.push(timeString);
      acc[dateString].totalHours += 0.5;
      return acc;
    }, {} as Record<string, { date: string; times: string[]; blocks: TimeBlock[]; totalHours: number }>);

    // Convert the summary object to an array and sort by date
    return Object.values(summary).map(({ date, times, totalHours }) => {
      // Sort times chronologically
      times.sort();
      
      // Group consecutive times into blocks
      const blocks: TimeBlock[] = [];
      let currentBlock: TimeBlock | null = null;

      times.forEach((time, index) => {
        if (!currentBlock) {
          currentBlock = { 
            start: time, 
            end: addMinutesToTime(time, 30) 
          };
        } else {
          if (isConsecutive(currentBlock.end.slice(0, -3), time)) {
            currentBlock.end = addMinutesToTime(time, 30);
          } else {
            blocks.push(currentBlock);
            currentBlock = { 
              start: time, 
              end: addMinutesToTime(time, 30) 
            };
          }
        }

        if (index === times.length - 1 && currentBlock) {
          blocks.push(currentBlock);
        }
      });

      return {
        date,
        blocks,
        totalHours
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Fetch availabilities for the specific professional
    const fetchAvailabilities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/professionals/availability?ProfessionalID=${professionalId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch availabilities');
        }

        const data = await response.json();
        setAvailabilities(data.availability || []);
      } catch (error) {
        console.error('Error fetching availabilities:', error);
        setError('Failed to fetch availabilities');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [professionalId]);

  return {
    currentDate,
    selectedDate,
    availabilities,
    loading,
    error,
    getCalendarDates,
    changeMonth,
    selectDate,
    formatTime,
    generateTimeSlots,
    toggleAvailability,
    deleteAllAvailabilities,
    confirmAvailabilities,
    generateSummary,
  };
};