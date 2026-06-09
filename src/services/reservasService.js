import { supabase, isSupabaseConfigured } from '../lib/supabase';

const warnNotConfigured = () => {
  console.warn('Supabase no está configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env');
};

export const fetchReservasByDate = async (fecha) => {
  if (!isSupabaseConfigured) {
    warnNotConfigured();
    return [];
  }
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('fecha', fecha)
    .neq('estado', 'cancelada');

  if (error) {
    console.error('Error al cargar reservas:', error);
    return [];
  }
  return data || [];
};

export const fetchReservasByMonth = async (year, month) => {
  if (!isSupabaseConfigured) {
    warnNotConfigured();
    return [];
  }
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .gte('fecha', startDate)
    .lte('fecha', endDate)
    .order('fecha', { ascending: true })
    .order('hora', { ascending: true });

  if (error) {
    console.error('Error al cargar historial:', error);
    return [];
  }
  return data || [];
};

export const saveReserva = async (reserva) => {
  if (!isSupabaseConfigured) {
    warnNotConfigured();
    return { success: false, error: 'Supabase no configurado' };
  }
  const { data, error } = await supabase
    .from('reservas')
    .insert([reserva])
    .select()
    .single();

  if (error) {
    console.error('Error al guardar reserva:', error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
};

export const fetchReservaById = async (id) => {
  if (!isSupabaseConfigured) {
    warnNotConfigured();
    return { data: null, error: 'Supabase no configurado' };
  }
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al cargar reserva:', error);
    return { data: null, error: error.message };
  }
  return { data, error: null };
};

export const updateReservaEstado = async (id, estado) => {
  if (!isSupabaseConfigured) return { success: false };
  const { error } = await supabase
    .from('reservas')
    .update({ estado })
    .eq('id', id);

  return { success: !error, error: error?.message };
};

export const fetchFechasBloqueadas = async () => {
  if (!isSupabaseConfigured) {
    warnNotConfigured();
    return [];
  }
  const { data, error } = await supabase
    .from('fechas_bloqueadas')
    .select('*')
    .order('fecha', { ascending: true });

  if (error) {
    console.error('Error al cargar fechas bloqueadas:', error);
    return [];
  }
  return data || [];
};

export const bloquearFecha = async (fecha, razon = 'Evento privado') => {
  if (!isSupabaseConfigured) return { success: false, error: 'Supabase no configurado' };
  const { data, error } = await supabase
    .from('fechas_bloqueadas')
    .insert([{ fecha, razon }])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
};

export const desbloquearFecha = async (id) => {
  if (!isSupabaseConfigured) return { success: false };
  const { error } = await supabase
    .from('fechas_bloqueadas')
    .delete()
    .eq('id', id);

  return { success: !error, error: error?.message };
};

export const countReservasPorHora = (reservas) => {
  const counts = {};
  reservas.forEach((r) => {
    counts[r.hora] = (counts[r.hora] || 0) + 1;
  });
  return counts;
};

export const fetchReservasByPhone = async (telefono) => {
  if (!isSupabaseConfigured) {
    warnNotConfigured();
    return [];
  }
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('cliente_telefono', telefono)
    .neq('estado', 'cancelada')
    .order('fecha', { ascending: false });

  if (error) {
    console.error('Error al buscar reservas por teléfono:', error);
    return [];
  }
  return data || [];
};

export const updateReserva = async (id, updates) => {
  if (!isSupabaseConfigured) return { success: false, error: 'Supabase no configurado' };
  const { error } = await supabase
    .from('reservas')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar reserva:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
};

export const cancelReserva = async (id) => {
  return updateReserva(id, { estado: 'cancelada' });
};

export const consolidarPedidos = (reservas) => {
  const platos = {};
  reservas.forEach((r) => {
    const pedido = r.pedido_anticipado || [];
    pedido.forEach((item) => {
      const key = item.name;
      platos[key] = (platos[key] || 0) + (item.quantity || 1);
    });
  });
  return platos;
};
