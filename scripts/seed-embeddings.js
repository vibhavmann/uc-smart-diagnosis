/**
 * One-time script: embed the UC service catalog and store vectors in Supabase.
 *
 * Usage (reads .env automatically via --env-file):
 *   node --env-file=.env scripts/seed-embeddings.js
 *
 * Requires Node 20+. All 79 services are batch-embedded in one Voyage AI call.
 */

import { createClient } from '@supabase/supabase-js';
import { CATALOG } from '../src/catalog.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const voyageKey   = process.env.VOYAGE_API_KEY;

if (!supabaseUrl || !supabaseKey || !voyageKey) {
  console.error('Missing env vars. Run with: node --env-file=.env scripts/seed-embeddings.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Debug: verify env vars are being read correctly
console.log('Supabase URL    :', supabaseUrl);
console.log('Service key     :', supabaseKey?.slice(0, 20), '...', supabaseKey?.slice(-10), `(${supabaseKey?.length} chars)`);
console.log('Voyage key      :', voyageKey?.slice(0, 20), '...', `(${voyageKey?.length} chars)`);

// Quick connection test before embedding anything
const { error: pingError } = await supabase.from('service_embeddings').select('id').limit(1);
if (pingError) {
  console.error('\nSupabase connection test FAILED:', pingError.message);
  console.error('Check that the service_role key matches the project URL above.');
  process.exit(1);
}
console.log('Supabase connection test PASSED ✓\n');

// Flatten catalog into rows — combine catalog description with metadata for rich embeddings
const rows = CATALOG.flatMap((cat) =>
  cat.services.map((svc) => ({
    service_name: svc.name,
    category: cat.category,
    // This text is what gets embedded — rich natural-language description is key for semantic match
    embed_text:
      `${cat.category}: ${svc.name}. ${svc.description} ` +
      `Variants: ${svc.variants.join(', ')}. ` +
      `Typical add-ons: ${svc.addons.map((a) => a.name).join(', ')}.`,
  }))
);

async function batchEmbed(texts) {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${voyageKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'voyage-3', input: texts }),
  });
  if (!res.ok) throw new Error(`Voyage AI error: ${await res.text()}`);
  const data = await res.json();
  return data.data.map((d) => d.embedding);
}

async function seed() {
  console.log(`Embedding ${rows.length} services in one batch…`);
  const embeddings = await batchEmbed(rows.map((r) => r.embed_text));
  console.log('✓ Embeddings received. Clearing old data and inserting…\n');

  await supabase.from('service_embeddings').delete().neq('id', 0);

  let ok = 0;
  for (let i = 0; i < rows.length; i++) {
    const { error } = await supabase.from('service_embeddings').insert({
      service_name: rows[i].service_name,
      category: rows[i].category,
      description: rows[i].embed_text,
      embedding: embeddings[i],
    });
    if (error) {
      console.error(`✗ ${rows[i].service_name}:`, error.message);
    } else {
      ok++;
      console.log(`✓ ${ok}/${rows.length}  ${rows[i].category} — ${rows[i].service_name}`);
    }
  }

  console.log(`\nDone! ${ok}/${rows.length} services stored in Supabase pgvector.`);
}

seed().catch((err) => { console.error(err); process.exit(1); });
