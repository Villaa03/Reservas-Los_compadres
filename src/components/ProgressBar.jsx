import { useReservation } from '../hooks/useReservation';

const STEP_NAMES = [
  "Bienvenida",
  "Personas",
  "Ocasión",
  "Fecha",
  "Hora",
  "Pedido",
  "Tus Datos",
  "Resumen"
];

export const ProgressBar = () => {
  const { step, goToStep } = useReservation();

  const totalSteps = 8;
  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-6 pb-2 select-none">
      {/* Step Title & Count */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
          Paso {step} de {totalSteps}
        </span>
        <span className="text-sm font-outfit font-semibold text-gold-400">
          {STEP_NAMES[step - 1]}
        </span>
      </div>

      {/* Progress Bar Line */}
      <div className="relative h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden mb-6">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-600 via-gold-400 to-amber-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Interactive Dots for Steps (Scrollable/compact on mobile, grid on desktop) */}
      <div className="flex justify-between items-center gap-1">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          // A step is clickable if it is in the past OR if it and all steps before it are valid
          const isClickable = stepNum < step;

          return (
            <button
              key={stepNum}
              type="button"
              disabled={!isClickable}
              onClick={() => goToStep(stepNum)}
              className={`relative flex flex-col items-center group cursor-pointer transition-all duration-300 ${
                isClickable ? 'hover:scale-105' : 'cursor-default'
              }`}
            >
              {/* Dot Circle */}
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold font-outfit transition-all duration-300 border ${
                  isActive 
                    ? 'bg-gold-500 border-gold-400 text-neutral-950 shadow-[0_0_12px_rgba(220,163,60,0.5)] font-bold scale-110' 
                    : isCompleted 
                      ? 'bg-neutral-900 border-gold-500/60 text-gold-400' 
                      : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                }`}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              
              {/* Label below dot (Hidden on mobile to save space, visible on large screens) */}
              <span 
                className={`hidden md:block text-[10px] mt-2 text-center font-medium font-sans tracking-wide transition-all duration-300 ${
                  isActive 
                    ? 'text-gold-400 scale-105 font-bold' 
                    : isCompleted 
                      ? 'text-neutral-300' 
                      : 'text-neutral-500'
                }`}
              >
                {STEP_NAMES[index]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
