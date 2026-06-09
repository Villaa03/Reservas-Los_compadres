import { useReservation } from '../hooks/useReservation';
import { Link } from 'react-router-dom';

export const WelcomeStep = () => {
  const { nextStep } = useReservation();

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center text-center animate-fade-in">
      {/* Visual Header Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-8 glass-panel flex flex-col items-center justify-center py-8 md:py-10 px-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black">
        {/* Floating gradient glow behind text */}
        <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full"></div>

        <div className="relative z-10 text-center">
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
        <div className="w-full bg-black/30 rounded-xl p-4 border border-white/5 mb-8 text-center">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2 flex items-center justify-center gap-1.5">
            <span>🕒</span> Horario de Atención:
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Lunes, Miércoles, Jueves y Domingo — 12:00 PM a 10:00 PM <br />
            Viernes y Sábado — 12:00 PM a 11:00 PM <br />
            <span className="text-amber-400">Martes — Sin servicio (Cerrado)</span>
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
