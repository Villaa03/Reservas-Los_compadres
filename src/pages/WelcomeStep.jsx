import { useReservation } from '../hooks/useReservation';
import { Link } from 'react-router-dom';
import { RESTAURANT_SETTINGS } from '../constants/settings';

export const WelcomeStep = () => {
  const { nextStep } = useReservation();

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center text-center animate-fade-in">
      {/* Visual Header Banner */}
      <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-8 glass-panel flex flex-col justify-end p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black">
        {/* Subtle decorative lights representing rooftop night lights */}
        <div className="absolute top-4 left-6 w-2.5 h-2.5 rounded-full bg-amber-400/60 blur-[1px] animate-pulse"></div>
        <div className="absolute top-8 left-16 w-3 h-3 rounded-full bg-yellow-400/50 blur-[2px] animate-pulse [animation-delay:0.3s]"></div>
        <div className="absolute top-3 left-32 w-2 h-2 rounded-full bg-amber-500/70 blur-[1px] animate-pulse [animation-delay:0.7s]"></div>
        <div className="absolute top-6 left-48 w-3 h-3 rounded-full bg-yellow-300/40 blur-[2px] animate-pulse [animation-delay:0.2s]"></div>
        <div className="absolute top-4 right-12 w-2.5 h-2.5 rounded-full bg-amber-400/60 blur-[1px] animate-pulse [animation-delay:0.5s]"></div>
        
        {/* Floating gradient glow behind text */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold font-outfit uppercase tracking-widest bg-amber-500/10 text-gold-300 border border-amber-500/20 mb-2">
            Restaurante & Terraza Bar
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight m-0 select-none">
            Los Compadres
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Restaurante (Piso 2) & Terraza Coctelería (Piso 3)
          </p>
        </div>
      </div>

      {/* Welcome content card */}
      <div className="w-full glass-panel-gold rounded-2xl p-6 md:p-8 flex flex-col items-center">
        <h3 className="text-xl md:text-2xl font-outfit font-bold text-white mb-3">
          ¡Bienvenidos a Los Compadres!
        </h3>
        
        <p className="text-sm text-neutral-300 leading-relaxed font-sans mb-8">
          Disfruta de la mejor experiencia gastronómica en Los Compadres. 
          Deléitate con nuestros platos en el segundo piso, o relájate con nuestros 
          cócteles y bebidas de autor en la terraza del tercer piso.
        </p>

        {/* Schedule Info Box */}
        <div className="w-full bg-black/30 rounded-xl p-3 border border-white/5 mb-8 text-left">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1 flex items-center gap-1.5">
            <span>🕒</span> Horario de Atención:
          </h4>
          <p className="text-xs text-neutral-300">
            • Lunes, Miér, Jue, Dom: 12:00 PM - 10:00 PM <br />
            • Viernes y Sábado: 12:00 PM - 11:00 PM <br />
            <span className="text-amber-400">• Martes: Sin servicio (Cerrado)</span>
          </p>
        </div>

        {/* Main Action Button */}
        <button
          onClick={nextStep}
          className="w-full py-4 rounded-xl text-base font-outfit uppercase tracking-wider gold-gradient-button cursor-pointer"
        >
          Reservar Ahora
        </button>

        {/* My Reservations Button */}
        <Link
          to="/mis-reservas"
          className="w-full py-4 rounded-xl text-base font-outfit uppercase tracking-wider gold-gradient-button text-center block mt-3"
        >
          Mis Reservas
        </Link>
      </div>
    </div>
  );
};

export default WelcomeStep;
