import { useEffect, useRef } from 'react';
import { useReservation } from '../hooks/useReservation';
import { OCCASIONS } from '../constants/occasions';
import { PAYMENT_INFO } from '../constants/payment';

export const OccasionStep = () => {
  const {
    occasion,
    decoracionCumpleanos,
    setOccasionSelected,
    setDecoracionCumpleanos,
    nextStep,
    prevStep,
  } = useReservation();

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isCumpleanos = occasion === 'Cumpleaños';

  const handleSelect = (id) => {
    const selectedOccasion = OCCASIONS.find((o) => o.id === id);
    if (selectedOccasion) {
      setOccasionSelected(selectedOccasion.label);
      if (selectedOccasion.id !== 'cumpleanos') {
        timerRef.current = setTimeout(() => nextStep(), 250);
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center animate-slide-in-right">
      <div className="w-full glass-panel rounded-2xl p-6 md:p-8 flex flex-col">
        <h3 className="text-xl md:text-2xl font-outfit font-bold text-white text-center mb-1">
          ¿Qué celebras?
        </h3>
        <p className="text-xs text-neutral-400 text-center mb-8">
          Queremos hacer tu ocasión especial e inolvidable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {OCCASIONS.map((occ) => {
            const isSelected = occasion === occ.label;
            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => handleSelect(occ.id)}
                className={`p-4 rounded-xl text-left border transition-all duration-300 flex items-center gap-4 cursor-pointer active:scale-98 ${
                  isSelected
                    ? 'bg-gold-950/40 border-gold-400 shadow-[0_0_12px_rgba(220,163,60,0.15)] translate-x-1'
                    : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900/80'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-gold-500 text-neutral-950 scale-105'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-300'
                  }`}
                >
                  {occ.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold font-outfit text-white">{occ.label}</h4>
                  <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">{occ.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Decoración opcional para cumpleaños */}
        {isCumpleanos && (
          <div className="mb-6 p-4 bg-gold-950/20 border border-gold-500/25 rounded-xl animate-fade-in">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={decoracionCumpleanos}
                onChange={(e) => setDecoracionCumpleanos(e.target.checked)}
                className="mt-1 w-4 h-4 accent-gold-500 cursor-pointer"
              />
              <div>
                <span className="text-sm font-semibold text-white font-outfit block">
                  ¿Deseas agregar el plan de decoración especial de cumpleaños?
                </span>
                <span className="text-[11px] text-neutral-400 block mt-1 leading-relaxed">
                  Incluye globos, aviso en mesa y detalle sorpresa{' '}
                  <span className="text-gold-400 font-bold">
                    (+${PAYMENT_INFO.decoracionCumpleanos.toLocaleString('es-CO')} COP)
                  </span>
                </span>
              </div>
            </label>
          </div>
        )}

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
            disabled={!occasion}
            className="flex-2 py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider gold-gradient-button disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default OccasionStep;
