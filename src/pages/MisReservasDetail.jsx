import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchFechasBloqueadas, countReservasPorHora, fetchReservasByDate, updateReserva, cancelReserva } from '../services/reservasService';
import { formatIsoToSpanish } from '../utils/dateHelpers';
import { formatTime12h } from '../utils/timeHelpers';
import { getAvailableDates } from '../utils/dateHelpers';
import { PAYMENT_INFO, getTotalGarantia } from '../constants/payment';

const MAX_RESERVAS_POR_HORA = 2;

const TIME_SECTIONS = [
  {
    id: 'almuerzo', label: 'Almuerzo (Mediodía)', icon: '☀️',
    slots: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
  },
  {
    id: 'tarde', label: 'Tarde / After Office', icon: '🌇',
    slots: ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30'],
  },
  {
    id: 'cena', label: 'Cena', icon: '✨',
    slots: ['19:00', '19:30', '20:00', '20:30'],
  },
];

const ConfirmDialog = ({ message, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="glass-panel-gold rounded-2xl p-6 max-w-sm w-full text-center">
      <span className="text-4 block mb-3">⚠️</span>
      <p className="text-sm text-white font-outfit font-semibold mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-3 rounded-xl text-xs font-outfit uppercase tracking-wider border border-neutral-800 text-neutral-400 hover:bg-neutral-900 cursor-pointer"
        >
          No
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-3 rounded-xl text-xs font-outfit uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Cancelando...' : 'Sí, Cancelar'}
        </button>
      </div>
    </div>
  </div>
);

const SuccessDialog = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="glass-panel-gold rounded-2xl p-6 max-w-sm w-full text-center">
      <span className="text-4 block mb-3">✅</span>
      <p className="text-sm text-white font-outfit font-semibold mb-4">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3 rounded-xl text-xs font-outfit uppercase tracking-wider gold-gradient-button cursor-pointer"
      >
        Volver a Mis Reservas
      </button>
    </div>
  </div>
);

export const MisReservasDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [editing, setEditing] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [reservasPorHora, setReservasPorHora] = useState({});

  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase
      .from('reservas')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err || !data) {
          setError(true);
        } else {
          setReserva(data);
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    fetchFechasBloqueadas().then((fechas) => {
      setBlockedDates(fechas.map((f) => f.fecha));
    });
  }, []);

  const availableDates = getAvailableDates(30).filter(
    (d) => !blockedDates.includes(d.isoString)
  );

  const groupedDates = availableDates.reduce((acc, curr) => {
    const month = curr.date.toLocaleString('es-CO', { month: 'long', year: 'numeric' });
    const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
    if (!acc[capitalized]) acc[capitalized] = [];
    acc[capitalized].push(curr);
    return acc;
  }, {});

  const loadAvailability = useCallback(async (fecha) => {
    const reservas = await fetchReservasByDate(fecha);
    setReservasPorHora(countReservasPorHora(reservas));
  }, []);

  useEffect(() => {
    if (editing === 'date' || editing === 'time') {
      const dateToCheck = editing === 'time' && reserva ? reserva.fecha : (reserva?.fecha || '');
      if (dateToCheck) loadAvailability(dateToCheck);
    }
  }, [editing, reserva, loadAvailability]);

  const handleSaveDate = async (newDate) => {
    if (!reserva) return;
    const result = await updateReserva(reserva.id, { fecha: newDate, hora: '' });
    if (result.success) {
      setReserva({ ...reserva, fecha: newDate, hora: '' });
      setEditing(null);
      setSuccessMsg('Fecha actualizada correctamente.');
    }
  };

  const handleSaveTime = async (newTime) => {
    if (!reserva) return;
    const result = await updateReserva(reserva.id, { hora: newTime });
    if (result.success) {
      setReserva({ ...reserva, hora: newTime });
      setEditing(null);
      setSuccessMsg('Hora actualizada correctamente.');
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    const result = await cancelReserva(reserva.id);
    setCancelling(false);
    if (result.success) {
      setShowCancel(false);
      setSuccessMsg('Tu reserva ha sido cancelada.');
      setReserva({ ...reserva, estado: 'cancelada' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-400">Cargando reserva...</p>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <span className="text-4">😕</span>
        <p className="text-sm text-neutral-400 text-center">No encontramos esta reserva.</p>
        <Link to="/mis-reservas" className="text-xs text-gold-400 hover:underline">
          ← Volver a Mis Reservas
        </Link>
      </div>
    );
  }

  const totalGarantia = getTotalGarantia(reserva.decoracion_cumpleanos);
  const isCancelled = reserva.estado === 'cancelada';

  const renderDateEditor = () => (
    <div className="mt-4 p-4 bg-neutral-950/60 border border-gold-500/20 rounded-xl">
      <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">
        Selecciona nueva fecha
      </h4>
      <div className="max-h-48 overflow-y-auto no-scrollbar flex flex-col gap-4">
        {Object.keys(groupedDates).map((monthYear) => (
          <div key={monthYear}>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{monthYear}</h5>
            <div className="grid grid-cols-4 gap-1.5">
              {groupedDates[monthYear].map((dayObj) => {
                const isSelected = reserva.fecha === dayObj.isoString;
                return (
                  <button
                    key={dayObj.isoString}
                    type="button"
                    onClick={() => handleSaveDate(dayObj.isoString)}
                    className={`py-2 rounded-lg border text-center transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-gold-950/40 border-gold-400 text-gold-300 font-bold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider block">{dayObj.label}</span>
                    <span className="text-sm font-bold font-outfit text-white block">{dayObj.dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setEditing(null)}
        className="mt-3 w-full py-2 rounded-lg text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:bg-neutral-900 transition-all cursor-pointer"
      >
        Cancelar
      </button>
    </div>
  );

  const renderTimeEditor = () => (
    <div className="mt-4 p-4 bg-neutral-950/60 border border-gold-500/20 rounded-xl">
      <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">
        Selecciona nueva hora — {formatIsoToSpanish(reserva.fecha)}
      </h4>
      <div className="max-h-48 overflow-y-auto no-scrollbar flex flex-col gap-3">
        {TIME_SECTIONS.map((section) => (
          <div key={section.id}>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-1 mb-2">
              <span>{section.icon}</span> {section.label}
            </h5>
            <div className="grid grid-cols-3 gap-1.5">
              {section.slots.map((slot) => {
                const count = reservasPorHora[slot] || 0;
                const agotado = count >= MAX_RESERVAS_POR_HORA;
                const isSelected = reserva.hora === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => !agotado && handleSaveTime(slot)}
                    disabled={agotado}
                    className={`py-2 rounded-lg border text-center transition-all ${
                      agotado
                        ? 'bg-neutral-950/60 border-neutral-800/50 text-neutral-600 cursor-not-allowed opacity-60'
                        : isSelected
                          ? 'bg-gold-950/40 border-gold-400 text-gold-300 font-bold cursor-pointer active:scale-95'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 cursor-pointer active:scale-95'
                    }`}
                  >
                    <span className="text-xs font-bold font-outfit">{formatTime12h(slot).split(' ')[0]}</span>
                    <span className={`text-[9px] uppercase tracking-wider block ${agotado ? 'text-red-400/70' : 'text-neutral-500'}`}>
                      {agotado ? 'Agotado' : formatTime12h(slot).split(' ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setEditing(null)}
        className="mt-3 w-full py-2 rounded-lg text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:bg-neutral-900 transition-all cursor-pointer"
      >
        Cancelar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-5 px-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <Link to="/mis-reservas" className="text-neutral-400 hover:text-white text-sm">
          ← Mis Reservas
        </Link>
        <h1 className="text-lg font-outfit font-bold gold-gradient-text uppercase tracking-wider">
          Detalle de Reserva
        </h1>
        <div className="w-16" />
      </header>

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8">
        <div className="glass-panel-gold rounded-2xl p-6 md:p-8 flex flex-col">
          <div className="text-center mb-6">
            <span className="text-4 block mb-2">🥂</span>
            <h2 className="text-xl font-outfit font-bold text-white">
              {isCancelled ? 'Reserva Cancelada' : 'Reserva Confirmada'}
            </h2>
            <span
              className={`inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full ${
                isCancelled
                  ? 'bg-red-950/30 text-red-400 border border-red-500/20'
                  : reserva.estado === 'confirmada'
                    ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-950/30 text-amber-400 border border-amber-500/20'
              }`}
            >
              {reserva.estado}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Personas</span>
              <span className="text-sm font-bold text-white font-outfit">{reserva.personas} {reserva.personas === 1 ? 'persona' : 'personas'}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Ocasión</span>
              <span className="text-sm font-bold text-white font-outfit">{reserva.ocasion}</span>
              {reserva.decoracion_cumpleanos && (
                <span className="text-[10px] text-gold-400 block mt-0.5">+ Decoración especial</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-b border-white/5">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Fecha</span>
              <span className="text-sm font-bold text-white font-outfit">{formatIsoToSpanish(reserva.fecha)}</span>
              {!isCancelled && editing !== 'date' && (
                <button
                  type="button"
                  onClick={() => setEditing(editing === 'date' ? null : 'date')}
                  className="text-[10px] text-gold-400 hover:underline mt-1 block cursor-pointer"
                >
                  Cambiar fecha
                </button>
              )}
              {editing === 'date' && renderDateEditor()}
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Hora</span>
              <span className="text-sm font-bold text-white font-outfit">{formatTime12h(reserva.hora)}</span>
              {!isCancelled && editing !== 'time' && reserva.hora && (
                <button
                  type="button"
                  onClick={() => setEditing(editing === 'time' ? null : 'time')}
                  className="text-[10px] text-gold-400 hover:underline mt-1 block cursor-pointer"
                >
                  Cambiar hora
                </button>
              )}
              {editing === 'time' && renderTimeEditor()}
            </div>
          </div>

          <div className="py-4 border-b border-white/5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-2">Pedido Anticipado</span>
            {reserva.pedido_anticipado && reserva.pedido_anticipado.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {reserva.pedido_anticipado.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-neutral-300">{item.quantity}x {item.name}</span>
                    <span className="text-gold-400 font-bold font-outfit">${(item.price * item.quantity).toLocaleString('es-CO')} COP</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-white/5 pt-2 mt-1">
                  <span className="text-xs text-neutral-400 font-semibold uppercase">Total Estimado</span>
                  <span className="text-sm font-extrabold text-gold-300 font-outfit">
                    ${reserva.pedido_anticipado.reduce((a, i) => a + i.price * i.quantity, 0).toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-xs text-neutral-500 italic">Ninguno</span>
            )}
          </div>

          <div className="py-4 border-b border-white/5 flex flex-col gap-3">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Nombre</span>
              <span className="text-sm font-bold text-white font-outfit">{reserva.cliente_nombre}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Teléfono</span>
              <span className="text-sm font-bold text-white font-outfit">+57 {reserva.cliente_telefono}</span>
            </div>
            {reserva.cliente_comentarios && (
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Comentarios</span>
                <span className="text-xs text-neutral-300">{reserva.cliente_comentarios}</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col gap-2.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Garantía</span>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-300">Abono Garantía de Mesa</span>
              <span className="font-bold text-white font-outfit">${PAYMENT_INFO.garantiaMesa.toLocaleString('es-CO')} COP</span>
            </div>
            {reserva.decoracion_cumpleanos && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">Decoración Especial</span>
                <span className="font-bold text-gold-400 font-outfit">${PAYMENT_INFO.decoracionCumpleanos.toLocaleString('es-CO')} COP</span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/10 pt-2.5 mt-1">
              <span className="font-bold text-white">Total Garantía</span>
              <span className="font-extrabold text-gold-300 font-outfit text-base">
                ${totalGarantia.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>

          {!isCancelled && (
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setShowCancel(true)}
                className="w-full py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider border border-red-500/30 text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
              >
                Cancelar Reserva
              </button>
              <Link
                to="/mis-reservas"
                className="w-full py-3 text-center rounded-xl text-xs font-outfit uppercase tracking-wider border border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all"
              >
                ← Volver a Mis Reservas
              </Link>
            </div>
          )}
        </div>
      </main>

      {showCancel && (
        <ConfirmDialog
          message="¿Estás seguro de cancelar tu reserva? Esta acción no se puede deshacer."
          onConfirm={handleCancel}
          onCancel={() => setShowCancel(false)}
          loading={cancelling}
        />
      )}

      {successMsg && (
        <SuccessDialog
          message={successMsg}
          onClose={() => {
            setSuccessMsg(null);
            if (reserva.estado === 'cancelada') {
              navigate('/mis-reservas');
            }
          }}
        />
      )}

      <footer className="w-full py-4 text-center text-[10px] text-neutral-500 font-sans tracking-wider border-t border-white/5 bg-black/20">
        © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME || 'Los Compadres Rooftop'}. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default MisReservasDetail;
