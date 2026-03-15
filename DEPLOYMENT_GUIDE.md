# Paraphrasing X — Production Deployment Guide

This guide covers deploying Paraphrasing X to production across all components.

---

## Overview

### Deployment Architecture

```
Production Stack:
├── Frontend: Vercel (Next.js)
├── Backend: Optional (Render, Railway, Fly.io)
├── Database: MongoDB Atlas
├── AI: GPU Server or Cloud API
└── Payments: Paystack (Production Keys)
```

---

## Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] No console errors in dev
- [ ] Environment variables configured
- [ ] Paystack live keys ready
- [ ] MongoDB Atlas cluster created
- [ ] Domain registered
- [ ] SSL certificate ready

---

## Part 1: Database (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project
4. Click "Create" → Select "Free Tier"
5. Choose region (closest to users)
6. Create cluster

### 1.2 Create Database User

1. Go to **Database Access**
2. Click **Add New Database User**
3. Enter:
   - Username: `paraphrasingx`
   - Password: Generate secure password
   - Role: `Atlas Admin`
4. Click **Add User**

### 1.3 Configure Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. For development: Add your IP
4. For production: Click **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Confirm**

### 1.4 Get Connection String

1. Click **Databases**
2. Click **Connect** on your cluster
3. Choose **Drivers**
4. Copy connection string
5. Replace `<username>` and `<password>` with actual credentials
6. Copy final string

**Example:**
```
mongodb+srv://paraphrasingx:password123@cluster0.mongodb.net/paraphrasing-x?retryWrites=true&w=majority
```

### 1.5 Create Collections (Optional)

Atlas auto-creates collections, but you can pre-create indexes:

```javascript
// Connect with mongosh
mongosh "your-connection-string"

// Create indexes for faster queries
use paraphrasing-x

db.texts.createIndex({ sessionId: 1 }, { unique: true })
db.texts.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 })
db.payments.createIndex({ sessionId: 1 })
db.payments.createIndex({ email: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
```

---

## Part 2: Frontend (Vercel)

### 2.1 Prepare Repository

```bash
# Initialize git if not already
git init
git add .
git commit -m "Initial commit"

# Add to GitHub
git remote add origin https://github.com/your-username/paraphrasing-x
git push -u origin main
```

### 2.2 Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Click **Import**

### 2.3 Configure Environment Variables

In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add variables:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net/paraphrasing-x
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
NEXT_PUBLIC_BASE_URL=https://yourapp.vercel.app
OLLAMA_URL=https://your-ollama-server.com
OLLAMA_MODEL=llama3
NODE_ENV=production
```

### 2.4 Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Visit your URL (e.g., `https://paraphrasing-x.vercel.app`)
4. Test homepage loads

### 2.5 Custom Domain

1. Go to **Settings** → **Domains**
2. Click **Add**
3. Enter your domain (e.g., `paraphrase-x.com`)
4. Follow DNS setup instructions
5. Wait for DNS propagation (can take minutes to hours)

---

## Part 3: AI Engine (Ollama)

### Option 1: Self-Hosted GPU Server

#### Prerequisites
- GPU server (NVIDIA GPU recommended for Llama)
- Linux OS
- SSH access

#### Setup

```bash
# SSH into server
ssh user@your-server-ip

# Install Ollama
curl https://ollama.ai/install.sh | sh

# Download model
ollama pull llama3

# Start with network access
ollama serve --addr 0.0.0.0:11434

# Keep running (use screen/tmux)
screen -dm bash -c 'ollama serve --addr 0.0.0.0:11434'
```

#### Firewall Configuration
```bash
# Allow Ollama port
sudo ufw allow 11434/tcp
sudo ufw allow 11434/udp
```

#### Test Access
```bash
curl https://your-server-ip:11434/api/tags
```

---

### Option 2: Cloud AI API

#### Using Together.ai

1. Go to [Together.ai](https://www.together.ai)
2. Sign up and get API key
3. Modify paraphrase endpoint to use their API:

```typescript
// In src/app/api/paraphrase/route.ts
const response = await fetch('https://api.together.xyz/inference', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'meta-llama/Llama-2-7b-chat-hf',
    prompt: prompt,
    max_tokens: 2048,
    temperature: 0.7,
  }),
});
```

#### Using Replicate

1. Go to [Replicate](https://replicate.com)
2. Get API token
3. Use their SDK:

```bash
npm install replicate
```

```typescript
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const output = await replicate.run(
  "meta/llama-2-7b-chat:13c3cdee13ee3fd3cb9002081b2f7ef257bda18c9280c83ff7f737f3ff5ee186_anthropic_02-05-hybrid-cloud",
  { input: { prompt } }
);
```

---

## Part 4: Payments (Paystack)

### 4.1 Get Live Keys

1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Go to **Settings** → **Developers**
3. Switch to **Live Keys** (not Test Keys)
4. Copy:
   - Secret Key → `PAYSTACK_SECRET_KEY`
   - Public Key → `PAYSTACK_PUBLIC_KEY`

### 4.2 Configure Webhook

1. Go to **Settings** → **API Keys & Webhooks**
2. Find **Webhook URL**
3. Enter: `https://your-app.com/api/payment/verify`
4. Save

### 4.3 Enable Payment Methods

1. Go to **Settings** → **Business Settings**
2. Enable:
   - Mobile Money (Orange, Vodafone, Airteltigo)
   - Card payments
   - Bank transfers
3. Verify your business details

### 4.4 Test Payment (Before Going Live)

1. Use test card: `4111 1111 1111 1111`
2. Any future expiry date
3. Any 3-digit CVV

---

## Part 5: Environment Variables Summary

### Production .env.local

```env
# ============ DATABASE ============
MONGODB_URI=mongodb+srv://paraphrasingx:password@cluster.mongodb.net/paraphrasing-x

# ============ PAYMENTS ============
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx

# ============ BASE URLs ============
NEXT_PUBLIC_BASE_URL=https://paraphrase-x.com
BACKEND_PORT=4000

# ============ AI ENGINE ============
OLLAMA_URL=https://your-gpu-server.com:11434
OLLAMA_MODEL=llama3

# ============ NODE ============
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key
```

---

## Part 6: Testing Production

### 6.1 Smoke Test

1. Visit https://your-domain.com
2. Verify:
   - [ ] Homepage loads
   - [ ] No broken images
   - [ ] Navigation works
   - [ ] Styling is intact

### 6.2 API Test

```bash
curl -X POST https://your-domain.com/api/paraphrase \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test text for paraphrasing in production environment",
    "mode": "academic"
  }'
```

### 6.3 Payment Test (Use Test Card)

1. Go to preview page
2. Try to pay with test card
3. Verify Paystack redirects correctly
4. Confirm payment webhook fires

### 6.4 Monitor Logs

**Vercel:**
- Go to **Deployments** → **View Logs**

**MongoDB:**
- Go to **Monitoring** → **Query Performance**

**Ollama:**
```bash
ssh your-server
tail -f ollama.log
```

---

## Part 7: Performance Optimization

### Database Optimization

```javascript
// Create indexes
db.texts.createIndex({ sessionId: 1 })
db.texts.createIndex({ createdAt: 1 })
db.payments.createIndex({ sessionId: 1 })
```

### AI Optimization

For faster inference:
1. Use smaller model: `mistral` instead of `llama3`
2. Increase GPU memory allocation
3. Use model quantization if available

### Frontend Optimization

Already included:
- ✅ Next.js Optimization
- ✅ Image Optimization
- ✅ CSS Minification
- ✅ Code Splitting

---

## Part 8: Monitoring & Maintenance

### Monitoring Setup

**Vercel Analytics:**
1. https://vercel.com/dashboard → Select project
2. **Analytics** tab
3. Monitor:
   - Page load times
   - Error rates
   - Traffic patterns

**MongoDB Monitoring:**
1. Atlas Dashboard → **Monitoring**
2. Check:
   - Database size
   - Connection count
   - Query performance

**Error Tracking (Optional):**
- Sentry: https://sentry.io
- LogRocket: https://logrocket.com

### Maintenance Tasks

**Weekly:**
- Check error logs
- Review database size
- Monitor Ollama uptime

**Monthly:**
- Update dependencies: `npm update`
- Backup MongoDB (Atlas does this automatically)
- Review costs

**Quarterly:**
- Analyze user data
- Optimize performance
- Plan features

---

## Part 9: Scaling

### When to Scale

**Database:**
- After 1M documents
- Implement sharding strategy
- Consider write clustering

**AI:**
- When response times exceed 60 seconds
- Deploy multiple Ollama instances
- Use load balancer (NGINX)

**Frontend:**
- Monitor Vercel analytics
- Enable Edge Caching
- Add CDN (Cloudflare)

---

## Part 10: Security Hardening

### API Security

Add rate limiting middleware:
```typescript
// Advanced rate limiting
import RedisStore from "rate-limit-redis";
import redis from "redis";

const redisClient = redis.createClient({
  host: "your-redis-server",
  port: 6379,
});

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "rate-limit:",
  }),
  windowMs: 60 * 1000,
  max: 5,
});

app.use(limiter);
```

### HTTPS Setup

- Vercel: ✅ Automatic SSL
- Custom domain: ✅ Free with Let's Encrypt

### API Key Management

```env
# Never commit production keys!
# Use Vercel Secrets Manager for sensitive data
```

---

## Part 11: Disaster Recovery

### Backup Strategy

**MongoDB:**
- ✅ Atlas automatic backups (included)
- Manual backup: `mongodump` command

**Code:**
- ✅ GitHub repository is version control
- Use branches for features

**Environment Variables:**
- Store in Vercel Secrets
- Never commit to git

### Recovery Procedures

**Database Corruption:**
```bash
mongosh
use paraphrasing-x
db.textsrepairDatabase()
```

**Code Rollback:**
```bash
git revert HEAD
git push
# Vercel auto-deploys
```

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access configured
- [ ] Code pushed to GitHub
- [ ] Project created in Vercel
- [ ] Environment variables added to Vercel
- [ ] Frontend deployed successfully
- [ ] Ollama server running (or cloud AI configured)
- [ ] Paystack live keys configured
- [ ] Webhook URL configured
- [ ] Domain DNS pointing to Vercel
- [ ] HTTPS SSL certificate active
- [ ] Smoke tests passing
- [ ] Payment test successful
- [ ] Monitoring configured
- [ ] Backup strategy verified

---

## Troubleshooting Deployment

### Build Fails

```bash
# Clear cache and rebuild
vercel --prod --force
```

### Database Connection Error

1. Check connection string in Vercel
2. Verify MongoDB Atlas network access
3. Test locally first: `mongosh "connection-string"`

### Payment Redirect Issue

1. Verify webhook URL in Paystack
2. Check firewall isn't blocking requests
3. Monitor CORS settings

### AI Endpoint Timeout

1. Verify Ollama/API is running
2. Check network connectivity
3. Monitor GPU memory usage
4. Increase timeout: `fetch(..., { signal: AbortSignal.timeout(180000) })`

---

## Post-Deployment

### Monitor First Week

- Check error logs hourly
- Monitor database growth
- Verify payment processing
- Track user feedback

### Launch Announcement

- Blog post
- Social media
- Email newsletter
- Product Hunt (optional)

### Iterate Based on Feedback

- Fix bugs
- Implement feature requests
- Optimize performance
- Monitor costs

---

## Support

Need help?
- Check Vercel docs: https://vercel.com/docs
- MongoDB support: https://support.mongodb.com
- Paystack help: https://paystack.com/support
- Ollama issues: https://github.com/ollama/ollama/issues

---

**Deployment Guide Version:** 1.0.0
**Last Updated:** March 2026

