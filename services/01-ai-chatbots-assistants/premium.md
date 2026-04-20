# AI Chatbots & Assistants — Premium

**Price:** ₹2,49,999 one-time | ₹18,000/mo retainer | ₹4,29,999/yr bundled

---

## What this is

A production-grade AI bot powered by RAG (Retrieval Augmented Generation). Instead of answering from a manually written FAQ list, the bot reads the client's actual documents — PDFs, manuals, product catalogues, SOPs, Notion exports — and answers from inside them. No context window limit. No manual Q&A writing. Documents update → you re-ingest → bot instantly knows the new information.

Runs on **all 3 platforms simultaneously** — WhatsApp + Website + Telegram — from the same knowledge base.

Key upgrades over Standard:
- RAG pipeline — answers from real documents, not a system prompt
- All 3 platforms at once (not a choice of one)
- Multi-language — Hindi + English, bot responds in whatever language the user writes in
- Lead scoring — every conversation gets an intent score (1–5), hot leads alert the sales team instantly
- Analytics dashboard — Metabase connected to PostgreSQL, client has a live login
- Escalation workflows — routes to the right team (sales / support / billing) not just "a human"
- Dedicated support — priority response, SLA on issue resolution

---

## Tech Stack

| Tool | Role |
|---|---|
| **Python FastAPI** | RAG service — ingestion, embedding, retrieval |
| **LlamaIndex** | Document chunking, embedding pipeline, retrieval |
| **Qdrant** (self-hosted) | Vector database — one collection per client |
| **OpenAI Embeddings** (`text-embedding-3-small`) | Converts text to vectors for storage and search |
| **Claude API** (Sonnet model) | Answers questions using retrieved chunks |
| **n8n** (self-hosted) | Orchestration — webhook handling, flow logic |
| **PostgreSQL** | Conversation history, lead scores, analytics data |
| **Chatwoot** (self-hosted) | Human handoff with multi-inbox escalation routing |
| **Metabase** (self-hosted) | Analytics dashboard for the client |
| **Meta Cloud API** | WhatsApp messaging |
| **Telegram Bot API** | Telegram messaging |
| **Custom JS widget** | Website chat with text input |
| **Zoho CRM / HubSpot** | Lead capture with score field |
| **UptimeRobot** | Uptime monitoring |

Use **Claude Sonnet** here — RAG requires better reasoning than Haiku. The model reads retrieved chunks and must synthesise an accurate answer. Worth the extra cost at this price point.

---

## RAG — How It Works

RAG has two completely separate phases. They are not the same operation.

### Phase 1: Ingestion (runs once at onboarding, then when documents update)

You take the client's documents and convert them into searchable vectors stored in Qdrant.

```
Client uploads documents (PDFs, Word, Notion export, Excel, etc.)
  ↓
Python script reads each document
  ↓
Split into chunks (~500 words each, 50-word overlap between chunks)
  ↓
For each chunk: call OpenAI Embeddings API → get a vector (1536 numbers)
  ↓
Store each vector + original chunk text in Qdrant (client's own collection)
```

**What is a chunk?**
You cannot feed a 200-page PDF to Claude — it's too large. So you split it into small pieces of ~500 words. The 50-word overlap means the end of chunk 1 repeats as the start of chunk 2 — this prevents answers from being cut off at chunk boundaries.

**What is an embedding?**
A vector (list of ~1536 numbers) that represents the meaning of a piece of text. "What are your delivery charges?" and "How much does shipping cost?" are different strings but their vectors are mathematically close. This is how the bot finds relevant content even when the user doesn't use the exact words from the document.

**Why OpenAI for embeddings and Claude for answering?**
Claude does not have an embedding model. OpenAI's `text-embedding-3-small` is very cheap (~₹0.001 per 1,000 chunks) and excellent quality. This is standard practice — use the best tool for each job.

**The ingestion script:**
```python
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding
import qdrant_client

client = qdrant_client.QdrantClient(host="localhost", port=6333)

# Load all documents from client's folder
documents = SimpleDirectoryReader("./client_docs/client_xyz/").load_data()

# Set up Qdrant — one collection per client
vector_store = QdrantVectorStore(
    client=client,
    collection_name="client_xyz"
)

# Chunk, embed, and store everything
index = VectorStoreIndex.from_documents(
    documents,
    vector_store=vector_store,
    embed_model=OpenAIEmbedding(model="text-embedding-3-small")
)

print("Ingestion complete.")
```

Run this once at onboarding. When the client updates a document, re-run for that file only.

**What Qdrant stores per chunk:**
```json
{
  "id": "uuid-1234",
  "vector": [0.023, -0.847, 0.341, ...],
  "payload": {
    "text": "Our standard delivery takes 3–5 business days for metros...",
    "source": "delivery-policy.pdf",
    "page": 4
  }
}
```

One Qdrant collection per client — completely isolated. Client A's documents never appear in Client B's answers.

---

### Phase 2: Retrieval (runs on every user message)

```
User sends: "How long does delivery take?"
  ↓
n8n calls Python FastAPI /query endpoint
  ↓
FastAPI embeds the query text (OpenAI Embeddings API)
  → query vector: [0.019, -0.851, 0.338, ...]
  ↓
Qdrant: find top 5 chunks whose vectors are closest to query vector
  ↓
FastAPI returns those 5 chunk texts to n8n
  ↓
n8n builds Claude prompt:
  system: "Answer using only the context below. If the answer is not in
           the context, say HANDOFF_REQUIRED."
  context: [chunk 1 text] [chunk 2 text] [chunk 3 text] [chunk 4] [chunk 5]
  history: [last 10 messages]
  user: "How long does delivery take?"
  ↓
Claude reads the chunks and answers:
  "Our standard delivery takes 3–5 business days for metros
   and 5–7 days for other cities, as per our delivery policy."
  ↓
n8n strips any flags, sends answer to user
```

**The FastAPI service:**
```python
from fastapi import FastAPI
from pydantic import BaseModel
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding
import qdrant_client as qc

app = FastAPI()
qdrant = qc.QdrantClient(host="localhost", port=6333)

class QueryRequest(BaseModel):
    client_id: str
    question: str

@app.post("/query")
def query(req: QueryRequest):
    vector_store = QdrantVectorStore(
        client=qdrant,
        collection_name=req.client_id
    )
    index = VectorStoreIndex.from_vector_store(
        vector_store,
        embed_model=OpenAIEmbedding(model="text-embedding-3-small")
    )
    retriever = index.as_retriever(similarity_top_k=5)
    nodes = retriever.retrieve(req.question)
    chunks = [node.text for node in nodes]
    return {"chunks": chunks, "sources": [node.metadata.get("source") for node in nodes]}
```

n8n calls this with an HTTP Request node:
```
POST http://localhost:8000/query
{ "client_id": "client_xyz", "question": "How long does delivery take?" }
```

Gets back 5 chunks. Passes them to Claude. Done.

---

## System Prompt for Premium

Unlike Standard (where the system prompt IS the knowledge base), in Premium the system prompt contains only instructions — the knowledge comes from retrieved chunks at query time.

```
You are a helpful assistant for {{CLIENT_NAME}}, a {{BUSINESS_TYPE}}.

YOUR JOB:
- Answer questions using only the context provided below
- Be accurate, concise, and friendly
- Detect the language the user is writing in — respond in the same language
  (Hindi, English, or Hinglish — match what they write)
- Never make up information not present in the context
- Cite the source document when useful (e.g., "As per our refund policy...")

HANDOFF RULE:
If the context does not contain enough information to answer confidently,
respond with exactly: HANDOFF_REQUIRED

LEAD SCORING:
After every response, evaluate buying intent from the full conversation.
Append one of these on a new line:
LEAD_SCORE:1 — just browsing
LEAD_SCORE:2 — mildly curious
LEAD_SCORE:3 — moderate interest, asked about features
LEAD_SCORE:4 — high intent, asked about pricing or timelines
LEAD_SCORE:5 — ready to act, asked for demo, quote, or next steps

LEAD CAPTURE:
If the user asks for pricing, a demo, a quote, or wants to buy,
append: LEAD_CAPTURED

ESCALATION:
If the topic is sales or pricing → append: ESCALATE:sales
If the topic is a complaint, refund, or support issue → append: ESCALATE:support
If the topic is billing, payment failure, or invoice → append: ESCALATE:billing

CONTEXT:
{{RETRIEVED_CHUNKS}}
```

The `{{RETRIEVED_CHUNKS}}` placeholder is filled by n8n with the 5 chunks returned by FastAPI on every message.

---

## Multi-Language Support

Claude natively understands Hindi, English, and Hinglish. No extra API or model needed.

The system prompt instruction does the work:
```
Detect the language the user is writing in — respond in the same language.
```

If the user writes in Hindi (Devanagari), Claude responds in Hindi. If they write Hinglish ("bhai delivery kab aayegi?"), Claude responds in Hinglish. If they write English, Claude responds in English.

**WhatsApp:** Meta's Cloud API supports Unicode fully — Hindi Devanagari script works in messages with no extra configuration.

**Telegram:** Telegram supports all Unicode scripts natively.

**Website widget:** Standard HTML/CSS with `lang` attribute set — renders Hindi correctly in all modern browsers.

No additional cost. No additional API. Claude handles it.

---

## Lead Scoring — How It Works

### The signal

Claude appends `LEAD_SCORE:X` to every response (1–5). It re-evaluates on every message as the conversation progresses — a score can go from 2 to 5 as the user gets more interested.

### What n8n does with the score

```
Claude's full response:
"Our pricing starts at ₹999/month. Would you like a demo?
LEAD_SCORE:4
LEAD_CAPTURED
ESCALATE:sales"

n8n extracts:
  - Score: 4
  - Lead captured: true
  - Escalation type: sales

n8n strips all flags from the text before sending to user:
  → sends: "Our pricing starts at ₹999/month. Would you like a demo?"

n8n saves score = 4 to PostgreSQL conversations table

n8n calls CRM API with score field

IF score = 5:
  → immediately create Chatwoot conversation + alert sales agent via email
  → don't wait for HANDOFF_REQUIRED
  → agent watches the conversation in real time, can jump in

IF score >= 4:
  → create CRM lead as "Hot"

IF score = 3:
  → create CRM lead as "Warm"

IF score <= 2:
  → log score in DB, no CRM action yet
```

### CRM with lead score

**Zoho CRM:**
```json
{
  "data": [{
    "Last_Name": "{{user_name}}",
    "Phone": "{{user_phone}}",
    "Lead_Source": "WhatsApp Bot",
    "Rating": "Hot",
    "Description": "Score: 4/5. Asked about pricing and demo. Platform: WhatsApp."
  }]
}
```
Map: score 4–5 → "Hot" | score 3 → "Warm" | score 1–2 → "Cold"

**HubSpot:**
```json
{
  "properties": {
    "firstname": "{{user_name}}",
    "phone": "{{user_phone}}",
    "hs_lead_status": "IN_PROGRESS",
    "lead_score": "4",
    "lead_intent": "Asked about pricing and demo"
  }
}
```

---

## Escalation Workflows — Multi-Inbox Routing

Standard has one Chatwoot inbox — all handoffs go to the same place. Premium routes to the right team.

### Chatwoot setup for Premium

Create **3 separate inboxes** in Chatwoot:
- `Sales inbox` — for pricing, demo, quote queries (ESCALATE:sales)
- `Support inbox` — for complaints, how-to questions, issues (ESCALATE:support)
- `Billing inbox` — for payment failures, invoice disputes (ESCALATE:billing)

Assign different agents to each inbox. The sales team only sees sales conversations. Support team only sees support tickets.

### How n8n routes

```
n8n extracts ESCALATE:{{type}} from Claude's response
  ↓
Switch node on escalation type:
  ├── "sales"   → create conversation in Sales inbox   (inbox_id: 1)
  ├── "support" → create conversation in Support inbox (inbox_id: 2)
  └── "billing" → create conversation in Billing inbox (inbox_id: 3)
  ↓
Set PostgreSQL status = 'awaiting_agent'
  ↓
Send to user: "Connecting you with our {{sales/support/billing}} team. 🙏"
```

The Chatwoot API call is the same as Standard — just pass the correct `inbox_id` based on escalation type.

---

## Analytics Dashboard — Metabase

### PostgreSQL schema additions

Add these to your `conversations` table:

```sql
ALTER TABLE conversations ADD COLUMN lead_score INTEGER DEFAULT 0;
ALTER TABLE conversations ADD COLUMN lead_captured BOOLEAN DEFAULT FALSE;
ALTER TABLE conversations ADD COLUMN handoff_triggered BOOLEAN DEFAULT FALSE;
ALTER TABLE conversations ADD COLUMN escalation_type TEXT;
ALTER TABLE conversations ADD COLUMN message_count INTEGER DEFAULT 0;
ALTER TABLE conversations ADD COLUMN platform TEXT;
ALTER TABLE conversations ADD COLUMN resolved_at TIMESTAMP;
```

Create a separate `messages` table for question-level analytics:

```sql
CREATE TABLE messages (
  id              SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  client_id       TEXT NOT NULL,
  role            TEXT NOT NULL,   -- 'user' | 'assistant'
  content         TEXT NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

n8n writes every message to this table. This powers the "top questions" dashboard.

### Metabase setup

1. Install Metabase on your VPS:
```bash
docker run -d -p 3000:3000 \
  -e MB_DB_TYPE=postgres \
  -e MB_DB_DBNAME=metabase \
  -e MB_DB_PORT=5432 \
  -e MB_DB_USER=postgres \
  -e MB_DB_PASS=yourpassword \
  -e MB_DB_HOST=localhost \
  --name metabase metabase/metabase
```
2. Open `http://your-vps-ip:3000` → connect to your PostgreSQL database
3. Create dashboards (Metabase calls each chart a "Question")

### The 4 dashboards you build

**Dashboard 1 — Overview (client login)**

| Metric | SQL |
|---|---|
| Total conversations this month | `SELECT COUNT(*) FROM conversations WHERE client_id = 'xyz' AND created_at >= date_trunc('month', NOW())` |
| Total leads captured | `WHERE lead_captured = true` |
| Lead capture rate % | leads / total × 100 |
| Handoff rate % | handoffs / total × 100 |
| Conversations by platform | `GROUP BY platform` |
| Avg messages per conversation | `AVG(message_count)` |

**Dashboard 2 — Lead Quality (client's sales team)**

| Metric | SQL |
|---|---|
| Leads by score | `SELECT lead_score, COUNT(*) GROUP BY lead_score` |
| Hot leads this week (score 4–5) | `WHERE lead_score >= 4 AND created_at >= NOW() - INTERVAL '7 days'` |
| Lead score trend over time | score by day as line chart |
| Escalation breakdown | `SELECT escalation_type, COUNT(*) GROUP BY escalation_type` |

**Dashboard 3 — Top Questions (internal — for you)**

```sql
SELECT content, COUNT(*) as frequency
FROM messages
WHERE role = 'user' AND client_id = 'xyz'
GROUP BY content
ORDER BY frequency DESC
LIMIT 20;
```

This shows what users actually ask most. Useful for identifying gaps in the knowledge base — if "return policy for electronics" appears 50 times and the bot is handoff-ing on it, you need to ingest a document on that.

**Dashboard 4 — Handoff Performance (client's support team)**

| Metric | SQL |
|---|---|
| Avg resolution time | `AVG(resolved_at - created_at) WHERE handoff_triggered = true` |
| Open handoffs right now | `WHERE status = 'awaiting_agent'` |
| Handoffs by escalation type | `GROUP BY escalation_type WHERE handoff_triggered = true` |

### Client access

Give the client a **read-only Metabase login** scoped to their data only. They log in and see their dashboards — live, no exports, no waiting for your monthly report.

You as the agency keep an admin view across all clients.

---

## WhatsApp Build

Same Meta Cloud API setup as Standard. Refer to `standard.md` Section 6.

The only difference in the n8n flow is step 3: instead of calling Claude directly with a system prompt containing FAQs, n8n first calls the FastAPI `/query` endpoint to retrieve chunks, then passes those chunks to Claude.

Full flow:
```
Webhook trigger
  ↓
Extract: user phone + message text + phone_number_id
  ↓
PostgreSQL: check status — if awaiting_agent → STOP
  ↓
PostgreSQL: fetch last 10 messages (conversation history)
  ↓
HTTP Request → FastAPI /query (get 5 relevant chunks)
  ↓
HTTP Request → Claude API (system prompt + chunks + history + message)
  ↓
Extract: response text + LEAD_SCORE + LEAD_CAPTURED + ESCALATE + HANDOFF
  ↓
Strip all flags from response text
  ↓
Save score to PostgreSQL
  ↓
IF LEAD_CAPTURED → call CRM API
IF score = 5 → alert sales agent immediately
IF ESCALATE → route to correct Chatwoot inbox
IF HANDOFF → create Chatwoot conversation, set status = awaiting_agent
  ↓
HTTP Request → Meta Cloud API (send cleaned response to user)
  ↓
PostgreSQL: append exchange to conversation history, increment message_count
  ↓
INSERT into messages table (for analytics)
```

---

## Telegram Build

Same as Standard `standard.md` Section 7. Flow is identical to WhatsApp above — only the send/receive API calls differ (Telegram API vs Meta Cloud API).

Chatwoot's native Telegram inbox handles the agent side. When escalation type is determined, route to the correct Chatwoot inbox as per the escalation routing section above.

---

## Website Build

Same widget as Standard (`standard.md` Section 8) with text input field.

One addition: the widget displays the **source document** when Claude cites it. FastAPI returns source filenames alongside chunks. When Claude says "As per our refund policy..." the widget can show a small badge: `📄 refund-policy.pdf`. This builds trust with the user.

For Chatwoot handoff on website: use Option A from Standard (switch to Chatwoot's embeddable widget on handoff) unless you've already built the custom bridge from the Standard tier work.

---

## Template Approach (scaling across clients)

**What you build once:**
- Python FastAPI RAG service running on your VPS, handles all clients via `client_id` routing
- Master n8n workflow template with all nodes: webhook → DB check → FastAPI query → Claude → flag extraction → CRM → Chatwoot routing → send → DB update
- Metabase dashboard templates (duplicate and remap `client_id` filter per new client)
- System prompt template with placeholders

**Per new Premium client:**
1. Create a new Qdrant collection (`client_xyz`)
2. Run knowledge collection session (2–3 hours — more thorough than Standard, gather all documents)
3. Run ingestion script on their documents
4. Test retrieval — ask 30 real questions, verify chunks returned are relevant
5. Fill system prompt template
6. Duplicate n8n workflow, set `client_id`
7. Connect all 3 platforms (Meta + Telegram + website snippet)
8. Set up 3 Chatwoot inboxes + assign agents
9. Set up CRM (Zoho or HubSpot with score field)
10. Set up Metabase dashboard (duplicate template, set client filter)
11. Full end-to-end test: normal flow, HANDOFF, LEAD_SCORE:5 alert, escalation routing, all 3 platforms
12. Give client their Metabase login, train their team on Chatwoot

**Time per new Premium client: 1–2 weeks** (document ingestion + testing is the bulk of it).

---

## Monthly Retainer — What You Actually Do (₹18,000/mo)

- **Document updates:** Client uploads new product catalogue → re-run ingestion script → 30 minutes. Included as needed.
- **Cross-platform monitoring:** All 3 platforms — check for webhook failures, Meta API updates, Telegram bot issues. UptimeRobot on all 3 webhook URLs.
- **RAG re-indexing:** When documents change significantly, re-ingest the affected files. Monitor retrieval quality — if users are hitting HANDOFF on questions the knowledge base should cover, investigate which chunks are missing.
- **Lead scoring calibration:** Review score accuracy monthly. If score 5 leads are actually cold, adjust the system prompt scoring instructions.
- **Analytics review:** Pull the Metabase dashboards, write a 1-page summary for the client: conversations this month, lead capture rate, top questions, handoff rate, avg resolution time.
- **Chatwoot maintenance:** Multi-inbox issues, agent notification settings, new agent onboarding.
- **CRM sync:** Lead score updates, field mapping checks.
- **Claude API cost monitoring:** Sonnet costs more than Haiku — track per-client token usage in Anthropic console. Set budget alerts.

Realistic time per Premium client per month: **8–12 hours.**

---

## Costs to Run This (your side)

| Item | Cost |
|---|---|
| VPS — n8n + PostgreSQL + Chatwoot + Qdrant + FastAPI + Metabase | ~₹4,000–6,000/mo (dedicated VPS per Premium client recommended) |
| Claude Sonnet API (~30k messages/mo) | ~₹3,000–6,000/mo per client |
| OpenAI Embeddings (ingestion + queries) | ~₹200–500/mo per client |
| Meta Cloud API | Free up to 1,000 conversations/mo |
| Telegram Bot API | Free |
| Qdrant | Free (self-hosted) |
| Metabase | Free (self-hosted) |
| Zoho CRM / HubSpot | Free tier |
| Chatwoot | Free (self-hosted) |

**Recommendation:** Give each Premium client their own VPS. At ₹2,49,999 one-time and ₹18,000/mo retainer, the margin easily covers a dedicated ₹5,000/mo server. Isolation is cleaner, performance is better, and a client's traffic spike doesn't affect others.

---

## What to Build First

1. Set up a dedicated VPS for your first Premium client
2. Install: n8n, PostgreSQL, Qdrant (Docker), Chatwoot, Metabase (Docker), Python + FastAPI
3. Build and test the FastAPI RAG service with a sample document set
4. Build the master n8n workflow template with all flag extraction logic
5. Run a full end-to-end test on your own WhatsApp number:
   - Normal RAG answer (chunk retrieved correctly, Claude answers)
   - HANDOFF_REQUIRED (chunk not found, escalates)
   - LEAD_SCORE:5 (sales alert fires immediately)
   - ESCALATE:billing (routes to billing Chatwoot inbox)
   - All 3 platforms working off the same knowledge base
6. Build one Metabase dashboard with your test data — verify all 4 dashboards render correctly
7. That stack = your Premium product

First Premium client takes 1–2 weeks to fully deploy and test. Every client after: 1 week (you have the template, ingestion script, and Metabase template ready).
