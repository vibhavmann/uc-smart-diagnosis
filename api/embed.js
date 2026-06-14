export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  const voyageKey = process.env.VOYAGE_API_KEY;
  if (!voyageKey) return res.status(500).json({ error: 'VOYAGE_API_KEY not set' });

  const upstream = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${voyageKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'voyage-3', input: [text] }),
  });

  const data = await upstream.json();
  if (!upstream.ok) return res.status(upstream.status).json(data);
  return res.status(200).json({ embedding: data.data[0].embedding });
}
