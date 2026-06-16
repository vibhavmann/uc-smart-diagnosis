# UC Smart Diagnosis

**AI-powered service routing for Urban Company** — describe your problem in plain English, get the right service, right price, right pro.

🔗 **[Live Demo](https://uc-smart-diagnosis.vercel.app)** &nbsp;|&nbsp; 📄 **[Full Product Analysis](DETAILED_ANALYSIS.md)**

---

## The Problem

Urban Company's booking flow assumes you already know what service you need. Most customers don't — they know their *symptom*. This mismatch causes mis-bookings, on-site price surprises, and failed first visits.

**This app lets customers describe their problem. AI does the rest.**

---

## What It Does

| Step | What happens |
|---|---|
| **Describe** | User types a problem or uploads a photo |
| **Diagnose** | Claude `claude-sonnet-4-6` routes to the exact service + variant |
| **Clarify** | If ambiguous, asks one focused follow-up question |
| **Price** | Returns a realistic price band with itemised breakdown |
| **Book** | User picks a slot — booking saved to Supabase |
| **Manage** | Reschedule or cancel from My Bookings |

---

## Key Features

- **Multimodal input** — text description + optional photo; detects when the two contradict each other
- **RAG pipeline** — Voyage AI embeds the query → Supabase pgvector retrieves top matching services → Claude sees only those (not all 79), cutting token cost ~8×
- **RAG inspector** — collapsible panel on every result showing which services were retrieved and their similarity scores
- **Clarification flow** — structured follow-up with multiple-choice options + free-text fallback
- **Booking management** — create, reschedule, and cancel bookings; synced to Supabase for logged-in users
- **Auth** — Google / GitHub OAuth via Supabase; fully optional (guest flow works end-to-end)
- **Mobile-first PWA** — `100dvh`, `env(safe-area-inset-*)`, `viewport-fit=cover`; works on iPhone Safari

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| AI | Anthropic Claude `claude-sonnet-4-6` (multimodal) |
| Embeddings | Voyage AI `voyage-3` (1024-dim vectors) |
| Vector DB | Supabase pgvector (`ivfflat` index, cosine similarity) |
| Auth & DB | Supabase (Google + GitHub OAuth, bookings table) |
| Hosting | Vercel (serverless functions + static frontend) |

---

## RAG Architecture

```
User query → Voyage AI embedding → Supabase pgvector search
                                          ↓
                              Top 5 services (≥ 30% similarity)
                                          ↓
                               Claude diagnoses from subset
                                          ↓
                        Service · Variant · Price · Add-ons · Severity
```

The full catalog (79 services, 11 categories) is pre-embedded at deploy time. At runtime, only semantically relevant services reach Claude — keeping prompts focused and costs low regardless of catalog size.

---

## Catalog

79 services across 11 categories scraped from Urban Company's live Bangalore listings: AC & Appliances, Geyser, Plumbing, Electrician, Carpentry, Cleaning, Painting & Waterproofing, Pest Control, Women's Salon, Men's Salon, Spa & Massage.

---

*→ For full scope definition, tradeoff analysis, and product decisions: [DETAILED_ANALYSIS.md](DETAILED_ANALYSIS.md)*
