# 🚀 Paraphrasing X — Complete SaaS Platform

A production-ready AI-powered academic paraphrasing platform with integrated payments, local AI processing, and modern UI/UX.

## ✨ Features

✅ **AI-Powered Paraphrasing**
- Local Ollama integration (no API fees)
- 8 rewriting modes (Academic, Standard, Formal, Simple, Flowing, Informal, Expand, Shorten)
- Handles unlimited text length with smart chunking
- Built-in fallback paraphraser when AI unavailable

✅ **Plagiarism & AI Detection**
- Simulates plagiarism detection scores
- Estimates AI detection rates
- Shows before/after comparisons

✅ **Secure Payments**
- Paystack integration (Mobile Money, Card, Bank Transfer)
- GHS 5 per unlock
- Webhook verification for security
- Payment history tracking

✅ **Database Integration**
- MongoDB with auto-expiring sessions (24-hour TTL)
- User tracking
- Payment records
- Paraphrase history

✅ **Modern Frontend**
- Next.js 14 with React 18
- Tailwind CSS with custom dark theme
- Framer Motion animations
- Toast notifications
- Fully responsive design

✅ **Developer-Friendly**
- TypeScript throughout
- Comprehensive error handling
- Rate limiting built-in
- Input validation & sanitization
- Full API documentation

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js/React)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ParaphrasingTool.tsx                                │  │
│  │  - Text input & mode selection                       │  │
│  │  - Results preview with payment modal                │  │
│  │  - Unlocked results display                          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼──────┐ ┌──▼────────┐ ┌─▼──────────┐
   │   API     │ │ Database  │ │ Payments   │
   │           │ │           │ │            │
   │ /paraphrase
   │ /payment  │ │ MongoDB   │ │ Paystack   │
   │ /result   │ │           │ │   API      │
   └─┬─────────┘ └──┬────────┘ └─┬──────────┘
     │              │            │
     │              └──────┬─────┘
     │                     │
     └─────────────┬───────┘
                   │
            ┌──────▼──────────┐
            │   Ollama Local   │
            │   AI Engine      │
            │                  │
            │  Llama 3 / Mistral
            └──────────────────┘
```

---

## 🛠 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Frontend** | Next.js | 14.2.5 |
| | React | 18 |
| | Tailwind CSS | 3.4.1 |
| **Backend/API** | Node.js | 18+ |
| | Express.js | 4.18.2 |
| **Database** | MongoDB | Latest |
| **AI Engine** | HuggingFace Inference (Free) OR Built-in Fallback | Latest |
| | Ollama (Optional, local) | Latest |
| | Llama 3 / Mistral | 7B models |
| **Payments** | Paystack | API v2 |
| **Language** | TypeScript | 5.0+ |

---

## 📋 Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** ([Community Server](https://www.mongodb.com/try/download/community) or [Atlas Cloud](https://www.mongodb.com/cloud/atlas))
- **Ollama** ([Download](https://ollama.ai/))
- **Paystack Account** ([Sign up](https://paystack.com))

---

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd paraphrasing-x
npm install
```

### 2. Configure Environment
```bash
# Edit .env.local with:
MONGODB_URI=mongodb://localhost:27017/paraphrasing-x
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

### 3. Start Services
```bash
# Terminal 1: MongoDB
mongosh

# Terminal 2: Ollama
ollama serve

# Terminal 3: Download model (while serving)
ollama pull llama3

# Terminal 4: Start app
npm run dev
```

### 4. Open App
```
http://localhost:3000
```

---

## 📖 Full Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | 5-15 min setup guide |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Comprehensive setup & configuration |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API documentation |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Full testing procedures |

---

## 🔧 Project Structure

```
paraphrasing-x/
├── src/
│   ├── app/
│   │   ├── api/                          # Next.js API Routes
│   │   │   ├── paraphrase/route.ts       # ✨ AI paraphrase endpoint
│   │   │   ├── payment/
│   │   │   │   ├── init/route.ts         # 💳 Payment init
│   │   │   │   └── verify/route.ts       # ✅ Payment verification
│   │   │   └── result/route.ts           # 📄 Get unlocked result
│   │   │
│   │   ├── page.tsx                      # Homepage
│   │   ├── layout.tsx                    # Root layout
│   │   ├── globals.css                   # Global styles
│   │   │
│   │   └── [pages]/                      # Other pages (about, pricing, etc.)
│   │
│   ├── components/                       # React Components
│   │   ├── ParaphrasingTool.tsx          # 🎯 Main tool UI
│   │   ├── ResultsPreview.tsx            # 📊 Preview & payment UI
│   │   ├── ProcessingScreen.tsx          # ⏳ Loading animation
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── models/                           # Database Schemas
│   │   ├── User.ts
│   │   ├── Text.ts                       # Paraphrased texts
│   │   └── Payment.ts                    # Payment records
│   │
│   └── lib/
│       └── mongodb.ts                    # DB connection helper
│
├── backend/                              # Optional Express backend
│   ├── server.js
│   ├── models/
│   └── routes/
│
├── public/                               # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── .env.local                            # Environment config
```

---

## 🌐 API Endpoints

### Paraphrase
```
POST /api/paraphrase
├─ Input: text, mode
└─ Output: paraphrasedText, sessionId, stats
```

### Payment
```
POST /api/payment/init
├─ Input: email, sessionId, amount
└─ Output: authorizationUrl, reference

GET /api/payment/verify
├─ Input: reference, sessionId
└─ Output: redirects to /result

GET /api/result
├─ Input: sessionId
└─ Output: paraphrasedText (if paid)
```

See [API_REFERENCE.md](./API_REFERENCE.md) for full documentation.

---

## 💻 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Install new package
npm install package-name
```

---

## 🧪 Testing

### Quick Test
```javascript
// In browser console
fetch('/api/paraphrase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Your text here (min 50 chars)',
    mode: 'academic'
  })
})
.then(r => r.json())
.then(d => console.log(d.paraphrasedText))
```

### Full Testing
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for:
- API health checks
- Complete user journey testing
- Error handling tests
- Performance benchmarks
- Payment flow verification

---

## 🤖 AI Models

### Recommended Models

| Model | Size | Speed | Quality |
|-------|------|-------|---------|
| **Llama 3** | 7B | Medium | Excellent |
| **Mistral** | 7B | Fast | Good |
| **Neural Chat** | 7B | Fast | Good |
| **FLAN-T5** | 3B | Fast | Good (smaller) |

### Download Models
```bash
# Llama 3 (recommended)
ollama pull llama3

# Mistral (faster)
ollama pull mistral

# Neural Chat
ollama pull neural-chat
```

### Change Model
Edit `.env.local`:
```env
OLLAMA_MODEL=mistral
```

---

## 🔐 Security Features

✅ **Input Validation**
- Text length validation (50-500K chars)
- Email format validation
- Mode validation

✅ **Sanitization**
- HTML/script tag removal
- XSS prevention
- SQL injection prevention (MongoDB)

✅ **Rate Limiting**
- Paraphrase: 5 requests/minute
- Payment: 10 requests/minute
- Per-IP tracking

✅ **Payment Security**
- Paystack HMAC signature verification
- Webhook validation
- PCI DSS compliance via Paystack

✅ **Database Security**
- Unique constraints on critical fields
- Auto-delete after 24 hours for privacy
- Indexed queries for performance

---

## 📈 Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Paraphrase (100 words) | 8-15 sec | Ollama locally |
| Paraphrase (500 words) | 25-45 sec | Chunked processing |
| Payment init | <1 sec | Fast API call |
| Result fetch | <500 ms | DB lookup |
| Fallback paraphrase | 0.1 sec | No AI |

---

## 🚀 Deployment

### Vercel (Frontend)
```bash
# Push to GitHub
git push origin main

# Import in Vercel dashboard
# Add environment variables
# Deploy
```

### Database
- **Development:** Local MongoDB
- **Production:** MongoDB Atlas (free tier available)

### AI Engine (Ollama)
- **Development:** Local machine
- **Production:** 
  - Option 1: GPU server with Ollama
  - Option 2: Cloud endpoints (Fireworks, Replicate, Together)
  - Option 3: API-based (HuggingFace, Groq)

---

## 🐛 Troubleshooting

### MongoDB Not Running
```bash
# Check
mongosh

# Start
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

### Ollama Not Responding
```bash
# Check
curl http://localhost:11434/api/tags

# Start
ollama serve

# Download model if needed
ollama pull llama3
```

### Paraphrase Too Slow
1. Check Ollama is running and model loaded
2. Check system resources (RAM, GPU)
3. Try smaller model: `ollama pull mistral`
4. Check network connectivity

### Payment Not Working
1. Verify Paystack credentials in `.env.local`
2. Restart dev server: `npm run dev`
3. Check Paystack test keys (sandbox mode)
4. Verify callback URL is set correctly

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting.

---

## 📞 Support & Resources

**Official Docs:**
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Ollama GitHub](https://github.com/ollama/ollama)
- [Paystack Documentation](https://paystack.com/docs)

**Community:**
- [Next.js Discord](https://discord.gg/nextjs)
- [Ollama Discussions](https://github.com/ollama/ollama/discussions)
- [Paystack Community](https://paystack.com/support)

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 🎉 You're Ready!

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env.local`
3. ✅ Start MongoDB, Ollama, and dev server
4. ✅ Open http://localhost:3000
5. ✅ Test paraphrasing and payment
6. ✅ Deploy to production

---

## 📊 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend UI | ✅ Ready | All pages included |
| API Routes | ✅ Ready | Fully functional |
| Database | ✅ Ready | Schemas defined |
| AI Integration | ✅ Ready | Ollama configured |
| Payments | ✅ Ready | Paystack integrated |
| Documentation | ✅ Ready | Comprehensive guides |
| Testing | ✅ Ready | Full test suite |

---

**Last Updated:** March 2026
**Version:** 1.0.0

