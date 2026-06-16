# UC Smart Diagnosis — Product 3-Pager

**Author:** Vibhav Mann  
**Date:** June 2026  
**Status:** Live — [uc-smart-diagnosis.vercel.app](https://uc-smart-diagnosis.vercel.app)

---

## 1. The Problem We Set Out to Solve

Urban Company's current booking experience assumes the customer already knows what they need. A user who wakes up to a dripping pipe, a room that won't cool, or skin that looks tired before a wedding must first self-diagnose their problem, then navigate a category tree, then pick the right sub-service — often getting it wrong. The downstream consequences are real: wrong professionals show up, scopes are mismatched, prices surprise on-site, disputes spike, and the first-visit success rate suffers.

The insight that drove this project: **the customer knows their symptom, not their service.** Nobody searches for "AC gas refill R32." They search for "my AC is blowing warm air." The gap between how customers describe problems and how services are catalogued is where mis-bookings are born.

**UC Smart Diagnosis** is a proof-of-concept feature layer on top of Urban Company's service catalog that closes this gap using a multimodal AI diagnosis engine — letting users describe problems in plain language (or show a photo), and routing them to the correct service with a realistic price band and the right professional specification, before a single booking is made.

---

## 2. Scope Definition — What We Built and Why

### How We Defined Scope

We ran a simple framing exercise: for any candidate feature, does it reduce the distance between *"customer has a problem"* and *"right pro shows up with the right parts at the right price"*? Features that cleared that bar made it in. Features that were interesting but didn't directly address that gap were deferred.

We also made an explicit decision to build a **mobile-first, zero-installation experience** — no app store, no account required to try. This meant a PWA-ready React app with safe-area insets, dynamic viewport height, and Google/GitHub auth that's optional, not a gate.

### The 11-Category, 79-Service Catalog

The original catalog had 6 categories and 18 services — enough to demo, not enough for RAG to matter. We expanded it to **11 categories and 79 services**, drawn directly from Urban Company's live service pages (Bangalore city, June 2026). New categories added:

| Category | Services |
|---|---|
| AC & Appliance Repair | 8 |
| Geyser & Water Heater | 3 |
| Plumbing | 7 |
| Electrician | 7 |
| Carpentry | 9 |
| Cleaning | 10 |
| Painting & Waterproofing | 6 |
| Pest Control | 6 |
| Women's Salon & Beauty | 11 |
| Men's Salon & Grooming | 6 |
| Spa & Massage | 6 |

Each service was authored with a `description` field — a plain-English paragraph written from the customer's symptom perspective. This is the field that gets embedded for vector search and is the primary reason RAG retrieves the right services for natural-language queries.

### What We Triaged Out

- **Payment integration** — adds regulatory and partner complexity; the goal was to prove routing accuracy, not process transactions
- **Real pro matching** — live pro availability, ratings, and dispatch are production infrastructure concerns outside the scope of this prototype
- **Push notifications** — relevant for a native app, not a browser-based demo
- **Multi-city pricing** — prices vary by city; we used Bangalore as the single locale to keep the catalog accurate and the AI pricing consistent
- **Dark mode** — removed mid-project after concluding it added maintenance surface without product value in the UC design language

---

## 3. Features — What the App Does and How It Outperforms the Current Flow

### 3.1 AI-Powered Smart Diagnosis

**How it works:** The user types a freeform description of their problem — "my bathroom looks really bad," "water pooling under my sink every morning," "skin looks dull, wedding on Saturday." The app sends this (and optionally a photo) to Claude `claude-sonnet-4-6`, which returns a structured JSON diagnosis: exact service, specific variant, reasoning, likely add-ons, severity, a realistic price range with itemised breakdown, and a confidence level.

**How it beats the current UC app:**

| Current UC | UC Smart Diagnosis |
|---|---|
| User must know the service name | User describes the symptom |
| Category browsing (3–4 taps deep) | One text box |
| Price revealed after booking | Price estimated before booking |
| Variant selected by user | Variant inferred from description |
| Add-ons upsold on-site | Add-ons flagged upfront |
| Wrong service → re-booking | AI catches ambiguity before booking |

The structured output means the booking screen is pre-filled with the right service, variant, and price band — the user only picks a slot.

### 3.2 Multimodal Input — Text + Image

Users can attach a photo of the problem alongside their description. Claude processes both together. This matters for ambiguous problems: a photo of a dripping outdoor compressor unit tells Claude far more than "my AC is leaking."

**Tradeoff considered:** Image processing adds latency and cost per request. We accepted this because the accuracy gain on ambiguous cases (which are the highest-risk mis-bookings) outweighs the marginal cost. Image upload is optional — the flow degrades gracefully to text-only.

### 3.3 Contradiction Detection

If the image and text describe different problems (e.g., text says "sink leakage" but photo shows an AC unit), Claude detects the contradiction and surfaces a clarifying question — *"Your text and image seem to describe different issues — which problem do you need help with?"* — rather than silently picking one. This prevents a class of mis-bookings that would have been invisible in the old flow.

### 3.4 Clarifying Questions and Re-Diagnosis

When the diagnosis is genuinely ambiguous, the AI asks one focused follow-up question with 2–4 multiple-choice options. The user's answer triggers a second, more precise diagnosis pass. A free-text fallback ("None of these — describe it yourself") ensures no user is stuck.

Additionally, on the result screen, a "Not quite right? Add more detail" section lets users refine any diagnosis without starting over.

**Loading screen behaviour:** The initial diagnosis pass intentionally does not show "Estimating realistic price…" — because that first pass almost always surfaces a clarifying question, making the price step misleading. The price loading step appears only after clarification, when Claude is genuinely computing a final estimate.

### 3.5 Booking, Reschedule, and Cancel

After diagnosis, users proceed to a slot picker (5 slots across 3 days, with availability states). Post-booking, the **My Bookings** screen shows all bookings synced to Supabase (for logged-in users) or held in session state (for guests).

Each booking card exposes two inline actions:
- **Reschedule** — reopens the slot picker with the booking pre-loaded; confirming a new slot patches `slot_day` / `slot_time` in Supabase
- **Cancel** — shows an inline confirmation row ("Cancel this booking? / Yes, cancel / Keep") before removing the record, preventing accidental cancellations. Cancelled bookings are soft-deleted (status set to `cancelled`) so history is preserved

### 3.6 Authentication

Google and GitHub OAuth via Supabase Auth. Login is optional — guests get the full diagnosis and booking flow with session-only persistence. Signed-in users get Supabase-synced booking history across sessions. This removes friction at the top of the funnel while still offering value for repeat users.

---

## 4. RAG — What It Is, How It Works, and Why It Makes the App Better

### What is RAG?

Retrieval-Augmented Generation (RAG) is an architecture pattern where, instead of sending an AI model your entire knowledge base on every request, you first *retrieve* only the most relevant subset and send only that to the model for generation.

In the context of this app: instead of sending all 79 services to Claude on every diagnosis request, RAG identifies the 3–5 services most semantically similar to the user's description and sends only those.

### How It Works in This App

```
User types: "my skin looks dull, wedding on Saturday"
                    ↓
        Voyage AI (voyage-3 model)
        Converts text → 1024-dimensional vector
                    ↓
        Supabase pgvector
        Cosine similarity search across 79 pre-embedded service vectors
        Threshold: 30% similarity minimum
                    ↓
        Top matches returned (e.g. Facial Treatment 71%, Pre-Bridal Makeup 58%)
                    ↓
        Claude sees only those 2 services
        Returns precise diagnosis
```

The 79 service vectors were generated in a one-time batch embedding run (`scripts/seed-embeddings.js`) and stored in Supabase's `service_embeddings` table with a `vector(1024)` column and an `ivfflat` index for fast approximate nearest-neighbour search.

### The Similarity Threshold

We set the threshold at **30%** (cosine similarity ≥ 0.3). This was tuned after observing that 0.4 was too aggressive — beauty and lifestyle queries like "dull skin, wedding Saturday" scored just below 0.4 against even the most relevant services, causing silent fallback to the full catalog. At 0.3, those queries retrieve 2–4 meaningful matches without pulling in noise.

When zero services clear the threshold (genuinely out-of-catalog queries), the app falls back to the full catalog silently — Claude still produces a useful response, just without the RAG efficiency benefit.

### Why RAG Helps This App

| Dimension | Without RAG | With RAG |
|---|---|---|
| Tokens per request | ~12,000 (full catalog) | ~1,500 (top 5 services) |
| Claude focus | Diffuse — must consider all 79 services | Sharp — only sees relevant candidates |
| Scale ceiling | Degrades as catalog grows | Constant cost per query |
| Accuracy on narrow queries | Good but noisy | Precise — less distraction |
| Cost per diagnosis | Higher | ~8× cheaper at scale |

### The RAG Inspector

Every diagnosis result includes a collapsible **🔍 Inspect RAG Pipeline** card showing:
- Whether RAG was active or full catalog was used
- Each retrieved service with its similarity score as a visual bar (darker = stronger match)
- An explanation of the threshold and vector search

This was built deliberately for transparency — both to demonstrate the system to stakeholders and to give product teams a live debugging tool for understanding why a specific query routed to a specific service.

---

## 5. Key Product Decisions and Tradeoffs

### Decision 1: Single-turn clarification, not multi-turn chat

We chose to ask one clarifying question (with options) rather than a free-form back-and-forth conversation. **Reason:** multi-turn chat is open-ended and hard to route cleanly into a booking. One structured question with multiple-choice options keeps the user on a directed path to a confirmed service. Free-text fallback is available for edge cases.

### Decision 2: Price estimation at diagnosis time, not booking time

Showing a realistic price band before the user commits to a slot reduces the "price shock" moment that currently happens on-site. **Tradeoff:** the estimate may not match the final invoice if parts discovered on-site differ. We mitigated this with an explicit amber disclaimer: *"Final price confirmed on-site. This band includes likely parts & add-ons."*

### Decision 3: Soft-delete cancellations, not hard-delete

Cancelled bookings are marked `status = 'cancelled'` in Supabase rather than deleted. **Reason:** preserves history for the user and for potential future analytics (cancellation reason, cancellation rate by service type). Excluded from the active bookings query with a `.neq('status', 'cancelled')` filter.

### Decision 4: RAG skipped on clarification re-diagnoses

When a user answers a clarifying question and triggers a re-diagnosis, the app intentionally skips RAG and uses the full catalog. **Reason:** at that point, Claude has a richer, more specific context (original description + clarification answer) and should not be limited to the services that matched the original partial description. The full catalog gives Claude the freedom to make a precise final call.

### Decision 5: Guest-first auth

Auth is optional. **Reason:** requiring login before diagnosis would sharply reduce top-of-funnel conversion and contradict the core value proposition (speed to answer). Supabase sync is a value-add for returning users, not a prerequisite.

---

## 6. Measuring Success

Because this is a prototype, we used illustrative proxies rather than live production data. The framing metrics are:

- **Mis-booking rate** — does the AI route to the correct service category and variant? Measured by manual testing across 20+ problem descriptions spanning all 11 categories
- **Clarification rate** — what % of initial diagnoses trigger a follow-up question? Target: < 40% (indicating the initial diagnosis is usually confident enough)
- **RAG retrieval rate** — what % of queries retrieve ≥ 1 service above threshold? Post-threshold-tuning: > 80% of queries retrieve at least 2 services
- **Price accuracy** — do the AI-generated price bands match real Urban Company prices for the diagnosed service? Validated manually against live UC service pages

The RAG inspector panel exists partly to make these metrics observable in production without a separate analytics layer — stakeholders can tap "Inspect RAG Pipeline" on any diagnosis to see exactly what the model saw.

---

*UC Smart Diagnosis is a working prototype — not a production deployment. It demonstrates that natural-language service routing is feasible, accurate, and significantly better for the customer than category-based browsing. The architecture (React + Vercel serverless + Supabase + Voyage AI + Claude) is production-ready and can be integrated into the main Urban Company app without architectural changes.*
