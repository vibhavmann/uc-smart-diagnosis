-- Run this in Supabase SQL Editor (Project → SQL Editor → New Query)

-- 1. Enable pgvector extension for RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id            TEXT PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service       TEXT NOT NULL,
  variant       TEXT,
  price_low     INTEGER,
  price_high    INTEGER,
  price_breakdown TEXT,
  slot_day      TEXT,
  slot_time     TEXT,
  severity      TEXT,
  addons        TEXT[],
  status        TEXT DEFAULT 'confirmed',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Allow users to read/write only their own bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own bookings" ON bookings
  FOR ALL USING (auth.uid() = user_id);

-- 3. Service embeddings table for RAG
CREATE TABLE IF NOT EXISTS service_embeddings (
  id            SERIAL PRIMARY KEY,
  service_name  TEXT NOT NULL,
  category      TEXT NOT NULL,
  description   TEXT NOT NULL,
  embedding     vector(1024)
);

-- Cosine similarity index (speeds up ANN search)
CREATE INDEX IF NOT EXISTS service_embeddings_idx
  ON service_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 10);

-- Service embeddings are public read (no user data)
ALTER TABLE service_embeddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read service_embeddings" ON service_embeddings
  FOR SELECT USING (true);

-- 4. Semantic search function used by api/diagnose.js
CREATE OR REPLACE FUNCTION match_services(
  query_embedding vector(1024),
  match_threshold FLOAT DEFAULT 0.4,
  match_count     INT   DEFAULT 5
)
RETURNS TABLE (
  service_name TEXT,
  category     TEXT,
  description  TEXT,
  similarity   FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.service_name,
    se.category,
    se.description,
    1 - (se.embedding <=> query_embedding) AS similarity
  FROM service_embeddings se
  WHERE 1 - (se.embedding <=> query_embedding) > match_threshold
  ORDER BY se.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
