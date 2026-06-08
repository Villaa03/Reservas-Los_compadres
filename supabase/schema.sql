-- Ejecutar en el SQL Editor de Supabase

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

-- Políticas para reservas (acceso público con IDs UUID)
-- Los IDs UUID son únicos y no adivinables, lo que permite a los clientes
-- acceder a sus reservas sin autenticación. Ajustar RLS si se requiere
-- mayor seguridad en producción.
CREATE POLICY "Lectura pública reservas" ON reservas
  FOR SELECT USING (true);

CREATE POLICY "Inserción pública reservas" ON reservas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Actualización pública reservas" ON reservas
  FOR UPDATE USING (true);

CREATE POLICY "Eliminación pública reservas" ON reservas
  FOR DELETE USING (true);

-- Políticas para fechas bloqueadas
CREATE POLICY "Lectura pública fechas_bloqueadas" ON fechas_bloqueadas
  FOR SELECT USING (true);

CREATE POLICY "Inserción pública fechas_bloqueadas" ON fechas_bloqueadas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Eliminación pública fechas_bloqueadas" ON fechas_bloqueadas
  FOR DELETE USING (true);
