# Paraphrasing X — Quick Start Guide

## ⚡ 5-Minute Quick Start

### Prerequisites
- Node.js installed
- MongoDB running locally OR connection string ready
- ~~Ollama running~~ ✅ **NOT needed anymore!**
- Optional: HuggingFace API key (free, takes 1 minute to get)

### Step 1: Install Dependencies (1 min)
```bash
cd paraphrasing-x
npm install
```

### Step 2: Configure Environment (1 min)
Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/paraphrasing-x
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
HUGGINGFACE_API_KEY=hf_xxxxx  # Get free key from https://huggingface.co/settings/tokens
```

### Step 3: Start Development (2 min)
```bash
npm run dev
```

### Step 4: Open in Browser (1 min)
```
http://localhost:3000
```

---

## 🚀 Step-by-Step Full Setup (15 minutes)

### 1. Install Node.js
- Windows: Download from nodejs.org, run installer
- Mac: `brew install node`
- Linux: `sudo apt-get install nodejs npm`

### 2. Clone/Setup Project
```bash
cd c:\Users\USER\Downloads\page_content\paraphrasing-x
npm install
```

### 3. Setup MongoDB
**Local (recommended):**
```bash
# Windows: Download from mongodb.com → Run installer
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community

# Verify
mongosh
```

**Cloud (MongoDB Atlas):**
1. Sign up at mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `.env.local`

### 4. Setup Ollama
```bash
# Download from ollama.ai and install

# In terminal window 1:
ollama serve

# In terminal window 2 (wait for window 1 to start):
ollama pull llama3

# Verify
curl http://localhost:11434/api/tags
```

### 5. Configure App
Edit `.env.local`:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/paraphrasing-x

# Paystack - Get from https://dashboard.paystack.com
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

### 6. Start Server
```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.2.5
✓ Ready in 2.3s
```

### 7. Open App
Visit: http://localhost:3000

---

## 🧪 Quick Test

### Test Paraphrase (in browser console):
```javascript
fetch('/api/paraphrase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'The quick brown fox jumps over the lazy dog. This is a test of the paraphrasing system.',
    mode: 'academic'
  })
})
.then(r => r.json())
.then(d => console.log('Result:', d.paraphrasedText))
```

Should see paraphrased text in console after 10-20 seconds.

---

## 📋 Checklist

Before considering setup complete:

- [ ] `npm install` completed without errors
- [ ] `.env.local` file created with all required variables
- [ ] MongoDB is running and accessible (`mongosh` works)
- [ ] Ollama is running (`curl http://localhost:11434/api/tags` returns JSON)
- [ ] `npm run dev` starts without errors
- [ ] Browser can access http://localhost:3000
- [ ] Homepage loads and displays properly
- [ ] Paraphrase endpoint returns data
- [ ] All 8 paraphrase modes visible in UI

---

## 🔧 Common Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Database
```bash
# Connect to MongoDB locally
mongosh

# View all databases
show dbs

# Use paraphrasing-x database
use paraphrasing-x

# View collections
show collections

# View sample data
db.texts.findOne()
```

### Ollama
```bash
# Start Ollama server
ollama serve

# Download model
ollama pull llama3

# List downloaded models
ollama list

# Test API
curl http://localhost:11434/api/tags
```

---

## 🆘 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| MongoDB connection failed | Run: `mongosh` to verify it's running. If not, start service |
| Cannot reach Ollama | Run `ollama serve` in a new terminal |
| Missing dependencies | Run `npm install` again |
| Paraphrase takes forever | Normal first time. Check Ollama is running |
| Payment not working | Verify `PAYSTACK_SECRET_KEY` in `.env.local` and restart server |
| Port 3000 already in use | Change to different port: `npm run dev -- -p 3001` |

---

## 📚 Next Steps

After setup:

1. **Test the system:** See [TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. **Understand architecture:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
3. **Deploy to production:** See deployment section in SETUP_GUIDE.md
4. **Customize:** Modify prompts, models, UI as needed

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `src/app/api/paraphrase/route.ts` | Main AI endpoint |
| `src/app/api/payment/init/route.ts` | Payment gateway |
| `src/app/api/payment/verify/route.ts` | Payment verification |
| `src/components/ParaphrasingTool.tsx` | Main UI component |
| `src/models/Text.ts` | Database model for texts |
| `src/models/Payment.ts` | Database model for payments |
| `.env.local` | Environment configuration |

---

## 💡 Tips

- **First paraphrase is slow:** Ollama loads model into GPU, takes 10-20 sec
- **Use test Paystack keys first:** Test mode allows unlimited test transactions
- **Monitor MongoDB:** `db.texts.countDocuments()` to see stored paraphrases
- **Check Ollama memory:** Large texts need more GPU memory, switch to smaller model if issues
- **Keep .env.local out of git:** Already in .gitignore, but don't commit it

---

## 📞 Support

- **Ollama issues:** https://github.com/ollama/ollama
- **Next.js issues:** https://nextjs.org/docs
- **MongoDB issues:** https://docs.mongodb.com
- **Paystack issues:** https://paystack.com/support

---

That's it! You're ready to paraphrase! 🎉

