# Paraphrasing X — Complete Testing Guide

## System Requirements Check

Before testing, verify all components are running:

### 1. MongoDB Status
```bash
# Test locally
mongosh

# Should show:
# test>
# (then type "exit" to quit)
```

### 2. Ollama Status
```bash
# Test in a new terminal
curl http://localhost:11434/api/tags

# Should return JSON:
# {"models":[{"name":"llama3:latest",...}]}
```

### 3. Next.js Development Server
```bash
npm run dev

# Should output:
# ▲ Next.js 14.2.5
# ✓ Ready in X.Xs
```

---

## Test 1: API Health Check

### Test Paraphrase API

**Using curl:**
```bash
curl -X POST http://localhost:3000/api/paraphrase \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The quick brown fox jumps over the lazy dog. This is a famous pangram used in typography. It contains every letter of the English alphabet.",
    "mode": "academic"
  }'
```

**Using browser console:**
```javascript
fetch('/api/paraphrase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'The quick brown fox jumps over the lazy dog. This is a famous pangram used in typography. It contains every letter of the English alphabet.',
    mode: 'academic'
  })
})
.then(r => r.json())
.then(d => {
  console.log('Status:', d.success ? '✓ SUCCESS' : '✗ FAILED');
  console.log('SessionId:', d.sessionId);
  console.log('Paraphrased:', d.paraphrasedText);
  console.log('Stats:', d.stats);
})
.catch(e => console.error('ERROR:', e.message))
```

**Expected output:**
```json
{
  "success": true,
  "paraphrasedText": "A reddish-brown canine sprints across a dormant hound...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "stats": {
    "plagiarismBefore": 72,
    "plagiarismAfter": 14,
    "aiDetectionBefore": 85,
    "aiDetectionAfter": 9
  },
  "wordCount": 35
}
```

### Test Result API (without payment)

```javascript
fetch('/api/result?sessionId=550e8400-e29b-41d4-a716-446655440000')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Expected (should fail with 402):**
```json
{
  "error": "Payment not verified."
}
```

---

## Test 2: Payment Initialization

### Get Session ID first:

1. Paraphrase some text (see Test 1)
2. Copy the `sessionId` from response

### Initialize payment:

```javascript
const sessionId = "YOUR_SESSION_ID_FROM_ABOVE";

fetch('/api/payment/init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    sessionId: sessionId,
    amount: 500  // 500 pesewas = GHS 5
  })
})
.then(r => r.json())
.then(d => {
  console.log('Status:', d.success ? '✓ SUCCESS' : '✗ FAILED');
  console.log('Paystack URL:', d.authorizationUrl);
  console.log('Reference:', d.reference);
  // Optionally redirect:
  // window.location.href = d.authorizationUrl;
})
.catch(e => console.error('ERROR:', e.message))
```

**Expected output:**
```json
{
  "success": true,
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "1234567890"
}
```

---

## Test 3: Complete User Journey (UI)

### Step 1: Access the App
1. Open browser: http://localhost:3000
2. Verify homepage loads without errors
3. Check that UI looks correct (no broken styling)

### Step 2: Navigate to Paraphrasing Tool
1. Click "Paraphrasing Tool" in navbar (or scroll to section)
2. Verify textarea loads
3. Check that mode selector shows all 8 options:
   - 🎓 Academic
   - ⚡ Standard
   - 👔 Formal
   - 📝 Simple
   - 🌊 Flowing
   - 💬 Informal
   - ↔️ Expand
   - ↩️ Shorten

### Step 3: Paraphrase Text
1. Paste this sample text:
```
Artificial intelligence is transforming the way we work and live. Machine learning algorithms process vast amounts of data to identify patterns and make predictions. These technologies have applications in healthcare, finance, education, and many other sectors. However, there are important ethical considerations regarding privacy, bias, and job displacement that society must address.
```

2. Select **Academic** mode
3. Click **✨ Paraphrase Now**
4. Verify loading screen appears with animated steps:
   - Analyzing text structure
   - Rewriting sentences
   - Humanizing academic tone
   - Reducing plagiarism signals

### Step 4: Review Preview
1. Wait for paraphrase to complete (15-30 seconds)
2. Verify preview page loads with:
   - 4 stat cards (Plagiarism Before/After, AI Detection Before/After)
   - Blurred preview of paraphrased text
   - Lock icon indicating content is locked
   - Payment card on right side showing "GHS 5"

### Step 5: Try Payment
1. Enter email: `testuser@example.com`
2. Click **Pay GHS 5 — Unlock Now**
3. You should be redirected to Paystack test checkout
4. Use test card:
   - Number: `4111 1111 1111 1111`
   - Exp: `12/25`
   - CVV: `123`
5. On Paystack, click **Pay**
6. You should be redirected back to results page
7. Verify full result is now visible (no blur)

---

## Test 4: Performance & Stress Testing

### Test with Different Text Sizes

**Small (10 words):**
```
The quick brown fox jumps over the lazy dog today.
```

**Medium (100 words):**
Use a paragraph from a book or article.

**Large (500+ words):**
Use multiple paragraphs.

**Check:** API should return in reasonable time (30-60 sec for Ollama locally)

### Test with Different Modes

For each mode, paraphrase the same text and verify output style:

- **Academic:** Formal vocabulary, complex sentences
- **Standard:** Clear, balanced language
- **Formal:** Very formal tone
- **Simple:** Short sentences, basic words
- **Flowing:** Narrative-like, smooth transitions
- **Informal:** Conversational tone
- **Expand:** More detail, longer output
- **Shorten:** Condensed, fewer words

---

## Test 5: Error Handling

### Test 5.1: Empty Text
```javascript
fetch('/api/paraphrase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: '', mode: 'academic' })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Expected:**
```json
{
  "error": "Text is required."
}
```

### Test 5.2: Too Short Text
```javascript
fetch('/api/paraphrase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    text: 'Hello world', 
    mode: 'academic' 
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Expected:**
```json
{
  "error": "Text is too short. Please enter at least 50 characters."
}
```

### Test 5.3: Invalid Mode
```javascript
fetch('/api/paraphrase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    text: 'Your long text here...', 
    mode: 'invalid-mode' 
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Expected:** Should fall back to 'academic' mode and work normally.

### Test 5.4: Invalid Email in Payment
1. Go to preview page
2. Enter invalid email: `not-an-email`
3. Click **Pay GHS 5**
4. Should see toast error: "Please enter a valid email address."

### Test 5.5: Missing Session ID
```javascript
fetch('/api/payment/init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test@example.com',
    // missing sessionId
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Expected:**
```json
{
  "error": "Email and session ID are required."
}
```

---

## Test 6: Rate Limiting

### Test Rate Limit on Paraphrase (5 requests per minute)

```javascript
// Run this quickly 6 times
for (let i = 0; i < 6; i++) {
  fetch('/api/paraphrase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      text: 'The quick brown fox jumps over the lazy dog.', 
      mode: 'academic' 
    })
  })
  .then(r => {
    console.log(`Request ${i+1}: ${r.status}`);
    return r.json();
  })
  .then(d => console.log(d.error || d.success))
  .catch(e => console.error(e))
  
  // Small delay
  await new Promise(r => setTimeout(r, 100));
}
```

**Expected:** 
- First 5 requests: Success (200)
- 6th request: Rate limit error (429) with message "Too many requests"

---

## Test 7: Database Verification

### Check MongoDB Data

```bash
# Connect to MongoDB
mongosh

# Switch to database
use paraphrasing-x

# Check collections
show collections

# View sample documents
db.texts.findOne()
db.payments.findOne()
db.users.findOne()

# Count documents
db.texts.countDocuments()
db.payments.countDocuments()
```

**Expected:** After testing, you should see documents in texts and payments collections.

---

## Test 8: Browser Console Checks

Open browser DevTools (F12) and check:

### Console Tab
- No red errors
- Only info/warning messages
- No undefined references

### Network Tab
1. Perform paraphrase
2. Should see:
   - `POST /api/paraphrase` → 200
   - AI processing happening (network wait time)
   - Response contains paraphrasedText

3. After payment:
   - `POST /api/payment/init` → 200
   - Browser navigates to Paystack checkout

### Application Tab
- Check LocalStorage for any stored session data
- Check cookies from Paystack (after payment test)

---

## Test 9: Ollama Fallback

If Ollama is stopped or unavailable:

1. Stop Ollama service
2. Try to paraphrase text
3. System should use **fallback paraphraser** (built-in synonym replacement)
4. Result should still show in preview
5. Should NOT crash or throw error
6. Check browser console for warning: "Ollama unavailable, using built-in fallback"

---

## Checklist for Complete Testing

- [ ] MongoDB is running and accessible
- [ ] Ollama is running and model is downloaded
- [ ] Next.js dev server runs without errors
- [ ] Homepage loads correctly
- [ ] Paraphrase endpoint returns valid response
- [ ] Small, medium, and large texts all process
- [ ] All 8 modes produce different outputs
- [ ] Preview page shows blurred content
- [ ] Payment initialization works
- [ ] Payment redirect to Paystack works
- [ ] Invalid inputs show appropriate errors
- [ ] Rate limiting works
- [ ] Database stores records correctly
- [ ] Browser console has no errors
- [ ] Ollama fallback works if main unavailable
- [ ] All UI styling is intact (no broken CSS)

---

## Performance Benchmarks

### Expected Response Times (on local machine)

| Operation | Time | Notes |
|-----------|------|-------|
| Paraphrase 100 words | 8-15 sec | First Ollama request slower |
| Paraphrase 500 words | 25-45 sec | Split into chunks |
| Payment API init | <1 sec | Fast, no AI |
| Result fetch | <0.5 sec | Just DB lookup |
| Fallback paraphrase | 0.1 sec | No AI needed |

---

## Debugging Common Issues

### Issue: Paraphrase returns fallback (not Ollama)

**Check:**
1. Is Ollama running? `curl http://localhost:11434/api/tags`
2. Is model downloaded? `ollama list`
3. Check `.env.local` for correct `OLLAMA_URL` and `OLLAMA_MODEL`

**Fix:**
```bash
# Restart Ollama
ollama serve

# In another terminal, verify model exists
ollama list

# If not, download it
ollama pull llama3
```

### Issue: Payment page doesn't redirect to Paystack

**Check browser network tab:**
1. Does `/api/payment/init` return authorizationUrl?
2. Is the URL valid (starts with `https://checkout.paystack.com`)?
3. Check browser console for any JavaScript errors

**Fix:**
1. Verify `PAYSTACK_SECRET_KEY` in `.env.local`
2. Verify it matches your actual Paystack key
3. Restart dev server: `npm run dev`

### Issue: MongoDB connection error

**In browser devtools Network tab:**
- Check response from `/api/paraphrase`
- Look for error mentioning MongoDB

**Fix:**
```bash
# Check if MongoDB is running
mongosh

# If not, start it
# Windows: net start MongoDB
# macOS: brew services start mongodb-community

# Verify connection string in .env.local
cat .env.local | grep MONGODB_URI
```

---

## Test Data Samples

Use these texts for testing:

### Academic Text
```
Artificial intelligence and machine learning represent transformative technologies that are reshaping various sectors of the global economy. These sophisticated computational systems leverage vast datasets to identify intricate patterns and generate predictive models. The applications span diverse domains including healthcare diagnostics, financial forecasting, educational personalization, and scientific research. Nonetheless, paramount concerns regarding data privacy, algorithmic bias, workforce displacement, and ethical governance require urgent attention from policymakers and technologists.
```

### Simple Text
```
Cats are popular pets. They are independent animals. Cats like to play with toys. They sleep a lot. Some cats are very friendly and they like attention from people. Other cats prefer to be alone. Cats eat meat because they are carnivores.
```

### Technical Text
```
The OAuth 2.0 authorization protocol provides a standardized mechanism for delegated authentication and authorization. It enables resource owners to grant third-party applications limited access to protected resources without compromising credential security. The protocol utilizes bearer tokens, refresh tokens, and secure HTTPS channels to establish trust between clients, authorization servers, and resource servers. Implementation requires careful consideration of token expiration policies, scope validation, and CSRF protection measures.
```

---

## Final Verification

Once all tests pass:

1. ✅ System is production-ready
2. ✅ All endpoints functional
3. ✅ AI integration working
4. ✅ Payment flow complete
5. ✅ Error handling robust
6. ✅ Performance acceptable
7. ✅ UI/UX intact

You can now deploy to production or share with users for beta testing.

