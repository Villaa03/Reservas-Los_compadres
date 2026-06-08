import React from 'react';
import { useReservation } from '../hooks/useReservation';
import { formatIsoToSpanish } from '../utils/dateHelpers';

export const DateStep = () => {
  const { date, setDateSelected, nextStep, prevStep, availableDatesList } = useReservation();

  const handleSelectDate = (isoString) => {
    setDateSelected(isoString);
    // Auto-advance after 250ms for seamless flow
    setTimeout(() => {
      nextStep();
    }, 250);
  };

  // Group dates by Month to display section headers
  const groupedDates = availableDatesList.reduce((acc, curr) => {
    const month = curr.date.toLocaleString('es-CO', { month: 'long', year: 'numeric' });
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    if (!acc[capitalizedMonth]) {
      acc[capitalizedMonth] = [];
    }
    acc[capitalizedMonth].push(curr);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center animate-slide-in-right">
      <div className="w-full glass-panel rounded-2xl p-6 md:p-8 flex flex-col">
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-outfit font-bold text-white text-center mb-1">
          ¿Para qué día reservas?
        </h3>
        <p className="text-xs text-neutral-400 text-center mb-6">
          Solo selecciona el día. No abrimos los martes.
        </p>

        {/* Selected date preview */}
        {date && (
          <div className="mb-6 p-3 bg-gold-950/20 border border-gold-500/20 rounded-xl text-center">
            <span className="text-xs text-neutral-400 uppercase tracking-widest block font-medium">Día Seleccionado</span>
            <span className="text-sm md:text-base font-bold text-gold-300 font-outfit mt-1 block">
              {formatIsoToSpanish(date)}
            </span>
          </div>
        )}

        {/* Scrollable list of dates by Month */}
        <div className="max-h-[350px] overflow-y-auto pr-1 no-scrollbar mb-8 flex flex-col gap-6">
          {Object.keys(groupedDates).map((monthYear) => (
            <div key={monthYear} className="w-full">
              {/* Month Divider */}
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-white/5 pb-2 mb-3 text-left">
                {monthYear}
              </h4>
              
              {/* Grid of days */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {groupedDates[monthYear].map((dayObj) => {
                  const isSelected = date === dayObj.isoString;
                  return (
                    <button
                      key={dayObj.isoString}
                      type="button"
                      onClick={() => handleSelectDate(dayObj.isoString)}
                      className={`py-3 px-1 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-gold-950/40 border-gold-400 shadow-[0_0_12px_rgba(220,163,60,0.15)] scale-102 font-bold'
                          : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900/85'
                      }`}
                    >
                      {/* Short Day Label */}
                      <span className={`text-[9px] uppercase tracking-wider ${isSelected ? 'text-gold-300 font-bold' : 'text-neutral-500'}`}>
                        {dayObj.label}
                      </span>
                      {/* Day Number */}
                      <span className="text-lg font-extrabold font-outfit mt-1 text-white">
                        {dayObj.dayNum}
                      </span>
                      {/* Month Abbreviation */}
                      <span className="text-[9px] text-neutral-400 capitalize mt-0.5">
                        {dayObj.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 w-full mt-auto">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider border border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all cursor-pointer"
          >
            Atrás
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={!date}
            className="flex-2 py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider gold-gradient-button disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateStep;
