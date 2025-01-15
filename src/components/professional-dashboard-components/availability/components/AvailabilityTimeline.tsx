//AvailabilityTimeline.tsx

import React, { useState } from 'react';
import { DaySummary } from '../utils/calendarUtils';
import { Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface AvailabilityTimelineProps {
  summary: DaySummary[];
  formatTime: (time: string) => string;
  onDeleteAll: () => void;
  onConfirm: () => void;
}

const AvailabilityTimeline: React.FC<AvailabilityTimelineProps> = ({ summary, formatTime, onDeleteAll, onConfirm }) => {
  const [showPastAvailabilities, setShowPastAvailabilities] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState<{ date: string, index: number } | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredSummary = showPastAvailabilities
    ? summary
    : summary.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= today;
      });

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h3 className="text-xl font-bold text-gray-800">Resumen de Disponibilidades</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPastAvailabilities(!showPastAvailabilities)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showPastAvailabilities ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Ocultar pasadas
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Mostrar todas
                </>
              )}
            </button>
            <button
              onClick={onDeleteAll}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Eliminar todas las disponibilidades"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar todas
            </button>
            <button
              onClick={onConfirm}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label="Confirmar disponibilidades"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmar
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {filteredSummary.length > 0 ? (
          <div className="space-y-6">
            {filteredSummary.map(({ date, blocks, totalHours }) => {
              const dayDate = new Date(date);
              const isPast = dayDate < today;
              return (
                <div key={date} className={`border-b border-gray-200 pb-4 ${isPast ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-lg text-gray-800">{date}</h4>
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {totalHours} {totalHours === 1 ? 'hora disponible' : 'horas disponibles'}
                    </span>
                  </div>
                  <div className="relative h-24 bg-gray-50 rounded-lg p-2 overflow-hidden">
                    {/* Time Indicators */}
                    <div className="absolute inset-x-0 top-0 h-6 flex justify-between px-2 text-xs text-gray-400 z-10">
                      <span>6:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                    </div>

                    {/* Background Grid */}
                    <div className="absolute inset-x-0 top-6 bottom-0 flex">
                      {[...Array(12)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-[8.33%] ${i < 11 ? 'border-r border-gray-200' : ''}`}
                        ></div>
                      ))}
                    </div>

                    {/* Availability Blocks */}
                    {blocks.map((block, index) => {
                      const [startHour, startMin] = block.start.split(':').map(Number);
                      const [endHour, endMin] = block.end.split(':').map(Number);
                      const startMinutes = startHour * 60 + startMin;
                      const endMinutes = endHour * 60 + endMin;
                      const dayStartMinutes = 6 * 60; // 6:00 AM
                      const dayEndMinutes = 18 * 60; // 6:00 PM
                      const totalDayMinutes = dayEndMinutes - dayStartMinutes;

                      const left = ((startMinutes - dayStartMinutes) / totalDayMinutes) * 100;
                      const width = ((endMinutes - startMinutes) / totalDayMinutes) * 100;

                      const isHovered = hoveredBlock?.date === date && hoveredBlock?.index === index;

                      return (
                        <div
                          key={index}
                          onMouseEnter={() => setHoveredBlock({ date, index })}
                          onMouseLeave={() => setHoveredBlock(null)}
                          className={`
                            availability-block 
                            absolute h-10 
                            ${isHovered ? 'bg-green-600' : 'bg-green-500'} 
                            rounded-md text-white 
                            text-xs flex items-center 
                            justify-center overflow-hidden 
                            whitespace-nowrap 
                            transition-all 
                            duration-300 
                            top-8
                            hover:z-20
                            cursor-default
                            shadow-md
                          `}
                          style={{
                            left: `${left}%`,
                            width: `${Math.max(width, 4)}%`,
                            minWidth: '20px'
                          }}
                        >
                          {isHovered && (
                            <span className="px-1 truncate font-medium">
                              {formatTime(block.start)} - {formatTime(block.end)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay disponibilidades registradas.</p>
        )}
      </div>
    </div>
  );
};

export default AvailabilityTimeline;

