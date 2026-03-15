# 🚀 PARAPHRASING X - COMPLETE REPAIR & SETUP GUIDE

**Status**: ✅ All Systems Operational  
**Date**: March 14, 2026  
**Platform**: Windows (PowerShell)

---

## 📋 QUICK START (5 MINUTES)

### Step 1: Clean Build
```powershell
cd c:\Users\USER\Downloads\page_content\paraphrasing-x

# Remove old artifacts
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "out" -Recurse -Force -ErrorAction SilentlyContinue

# Install fresh dependencies
npm install
```

### Step 2: Configure Environment
```powershell
# Update .env.local with your API keys:
# PAYSTACK_SECRET_KEY=sk_test_YOUR_KEY_HERE
# HUGGINGFACE_API_KEY=hf_YOUR_KEY_HERE
```

### Step 3: Start Development Server
```powershell
npm run dev
```

### Step 4: Access Platform
```
Browser: http://localhost:3002
Database: MongoDB (mongodb://localhost:27017/paraphrasing-x)
```

---

## 🔧 ARCHITECTURE OVERVIEW

### Frontend (Next.js)
- **Port**: 3002
- **Framework**: Next.js 14.2.5 + React 18
- **Styling**: Tailwind CSS 3.4.1
- **Location**: `/src`

### Backend (Node.js Express)
- **Port**: 4000
- **Framework**: Express 4.18.2
- **Models**: MongoDB with Mongoose 8.5.1
- **Location**: `/backend`

### Database
- **Type**: MongoDB
- **URI**: `mongodb://localhost:27017/paraphrasing-x`
- **Models**: User, Text, Payment

### AI Infrastructure
- **Paraphrasing**: FLAN-T5-Large (via Hugging Face API)
- **Humanization**: Mistral-7B (via Hugging Face API)
- **Summarization**: BART Large CNN (via Hugging Face API)
- **Embeddings**: Sentence-BERT (via Hugging Face API)
- **Vector Search**: FAISS (via Sentence-BERT)

### Payments
- **Provider**: Paystack
- **Amount**: 1100 pesewas = GHS 11
- **Currencies**: GHS (Ghana Cedis)
- **Methods**: Mobile Money, Card, Bank

---

## 📁 PROJECT STRUCTURE

```
paraphrasing-x/
├── src/
│   ├── app/
│   │   ├── api/                    # Next.js API routes
│   │   │   ├── paraphrase/         # POST /api/paraphrase
│   │   │   ├── humanize/           # POST /api/humanize
│   │   │   ├── summarize/          # POST /api/summarize
│   │   │   ├── plagiarism/         # POST /api/plagiarism
│   │   │   ├── payment/
│   │   │   │   ├── init/           # POST /api/payment/init
│   │   │   │   └── verify/         # GET/POST /api/payment/verify
│   │   │   └── result/             # GET /api/result
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Main UI
│   ├── components/
│   │   ├── ParaphrasingTool.tsx    # Main tool component
│   │   ├── ResultsPreview.tsx      # Results & payment UI
│   │   ├── ProcessingScreen.tsx    # Loading state
│   │   └── ...
│   ├── models/
│   │   ├── User.ts                 # User schema
│   │   ├── Text.ts                 # Text schema (for storing results)
│   │   └── Payment.ts              # Payment schema
│   └── lib/
│       └── mongodb.ts              # Database connection
├── backend/
│   ├── server.js                   # Express server (utility only)
│   └── models/                     # Mongoose models (Node.js versions)
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── next.config.js                  # Next.js config
├── tailwind.config.js              # Tailwind config
└── .env.local                      # Environment variables
```

---

## 🛠️ API ENDPOINTS (COMPLETE REFERENCE)

### 1️⃣ PARAPHRASE
**Endpoint**: `POST /api/paraphrase`

**Request**:
```json
{
  "text": "Your text here (min 50 chars, max 500k chars)",
  "mode": "academic|standard|formal|simple|flowing|informal|expand|shorten"
}
```

**Response**:
```json
{
  "success": true,
  "paraphrasedText": "Rewritten text...",
  "sessionId": "uuid",
  "wordCount": 250,
  "stats": {
    "plagiarismBefore": 70,
    "plagiarismAfter": 15,
    "aiDetectionBefore": 85,
    "aiDetectionAfter": 10
  }
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid input
- `429`: Rate limited (max 5 requests/min)
- `500`: Server error

---

### 2️⃣ HUMANIZE
**Endpoint**: `POST /api/humanize`

**Request**:
```json
{
  "text": "Your AI-generated text here"
}
```

**Response**:
```json
{
  "success": true,
  "humanizedText": "More natural text...",
  "wordCount": 250,
  "message": "Text has been humanized and made more conversational"
}
```

---

### 3️⃣ SUMMARIZE
**Endpoint**: `POST /api/summarize`

**Request**:
```json
{
  "text": "Long text to summarize (min 100 chars)",
  "length": "short|medium|long"
}
```

**Response**:
```json
{
  "success": true,
  "summary": "Summarized text...",
  "wordCount": 50,
  "originalWordCount": 500
}
```

---

### 4️⃣ PLAGIARISM DETECTION
**Endpoint**: `POST /api/plagiarism`

**Request**:
```json
{
  "text": "Your text to check (min 100 chars)"
}
```

**Response**:
```json
{
  "success": true,
  "plagiarismScore": 12,
  "status": "original|moderate|high",
  "wordCount": 250,
  "sentenceCount": 8,
  "avgSentenceLength": 31,
  "detectionMethod": "heuristic|semantic|overlap",
  "message": "✓ Text appears to be original"
}
```

---

### 5️⃣ PAYMENT INITIALIZATION
**Endpoint**: `POST /api/payment/init`

**Request**:
```json
{
  "email": "user@example.com",
  "sessionId": "uuid-from-paraphrase",
  "amount": 1100
}
```

**Response**:
```json
{
  "success": true,
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "paystack_reference"
}
```

---

### 6️⃣ PAYMENT VERIFICATION
**Endpoint**: `GET /api/payment/verify?reference=REF&sessionId=SESSION_ID`

**Response**:
```json
{
  "received": true
}
```

**Also handles POST from Paystack webhook**

---

### 7️⃣ FETCH RESULT
**Endpoint**: `GET /api/result?sessionId=UUID&ref=PAYSTACK_REF`

**Response**:
```json
{
  "success": true,
  "paraphrasedText": "Full text...",
  "stats": {...},
  "mode": "academic"
}
```

---

## 🔑 ENVIRONMENT VARIABLES

Create `.env.local` in project root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/paraphrasing-x

# Paystack Payment Gateway
PAYSTACK_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
PAYSTACK_PUBLIC_KEY=pk_test_YOUR_PUBLIC_KEY_HERE

# Hugging Face API (for AI models)
HUGGINGFACE_API_KEY=hf_YOUR_FREE_API_KEY_HERE

# Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3002
BACKEND_PORT=4000
```

### Getting API Keys:

**Paystack**:
1. Go to https://paystack.com
2. Create account & get test keys
3. Copy into `.env.local`

**Hugging Face**:
1. Sign up at https://huggingface.co
2. Go to Settings > Access Tokens
3. Create free token
4. Copy into `.env.local`

---

## 🚀 INSTALLATION & SETUP

### Prerequisites
- Node.js 18+ (Check: `node --version`)
- npm 9+ (Check: `npm --version`)
- MongoDB running locally (Check: `mongosh --version`)
- PowerShell (Windows)

### Full Installation

```powershell
# 1. Navigate to project
cd c:\Users\USER\Downloads\page_content\paraphrasing-x

# 2. Clean previous artifacts
Remove-Item -Path ".next", "node_modules", "out" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Install dependencies
npm install

# 4. Configure environment variables
# Edit .env.local with your API keys

# 5. Start development server
npm run dev

# 6. Open in browser
Start-Process "http://localhost:3002"
```

### Also run backend server (optional utility port):
```powershell
# In a NEW PowerShell window:
cd c:\Users\USER\Downloads\page_content\paraphrasing-x
node backend/server.js
```

---

## 🧪 TESTING ALL FEATURES

### Test 1: Paraphrase Feature
```
1. Open http://localhost:3002
2. Paste text (min 50 chars)
3. Select mode (e.g., "Academic")
4. Click "Rewrite Now"
5. ✓ Should show paraphrased text with stats
```

### Test 2: Humanize Feature
```
1. Go to Humanize page
2. Paste AI-generated text
3. Click "Humanize Text"
4. ✓ Should make text more conversational
```

### Test 3: Summarize Feature
```
1. Go to Summarize page
2. Paste long text
3. Select length (short/medium/long)
4. Click "Summarize"
5. ✓ Should show condensed summary
```

### Test 4: Plagiarism Detection
```
1. Go to Plagiarism page
2. Paste text to check
3. Click "Check Plagiarism"
4. ✓ Should show plagiarism score and status
```

### Test 5: Payment System
```
1. Complete any paraphrasing task
2. Click "Pay GHS 11 - Unlock Now"
3. Use Paystack test card:
   - Card: 4084084084084081
   - Expiry: Any future date
   - CVV: 408
4. ✓ Should unlock full results
```

### Test 6: API Endpoints (via Terminal)
```powershell
# Health check
curl http://localhost:4000/health

# Test paraphrase API
$body = @{
    text = "This is a test sentence that needs to be rewritten."
    mode = "academic"
} | ConvertTo-Json

curl -Method POST `
  -Uri "http://localhost:3002/api/paraphrase" `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Port 3002 already in use"
```powershell
# Find process using port 3002
Get-NetTCPConnection -State Listen | Where-Object {$_.LocalPort -eq 3002}

# Kill process (replace PID)
Stop-Process -Id <PID> -Force
```

### Issue: "Cannot find module 'mongoose'"
```powershell
npm install mongoose --save
npm install
```

### Issue: "MONGODB_URI not configured"
```powershell
# Verify .env.local exists and has MONGODB_URI
cat .env.local

# Start MongoDB
mongod
```

### Issue: "Hot reload not working"
```powershell
# Clear Next.js cache
Remove-Item -Path ".next" -Recurse -Force

# Restart dev server
npm run dev
```

### Issue: "HuggingFace API errors"
```
• Verify API key in .env.local
• Check free tier rate limits (100 requests/day for free)
• Fallback models will activate if API unavailable
```

### Issue: "Payment initialization fails"
```
• Verify PAYSTACK_SECRET_KEY in .env.local
• Check internet connection
• Ensure amount is 1100 (GHS 11 in pesewas)
```

---

## 📊 DATABASE SCHEMAS

### User Schema
```typescript
{
  email: String (unique, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Text Schema
```typescript
{
  sessionId: String (unique, required),
  originalText: String (required),
  paraphrasedText: String (required),
  mode: String (enum: academic|standard|formal|simple|flowing|informal|expand|shorten|humanize|summary_*|plagiarism_check),
  stats: {
    plagiarismBefore: Number,
    plagiarismAfter: Number,
    aiDetectionBefore: Number,
    aiDetectionAfter: Number,
    wordCount: Number,
    sentenceCount: Number,
    avgSentenceLength: Number
  },
  createdAt: Date (auto-deleted after 24 hours),
  updatedAt: Date
}
```

### Payment Schema
```typescript
{
  sessionId: String (required),
  email: String (required, lowercase),
  amount: Number (default: 1100),
  status: String (enum: pending|success|failed),
  paystackReference: String (unique, required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 SECURITY FEATURES

✅ **Input Sanitization**: Removes HTML/scripts from all text inputs  
✅ **Rate Limiting**: Max 5 requests/minute per IP  
✅ **Payment Verification**: Cryptographic signature validation  
✅ **Email Validation**: Regex pattern matching  
✅ **CORS Protection**: Restricted to http://localhost:3002  
✅ **Large Text Support**: Up to 500KB per request  
✅ **Auto-delete**: Text records auto-deleted after 24 hours  

---

## 📈 PERFORMANCE OPTIMIZATIONS

✅ **Chunked Processing**: Large texts split into 800-word chunks  
✅ **Parallel Processing**: Multiple chunks processed simultaneously  
✅ **Fallback Models**: Works without Hugging Face API  
✅ **In-Memory Rate Limiting**: Fast request tracking  
✅ **MongoDB Connection Pooling**: Efficient DB access  
✅ **Response Caching**: Session-based result storage  

---

## 📝 TECHNOLOGY STACK SUMMARY

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | Next.js | 14.2.5 | Full-stack React framework |
| Frontend | React | 18 | UI components |
| Frontend | Tailwind CSS | 3.4.1 | Styling |
| Backend | Node.js | - | Runtime |
| Backend | Express | 4.18.2 | HTTP server (optional utility) |
| Database | MongoDB | - | Document storage |
| ORM | Mongoose | 8.5.1 | MongoDB modeling |
| AI - Paraphrase | FLAN-T5 Large | - | Text rewriting |
| AI - Humanize | Mistral 7B | - | Natural writing |
| AI - Summarize | BART Large CNN | - | Text summarization |
| AI - Embeddings | Sentence-BERT | - | Semantic similarity |
| Vector DB | FAISS | - | Similarity search |
| Payments | Paystack | - | Payment processing |
| UI Library | Lucide React | 0.400.0 | Icons |
| Animations | Framer Motion | 11.3.8 | Smooth transitions |
| Notifications | React Hot Toast | 2.4.1 | Toast messages |

---

## 🎯 FEATURE CHECKLIST

- [x] Paraphrasing (8 modes: academic, standard, formal, simple, flowing, informal, expand, shorten)
- [x] Text Humanization (removes robotic phrasing)
- [x] Summarization (3 lengths: short, medium, long)
- [x] Plagiarism Detection (semantic similarity scoring)
- [x] Turnitin-style Reports (similarity percentages)
- [x] Payment System (GHS 11, Paystack integration)
- [x] Session Management (24-hour data retention)
- [x] Rate Limiting (DoS protection)
- [x] Error Handling (comprehensive error messages)
- [x] Hot Reload (code changes reflect immediately)
- [x] Large Text Support (up to 500KB)
- [x] Fallback Models (works without API keys)
- [x] User Privacy (auto-delete after 24 hours)
- [x] Mobile Responsive (Tailwind + Framer Motion)

---

## 🚨 CRITICAL REQUIREMENTS (DO NOT CHANGE)

✅ **NO Authentication/Login**  
✅ **NO Signup System**  
✅ **Pay-to-unlock Model** (GHS 11)  
✅ **UI Must Remain Identical** (layout, colors, fonts, spacing)  
✅ **Only Backend Logic Repaired**  

---

## 💬 SUPPORT

**Common Issues**:
- Hot reload not working → Clear `.next` folder
- API errors → Check `.env.local` configuration
- Payment fails → Verify Paystack API keys
- Rate limited → Wait 60 seconds before retrying
- MongoDB errors → Ensure MongoDB is running

**Quick Commands**:
```powershell
# Check if MongoDB is running
Get-Process mongod

# Check port usage
Get-NetTCPConnection -State Listen | Select-Object LocalPort, State, OwningProcess

# View logs
npm run dev
```

---

**Version**: 1.0.0  
**Last Updated**: March 14, 2026  
**Status**: ✅ FULLY OPERATIONAL
