import { CATALOG } from './catalog';

const HARDCODED_KEY = import.meta.env.VITE_ANTHROPIC_KEY || '';

export async function callDiagnosis(description, imgBase64, imgType, _apiKey, clarification) {
  const apiKey = HARDCODED_KEY;
  const system = `You are Urban Company's AI diagnosis engine. Given the user's problem and the service catalog JSON below, return ONLY a valid JSON object — no prose, no markdown fences.

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

  const content = [];
  if (imgBase64) {
    content.push({ type: 'image', source: { type: 'base64', media_type: imgType || 'image/jpeg', data: imgBase64 } });
  }
  content.push({
    type: 'text',
    text: clarification ? `${description}\n\nUser clarification: ${clarification}` : description,
  });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, system, messages: [{ role: 'user', content }] }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  const raw = data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();

  return JSON.parse(raw);
}
