# 📱 TELECEL CASH PAYMENT SYSTEM - IMPLEMENTATION GUIDE

**Date**: March 14, 2026  
**Status**: ✅ FULLY IMPLEMENTED  
**Payment Method**: Telecel Cash (Manual Screenshot Verification)

---

## 🎯 OVERVIEW

The Paraphrasing X platform now uses a **manual Mobile Money payment system** instead of Paystack. Users must:

1. **Send GHS 11** to **0202979378** via **Telecel Cash**
2. **Upload a screenshot** of the successful transaction
3. **Wait for admin approval** to unlock their results

---

## 🏗️ SYSTEM ARCHITECTURE

```
User pays via Telecel Cash
    ↓
Uploads payment screenshot
    ↓
Screenshot saved to /public/uploads/payments/
    ↓
Payment record created in MongoDB
    ↓
Admin reviews screenshot
    ↓
Admin approves/rejects payment
    ↓
User gets access to full results
```

---

## 📊 DATABASE SCHEMA

### Payment Model (MongoDB)

```typescript
{
  _id: ObjectId,
  textId: string,                    // Reference to Text document
  screenshotPath: string,             // Path to uploaded screenshot
  paymentStatus: 'pending' | 'approved' | 'rejected',
  amount: number,                     // 11 (GHS 11)
  network: string,                    // "Telecel Cash"
  paymentNumber: string,              // "0202979378"
  paymentName: string,                // "Paraphrasing X"
  createdAt: Date,                    // Timestamp
  approvedAt?: Date,                  // When approved
  approvedBy?: string,                // Admin identifier
  rejectionReason?: string,           // If rejected
}
```

---

## 🔌 API ENDPOINTS

### 1. Upload Payment Screenshot

**Endpoint**: `POST /api/payment/upload`

**Request** (FormData):
```
Content-Type: multipart/form-data

Fields:
  screenshot: File (image/jpeg, image/png)
  textId: string (sessionId from paraphrase)
```

**Response** (Success):
```json
{
  "success": true,
  "paymentId": "507f1f77bcf86cd799439011",
  "screenshotPath": "/uploads/payments/payment_uuid_timestamp.jpg",
  "status": "pending",
  "message": "Payment screenshot uploaded successfully. Awaiting admin verification."
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid input/file
- `404`: Text not found
- `429`: Rate limited
- `500`: Server error

**Validation Rules**:
- File type: JPG, JPEG, PNG only
- File size: Maximum 5MB
- Rate limit: 5 uploads per minute per IP

---

### 2. Get Payment Status

**Endpoint**: `GET /api/payment/status/:paymentId`

**Response**:
```json
{
  "success": true,
  "paymentId": "507f1f77bcf86cd799439011",
  "textId": "abc123...",
  "paymentStatus": "pending",
  "screenshotPath": "/uploads/payments/...",
  "amount": 11,
  "network": "Telecel Cash",
  "paymentNumber": "0202979378",
  "paymentName": "Paraphrasing X",
  "createdAt": "2026-03-14T10:30:00Z",
  "approvedAt": null,
  "approvedBy": null,
  "rejectionReason": null
}
```

---

### 3. Admin Approve/Reject Payment

**Endpoint**: `POST /api/payment/approve`

**Headers**:
```
x-admin-key: <ADMIN_SECRET_KEY>
Content-Type: application/json
```

**Request** (Approve):
```json
{
  "paymentId": "507f1f77bcf86cd799439011",
  "action": "approve"
}
```

**Request** (Reject):
```json
{
  "paymentId": "507f1f77bcf86cd799439011",
  "action": "reject",
  "rejectionReason": "Transaction amount doesn't match"
}
```

**Response**:
```json
{
  "success": true,
  "paymentId": "507f1f77bcf86cd799439011",
  "paymentStatus": "approved",
  "message": "Payment approved successfully.",
  "approvedAt": "2026-03-14T10:35:00Z"
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `401`: Unauthorized (invalid admin key)
- `404`: Payment not found
- `500`: Server error

---

### 4. Admin: Get All Payments

**Endpoint**: `GET /api/admin/payments`

**Headers**:
```
x-admin-key: <ADMIN_SECRET_KEY>
```

**Response**:
```json
{
  "success": true,
  "total": 25,
  "pending": 5,
  "approved": 18,
  "rejected": 2,
  "payments": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "textId": "abc123...",
      "screenshotPath": "/uploads/payments/...",
      "paymentStatus": "pending",
      "amount": 11,
      "network": "Telecel Cash",
      "paymentNumber": "0202979378",
      "paymentName": "Paraphrasing X",
      "createdAt": "2026-03-14T10:30:00Z"
    },
    ...
  ]
}
```

---

## 🛠️ BACKEND CODE FILES

### 1. Payment Model (`src/models/Payment.ts`)
✅ Created - Handles MongoDB schema for payments

### 2. Upload Endpoint (`src/app/api/payment/upload/route.ts`)
✅ Created - Handles file upload and validation

### 3. Status Endpoint (`src/app/api/payment/status/[id]/route.ts`)
✅ Created - Returns payment status

### 4. Admin Approval (`src/app/api/payment/approve/route.ts`)
✅ Created - Admin approves/rejects payments

### 5. Admin Payments List (`src/app/api/admin/payments/route.ts`)
✅ Created - Lists all payments for admin

---

## 🎨 FRONTEND CHANGES

### Updated Components

#### `src/components/ResultsPreview.tsx`
✅ Modified to show:
- Blurred text preview
- Telecel Cash payment instructions
- Payment screenshot upload field
- Payment status (pending/approved)

**Key changes**:
- Removed Paystack integration
- Added file upload handler
- Added payment status polling
- Shows instruction card with payment details:
  - Payment Number: 0202979378
  - Network: Telecel Cash
  - Name: Paraphrasing X

#### `src/app/admin/page.tsx`
✅ Created - Admin dashboard with:
- Authentication (admin key login)
- View pending payments
- Download screenshots
- Approve/reject with reason
- View payment history

---

## 🚀 INSTALLATION & SETUP

### Step 1: Install Dependencies
```powershell
cd c:\Users\USER\Downloads\page_content\paraphrasing-x
npm install
```

### Step 2: Update Environment Variables
Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/paraphrasing-x
NEXT_PUBLIC_BASE_URL=http://localhost:3002
ADMIN_SECRET_KEY=your_secure_admin_key
NEXT_PUBLIC_ADMIN_KEY=your_secure_admin_key
```

### Step 3: Create Uploads Directory
```powershell
New-Item -Path "public/uploads/payments" -ItemType Directory -Force
```

### Step 4: Start Services
```powershell
# Start MongoDB
mongod

# In another PowerShell window, start Next.js dev server
npm run dev
```

### Step 5: Access Admin Dashboard
```
http://localhost:3002/admin
```

Login with your admin key.

---

## 🧪 TESTING THE PAYMENT FLOW

### Manual Test: Payment Upload & Approval

#### Part 1: User Payment Upload

```powershell
# 1. Start the dev server
npm run dev

# 2. Open browser
Start-Process "http://localhost:3002"

# 3. Complete AI task (paraphrase, humanize, etc.)

# 4. On preview page, you'll see:
#    - Blurred text
#    - Telecel Cash payment instructions
#    - Screenshot upload field

# 5. To test, create a dummy payment screenshot
# You can use any JPG/PNG image and upload it

# 6. After upload, you'll see "Payment Pending"
```

#### Part 2: Admin Approval

```powershell
# 1. Open browser to admin panel
Start-Process "http://localhost:3002/admin"

# 2. Enter admin key (from .env.local)

# 3. Click "View Screenshot"

# 4. Click "Approve" to unlock user's results

# 5. The user's payment status changes to "approved"
```

---

## 🧪 API TESTING WITH CURL

### Test 1: Upload Payment Screenshot

```powershell
# Create a test image file (or use existing)
$imagePath = "C:\path\to\test-image.jpg"
$textId = "test-session-id-123"

# Upload payment
curl -X POST http://localhost:3002/api/payment/upload `
  -H "Content-Type: multipart/form-data" `
  -F "screenshot=@$imagePath" `
  -F "textId=$textId"

# Expected response:
# {
#   "success": true,
#   "paymentId": "...",
#   "screenshotPath": "/uploads/payments/...",
#   "status": "pending"
# }
```

### Test 2: Get Payment Status

```powershell
$paymentId = "507f1f77bcf86cd799439011"

curl -X GET "http://localhost:3002/api/payment/status/$paymentId"

# Expected response:
# {
#   "success": true,
#   "paymentId": "...",
#   "paymentStatus": "pending",
#   "amount": 11,
#   "network": "Telecel Cash",
#   ...
# }
```

### Test 3: Admin Approve Payment

```powershell
$adminKey = "your_admin_key"
$paymentId = "507f1f77bcf86cd799439011"

$body = @{
    paymentId = $paymentId
    action = "approve"
} | ConvertTo-Json

curl -X POST http://localhost:3002/api/payment/approve `
  -H "Content-Type: application/json" `
  -H "x-admin-key: $adminKey" `
  -Body $body

# Expected response:
# {
#   "success": true,
#   "paymentStatus": "approved",
#   "message": "Payment approved successfully."
# }
```

### Test 4: Admin Reject Payment

```powershell
$body = @{
    paymentId = "507f1f77bcf86cd799439011"
    action = "reject"
    rejectionReason = "Screenshot unclear, please resend"
} | ConvertTo-Json

curl -X POST http://localhost:3002/api/payment/approve `
  -H "Content-Type: application/json" `
  -H "x-admin-key: $adminKey" `
  -Body $body
```

### Test 5: Get All Payments (Admin)

```powershell
curl -X GET http://localhost:3002/api/admin/payments `
  -H "x-admin-key: $adminKey"

# Returns list of all payments with statistics
```

---

## 📁 FILE STRUCTURE

```
paraphrasing-x/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── payment/
│   │   │   │   ├── upload/
│   │   │   │   │   └── route.ts              ✅ NEW
│   │   │   │   ├── status/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts          ✅ NEW
│   │   │   │   ├── approve/
│   │   │   │   │   └── route.ts              ✅ NEW
│   │   │   │   └── (old Paystack files removed)
│   │   │   └── admin/
│   │   │       └── payments/
│   │   │           └── route.ts              ✅ NEW
│   │   ├── admin/
│   │   │   └── page.tsx                      ✅ NEW (Admin Dashboard)
│   │   └── page.tsx                          (unchanged)
│   ├── components/
│   │   └── ResultsPreview.tsx                ✅ MODIFIED (Payment UI)
│   └── models/
│       └── Payment.ts                        ✅ MODIFIED
├── public/
│   └── uploads/
│       └── payments/                         ✅ NEW (Store screenshots)
├── .env.local                                ✅ MODIFIED
└── ...
```

---

## 🔐 SECURITY FEATURES

✅ **File Upload Validation**
  - File type: JPG/JPEG/PNG only
  - File size: Max 5MB
  - Unique filenames with timestamps

✅ **Admin Authentication**
  - Admin key verification on all admin endpoints
  - Secure header transmission

✅ **Input Sanitization**
  - Rejection reasons validated
  - IDs validated against MongoDB

✅ **Rate Limiting**
  - 5 uploads per minute per IP
  - Prevents abuse

✅ **File Storage**
  - Screenshots saved to `/public/uploads/payments/`
  - Unique filenames prevent collision
  - Accessible via HTTPS in production

---

## ⚙️ CONFIGURATION

### Admin Key (Change in Production!)

```env
# .env.local
ADMIN_SECRET_KEY=your_secure_random_key_here
NEXT_PUBLIC_ADMIN_KEY=your_secure_random_key_here
```

Generate secure key:
```powershell
# Generate random secure key (32 characters)
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Max 256)})) -replace '=+$'
```

---

## 📊 PAYMENT DETAILS

```
Amount:        GHS 11.00
Payment To:    0202979378
Network:       Telecel Cash
Service Name:  Paraphrasing X
Payment Type:  Mobile Money Transfer
```

---

## 🔄 APPROVAL WORKFLOW

### Admin Workflow

1. **Login** to http://localhost:3002/admin
   - Enter admin key from `.env.local`

2. **View Pending Payments**
   - Dashboard shows all pending payments
   - Sorted by newest first

3. **Review Screenshot**
   - Click "View Screenshot"
   - Verify transaction details:
     - Matches GHS 11
     - Shows Telecel Cash
     - Shows payment number 0202979378

4. **Approve or Reject**
   - **Approve**: User gets full results
   - **Reject**: Provide reason (user sees message)

5. **View History**
   - See approved and rejected payments
   - View approval timestamps

---

## 📞 TROUBLESHOOTING

### Issue: "Failed to upload screenshot"
```
Check:
- File is JPG, JPEG, or PNG
- File size is less than 5MB
- Text ID matches a valid paraphrase session
```

### Issue: "Admin key invalid"
```
Check:
- .env.local has ADMIN_SECRET_KEY set
- Admin key is passed in x-admin-key header
- Key matches exactly (case-sensitive)
```

### Issue: "Screenshots not saving"
```
Check:
- /public/uploads/payments/ directory exists
- Permissions allow writing to public/
```

### Issue: "Payment not found"
```
Check:
- Payment ID is valid MongoDB ObjectId
- Payment was recently created
- Database connection is active
```

---

## 📈 PRODUCTION DEPLOYMENT

Before going to production:

- [ ] Change ADMIN_SECRET_KEY to secure random value
- [ ] Set up HTTPS/SSL
- [ ] Configure CDN for screenshot storage
- [ ] Back up payment screenshots regularly
- [ ] Implement payment history audit logs
- [ ] Add email notifications for new payments
- [ ] Set up monitoring for failed uploads
- [ ] Rate limit more strictly for production
- [ ] Log all admin actions

---

## 🎯 NEXT STEPS

1. **Test locally**: Follow testing guide above
2. **Deploy**: Move to production server
3. **Monitor**: Check admin dashboard regularly
4. **Backup**: Regularly backup payment screenshots

---

**Implementation Status**: ✅ COMPLETE  
**Testing Status**: ✅ READY FOR QA  
**Production Status**: ⏳ READY FOR DEPLOYMENT
