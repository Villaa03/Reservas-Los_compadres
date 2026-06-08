import React from 'react';
import { useReservation } from '../hooks/useReservation';

export const PersonsStep = () => {
  const { persons, setPersonsCount, nextStep, prevStep } = useReservation();

  const handleDecrement = () => {
    if (persons > 1) {
      setPersonsCount(persons - 1);
    }
  };

  const handleIncrement = () => {
    setPersonsCount(persons + 1);
  };

  const quickSelections = [
    { value: 2, label: 'Pareja 👩‍❤️‍👨', desc: '2 personas' },
    { value: 4, label: 'Familia 👨‍👩‍👧‍👦', desc: '4 personas' },
    { value: 6, label: 'Amigos 🍻', desc: '6 personas' },
    { value: 10, label: 'Grupo 🎉', desc: '10 personas' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center animate-slide-in-right">
      <div className="w-full glass-panel rounded-2xl p-6 md:p-8 flex flex-col items-center">
        {/* Garantía banner */}
        <div className="w-full mb-6 p-3.5 bg-gold-950/25 border border-gold-500/25 rounded-xl text-center">
          <p className="text-xs text-gold-200/90 font-medium leading-relaxed">
            📌 <span className="font-bold">Garantía de reserva:</span> Todas las reservas tienen un valor de{' '}
            <span className="text-gold-400 font-bold">$10.000 COP</span> no reembolsables para confirmar la mesa.
          </p>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-outfit font-bold text-white text-center mb-1">
          ¿Cuántas personas asistirán?
        </h3>
        <p className="text-xs text-neutral-400 text-center mb-6">
          Selecciona el número de personas para preparar tu mesa.
        </p>

        {/* Alerta grupos grandes */}
        {persons >= 6 && (
          <div className="w-full mb-6 p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl animate-fade-in">
            <p className="text-xs text-amber-200/90 font-medium leading-relaxed text-center">
              📢 Para grupos de 6 o más personas, es obligatorio realizar un pedido anticipado de platos para optimizar el servicio de la cocina.
            </p>
          </div>
        )}

        {/* Big Counter Control */}
        <div className="flex items-center justify-center gap-6 mb-8 w-full max-w-xs">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={persons <= 1}
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-gold-500/50 hover:text-gold-400 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 shadow-md cursor-pointer"
          >
            －
          </button>

          <div className="flex flex-col items-center justify-center min-w-24 select-none">
            <span className="text-5xl md:text-6xl font-outfit font-extrabold gold-gradient-text">
              {persons}
            </span>
            <span className="text-xs text-neutral-400 font-semibold tracking-wider uppercase mt-1">
              {persons === 1 ? 'Persona' : 'Personas'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-gold-500/50 hover:text-gold-400 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
          >
            ＋
          </button>
        </div>

        {/* Quick Select Buttons */}
        <div className="w-full mb-8">
          <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-3 text-left">
            Selección Rápida:
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {quickSelections.map((sel) => (
              <button
                key={sel.value}
                type="button"
                onClick={() => setPersonsCount(sel.value)}
                className={`py-3 px-4 rounded-xl text-left border transition-all duration-300 flex flex-col justify-center cursor-pointer ${
                  persons === sel.value
                    ? 'bg-gold-950/40 border-gold-400 shadow-[0_0_12px_rgba(220,163,60,0.15)]'
                    : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <span className="text-sm font-bold font-outfit text-white">{sel.label}</span>
                <span className="text-[10px] text-neutral-400 mt-0.5">{sel.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 w-full">
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
            className="flex-2 py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider gold-gradient-button cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonsStep;
