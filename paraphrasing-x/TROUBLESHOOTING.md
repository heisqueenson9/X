# 🔧 TROUBLESHOOTING GUIDE

**Last Updated**: March 14, 2026  
**Platform**: Windows (PowerShell)

---

## 🚨 CRITICAL ISSUES

### Issue #1: "Cannot find module" errors

**Symptoms**:
```
Error: Cannot find module 'mongoose'
Error: Cannot find module 'next'
```

**Causes**:
- Dependencies not installed
- node_modules corrupted
- npm cache issues

**Solutions**:

```powershell
# Solution 1: Clean install
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install

# Solution 2: Clear npm cache
npm cache clean --force
npm install

# Solution 3: Use npm ci (cleaner install)
npm ci
```

---

### Issue #2: Port already in use

**Symptoms**:
```
Error: listen EADDRINUSE: address already in use :::3002
```

**Causes**:
- Old Next.js process still running
- Another app using port 3002
- Stale process from previous session

**Solutions**:

```powershell
# Find process using port 3002
Get-NetTCPConnection -State Listen | Where-Object {$_.LocalPort -eq 3002}

# Kill the process (replace <PID> with actual process ID)
Stop-Process -Id <PID> -Force

# Or kill all node processes
Get-Process node | Stop-Process -Force

# Try a different port
npm run dev -- -p 3003
```

---

### Issue #3: Hot reload not working

**Symptoms**:
- Changes to code don't appear in browser
- CSS changes not reflecting
- API routes returning old code

**Causes**:
- Build cache not cleared
- Next.js not watching files
- Browser cache issues

**Solutions**:

```powershell
# Clear Next.js cache
Remove-Item .next -Recurse -Force
Remove-Item out -Recurse -Force

# Restart dev server
npm run dev

# Clear browser cache (Ctrl + Shift + Delete in browser)
# Then refresh page (Ctrl + F5)

# If using turbo build, clear turbo cache
Remove-Item .turbo -Recurse -Force
```

---

### Issue #4: MongoDB connection errors

**Symptoms**:
```
MongooseError: Cannot connect to MongoDB
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Causes**:
- MongoDB not installed
- MongoDB service not running
- Wrong connection URI
- Port 27017 in use by another process

**Solutions**:

```powershell
# Check if MongoDB is installed
Get-Command mongod -ErrorAction SilentlyContinue

# Start MongoDB
mongod

# If MongoDB service is installed, start it
Start-Service MongoDB -ErrorAction SilentlyContinue

# Verify MongoDB is running
Get-Process mongod

# Check if port 27017 is in use
Get-NetTCPConnection -State Listen | Where-Object {$_.LocalPort -eq 27017}

# Test connection with mongosh
mongosh mongodb://localhost:27017/paraphrasing-x

# If connection still fails, check in MongoDB docs for Windows setup
```

---

### Issue #5: API key errors

**Symptoms**:
```
Error: HUGGINGFACE_API_KEY not configured
Error: PAYSTACK_SECRET_KEY not configured
```

**Causes**:
- Missing `.env.local` file
- API keys not filled in
- Incorrect environment variable names
- .env.local not being read

**Solutions**:

```powershell
# 1. Check if .env.local exists
Test-Path .env.local

# 2. View contents
Get-Content .env.local

# 3. Verify required keys are present
$env = Get-Content .env.local -Raw
$env | Select-String "PAYSTACK_SECRET_KEY"
$env | Select-String "HUGGINGFACE_API_KEY"

# 4. Make sure they're not empty
# Edit .env.local in VS Code or notepad
notepad .env.local

# 5. Restart dev server after changing .env.local
# (Next.js reads .env.local at startup)
npm run dev
```

---

### Issue #6: Payment initialization fails

**Symptoms**:
```
Error: Payment initialization failed
Error: Paystack initialization failed
```

**Causes**:
- Invalid Paystack API key
- Paystack account in test mode not active
- Network/firewall blocking Paystack API
- Amount is 0 or negative

**Solutions**:

```powershell
# 1. Verify Paystack credentials
$env:PAYSTACK_SECRET_KEY
# Should output: sk_test_xxxx... (not empty)

# 2. Get correct test keys from Paystack
# Go to: https://paystack.com/account/settings/developer
# Copy Secret Key (starts with sk_test_)
# Update in .env.local

# 3. Verify amount is correct
# GHS 11 = 1100 pesewas (100 pesewas = 1 GHS)

# 4. Test with curl
curl -X POST "https://api.paystack.co/transaction/initialize" `
  -H "Authorization: Bearer sk_test_YOUR_KEY" `
  -H "Content-Type: application/json" `
  -Body @{
    email="test@example.com"
    amount=1100
    currency="GHS"
  } | ConvertTo-Json
```

---

### Issue #7: Hugging Face API errors

**Symptoms**:
```
Error: HuggingFace API error: 429
Error: Model not found or private
Error: API token invalid
```

**Causes**:
- Invalid Hugging Face API key
- Free tier rate limit exceeded (100 req/day)
- Model temporarily unavailable
- Network timeout

**Solutions**:

```powershell
# 1. Verify API key
$env:HUGGINGFACE_API_KEY
# Should output: hf_xxxx... (not empty)

# 2. Get correct free API key
# Go to: https://huggingface.co/settings/tokens
# Create new token with 'read' access
# Update in .env.local

# 3. Check free tier limits
# Free tier: 100 requests/day
# Wait 24 hours if rate limited

# 4. System will auto-fallback to built-in models
# If Hugging Face is unavailable, fallback paraphrasers activate
# This is NORMAL behavior

# 5. Test API key with curl
curl -X POST "https://api-inference.huggingface.co/models/google/flan-t5-large" `
  -H "Authorization: Bearer hf_YOUR_KEY" `
  -H "Content-Type: application/json" `
  -Body @{
    inputs="Rewrite this sentence in academic style"
  } | ConvertTo-Json
```

---

## ⚠️ COMMON CONFIGURATION ISSUES

### Issue: NEXT_PUBLIC_BASE_URL mismatch

**Problem**: 
- Frontend expects one URL, backend/payment redirects to another
- Payment callbacks redirect to wrong port

**Solution**:
```powershell
# In .env.local, ensure base URL matches your dev port
NEXT_PUBLIC_BASE_URL=http://localhost:3002

# NOT:
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

### Issue: Localhost vs 127.0.0.1

**Problem**:
- Some services only respond to 127.0.0.1
- CORS errors with localhost

**Solution**:
```powershell
# Use localhost consistently in .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3002  # ✓ Correct
MONGODB_URI=mongodb://localhost:27017/paraphrasing-x  # ✓ Correct

# NOT:
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3002  # ✗ Avoid mixing
```

---

### Issue: Large text causes timeout

**Problem**:
- Requests with 100K+ characters timeout
- Text processing takes too long

**Solution**:
```typescript
// The system handles this automatically:
// • Splits text into 800-word chunks
// • Processes chunks in sequence
// • Merges results back together
// Maximum supported: 500KB per request

// If still timing out, increase timeout in API routes:
signal: AbortSignal.timeout(120000) // 120 seconds instead of 60
```

---

## 🧪 DEBUGGING TECHNIQUES

### Enable Verbose Logging

```powershell
# In terminal, before running npm run dev
$env:DEBUG = "next:*"
npm run dev
```

### Check Network Requests

```powershell
# Use curl to test endpoints
curl -X POST http://localhost:3002/api/paraphrase `
  -H "Content-Type: application/json" `
  -Body @{
    text="Your text here"
    mode="academic"
  } | ConvertTo-Json
```

### Monitor Port Usage

```powershell
# Check all listening ports
Get-NetTCPConnection -State Listen | Select-Object LocalPort, State

# Check specific ports
$ports = @(3002, 3000, 4000, 27017)
foreach ($port in $ports) {
    $conn = Get-NetTCPConnection -State Listen | Where-Object {$_.LocalPort -eq $port}
    if ($conn) {
        Write-Host "Port $port: IN USE (PID: $($conn.OwningProcess))"
    } else {
        Write-Host "Port $port: FREE"
    }
}
```

### Check System Resources

```powershell
# Monitor CPU and memory
Get-Process node | Select-Object -Property Name, CPU, Memory, @{Name='MemoryMB'; Expression={$_.Memory / 1MB -as [int]}}

# Kill high-memory processes
Get-Process node | Where-Object {$_.Memory -gt 500MB} | Stop-Process -Force
```

---

## ✅ DIAGNOSTIC CHECKLIST

Run through this when experiencing issues:

```powershell
# ╔═══════════════════════════════════════════════════════════════╗
# ║           PARAPHRASING X - DIAGNOSTIC CHECKLIST              ║
# ╚═══════════════════════════════════════════════════════════════╝

Write-Host "`n1. Node.js & npm" -ForegroundColor Cyan
node --version
npm --version

Write-Host "`n2. Dependencies installed" -ForegroundColor Cyan
Test-Path node_modules

Write-Host "`n3. Environment configured" -ForegroundColor Cyan
Test-Path .env.local
Get-Content .env.local | Measure-Object -Line

Write-Host "`n4. Ports available" -ForegroundColor Cyan
$ports = @(3002, 3000, 4000, 27017)
foreach ($port in $ports) {
    Try {
        $connection = Get-NetTCPConnection -State Listen | Where-Object {$_.LocalPort -eq $port}
        if ($connection) {
            Write-Host "Port $port: IN USE" -ForegroundColor Red
        } else {
            Write-Host "Port $port: FREE" -ForegroundColor Green
        }
    } Catch {
        Write-Host "Port $port: Check failed" -ForegroundColor Yellow
    }
}

Write-Host "`n5. MongoDB status" -ForegroundColor Cyan
Try {
    $mongo = Get-Process mongod
    Write-Host "MongoDB: RUNNING" -ForegroundColor Green
} Catch {
    Write-Host "MongoDB: NOT RUNNING" -ForegroundColor Red
}

Write-Host "`n6. File permissions" -ForegroundColor Cyan
(Get-Item .env.local).Attributes
(Get-Item package.json).Attributes

Write-Host "`nDiagnostic check complete!`n" -ForegroundColor Cyan
```

---

## 🆘 GETTING MORE HELP

### Check Logs

```powershell
# Next.js dev server logs
npm run dev 2>&1 | Tee-Object -FilePath dev-logs.txt

# Backend server logs
node backend/server.js 2>&1 | Tee-Object -FilePath backend-logs.txt
```

### Browser Console Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Copy and search the error message

### MongoDB Logs

```powershell
# Check MongoDB logs
Get-Content "C:\Program Files\MongoDB\Server\5.0\log\mongod.log" -Tail 50
```

### Check with Postman

1. Download Postman (https://www.postman.com)
2. Create new request
3. Test endpoints manually:
   ```
   POST http://localhost:3002/api/paraphrase
   Headers: Content-Type: application/json
   Body: { "text": "...", "mode": "academic" }
   ```

---

## 📞 COMMON ERROR MESSAGES EXPLAINED

| Error | Meaning | Solution |
|-------|---------|----------|
| `EADDRINUSE` | Port already in use | Kill other process or use different port |
| `ECONNREFUSED` | Cannot connect to service | Start MongoDB/backend or check URL |
| `ENOTFOUND` | DNS/hostname not found | Check MongoDB URI spelling |
| `401 Unauthorized` | API key invalid | Update .env.local with correct keys |
| `429 Too Many Requests` | Rate limited | Wait 60 seconds before retrying |
| `500 Internal Server Error` | Server crashed | Check logs and .env.local config |
| `Cannot connect to MongoDB` | DB connection failed | Ensure MongoDB is running |
| `CORS error` | Cross-origin request blocked | Check NEXT_PUBLIC_BASE_URL |

---

## 🎯 QUICK FIX COMMANDS

```powershell
# Nuclear option - Complete reset
Remove-Item node_modules, .next, out, .turbo -Recurse -Force -ErrorAction SilentlyContinue
npm cache clean --force
npm install
npm run dev

# Clear just build cache
Remove-Item .next -Recurse -Force
npm run dev

# Kill all node processes
Get-Process node | Stop-Process -Force -ErrorAction SilentlyContinue

# Restart MongoDB
Stop-Service MongoDB -ErrorAction SilentlyContinue
Start-Service MongoDB

# Test single endpoint
curl -X POST http://localhost:3002/api/paraphrase -H "Content-Type: application/json" -Body @{text="test";mode="academic"} | ConvertTo-Json -Depth 10
```

---

**For additional help, check**: 
- MASTER_REPAIR_GUIDE.md
- API_REFERENCE.md (if exists)
- Backend logs: `npm run dev` output
