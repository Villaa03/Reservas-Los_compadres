CREATE TABLE IF NOT EXISTS reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  token UUID DEFAULT gen_random_uuid(),
  personas INT NOT NULL,
  ocasion TEXT NOT NULL,
  decoracion_cumpleanos BOOLEAN DEFAULT FALSE,
  fecha DATE NOT NULL,
  hora TEXT NOT NULL,
  pedido_anticipado JSONB DEFAULT '[]'::jsonb,
  cliente_nombre TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  cliente_comentarios TEXT DEFAULT '',
  valor_garantia INT NOT NULL,
  estado TEXT DEFAULT 'pendiente'
);

CREATE TABLE IF NOT EXISTS fechas_bloqueadas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  fecha DATE NOT NULL UNIQUE,
  razon TEXT DEFAULT 'Evento privado'
);

-- Índice para búsqueda rápida por teléfono
CREATE INDEX IF NOT EXISTS idx_reservas_telefono ON reservas (cliente_telefono);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas (fecha);

-- Habilitar RLS
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fechas_bloqueadas ENABLE ROW LEVEL SECURITY;

-- Políticas para reservas
-- Los clientes pueden leer, crear y actualizar sus reservas.
-- No se permite DELETE público: la app cambia estado a 'cancelada' en vez de borrar.
-- Para borrar registros, usar el panel de Supabase directamente.
CREATE POLICY "Lectura pública reservas" ON reservas
  FOR SELECT USING (true);

CREATE POLICY "Inserción pública reservas" ON reservas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Actualización pública reservas" ON reservas
  FOR UPDATE USING (true);

-- Políticas para fechas bloqueadas
CREATE POLICY "Lectura pública fechas_bloqueadas" ON fechas_bloqueadas
  FOR SELECT USING (true);

CREATE POLICY "Inserción pública fechas_bloqueadas" ON fechas_bloqueadas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Eliminación pública fechas_bloqueadas" ON fechas_bloqueadas
  FOR DELETE USING (true);
