import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_PASSWORD, ADMIN_SESSION_KEY } from '../constants/admin';
import {
  fetchReservasByDate,
  fetchReservasByMonth,
  fetchFechasBloqueadas,
  bloquearFecha,
  desbloquearFecha,
  updateReservaEstado,
  consolidarPedidos,
} from '../services/reservasService';
import { formatTime12h } from '../utils/timeHelpers';
import { formatDateISO } from '../utils/dateHelpers';
import { isSupabaseConfigured } from '../lib/supabase';

const formatDateDisplay = (iso) => {
  const [y, m, d] = iso.split('-');
  const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass-panel-gold rounded-2xl p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">🔐</span>
          <h1 className="text-xl font-outfit font-bold gold-gradient-text mt-3 uppercase tracking-wider">
            Panel Admin
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Los Compadres Rooftop</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Contraseña"
            className="py-3 px-4 rounded-xl text-sm glass-input text-white"
            autoFocus
          />
          {error && <p className="text-xs text-red-400 text-center">Contraseña incorrecta</p>}
          <button type="submit" className="py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider gold-gradient-button cursor-pointer">
            Ingresar
          </button>
        </form>
        <Link to="/" className="block text-center text-xs text-neutral-500 hover:text-neutral-300 mt-6">
          ← Volver a reservas
        </Link>
      </div>
    </div>
  );
};

const DailyAgenda = ({ selectedDate, onDateChange, reservas, onRefresh }) => {
  const totalPersonas = reservas.reduce((acc, r) => acc + r.personas, 0);
  const platosConsolidados = consolidarPedidos(reservas);

  const handleEstado = async (id, estado) => {
    await updateReservaEstado(id, estado);
    onRefresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-outfit font-bold text-white">Agenda del Día</h2>
          <p className="text-xs text-neutral-400 capitalize">{formatDateDisplay(selectedDate)}</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="py-2 px-3 rounded-xl text-sm glass-input text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel rounded-xl p-4 text-center">
          <span className="text-2xl font-extrabold text-gold-400 font-outfit">{reservas.length}</span>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Reservas</p>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center">
          <span className="text-2xl font-extrabold text-gold-400 font-outfit">{totalPersonas}</span>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Comensales</p>
        </div>
      </div>

      {Object.keys(platosConsolidados).length > 0 && (
        <div className="glass-panel rounded-xl p-4 border border-gold-500/15">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">
            🍳 Preparación de Cocina
          </h3>
          <p className="text-sm text-neutral-300">
            Hoy preparar:{' '}
            {Object.entries(platosConsolidados)
              .map(([nombre, qty]) => `${qty} ${nombre}`)
              .join(', ')}
          </p>
        </div>
      )}

      {reservas.length === 0 ? (
        <p className="text-sm text-neutral-500 text-center py-8">No hay reservas para este día.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reservas
            .sort((a, b) => a.hora.localeCompare(b.hora))
            .map((r) => (
              <div key={r.id} className="glass-panel rounded-xl p-4 border border-white/5">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-gold-400 font-bold font-outfit text-sm">
                      {formatTime12h(r.hora)}
                    </span>
                    <h4 className="text-white font-semibold font-outfit mt-1">{r.cliente_nombre}</h4>
                    <p className="text-xs text-neutral-400">📱 {r.cliente_telefono}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white">{r.personas} pers.</span>
                    <span
                      className={`block text-[10px] uppercase tracking-wider mt-1 font-semibold ${
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
                </div>
                <p className="text-xs text-neutral-400 mt-2">🎉 {r.ocasion}</p>
                {r.decoracion_cumpleanos && (
                  <p className="text-xs text-gold-400 mt-1">🎂 Con decoración especial</p>
                )}
                {(r.pedido_anticipado || []).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Pedido anticipado</p>
                    {r.pedido_anticipado.map((item, i) => (
                      <p key={i} className="text-xs text-neutral-300">
                        {item.quantity}x {item.name}
                      </p>
                    ))}
                  </div>
                )}
                {r.cliente_comentarios && (
                  <p className="text-xs text-neutral-500 mt-2 italic">"{r.cliente_comentarios}"</p>
                )}
                <div className="flex gap-2 mt-3">
                  {r.estado !== 'confirmada' && (
                    <button
                      type="button"
                      onClick={() => handleEstado(r.id, 'confirmada')}
                      className="text-[10px] px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/60 cursor-pointer"
                    >
                      Confirmar
                    </button>
                  )}
                  {r.estado !== 'cancelada' && (
                    <button
                      type="button"
                      onClick={() => handleEstado(r.id, 'cancelada')}
                      className="text-[10px] px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-950/60 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const BlockedDatesPanel = ({ fechasBloqueadas, onRefresh }) => {
  const [nuevaFecha, setNuevaFecha] = useState(formatDateISO(new Date()));
  const [razon, setRazon] = useState('Evento privado');
  const [loading, setLoading] = useState(false);

  const handleBloquear = async () => {
    setLoading(true);
    const result = await bloquearFecha(nuevaFecha, razon);
    if (result.success) {
      onRefresh();
    }
    setLoading(false);
  };

  const handleDesbloquear = async (id) => {
    await desbloquearFecha(id);
    onRefresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-outfit font-bold text-white">Fechas Bloqueadas</h2>

      <div className="glass-panel rounded-xl p-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
            className="flex-1 py-2 px-3 rounded-xl text-sm glass-input text-white"
          />
          <input
            type="text"
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
            placeholder="Razón"
            className="flex-1 py-2 px-3 rounded-xl text-sm glass-input text-white"
          />
        </div>
        <button
          type="button"
          onClick={handleBloquear}
          disabled={loading}
          className="py-2.5 rounded-xl text-xs font-outfit uppercase tracking-wider gold-gradient-button cursor-pointer disabled:opacity-50"
        >
          Bloquear Fecha
        </button>
      </div>

      {fechasBloqueadas.length === 0 ? (
        <p className="text-sm text-neutral-500 text-center py-4">No hay fechas bloqueadas.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {fechasBloqueadas.map((f) => (
            <div
              key={f.id}
              className="glass-panel rounded-xl p-3 flex justify-between items-center"
            >
              <div>
                <span className="text-sm font-semibold text-white capitalize">
                  {formatDateDisplay(f.fecha)}
                </span>
                <p className="text-xs text-neutral-400">{f.razon}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDesbloquear(f.id)}
                className="text-[10px] px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-950/30 cursor-pointer"
              >
                Desbloquear
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MonthlyReport = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMonth = useCallback(async () => {
    setLoading(true);
    const data = await fetchReservasByMonth(year, month);
    setReservas(data);
    setLoading(false);
  }, [year, month]);

  useEffect(() => {
    loadMonth();
  }, [loadMonth]);

  const reservasPorDia = {};
  reservas.forEach((r) => {
    if (r.estado !== 'cancelada') {
      reservasPorDia[r.fecha] = (reservasPorDia[r.fecha] || 0) + 1;
    }
  });
  const maxCount = Math.max(...Object.values(reservasPorDia), 1);

  const downloadCSV = () => {
    const headers = [
      'Fecha',
      'Hora',
      'Cliente',
      'Teléfono',
      'Personas',
      'Ocasión',
      'Decoración',
      'Garantía',
      'Estado',
      'Comentarios',
    ];
    const rows = reservas.map((r) => [
      r.fecha,
      r.hora,
      r.cliente_nombre,
      r.cliente_telefono,
      r.personas,
      r.ocasion,
      r.decoracion_cumpleanos ? 'Sí' : 'No',
      r.valor_garantia,
      r.estado,
      (r.cliente_comentarios || '').replace(/"/g, '""'),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas_${year}_${String(month).padStart(2, '0')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-outfit font-bold text-white">Historial del Mes</h2>

      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="py-2 px-3 rounded-xl text-sm glass-input text-white"
        >
          {monthNames.map((name, i) => (
            <option key={i} value={i + 1}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="py-2 px-3 rounded-xl text-sm glass-input text-white"
        >
          {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={downloadCSV}
          disabled={reservas.length === 0}
          className="py-2 px-4 rounded-xl text-xs font-outfit uppercase tracking-wider border border-gold-500/30 text-gold-400 hover:bg-gold-950/30 cursor-pointer disabled:opacity-40"
        >
          Descargar CSV
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500 text-center py-4">Cargando...</p>
      ) : (
        <>
          <div className="glass-panel rounded-xl p-4">
            <p className="text-xs text-neutral-400 mb-3 uppercase tracking-wider">
              Reservas por día — {monthNames[month - 1]} {year}
            </p>
            {Object.keys(reservasPorDia).length === 0 ? (
              <p className="text-sm text-neutral-500">Sin datos este mes.</p>
            ) : (
              <div className="flex items-end gap-1 h-32">
                {Object.entries(reservasPorDia)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([fecha, count]) => (
                    <div key={fecha} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                      <div
                        className="w-full bg-gold-500/60 rounded-t-sm transition-all"
                        style={{ height: `${(count / maxCount) * 100}%`, minHeight: '4px' }}
                        title={`${fecha}: ${count} reservas`}
                      />
                      <span className="text-[8px] text-neutral-500 truncate w-full text-center">
                        {fecha.split('-')[2]}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <p className="text-xs text-neutral-400 text-center">
            Total: {reservas.filter((r) => r.estado !== 'cancelada').length} reservas activas ·{' '}
            {reservas.reduce((a, r) => (r.estado !== 'cancelada' ? a + r.personas : a), 0)} comensales
          </p>
        </>
      )}
    </div>
  );
};

export const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
  );
  const [activeTab, setActiveTab] = useState('agenda');
  const [selectedDate, setSelectedDate] = useState(formatDateISO(new Date()));
  const [reservas, setReservas] = useState([]);
  const [fechasBloqueadas, setFechasBloqueadas] = useState([]);

  const loadAgenda = useCallback(async () => {
    const data = await fetchReservasByDate(selectedDate);
    setReservas(data);
  }, [selectedDate]);

  const loadBloqueadas = useCallback(async () => {
    const data = await fetchFechasBloqueadas();
    setFechasBloqueadas(data);
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadAgenda();
      loadBloqueadas();
    }
  }, [authenticated, loadAgenda, loadBloqueadas]);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  const tabs = [
    { id: 'agenda', label: '📋 Agenda' },
    { id: 'bloqueos', label: '🚫 Bloqueos' },
    { id: 'historial', label: '📊 Historial' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-5 px-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div>
          <h1 className="text-lg font-outfit font-bold gold-gradient-text uppercase tracking-wider">
            Los Compadres — Admin
          </h1>
          {!isSupabaseConfigured && (
            <p className="text-[10px] text-amber-400 mt-0.5">
              ⚠ Supabase no configurado — agrega variables en .env
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs text-neutral-400 hover:text-white">
            Reservas
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-neutral-500 hover:text-red-400 cursor-pointer"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="flex border-b border-white/5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-xs font-outfit font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
        {activeTab === 'agenda' && (
          <DailyAgenda
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            reservas={reservas}
            onRefresh={loadAgenda}
          />
        )}
        {activeTab === 'bloqueos' && (
          <BlockedDatesPanel fechasBloqueadas={fechasBloqueadas} onRefresh={loadBloqueadas} />
        )}
        {activeTab === 'historial' && <MonthlyReport />}
      </main>
    </div>
  );
};

export default AdminPage;
