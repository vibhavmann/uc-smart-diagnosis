/**
 * One-time script: embed the UC service catalog and store vectors in Supabase.
 *
 * Usage:
 *   VITE_SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJ... \
 *   VOYAGE_API_KEY=pa-... \
 *   node scripts/seed-embeddings.js
 */

import { createClient } from '@supabase/supabase-js';
import { CATALOG } from '../src/catalog.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const voyageKey   = process.env.VOYAGE_API_KEY;

if (!supabaseUrl || !supabaseKey || !voyageKey) {
  console.error('Missing env vars: VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY, VOYAGE_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function embed(text) {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${voyageKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'voyage-3', input: [text] }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Voyage AI error: ${err}`);
  }
  const data = await res.json();
  return data.data[0].embedding;
}

async function seed() {
  console.log('Clearing existing embeddings…');
  await supabase.from('service_embeddings').delete().neq('id', 0);

  let count = 0;
  for (const cat of CATALOG) {
    for (const svc of cat.services) {
      const description =
        `${cat.category}: ${svc.name}. ` +
        `Variants: ${svc.variants.join(', ')}. ` +
        `Price range: ₹${svc.priceRange[0]}–₹${svc.priceRange[1]}. ` +
        `Common add-ons: ${svc.addons.map((a) => a.name).join(', ')}.`;

      const embedding = await embed(description);

      const { error } = await supabase.from('service_embeddings').insert({
        service_name: svc.name,
        category: cat.category,
        description,
        embedding,
      });

      if (error) {
        console.error(`Failed to insert ${svc.name}:`, error.message);
      } else {
        count++;
        console.log(`✓ ${count}. ${cat.category} — ${svc.name}`);
      }

      // Respect Voyage AI rate limits
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log(`\nDone! ${count} services embedded and stored in Supabase.`);
}

seed().catch((err) => { console.error(err); process.exit(1); });
