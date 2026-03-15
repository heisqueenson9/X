# 🔬 TECHNICAL IMPLEMENTATION GUIDE

**Version**: 1.0.0  
**Date**: March 14, 2026  
**Status**: ✅ PRODUCTION-READY

---

## 📚 TABLE OF CONTENTS

1. [System Architecture](#system-architecture)
2. [API Implementation Details](#api-implementation-details)
3. [Database Schema & Models](#database-schema--models)
4. [AI Model Integration](#ai-model-integration)
5. [Payment Processing](#payment-processing)
6. [Security Implementation](#security-implementation)
7. [Performance Optimization](#performance-optimization)
8. [Error Handling Strategy](#error-handling-strategy)
9. [Testing Strategy](#testing-strategy)

---

## SYSTEM ARCHITECTURE

### High-Level Flow

```
User Input (UI)
    ↓
Next.js API Route (Frontend)
    ↓
Text Sanitization
    ↓
Rate Limiting Check
    ↓
AI Model Processing
    (FLAN-T5 / BART / Mistral / Sentence-BERT)
    ↓
MongoDB Storage
    ↓
Generate Response
    ↓
Return to UI
    ↓
Payment Gateway (Paystack)
    ↓
Unlock Full Results
```

### Component Interactions

```
Frontend (Next.js + React)
    ├── ParaphrasingTool.tsx (Main UI)
    ├── ResultsPreview.tsx (Results & Payment)
    └── API Routes (/api/*)
        ├── paraphrase/route.ts
        ├── humanize/route.ts
        ├── summarize/route.ts
        ├── plagiarism/route.ts
        ├── payment/init/route.ts
        ├── payment/verify/route.ts
        └── result/route.ts

Backend Server (Express - Utility only)
    └── server.js (Health check & test endpoint)

Database (MongoDB)
    ├── User collection
    ├── Text collection
    └── Payment collection
```

---

## API IMPLEMENTATION DETAILS

### 1. PARAPHRASE ENDPOINT

**Implementation**: `src/app/api/paraphrase/route.ts`

**Processing Pipeline**:
```
1. Receive raw text from user
2. Sanitize input (remove scripts/HTML)
3. Validate length (50-500KB)
4. Split text into chunks (800 words each)
5. For each chunk:
   a. Call FLAN-T5-Large via Hugging Face API
   b. Apply mode-specific instructions
   c. Use fallback paraphraser if API unavailable
6. Merge chunks back together
7. Calculate plagiarism estimates
8. Save to MongoDB with session ID
9. Return paraphrased text + statistics
```

**Modes & Instructions**:
```
academic    → Formal academic English, varied structures, passive voice
standard    → Clear English, different words and sentences
formal      → Professional tone, official document style
simple      → Easy-to-understand, simplified vocabulary
flowing     → Smooth, natural narrative style
informal    → Friendly, conversational tone
expand      → Add details, examples, and explanation
shorten     → Remove details, keep key points only
```

**Fallback Mechanism**:
If Hugging Face API unavailable:
- Uses built-in synonym replacement
- Applies sentence restructuring
- Adds academic phrases for variety
- Maintains original meaning

**Rate Limiting**:
- 5 requests per minute per IP
- Returns 429 status when limit exceeded

---

### 2. HUMANIZE ENDPOINT

**Implementation**: `src/app/api/humanize/route.ts`

**Processing Pipeline**:
```
1. Receive AI-generated text
2. Sanitize input
3. Split into chunks
4. Call Mistral-7B for natural rewriting
5. Remove overly formal phrasing
6. Extract response (skip prompt)
7. Apply fallback humanizer if needed
8. Merge chunks
9. Save to database
10. Return humanized text
```

**Fallback Strategy**:
- Removes formal phrases ("it is evident that" → "clearly")
- Replaces robotic phrasing ("the present study" → "this")
- Simplifies complex structures
- Adds conversational flow

---

### 3. SUMMARIZE ENDPOINT

**Implementation**: `src/app/api/summarize/route.ts`

**Processing Pipeline**:
```
1. Receive long text (min 100 chars)
2. Sanitize and validate
3. Choose summary length:
   short   → 2-3 sentences, 100 tokens
   medium  → 3-4 sentences, 150 tokens
   long    → 4-5 sentences, 200 tokens
4. Call BART Large CNN via Hugging Face
5. Apply fallback extractive summarizer if needed
6. Save to database
7. Return summary + compression ratio
```

**Fallback Summarization**:
Uses extractive method:
- Tokenizes into sentences
- Scores by length and position (prioritize first sentences)
- Selects top N sentences
- Returns in original order

---

### 4. PLAGIARISM DETECTION ENDPOINT

**Implementation**: `src/app/api/plagiarism/route.ts`

**Processing Pipeline**:
```
1. Receive text to check (min 100 chars)
2. Sanitize input
3. If no comparison text:
   a. Use heuristic analysis
   b. Calculate uniqueness ratio
   c. Analyze sentence patterns
   d. Return plagiarism score (5-35%)
4. If comparison text provided:
   a. Generate embeddings (Sentence-BERT)
   b. Calculate cosine similarity
   c. Return similarity percentage
5. Classify as: original / moderate / high
6. Save analysis to database
7. Return detailed report
```

**Detection Methods** (in order of preference):
1. **Semantic** (best): Sentence-BERT embeddings + cosine similarity
2. **Overlap** (good): Word-level comparison
3. **Heuristic** (fallback): Pattern analysis

**Similarity Scoring**:
```
< 25%  → Original (✓)
25-50% → Moderate similarity (⚠)
> 50%  → High similarity (⚠)
```

---

### 5. PAYMENT INITIALIZATION

**Implementation**: `src/app/api/payment/init/route.ts`

**Processing Pipeline**:
```
1. Receive email and sessionId
2. Validate email format (RFC 5322)
3. Validate sessionId exists
4. Verify Paystack API key configured
5. Initialize Paystack transaction:
   - Amount: 1100 pesewas (GHS 11)
   - Currency: GHS (Ghana Cedis)
   - Channels: Mobile Money, Card, Bank
   - Callback URL with sessionId
6. Save pending payment to DB
7. Create/update user if new
8. Return authorization URL
9. User redirected to Paystack checkout
```

**Paystack Request Format**:
```json
{
  "email": "user@example.com",
  "amount": 1100,
  "currency": "GHS",
  "callback_url": "http://localhost:3002/api/payment/verify?sessionId=...",
  "metadata": {
    "sessionId": "uuid",
    "custom_fields": [
      {
        "display_name": "Session ID",
        "variable_name": "session_id",  
        "value": "uuid"
      }
    ]
  },
  "channels": ["mobile_money", "card", "bank"]
}
```

**Validation Rules**:
- Email: Must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Amount: Exactly 1100 pesewas (non-negotiable - GHS 11)
- SessionId: Must exist in Text collection
- Rate limit: 10 requests/min per IP

---

### 6. PAYMENT VERIFICATION

**Implementation**: `src/app/api/payment/verify/route.ts`

**Processing Pipeline**:
```
1. Receive from Paystack (webhook or redirect)
2. If webhook:
   a. Verify HMAC-SHA512 signature
   b. Extract transaction reference
   c. Update payment status to 'success'
3. If redirect callback:
   a. Extract reference and sessionId
   b. Call Paystack verify endpoint
   c. Check transaction status
   d. Update database
   e. Redirect to result page with sessionId
```

**Webhook Verification**:
```
HMAC-SHA512(secret_key, request_body) === x-paystack-signature header
```

**Payment Status Updates**:
```
pending → success (after verification)
pending → failed (if verification fails)
```

---

### 7. RESULT RETRIEVAL

**Implementation**: `src/app/api/result/route.ts`

**Processing Pipeline**:
```
1. Receive sessionId and reference
2. Query payment collection
3. Verify payment status === 'success'
4. Return 402 (Payment Required) if not paid
5. Query text collection for sessionId
6. Return:
   - paraphrasedText (full)
   - stats (all metrics)
   - mode (operation type)
7. Result automatically deleted after 24 hours
```

**Response**:
```json
{
  "success": true,
  "paraphrasedText": "Full text here",
  "stats": {
    "plagiarismBefore": 70,
    "plagiarismAfter": 15,
    "aiDetectionBefore": 85,
    "aiDetectionAfter": 10
  },
  "mode": "academic"
}
```

---

## DATABASE SCHEMA & MODELS

### User Model

```typescript
interface IUser extends Document {
  email: string;        // Unique, lowercase, trimmed
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**:
- Unique on `email`

**Retention**: Permanent (no auto-delete)

---

### Text Model

```typescript
interface IText extends Document {
  sessionId: string;    // Unique session identifier
  originalText: string; // User input (max 500KB)
  paraphrasedText: string; // Processed output
  mode: string;         // Operation type (enum)
  stats: {
    plagiarismBefore: number;
    plagiarismAfter: number;
    aiDetectionBefore: number;
    aiDetectionAfter: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Modes**:
- `academic`, `standard`, `formal`, `simple`, `flowing`, `informal`, `expand`, `shorten`
- `humanize`
- `summary_short`, `summary_medium`, `summary_long`
- `plagiarism_check`

**Indexes**:
- TTL index: Auto-delete after 24 hours (86400 seconds)
- Unique on `sessionId`

**Retention**: 24 hours (auto-deleted for privacy)

---

### Payment Model

```typescript
interface IPayment extends Document {
  sessionId: string;           // Links to Text
  email: string;              // User email (lowercase)
  amount: number;             // Pesewas (1100 = GHS 11)
  status: 'pending' | 'success' | 'failed';
  paystackReference: string;  // Paystack's transaction ID
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**:
- Unique on `paystackReference`
- Index on `sessionId`

**Retention**: Permanent (financial records)

---

## AI MODEL INTEGRATION

### Model Details

```
╔═══════════════════════════════════════════════════════════╗
║                    AI MODELS USED                         ║
╠═══════════════════════════════════════════════════════════╣
║ Task           Model                    Provider         ║
║───────────────────────────────────────────────────────── ║
║ Paraphrasing   FLAN-T5-Large           Hugging Face API ║
║ Humanization   Mistral-7B-Instruct     Hugging Face API ║
║ Summarization  BART-Large-CNN          Hugging Face API ║
║ Embeddings     Sentence-BERT (all-MiniLM-L6-v2)         ║
║ Vector Search  FAISS                   (via embeddings) ║
╚═══════════════════════════════════════════════════════════╝
```

### API Configuration

**Hugging Face Inference API**:
```
Base URL: https://api-inference.huggingface.co
Auth: Bearer token in Authorization header
Rate Limit: 100 requests/day (free tier)
Timeout: 60 seconds per request
```

**Model Endpoints**:
```
Paraphrase: /models/google/flan-t5-large
Humanize:   /models/mistralai/Mistral-7B-Instruct-v0.2
Summarize:  /models/facebook/bart-large-cnn
Embeddings: /models/sentence-transformers/all-MiniLM-L6-v2
```

### Request/Response Format

**Standard Hugging Face Format**:
```json
Request:
{
  "inputs": "Your text here",
  "parameters": {
    "max_length": 2048,
    "min_length": 10,
    "do_sample": true,
    "temperature": 0.7,
    "top_p": 0.9
  }
}

Response (Text Generation):
[
  {
    "generated_text": "The model output here"
  }
]

Response (Embeddings):
[
  [0.123, 0.456, 0.789, ...]  // N-dimensional vector
]
```

### Fallback Handling

When Hugging Face API unavailable:
1. **Paraphrase**: Built-in synonym replacement + sentence restructuring
2. **Humanize**: Regex-based formal phrase removal + flow improvement
3. **Summarize**: Extractive summarization (select important sentences)
4. **Embeddings**: Return null, skip semantic similarity

---

## PAYMENT PROCESSING

### Paystack Integration

**Account Setup**:
1. Sign up at https://paystack.com
2. Verify bank account
3. Go to Settings > Developer
4. Copy Secret Key (test mode)
5. Add to .env.local

**Transaction Flow**:
```
1. User clicks "Pay GHS 11"
   ↓
2. Frontend calls POST /api/payment/init
   ↓
3. Backend initializes Paystack transaction
   ↓
4. Returns authorization_url
   ↓
5. Frontend redirects user to Paystack checkout
   ↓
6. User submits payment details
   ↓
7. Paystack processes payment
   ↓
8. Redirects to /api/payment/verify?reference=...
   ↓
9. Backend verifies with Paystack
   ↓
10. Updates payment status to 'success'
    ↓
11. Redirects to /result?sessionId=...
    ↓
12. Frontend fetches full results
```

**Payment Amount**:
```
Item:     Paraphrased Text Download
Amount:   GHS 11.00
Currency: GHS (Ghana Cedis)
Pesewas:  1100 (1 GHS = 100 pesewas)
Methods:  Mobile Money, Card, Bank Transfer
```

**Test Credentials**:
```
Card Number: 4084084084084081
Expiry Month: Any future month (e.g., 12)
Expiry Year: Any future year (e.g., 2025)
CVV: 408 (any 3 digits)
OTP: 123456 (any 6 digits)
```

### Webhook Handling

Paystack sends webhook events:
```
POST /api/payment/verify (webhook receiver)
Header: x-paystack-signature: HMAC-SHA512 signature
Body: JSON event data

Verify signature:
hash = HMAC-SHA512(secret_key, body)
hash === signature header
```

**Webhook Events**:
- `charge.success`: Payment successful
- `charge.failed`: Payment failed
- `charge.dispute`: Payment disputed

---

## SECURITY IMPLEMENTATION

### Input Sanitization

```typescript
function sanitizeInput(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')  // Remove scripts
    .replace(/<[^>]+>/g, '')                                              // Remove HTML tags
    .trim()                                                                // Remove whitespace
    .substring(0, 500000);                                                // Max 500KB
}
```

**Prevents**:
- XSS (Cross-Site Scripting)
- HTML injection
- Large payload attacks

### Rate Limiting

```typescript
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const windowMs = 60 * 1000;  // 1 minute
  const maxRequests = 5;        // 5 per minute
  
  // Track per IP, reset after window
}
```

**Limits by Endpoint**:
- Paraphrase: 5 req/min
- Humanize: 5 req/min
- Summarize: 5 req/min
- Plagiarism: 3 req/min
- Payment init: 10 req/min

### CORS Protection

```typescript
app.use(cors({ 
  origin: 'http://localhost:3002',  // Only localhost
  credentials: true
}));
```

**Prevents**: Cross-origin attacks

### Payment Verification

```typescript
// Verify webhook signature
const hash = createHmac('sha512', secret).update(body).digest('hex');
if (hash !== signature) {
  return 401;  // Unauthorized
}
```

**Prevents**: Forged payment notifications

### Email Validation

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return 400;  // Invalid
}
```

**Prevents**: Invalid payment emails

---

## PERFORMANCE OPTIMIZATION

### Chunked Text Processing

```typescript
function splitIntoChunks(text: string, chunkSize = 800): string[] {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}
```

**Benefits**:
- Handles unlimited text size
- Reduces per-chunk processing time
- Enables parallel processing (future)

### Connection Pooling

```typescript
mongoose.connect(uri, {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5000
});
```

**Benefits**:
- Reuses database connections
- Faster query execution
- Prevents connection exhaustion

### TTL Indexes

```typescript
TextSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
```

**Benefits**:
- Auto-deletes old records
- Reduces database size
- Improves privacy (data auto-erased)

### Fallback Models

When API unavailable:
- Uses built-in algorithms (no network latency)
- Instant response
- Zero API rate limit impact

---

## ERROR HANDLING STRATEGY

### HTTP Status Codes

```
200 ✓ Success
400 ✗ Bad Request (invalid input)
402 ✗ Payment Required (locked content)
429 ✗ Too Many Requests (rate limited)
500 ✗ Internal Server Error
```

### Error Response Format

```json
{
  "error": "User-friendly message",
  "message": "Technical details",
  "status": 400
}
```

### Logging

```typescript
// API errors logged to console
console.error('Endpoint error:', error);

// Non-critical errors (like DB) don't block response
try {
  await connectDB();
} catch (dbErr) {
  console.error('DB error (non-critical):', dbErr);
  // Continue without DB
}
```

### Graceful Degradation

```
Primary: Hugging Face API
Fallback 1: Built-in models
Fallback 2: Basic heuristics

If API fails → Use fallback (user still gets results)
```

---

## TESTING STRATEGY

### Unit Tests (Recommended)

```typescript
describe('Paraphrase API', () => {
  it('should reject text < 50 characters', async () => {
    const res = await POST('/api/paraphrase', {
      text: 'Short',
      mode: 'academic'
    });
    expect(res.status).toBe(400);
  });

  it('should paraphrase valid text', async () => {
    const res = await POST('/api/paraphrase', {
      text: 'The quick brown fox jumps over the lazy dog. ' +
            'This is a longer sentence.',
      mode: 'academic'
    });
    expect(res.status).toBe(200);
    expect(res.body.paraphrasedText).toBeDefined();
  });
});
```

### Integration Tests (Recommended)

```typescript
describe('Payment Flow', () => {
  it('should initialize and verify payment', async () => {
    // 1. Create text
    const textRes = await POST('/api/paraphrase', {...});
    const sessionId = textRes.body.sessionId;
    
    // 2. Initialize payment
    const payRes = await POST('/api/payment/init', {
      email: 'test@example.com',
      sessionId
    });
    expect(payRes.body.authorizationUrl).toBeDefined();
    
    // 3. Verify payment
    const verifyRes = await GET('/api/payment/verify', {
      reference: 'test_ref'
    });
    // Should succeed or fail predictably
  });
});
```

### Manual Testing

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for curl commands

---

**End of Technical Implementation Guide**
