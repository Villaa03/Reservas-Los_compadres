import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchReservasByPhone } from '../services/reservasService';
import { formatIsoToSpanish } from '../utils/dateHelpers';
import { formatTime12h } from '../utils/timeHelpers';

export const MisReservasPage = () => {
  const [phone, setPhone] = useState('');
  const [reservas, setReservas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(true);
    const data = await fetchReservasByPhone(phone.trim());
    setReservas(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-5 px-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="text-neutral-400 hover:text-white text-sm">
          ← Reservas
        </Link>
        <h1 className="text-lg font-outfit font-bold gold-gradient-text uppercase tracking-wider">
          Mis Reservas
        </h1>
        <div className="w-16" />
      </header>

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8">
        <div className="glass-panel-gold rounded-2xl p-6 md:p-8 flex flex-col items-center">
          <span className="text-4xl mb-2">🔍</span>
          <h2 className="text-xl font-outfit font-bold text-white text-center mb-1">
            Busca tus reservas
          </h2>
          <p className="text-xs text-neutral-400 text-center mb-6">
            Ingresa tu número de teléfono para ver tus reservas activas.
          </p>

          <form onSubmit={handleSearch} className="w-full flex flex-col gap-4">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Tu número de teléfono"
              className="w-full py-3 px-4 rounded-xl text-sm glass-input text-white"
              autoFocus
            />
            <button
              type="submit"
              disabled={!phone.trim() || loading}
              className="w-full py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider gold-gradient-button disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Buscando...' : 'Buscar Reservas'}
            </button>
          </form>

          {searched && !loading && (
            <div className="w-full mt-6">
              {reservas.length === 0 ? (
                <div className="text-center py-6">
                  <span className="text-3 block mb-2">😕</span>
                  <p className="text-sm text-neutral-400">
                    No encontramos reservas activas con ese número.
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    Verifica el número o{' '}
                    <Link to="/" className="text-gold-400 hover:underline">
                      crea una nueva reserva
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-neutral-400 text-center mb-2">
                    Se encontraron {reservas.length} reserva{reservas.length !== 1 ? 's' : ''}
                  </p>
                  {reservas.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => navigate(`/mis-reservas/${r.id}`)}
                      className="w-full glass-panel rounded-xl p-4 border border-white/5 text-left hover:border-gold-500/30 transition-all cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <p className="text-sm font-bold text-white font-outfit">
                            {r.cliente_nombre}
                          </p>
                          <p className="text-xs text-neutral-400 mt-1">
                            📅 {formatIsoToSpanish(r.fecha)} — 🕒 {formatTime12h(r.hora)}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            👥 {r.personas} {r.personas === 1 ? 'persona' : 'personas'} · 🎉 {r.ocasion}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                            r.estado === 'confirmada'
                              ? 'text-emerald-400'
                              : r.estado === 'cancelada'
                                ? 'text-red-400'
                                : 'text-amber-400'
                          }`}
                        >
                          {r.estado}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="w-full py-4 text-center text-[10px] text-neutral-500 font-sans tracking-wider border-t border-white/5 bg-black/20">
        © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME || 'Los Compadres Rooftop'}. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default MisReservasPage;
