-- ─────────────────────────────────────────────────────────
-- schema.sql — TECHNØLÉ RAEE
-- Compatible con PostgreSQL 14+
-- Para SQLite (desarrollo local): ajusta los tipos según notas.
-- ─────────────────────────────────────────────────────────

-- Extensión para UUIDs (opcional, si prefieres UUID sobre serial)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Clientes ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  contact    VARCHAR(150),
  email      VARCHAR(150),
  phone      VARCHAR(30),
  nif        VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Recogidas ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collections (
  id           SERIAL PRIMARY KEY,
  client_id    INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  date         DATE         NOT NULL,
  address      TEXT,
  technician   VARCHAR(150),
  service_type VARCHAR(100),
  certified    BOOLEAN      DEFAULT FALSE,
  cert_id      VARCHAR(30),
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Dispositivos ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS devices (
  id            SERIAL PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  brand         VARCHAR(100),
  model         VARCHAR(150),
  serial        VARCHAR(100),
  method        VARCHAR(50) CHECK (method IN ('borrado_logico', 'trituracion', 'otros')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Certificados ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id            VARCHAR(30) PRIMARY KEY,  -- ej. RAEE-2025-001
  collection_id INTEGER REFERENCES collections(id) ON DELETE SET NULL,
  issued        DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Usuarios (para auth futura) ──────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT         NOT NULL,
  role          VARCHAR(50)  DEFAULT 'technician',
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ── Índices para consultas comunes ──────────────────────
CREATE INDEX IF NOT EXISTS idx_collections_client   ON collections(client_id);
CREATE INDEX IF NOT EXISTS idx_collections_date     ON collections(date);
CREATE INDEX IF NOT EXISTS idx_devices_collection   ON devices(collection_id);
CREATE INDEX IF NOT EXISTS idx_certificates_issued  ON certificates(issued);

-- ── Datos de ejemplo (desarrollo) ───────────────────────
-- Descomentar para seed inicial:
/*
INSERT INTO clients (name, contact, email, phone, nif) VALUES
  ('TechCorp S.L.',      'Ana García',   'ana@techcorp.es',    '+34 612 345 678', 'B12345678'),
  ('Oficinas Meridian',  'Carlos Ruiz',  'cruiz@meridian.com', '+34 699 876 543', 'B87654321'),
  ('Clínica Salud Total','Dr. Martínez', 'admin@saludtotal.es','+34 955 123 456', 'B11223344');
*/
