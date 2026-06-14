import { createClient } from '@supabase/supabase-js';

// Anon key is public by design — RLS policies protect data server-side
const url = import.meta.env.VITE_SUPABASE_URL || 'https://enaoigeukchitejhrgki.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuYW9pZ2V1a2NoaXRlamhyZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MTM2MjcsImV4cCI6MjA5Njk4OTYyN30.jpV9sc4ywAHdYPUugB-mwhla8B5fr83ALtOPvMdTxq8';

export const supabase = (url && key && key !== 'PASTE_YOUR_ANON_KEY_HERE')
  ? createClient(url, key)
  : null;
export const hasSupabase = Boolean(supabase);
