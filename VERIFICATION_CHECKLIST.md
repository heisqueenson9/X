# Paraphrasing X — Pre-Launch Verification Checklist

Use this checklist before starting the system to ensure everything is properly configured.

---

## ✅ Code & Configuration

- [ ] `package.json` has all required dependencies
  ```bash
  npm list mongoose axios express cors express-rate-limit
  ```

- [ ] `.env.local` file exists with all variables
  ```bash
  cat .env.local
  ```

- [ ] All API route files exist and are complete
  - [ ] `src/app/api/paraphrase/route.ts`
  - [ ] `src/app/api/payment/init/route.ts`
  - [ ] `src/app/api/payment/verify/route.ts`
  - [ ] `src/app/api/result/route.ts`

- [ ] All model files exist
  - [ ] `src/models/User.ts`
  - [ ] `src/models/Text.ts`
  - [ ] `src/models/Payment.ts`
  - [ ] `src/lib/mongodb.ts`

- [ ] All component files exist
  - [ ] `src/components/ParaphrasingTool.tsx`
  - [ ] `src/components/ResultsPreview.tsx`
  - [ ] `src/components/ProcessingScreen.tsx`
  - [ ] `src/components/Navbar.tsx`
  - [ ] `src/components/Footer.tsx`

---

## ✅ Environment Variables

- [ ] `MONGODB_URI` is set
  ```env
  # Local: mongodb://localhost:27017/paraphrasing-x
  # Cloud: mongodb+srv://user:pass@cluster.mongodb.net/paraphrasing-x
  ```

- [ ] `PAYSTACK_SECRET_KEY` is set (starts with `sk_`)
  ```env
  PAYSTACK_SECRET_KEY=sk_test_xxxxx
  ```

- [ ] `PAYSTACK_PUBLIC_KEY` is set (starts with `pk_`)
  ```env
  PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
  ```

- [ ] `NEXT_PUBLIC_BASE_URL` is set
  ```env
  NEXT_PUBLIC_BASE_URL=http://localhost:3000
  ```

- [ ] `OLLAMA_URL` is set
  ```env
  OLLAMA_URL=http://localhost:11434
  ```

- [ ] `OLLAMA_MODEL` is set
  ```env
  OLLAMA_MODEL=llama3
  ```

---

## ✅ Dependencies Installed

```bash
npm install
```

- [ ] No errors during installation
- [ ] `node_modules` folder exists and is large (>500MB is normal)
- [ ] `package-lock.json` updated

Verify with:
```bash
npm list --depth=0
```

---

## ✅ MongoDB Ready

### For Local MongoDB:

```bash
# Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb

# Test connection
mongosh
```

- [ ] `mongosh` command works
- [ ] Can connect to database
- [ ] Can see `paraphrasing-x` database (after first use)

### For MongoDB Atlas (Cloud):

- [ ] Cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0 or your IP)
- [ ] Connection string copied correctly
- [ ] Connection string in `.env.local`

Test with:
```bash
mongosh "your-connection-string"
```

---

## ✅ Ollama Ready

### Install Ollama:

1. Download from https://ollama.ai
2. Run installer
3. Wait for installation to complete

### Start Ollama:

```bash
# Terminal window dedicated to Ollama
ollama serve
```

- [ ] Ollama service starts
- [ ] Listen on port 11434
- [ ] No errors in console

### Download Model:

```bash
# In a NEW terminal (while ollama serve is running)
ollama pull llama3
```

- [ ] Model downloads successfully (3-5 min first time)
- [ ] See final message: "success"

### Verify:

```bash
# Test API response
curl http://localhost:11434/api/tags
```

- [ ] Returns JSON with model list
- [ ] Shows `llama3` in the list

---

## ✅ Git & Node Versions

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check Git (recommended but optional)
git --version
```

- [ ] Node version is 18 or higher
- [ ] npm version is 8 or higher

---

## ✅ Ports Available

```bash
# Check if ports are available
netstat -ano | findstr :3000
netstat -ano | findstr :11434
```

- [ ] Port 3000 is available (for Next.js)
- [ ] Port 11434 is available (for Ollama)
- [ ] Port 27017 is available (for MongoDB, if local)

---

## ✅ File Permissions

```bash
# Make sure you can read the project
ls -la paraphrasing-x/

# Verify src directory exists
ls -la paraphrasing-x/src/
```

- [ ] Can read project files
- [ ] No permission errors

---

## ✅ Disk Space

```bash
# Check available disk space
df -h
# Windows: dir C:

# Check node_modules size
du -sh paraphrasing-x/node_modules
```

- [ ] At least 1GB free disk space (recommended: 5GB)
- [ ] `node_modules` folder size is 500MB+ (normal)

---

## ✅ Package Installation Test

```bash
# Verify critical packages are installed
npm ls mongoose
npm ls express
npm ls next
npm ls react
```

- [ ] All packages listed without errors
- [ ] Versions match package.json

---

## 🚀 Ready to Launch!

Now run:

```bash
# Terminal 1: MongoDB
mongosh

# Terminal 2: Ollama
ollama serve

# Terminal 3: Next.js dev server
npm run dev

# Terminal 4: Open browser
# http://localhost:3000
```

### First Test:

1. Homepage should load without errors
2. Navbar and footer visible
3. No red errors in browser console
4. Paraphrasing Tool accessible

---

## 🧪 Quick API Test

In browser console (F12):

```javascript
fetch('/api/paraphrase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'The quick brown fox jumps over the lazy dog. This is a test of the system.',
    mode: 'academic'
  })
})
.then(r => r.json())
.then(d => console.log('Success:', d.success, 'Text:', d.paraphrasedText))
.catch(e => console.error('Error:', e.message))
```

- [ ] Returns `success: true`
- [ ] See paraphrased text in console
- [ ] Response time is reasonable (15-30 sec first time)

---

## ❌ Troubleshooting Quick Fixes

### Error: "Cannot find module 'mongoose'"
```bash
npm install
npm cache clean --force
npm install
```

### Error: "MongoDB connection failed"
```bash
# Check if MongoDB is running
mongosh

# If fails, restart:
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
```

### Error: "Cannot reach Ollama"
```bash
# Check if Ollama is serving
curl http://localhost:11434/api/tags

# If fails, run:
ollama serve
```

### Error: "Port 3000 already in use"
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000, then taskkill /PID <PID> /F
# macOS/Linux: lsof -i :3000, then kill -9 <PID>

# OR use different port
npm run dev -- -p 3001
```

### Error: "Paystack keys missing"
1. Check `.env.local` file exists
2. Add your Paystack keys
3. Restart dev server: `npm run dev`

---

## 📋 Final Checklist

Before declaring system ready:

- [ ] All files and directories exist
- [ ] All environment variables set
- [ ] All dependencies installed
- [ ] MongoDB running and accessible
- [ ] Ollama running with model downloaded
- [ ] No port conflicts
- [ ] Sufficient disk space
- [ ] npm/node versions correct
- [ ] Git ready (if needed for deployment)
- [ ] Homepage loads
- [ ] Console has no errors
- [ ] API endpoint test successful
- [ ] Can see "Success: true" in API response

---

## ✅ System Status

Once all checks pass:

```
✅ Code: Ready
✅ Configuration: Ready
✅ Dependencies: Ready
✅ Database: Ready
✅ AI Engine: Ready
✅ Network: Ready
✅ Ports: Ready

🚀 System Ready for Launch!
```

---

## 🎯 Next Steps

1. **Test paraphrasing:** Paste text and verify processing
2. **Test payment:** Go through payment flow (use test card)
3. **Check database:** Verify data is being saved
4. **Read documentation:** Start with QUICK_START.md
5. **Plan deployment:** See DEPLOYMENT_GUIDE.md

---

## 📞 Need Help?

Refer to:
- **Quick issues:** QUICK_START.md → Troubleshooting
- **Setup problems:** SETUP_GUIDE.md → Troubleshooting
- **API issues:** API_REFERENCE.md
- **Testing:** TESTING_GUIDE.md
- **Deployment:** DEPLOYMENT_GUIDE.md

---

**Checklist Version:** 1.0
**Last Updated:** March 13, 2026

Once all items are checked, you're ready to launch! 🚀

