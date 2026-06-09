import { useEffect, useState } from 'react';
import { useReservation } from '../hooks/useReservation';
import { formatIsoToSpanish, formatDateISO } from '../utils/dateHelpers';
import { formatTime12h } from '../utils/timeHelpers';
import { fetchReservasByDate, countReservasPorHora } from '../services/reservasService';

const MAX_RESERVAS_POR_HORA = 2;

const TIME_SECTIONS = [
  {
    id: 'almuerzo',
    label: 'Almuerzo (Mediodía)',
    icon: '☀️',
    slots: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
  },
  {
    id: 'tarde',
    label: 'Tarde / After Office',
    icon: '🌇',
    slots: ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30'],
  },
  {
    id: 'cena',
    label: 'Cena',
    icon: '✨',
    slots: ['19:00', '19:30', '20:00', '20:30'],
  },
];

const isToday = (dateISO) => dateISO === formatDateISO(new Date());

const isPastSlot = (slot) => {
  const [h, m] = slot.split(':').map(Number);
  const now = new Date();
  return now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m);
};

export const TimeStep = () => {
  const { date, time, setTimeSelected, nextStep, prevStep } = useReservation();
  const [reservasPorHora, setReservasPorHora] = useState({});
  const [loading, setLoading] = useState(true);

  const todaySelected = isToday(date);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    fetchReservasByDate(date).then((reservas) => {
      setReservasPorHora(countReservasPorHora(reservas));
      setLoading(false);
    });
  }, [date]);

  const handleSelectTime = (slot) => {
    if (todaySelected && isPastSlot(slot)) return;
    const count = reservasPorHora[slot] || 0;
    if (count >= MAX_RESERVAS_POR_HORA) return;
    setTimeSelected(slot);
  };

  const isSlotDisabled = (slot) => {
    if (todaySelected && isPastSlot(slot)) return true;
    return (reservasPorHora[slot] || 0) >= MAX_RESERVAS_POR_HORA;
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center animate-slide-in-right">
      <div className="w-full glass-panel rounded-2xl p-6 md:p-8 flex flex-col">
        <h3 className="text-xl md:text-2xl font-outfit font-bold text-white text-center mb-1">
          ¿A qué hora llegarás?
        </h3>
        <p className="text-xs text-neutral-400 text-center mb-6">
          Fecha seleccionada:{' '}
          <span className="text-gold-400 font-medium">{formatIsoToSpanish(date)}</span>
        </p>

        {time && (
          <div className="mb-6 p-3 bg-gold-950/20 border border-gold-500/20 rounded-xl text-center">
            <span className="text-xs text-neutral-400 uppercase tracking-widest block font-medium">
              Hora Seleccionada
            </span>
            <span className="text-lg font-bold text-gold-300 font-outfit mt-1 block">
              🕒 {formatTime12h(time)}
            </span>
          </div>
        )}

        <div className="max-h-[350px] overflow-y-auto pr-1 no-scrollbar mb-8 flex flex-col gap-6">
          {loading ? (
            <p className="text-xs text-neutral-500 text-center py-8">Cargando disponibilidad...</p>
          ) : (
            TIME_SECTIONS.map((section) => (
              <div key={section.id} className="w-full text-left">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300 flex items-center gap-1.5 border-b border-white/5 pb-2 mb-3">
                  <span>{section.icon}</span> {section.label}
                </h4>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {section.slots.map((slot) => {
                    const label12h = formatTime12h(slot);
                    const isSelected = time === slot;
                    const disabled = isSlotDisabled(slot);
                    const pasado = todaySelected && isPastSlot(slot);

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSelectTime(slot)}
                        disabled={disabled}
                        className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
                          disabled
                            ? 'bg-neutral-950/60 border-neutral-800/50 text-neutral-600 cursor-not-allowed opacity-60'
                            : isSelected
                              ? 'bg-gold-950/40 border-gold-400 shadow-[0_0_12px_rgba(220,163,60,0.15)] scale-102 font-bold text-gold-300 cursor-pointer active:scale-95'
                              : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900/85 cursor-pointer active:scale-95'
                        }`}
                      >
                        <span className="text-xs font-bold font-outfit">{label12h.split(' ')[0]}</span>
                        <span
                          className={`text-[9px] uppercase tracking-wider font-semibold mt-0.5 ${
                            disabled ? 'text-red-400/70' : 'text-neutral-500'
                          }`}
                        >
                          {pasado ? 'Pasado' : disabled ? 'Agotado' : label12h.split(' ')[1]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

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
            disabled={!time}
            className="flex-2 py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider gold-gradient-button disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeStep;
