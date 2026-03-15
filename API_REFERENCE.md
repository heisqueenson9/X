# Paraphrasing X — API Reference

## Base URL
```
Development: http://localhost:3000/api
Production: https://paraphrase-x.com/api
```

---

## 1. POST `/api/paraphrase`

### Description
Paraphrase a text using AI (Ollama with Llama3/Mistral).

### Request

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "text": "Your text to paraphrase (min 50 characters)",
  "mode": "academic"
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | string | ✅ Yes | - | Text to paraphrase (50-500K characters) |
| `mode` | string | ❌ No | academic | Paraphrase style: `academic`, `standard`, `formal`, `simple`, `flowing`, `informal`, `expand`, `shorten` |

### Response

#### Success (200 OK)
```json
{
  "success": true,
  "paraphrasedText": "The rewritten text with academic tone...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "stats": {
    "plagiarismBefore": 78,
    "plagiarismAfter": 14,
    "aiDetectionBefore": 89,
    "aiDetectionAfter": 7
  },
  "wordCount": 123
}
```

#### Error (400 / 429 / 500)
```json
{
  "error": "Text is required.",
  "status": 400
}
```

### Error Codes

| Code | Message | Reason |
|------|---------|--------|
| 400 | Text is required. | Missing `text` parameter |
| 400 | Text is too short. | Less than 50 characters |
| 429 | Too many requests. | Rate limit exceeded (5 per minute) |
| 500 | Internal server error. | Server error, check logs |

### Examples

#### Using JavaScript (Browser)
```javascript
const response = await fetch('/api/paraphrase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Artificial intelligence is transforming the world.',
    mode: 'academic'
  })
});

const data = await response.json();
console.log(data.paraphrasedText);
console.log(data.sessionId);  // Save for payment
```

#### Using curl
```bash
curl -X POST http://localhost:3000/api/paraphrase \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text here",
    "mode": "academic"
  }'
```

#### Using Python
```python
import requests

response = requests.post(
  'http://localhost:3000/api/paraphrase',
  json={
    'text': 'Your text here',
    'mode': 'academic'
  }
)

result = response.json()
print(result['paraphrasedText'])
print(result['sessionId'])
```

### Notes

- **Processing time:** 10-60 seconds depending on text length (local Ollama)
- **Rate limiting:** 5 requests per 60 seconds per IP
- **Fallback mode:** If Ollama unavailable, uses built-in synonym replacement
- **Auto-delete:** Results stored 24 hours then deleted for privacy
- **Database:** Paraphrased text saved to MongoDB with sessionId

---

## 2. POST `/api/payment/init`

### Description
Initialize a payment with Paystack to unlock paraphrased result.

### Request

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "email": "user@example.com",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 500
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | string | ✅ Yes | - | Customer email (valid email required) |
| `sessionId` | string | ✅ Yes | - | Session ID from paraphrase endpoint |
| `amount` | number | ❌ No | 500 | Amount in pesewas (500 = GHS 5) |

### Response

#### Success (200 OK)
```json
{
  "success": true,
  "authorizationUrl": "https://checkout.paystack.com/xxxxx",
  "reference": "1234567890"
}
```

#### Error (400 / 500)
```json
{
  "error": "Email and session ID are required.",
  "status": 400
}
```

### Error Codes

| Code | Message | Reason |
|------|---------|--------|
| 400 | Email and session ID are required. | Missing parameters |
| 400 | Invalid email address. | Email format invalid |
| 429 | Too many requests. | Rate limit exceeded (10 per minute) |
| 500 | Payment gateway not configured. | Missing Paystack keys |
| 500 | Payment initialization failed. | Paystack API error |

### Examples

#### Using JavaScript
```javascript
const sessionId = "550e8400-e29b-41d4-a716-446655440000";
const email = "user@example.com";

const response = await fetch('/api/payment/init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
    sessionId,
    amount: 500
  })
});

const data = await response.json();

if (data.success) {
  // Redirect to Paystack
  window.location.href = data.authorizationUrl;
}
```

#### Using curl
```bash
curl -X POST http://localhost:3000/api/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 500
  }'
```

### Notes

- **Amount:** Specified in pesewas (100 pesewas = GHS 1, so 500 = GHS 5)
- **Currency:** Only GHS (Ghana Cedis) supported
- **Redirect:** Client app redirects user to `authorizationUrl` from Paystack
- **Callback:** After payment, Paystack redirects to `/api/payment/verify`

---

## 3. GET/POST `/api/payment/verify`

### Description
Verify payment from Paystack and unlock paraphrased result. Called by Paystack as callback.

### Request (GET from browser redirect)

#### Query Parameters
```
?reference=paystack_reference&sessionId=session_id
```

| Parameter | Description |
|-----------|-------------|
| `reference` | Paystack transaction reference |
| `sessionId` | Session ID from paraphrase |

### Request (POST webhook from Paystack)

#### Headers
```
Content-Type: application/json
x-paystack-signature: hmac_signature
```

#### Body
```json
{
  "event": "charge.success",
  "data": {
    "reference": "1234567890",
    "status": "success",
    "metadata": {
      "sessionId": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

### Response

#### Success (300 Redirect)
Browser redirects to:
```
http://localhost:3000/result?sessionId=xxx&ref=yyy
```

#### Error (300 Redirect)
Browser redirects to:
```
http://localhost:3000/?error=payment_failed
```

### Error Types

| Error | Cause |
|-------|-------|
| invalid_params | Missing reference or sessionId |
| payment_not_found | No payment record found |
| payment_failed | Payment status is not 'success' |
| text_not_found | Paraphrased text not found |
| verification_failed | Server error during verification |

### Notes

- **Verification:** Uses stored Paystack key to verify signature
- **Database:** Updates Payment status to 'success'
- **Redirect:** User redirected to result page automatically
- **Webhook:** Also accepts POST webhook from Paystack for server-side verification

---

## 4. GET `/api/result`

### Description
Retrieve full paraphrased text after successful payment.

### Request

#### Query Parameters
```
?sessionId=550e8400-e29b-41d4-a716-446655440000
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `sessionId` | ✅ Yes | Session ID from paraphrase |

#### Headers (optional)
```
Content-Type: application/json
```

### Response

#### Success (200 OK) - Payment verified
```json
{
  "success": true,
  "paraphrasedText": "The full paraphrased text here...",
  "stats": {
    "plagiarismBefore": 78,
    "plagiarismAfter": 14,
    "aiDetectionBefore": 89,
    "aiDetectionAfter": 7
  },
  "mode": "academic"
}
```

#### Error (402 Payment Required) - Not paid
```json
{
  "error": "Payment not verified."
}
```

#### Error (404 Not Found) - Text not found
```json
{
  "error": "Result not found."
}
```

#### Error (400 Bad Request) - Missing sessionId
```json
{
  "error": "Session ID required."
}
```

### Error Codes

| Code | Message | Reason |
|------|---------|--------|
| 400 | Session ID required. | Missing sessionId parameter |
| 402 | Payment not verified. | No successful payment found |
| 404 | Result not found. | Paraphrased text doesn't exist or expired |
| 500 | Failed to retrieve result. | Server error |

### Examples

#### Using JavaScript
```javascript
const sessionId = "550e8400-e29b-41d4-a716-446655440000";

const response = await fetch(`/api/result?sessionId=${sessionId}`);
const data = await response.json();

if (response.ok) {
  console.log('Full text:', data.paraphrasedText);
  console.log('Stats:', data.stats);
} else {
  console.error('Error:', data.error);
}
```

#### Using curl
```bash
curl "http://localhost:3000/api/result?sessionId=550e8400-e29b-41d4-a716-446655440000"
```

### Notes

- **Payment required:** Only returns full text if payment is verified
- **TTL:** Results auto-delete after 24 hours for privacy
- **Cached:** Can be called multiple times for same sessionId
- **Stats:** Includes plagiarism and AI detection scores

---

## Rate Limiting

All endpoints have rate limiting to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/paraphrase` | 5 requests | 60 seconds |
| `/api/payment/init` | 10 requests | 60 seconds |

**Response when rate limited:**
```json
{
  "error": "Too many requests. Please wait a moment.",
  "status": 429
}
```

---

## Authentication

Currently no authentication required (public API).

For production, add:
- API keys
- JWT tokens
- User authentication

---

## CORS Headers

The API supports CORS with these headers:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Database Models

### Text
```typescript
{
  sessionId: string (unique),
  originalText: string,
  paraphrasedText: string,
  mode: string,
  stats: {
    plagiarismBefore: number,
    plagiarismAfter: number,
    aiDetectionBefore: number,
    aiDetectionAfter: number
  },
  createdAt: Date,
  updatedAt: Date
  // Auto-deletes after 24 hours (TTL index)
}
```

### Payment
```typescript
{
  sessionId: string,
  email: string,
  amount: number,
  status: 'pending' | 'success' | 'failed',
  paystackReference: string (unique),
  createdAt: Date,
  updatedAt: Date
}
```

### User
```typescript
{
  email: string (unique),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Paraphrase Modes

The system supports 8 different paraphrase modes:

| Mode | Style | Use Case |
|------|-------|----------|
| academic | Formal, complex vocabulary | Academic papers, essays |
| standard | Clear, balanced | General writing |
| formal | Very formal tone | Official documents |
| simple | Short sentences, basic words | Children's content, ELL |
| flowing | Narrative, smooth transitions | Stories, creative writing |
| informal | Conversational tone | Blogs, social media |
| expand | More detail, longer | Adding depth to content |
| shorten | Concise, key points | Summaries, abstracts |

---

## Testing with Paystack

### Test Credentials

**Card (Test Mode):**
- Number: 4111 1111 1111 1111
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits

**Mobile Money (Orange Ghana - Test):**
- Phone: 054XXXX1234
- PIN: 1234

### Getting Test Keys

1. Sign up at paystack.com (free account)
2. Go to Settings → Developers
3. Use **Test Keys** (starts with `pk_test_` and `sk_test_`)
4. Later switch to **Live Keys** for production

---

## Environment Variables Required

```env
# Required
MONGODB_URI=mongodb://localhost:27017/paraphrasing-x
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# AI Engine (choose one):
# Option 1: HuggingFace Inference API (Recommended - Cloud, Free)
HUGGINGFACE_API_KEY=hf_xxxxx

# Option 2: Ollama (Local, no API key needed but requires installation)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# Option 3: Neither (System uses built-in fallback paraphraser)
# Just leave AI settings empty

# Optional
BACKEND_PORT=4000
NODE_ENV=development
```

**Note:** 
- HuggingFace API key is optional. Get free key: https://huggingface.co/settings/tokens
- If no AI is configured, system uses built-in paraphraser (works instantly, no API)
- Ollama still supported if you have it installed locally

---

---

## Common Response Patterns

### Success Pattern
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed"
}
```

### Error Pattern
```json
{
  "error": "Error message",
  "status": 400,
  "details": "Additional info"
}
```

---

## Performance Notes

- **Paraphrase:** 10-60 sec (Ollama local processing)
- **Payment init:** <1 sec
- **Result fetch:** <500 ms
- **Database ops:** <100 ms

---

## Support

For API issues:
- Check logs: `npm run dev` console output
- Test endpoints with curl/Postman first
- Verify all environment variables set
- Ensure all services running (MongoDB, Ollama)

