import { CATALOG } from '../src/catalog.js';

const SYSTEM = `You are Urban Company's AI diagnosis engine. Given the user's problem and the service catalog JSON below, return ONLY a valid JSON object — no prose, no markdown fences.

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { description, imgBase64, imgType, clarification } = req.body;
  if (!description) return res.status(400).json({ error: 'description required' });

  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_KEY env var not set' });

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
      system: SYSTEM,
      messages: [{ role: 'user', content }],
    }),
  });

  const data = await upstream.json();
  return res.status(upstream.status).json(data);
}
