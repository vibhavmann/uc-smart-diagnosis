import { CATALOG } from '../src/catalog.js';

const SYSTEM_FULL = `You are Urban Company's AI diagnosis engine. Given the user's problem and the service catalog JSON below, return ONLY a valid JSON object — no prose, no markdown fences.

Schema (MUST match exactly):
{
  "service": "exact service name from catalog",
  "variant": "specific variant if determinable, else empty string",
  "why": "one plain-English sentence explaining why this service",
  "addons": ["addon name from catalog that is likely needed"],
  "severity": "low|medium|high",
  "priceLow": <integer INR>,
  "priceHigh": <integer INR>,
  "priceBreakdown": "concise breakdown e.g. Visit fee 199 + tap replacement 350 + fittings 150",
  "confidence": "low|medium|high",
  "needsClarification": <true|false>,
  "clarifyingQuestion": "one short focused question if ambiguous, else empty string",
  "clarifyingOptions": ["option1","option2","option3"] if question set, else []
}

Rules:
- Match to the MOST SPECIFIC service and variant possible.
- If the problem could be 2+ very different services, set needsClarification true and ask ONE focused question.
- Price range MUST include likely add-ons/parts — never just echo base price if parts are probable.
- severity: low=cosmetic/routine, medium=functional problem, high=urgent/safety risk.
- confidence: how certain you are about the service match.
- Return ONLY the JSON object. Nothing else.

SERVICE CATALOG:
${JSON.stringify(CATALOG, null, 2)}`;

function buildSystemPrompt(retrievedServices) {
  if (!retrievedServices || retrievedServices.length === 0) return SYSTEM_FULL;

  const serviceBlock = retrievedServices
    .map((s) => `${s.category} → ${s.service_name}: ${s.description}`)
    .join('\n');

  return `You are Urban Company's AI diagnosis engine. Based on the user's problem description, the most semantically relevant services from the catalog have been retrieved (RAG). Use ONLY these services to diagnose.

Return ONLY a valid JSON object matching this schema exactly:
{
  "service": "exact service name",
  "variant": "specific variant if determinable, else empty string",
  "why": "one plain-English sentence explaining why this service",
  "addons": ["likely addon name"],
  "severity": "low|medium|high",
  "priceLow": <integer INR>,
  "priceHigh": <integer INR>,
  "priceBreakdown": "concise breakdown",
  "confidence": "low|medium|high",
  "needsClarification": <true|false>,
  "clarifyingQuestion": "one short focused question if ambiguous, else empty string",
  "clarifyingOptions": ["option1","option2","option3"] if question set, else []
}

RETRIEVED SERVICES (top matches for this query):
${serviceBlock}

Rules: Match most specific service. Ask one clarifying question only if genuinely ambiguous. Include likely parts/addons in price. Return ONLY the JSON.`;
}

async function retrieveRelevantServices(description, supabaseUrl, supabaseKey, voyageKey) {
  try {
    // 1. Embed the query
    const embedRes = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${voyageKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'voyage-3', input: [description] }),
    });
    if (!embedRes.ok) return null;
    const embedData = await embedRes.json();
    const embedding = embedData.data[0].embedding;

    // 2. Query Supabase pgvector for similar services
    const matchRes = await fetch(`${supabaseUrl}/rest/v1/rpc/match_services`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query_embedding: embedding, match_threshold: 0.4, match_count: 5 }),
    });
    if (!matchRes.ok) return null;
    return await matchRes.json();
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { description, imgBase64, imgType, clarification, apiKey: bodyKey } = req.body;
  if (!description) return res.status(400).json({ error: 'description required' });

  const apiKey = process.env.ANTHROPIC_KEY || bodyKey;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_KEY env var not set' });

  // RAG retrieval — only runs if Voyage + Supabase are configured
  const voyageKey = process.env.VOYAGE_API_KEY;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  let retrievedServices = null;
  if (voyageKey && supabaseUrl && supabaseKey && !clarification) {
    retrievedServices = await retrieveRelevantServices(description, supabaseUrl, supabaseKey, voyageKey);
  }

  const systemPrompt = buildSystemPrompt(retrievedServices);

  const content = [];
  if (imgBase64) {
    content.push({ type: 'image', source: { type: 'base64', media_type: imgType || 'image/jpeg', data: imgBase64 } });
  }
  content.push({
    type: 'text',
    text: clarification ? `${description}\n\nUser clarification: ${clarification}` : description,
  });

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content }],
    }),
  });

  const data = await upstream.json();
  return res.status(upstream.status).json(data);
}
