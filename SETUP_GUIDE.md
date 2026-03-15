# Paraphrasing X — Complete Setup Guide

## Overview

Paraphrasing X is a full-stack SaaS platform for academic paraphrasing with AI-powered text rewriting, plagiarism detection simulation, and integrated payments via Paystack.

**Tech Stack:**
- Frontend: Next.js 14, React 18, Tailwind CSS
- Backend: Node.js + Express (optional standalone server)
- Database: MongoDB
- AI Engine: Ollama (local) with Llama 3 / Mistral models
- Payments: Paystack

---

## Prerequisites

Before starting, ensure you have installed:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **npm** or **yarn** (comes with Node.js)
3. **MongoDB** - Either:
   - Local: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
4. **Ollama** (for local AI) - [Download](https://ollama.ai/)
5. **Git** (recommended)

---

## Step 1: Install Dependencies

Navigate to the project directory:

```bash
cd c:\Users\USER\Downloads\page_content\paraphrasing-x
```

Install all npm dependencies:

```bash
npm install
```

This will install:
- Next.js and React
- Mongoose (MongoDB driver)
- Express & CORS (optional backend)
- Paystack SDK
- Other utilities (framer-motion, toast, lucide-react, etc.)

---

## Step 2: Configure Environment Variables

Copy the environment template:

```bash
cp .env.example .env.local
```

Or edit `.env.local` directly with these values:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/paraphrasing-x
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/paraphrasing-x

# Paystack API Keys (get from https://dashboard.paystack.com)
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here

# Base URL (for payment callbacks)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Ollama Configuration (local AI)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
# Alternative models: mistral, neural-chat, etc.

# Optional
BACKEND_PORT=4000
NODE_ENV=development
```

### Getting Paystack Keys:

1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Sign up or log in
3. Navigate to **Settings → Developers**
4. Copy **Secret Key** and **Public Key**
5. Use **Secret Key** → `PAYSTACK_SECRET_KEY`
6. Use **Public Key** → `PAYSTACK_PUBLIC_KEY`

---

## Step 3: Set Up MongoDB

### Option A: Local MongoDB (Recommended for Development)

**On Windows:**

1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. During installation, choose "Install MongoDB as a Service"
3. Start MongoDB:
   ```bash
   net start MongoDB
   ```
4. Test connection:
   ```bash
   mongosh
   ```
   If successful, you'll see a shell prompt.

**On macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
mongosh
```

**On Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
mongosh
```

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project
4. Deploy a **free cluster**
5. Go to **Database Access** → Create a user (e.g., `paraphrasing-x`)
6. Go to **Network Access** → Add your IP address (or 0.0.0.0 for anywhere)
7. Click **Connect** → Copy connection string
8. Replace in `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/paraphrasing-x?retryWrites=true&w=majority
   ```

**Verify connection:**
```bash
mongosh "mongodb://localhost:27017"
```

---

## Step 4: Set Up AI Engine

### ⭐ NEW: Cloud-Based AI (No Installation Needed!)

The system now uses **HuggingFace Inference API** instead of Ollama:

**Advantages:**
- ✅ No local installation required
- ✅ Completely free (cloud-based)
- ✅ Works out of the box
- ✅ No Ollama or GPU needed

**Disadvantages:**
- Slightly slower (5-15 seconds vs 2-5 seconds)
- Requires internet connection
- API rate limits (generous on free tier)

### Option 1: Use HuggingFace (Recommended - Free)

1. Go to: https://huggingface.co/settings/tokens
2. Sign up (takes 1 minute, free)
3. Click **"New token"**
4. Name it: `paraphrasing-x`
5. Select **"Read"** permission
6. Click **"Create token"**
7. Copy the token (starts with `hf_`)

**Add to `.env.local`:**
```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

That's it! The system is ready to use.

### Option 2: Use Built-in Fallback (Always Works)

If you don't add a HuggingFace key, the system automatically uses a built-in paraphraser:
- Uses intelligent synonym replacement
- Restructures sentences
- No API key needed
- Works instantly
- No internet required

**Simply don't add `HUGGINGFACE_API_KEY` to `.env.local`** and it works!

### Option 3: Use Ollama (If You Prefer Local)

If you still want to use Ollama locally:

**Windows:**
1. Download from https://ollama.ai
2. Run installer
3. Open PowerShell:
   ```powershell
   ollama serve
   ```

**macOS:**
```bash
brew install ollama
ollama serve
```

**Linux:**
```bash
curl https://ollama.ai/install.sh | sh
ollama serve
```

**Download a model:**
```bash
ollama pull llama3
```

**Add to `.env.local`:**
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

---

## Step 5: Start the Development Server

### Simple Method (Cloud AI)

If using HuggingFace or fallback paraphraser, you only need MongoDB:

```bash
# Terminal 1: MongoDB
mongosh

# Terminal 2: Start app
npm run dev
```

Open: **http://localhost:3000**

### Advanced Method (with Ollama)

If you chose to use Ollama locally:

```bash
# Terminal 1: MongoDB
mongosh

# Terminal 2: Ollama
ollama serve

# Terminal 3: Download model (if first time)
ollama pull llama3

# Terminal 4: Start app
npm run dev
```

Open: **http://localhost:3000**

---

## Step 6: Test the Complete System

### Test Paraphrase Endpoint

Open your browser and paste this in the console, or use Postman:

```javascript
fetch('/api/paraphrase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'The quick brown fox jumps over the lazy dog. This is a famous pangram used in typography testing.',
    mode: 'academic'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Expected response:**
```json
{
  "success": true,
  "paraphrasedText": "...",
  "sessionId": "uuid-string",
  "stats": {
    "plagiarismBefore": 75,
    "plagiarismAfter": 12,
    "aiDetectionBefore": 88,
    "aiDetectionAfter": 8
  }
}
```

### Test Paraphrase UI

1. Go to **http://localhost:3000**
2. Click on the **Paraphrasing Tool** section
3. Paste text in the textarea
4. Select a mode (Academic, Standard, etc.)
5. Click **✨ Paraphrase Now**
6. Wait for processing (15-30 seconds for Ollama)
7. Preview the result

### Test Payment Flow

1. After getting a preview, click **"Pay GHS 5 to Unlock"**
2. Enter an email address
3. Click **"Pay GHS 5 — Unlock Now"**
4. You'll be redirected to Paystack's test payment page
5. Use test card:
   - Card: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits
6. Click **Pay**
7. You'll be redirected back with the full result unlocked

---

## Project Structure

```
paraphrasing-x/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── paraphrase/route.ts          ← Paraphrase endpoint
│   │   │   ├── payment/init/route.ts        ← Payment initialization
│   │   │   ├── payment/verify/route.ts      ← Payment verification
│   │   │   └── result/route.ts              ← Get unlocked result
│   │   ├── layout.tsx                       ← Root layout
│   │   ├── page.tsx                         ← Homepage
│   │   │
│   │   └── [other pages]/
│   ├── components/
│   │   ├── ParaphrasingTool.tsx            ← Main tool UI
│   │   ├── ResultsPreview.tsx              ← Preview & payment UI
│   │   ├── ProcessingScreen.tsx            ← Loading animation
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── models/
│   │   ├── User.ts
│   │   ├── Text.ts                         ← Stores paraphrased texts
│   │   └── Payment.ts                      ← Stores payment records
│   └── lib/
│       └── mongodb.ts                      ← DB connection helper
├── backend/
│   ├── server.js                           ← Express server (optional)
│   ├── models/                             ← DB models (JS version)
│   └── routes/                             ← Express routes (optional)
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
└── .env.local                              ← Environment variables
```

---

## Troubleshooting

### Issue: "MongoDB connection failed"

**Solution:**
1. Check if MongoDB is running:
   ```bash
   mongosh
   ```
2. If not, start it:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongodb`

### Issue: "Paraphrase returns empty or blank"

**Solution:**
1. If using HuggingFace, verify API key in `.env.local`: `HUGGINGFACE_API_KEY=hf_xxxxx`
2. Check your internet connection
3. **The system automatically falls back to built-in paraphraser** - no API needed!
4. System will work even without any AI configured

### Issue: "HuggingFace API not working"

**Solution:**
1. Verify API key is correct: https://huggingface.co/settings/tokens
2. Check token has "Read" permission (not "Write")
3. **Don't worry** - system automatically uses built-in fallback if API fails
4. Built-in paraphraser works perfectly without any API key!

### Issue: "Cannot find module 'mongoose' / other packages"

**Solution:**
```bash
npm install
npm cache clean --force
npm install
```

### Issue: "PAYSTACK_SECRET_KEY is missing"

**Solution:**
1. Make sure `.env.local` exists in the project root
2. Add your Paystack keys (from dashboard)
3. Save the file
4. Restart the development server: `npm run dev`

### Issue: "Paraphrase takes 5-15 seconds"

**This is normal!** 
- HuggingFace API takes 5-15 seconds per request (cloud API)
- Built-in fallback takes <1 second (instant results)
- Both work perfectly - choose what you prefer
- No Ollama or GPU needed anymore!

### Issue: "Payment redirect to Paystack not working"

**Solution:**
1. Verify `PAYSTACK_SECRET_KEY` is correct
2. Verify `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
3. Check that `/api/payment/init` returns the `authorizationUrl`
4. Use browser DevTools (F12) → Network tab to debug

---

## Production Deployment

### Deploying to Vercel (Frontend)

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourname/paraphrasing-x
   git push -u origin main
   ```

2. Go to [Vercel](https://vercel.com) and import the repo
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploying Ollama (Production)

For production, consider:
- **Option 1:** Run Ollama on a separate GPU server
- **Option 2:** Use cloud endpoints (Fireworks AI, Replicate)
- **Option 3:** Keep local but optimize: `ollama serve --addr 0.0.0.0:11434`

### Database Backup

MongoDB Atlas automatically backs up data. For local MongoDB:

```bash
# Export
mongodump --uri="mongodb://localhost:27017" --out=./backup

# Import
mongorestore --uri="mongodb://localhost:27017" ./backup
```

---

## API Endpoints Reference

### POST `/api/paraphrase`
Paraphrase text with AI

**Request:**
```json
{
  "text": "Your text here",
  "mode": "academic"
}
```

**Response:**
```json
{
  "success": true,
  "paraphrasedText": "...",
  "sessionId": "uuid",
  "stats": {
    "plagiarismBefore": 75,
    "plagiarismAfter": 12,
    "aiDetectionBefore": 88,
    "aiDetectionAfter": 8
  }
}
```

### POST `/api/payment/init`
Initialize payment with Paystack

**Request:**
```json
{
  "email": "user@example.com",
  "sessionId": "uuid-from-paraphrase",
  "amount": 500
}
```

**Response:**
```json
{
  "success": true,
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "ref_xyz"
}
```

### GET `/api/payment/verify`
Verify payment and return full result (callback from Paystack)

### GET `/api/result`
Get unlocked result after payment

**Request:**
```
GET /api/result?sessionId=uuid&ref=paystack-ref
```

**Response:**
```json
{
  "success": true,
  "paraphrasedText": "...",
  "stats": {...},
  "mode": "academic"
}
```

---

## Support & Documentation

- **Next.js Docs:** https://nextjs.org/docs
- **Mongoose Docs:** https://mongoosejs.com/docs
- **Ollama Docs:** https://github.com/ollama/ollama
- **Paystack Docs:** https://paystack.com/docs/api
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## License

This project is proprietary. All rights reserved.

