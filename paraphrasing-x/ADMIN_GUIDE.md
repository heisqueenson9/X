# 👑 ADMIN DASHBOARD GUIDE

**Payment Verification & User Management**

---

## 🔐 ADMIN LOGIN

### Accessing the Admin Panel

```
URL: http://localhost:3002/admin
```

### Authentication

The admin panel is protected by a secret key. When you first load the admin page:

```
┌─────────────────────────────────────┐
│       🔐 Admin Dashboard Login      │
├─────────────────────────────────────┤
│                                     │
│  Admin Secret Key:                  │
│  [_______________________________]  │
│                                     │
│  [           Login            ]     │
│                                     │
└─────────────────────────────────────┘
```

**Default Admin Key**: `admin_key_change_in_production`

⚠️ **IMPORTANT**: Change this key before deploying to production!

```powershell
# Generate a secure admin key
[Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Max 256)})) -replace '=+$'
```

---

## 📊 ADMIN DASHBOARD VIEW

Once logged in, you'll see:

```
╔═══════════════════════════════════════════════════════════╗
║                   💳 Payment Management                    ║
╟───────────────────────────────────────────────────────────╢
║  Total Payments: 25  │  Pending: 5  │  Approved: 18      ║
║  Rejected: 2                                               ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  PENDING PAYMENTS                                          ║
║  ──────────────────────────────────────────────────────   ║
║                                                            ║
║  [Card 1]  Reference: 507f1f77bcf86cd799439011            ║
║            Amount: GHS 11.00                              ║
║            Network: Telecel Cash → 0202979378             ║
║            Date: 2026-03-14 10:30:00                      ║
║            Status: ⏳ PENDING                             ║
║            [View Screenshot]  [Approve]  [Reject]         ║
║                                                            ║
║  [Card 2]  Reference: 507f1f77bcf86cd799439012            ║
║            ...                                             ║
║                                                            ║
╟───────────────────────────────────────────────────────────╢
║  [HISTORY] (View approved/rejected payments)              ║
║  [LOGOUT]                                                  ║
╚═══════════════════════════════════════════════════════════╝
```

---

## ✅ APPROVING A PAYMENT

### Step-by-Step

1. **Review Pending Payments**
   - Dashboard shows all pending payments sorted by newest first
   - Each card shows amount, network, and date

2. **Click "View Screenshot"**
   - Opens a modal with the payment proof image
   - Verify:
     - Is the amount GHS 11.00?
     - Is the network Telecel Cash?
     - Is the recipient 0202979378?
     - Does the screenshot look legitimate?

3. **Click "Approve" Button**
   - Payment status changes to "approved" ✅
   - User immediately gets access to full results
   - Payment is moved to history

4. **View History to Confirm**
   - Click "HISTORY" tab
   - See approved payment with approval date/time

---

## ❌ REJECTING A PAYMENT

### Step-by-Step

1. **Click "Reject" Button**
   - Opens rejection reason dialog

2. **Enter Rejection Reason**
   ```
   Examples:
   - "Screenshot is blurry, cannot verify amount"
   - "Transaction amount doesn't match (shows GHS 5)"
   - "Different phone number shown"
   - "Screenshot too old (more than 24 hours)"
   ```

3. **Click "Confirm Rejection"**
   - Payment status changes to "rejected" ❌
   - User sees rejection reason
   - User can re-upload new screenshot

4. **View in History**
   - Shows rejection with reason and date

---

## 📋 PAYMENT INFORMATION IN ADMIN PANEL

Each payment card displays:

```
┌──────────────────────────────────────┐
│ 📌 Payment ID                         │
│    507f1f77bcf86cd799439011          │
│                                       │
│ 💰 Amount: GHS 11.00                 │
│                                       │
│ 📱 Network: Telecel Cash             │
│    Recipient: 0202979378             │
│    Service: Paraphrasing X           │
│                                       │
│ 📅 Submitted: 2026-03-14 10:30       │
│                                       │
│ 🔗 Text ID: abc123...xyz             │
│                                       │
│ Status: ⏳ PENDING (APPROVED/REJECTED)│
│                                       │
│ If approved:                          │
│   ✓ Approved: 2026-03-14 10:35       │
│   ✓ By: admin                         │
│                                       │
│ If rejected:                          │
│   ✗ Rejected: 2026-03-14 10:32       │
│   Reason: Screenshot is blurry        │
│                                       │
└──────────────────────────────────────┘
```

---

## 🔍 VERIFYING PAYMENT SCREENSHOTS

### What to Look For

✅ **ACCEPT IF**:
- Shows Telecel Cash transaction
- Amount is exactly GHS 11.00
- Recipient is 0202979378
- Screenshot timestamp is recent (within 24 hours)
- All transaction details are clearly visible

❌ **REJECT IF**:
- Screenshot is blurry or cut off
- Amount doesn't match GHS 11.00
- Recipient phone number is different
- Screenshot is edited/forged-looking
- Transaction is for different service/person
- Amount currency is not GHS (Ghana Cedis)

---

## 📊 PAYMENT STATISTICS

The dashboard header shows real-time statistics:

```
┌───────────┬──────────┬───────────┬──────────┐
│   Total   │ Pending  │ Approved  │ Rejected │
│    25     │    5     │    18     │    2     │
└───────────┴──────────┴───────────┴──────────┘
```

These update automatically as you review payments.

---

## 🔄 REVIEW WORKFLOW

### Daily Admin Tasks

1. **Morning Check** (9:00 AM)
   - Login to http://localhost:3002/admin
   - Check "Pending" count
   - Review all pending payments
   - Approve legitimate ones
   - Reject suspicious ones

2. **Record Keeping**
   - Keep notes on rejected payments
   - Monitor rejection reasons
   - Identify patterns (if any)

3. **Evening Check** (5:00 PM)
   - Quick review of new pending payments
   - Ensure no backlog

4. **Weekly Summary**
   - Review payment statistics
   - Check for anomalies
   - Verify download links all work

---

## 🛡️ SECURITY CHECKLIST

✅ **Before Each Session**:
- [ ] Check admin key is set in .env.local
- [ ] Verify no one is watching over your shoulder
- [ ] Ensure browser is using HTTPS (in production)
- [ ] Check internet connection is secure

✅ **During Each Session**:
- [ ] Verify screenshot authenticity before approving
- [ ] Provide helpful rejection reasons
- [ ] Don't approve suspicious-looking payments
- [ ] Keep accurate approval records

✅ **After Each Session**:
- [ ] Click "LOGOUT" button
- [ ] Close browser tab/window
- [ ] Keep admin key confidential

---

## 🔗 ACTION BUTTONS

### Main Controls

| Button | Action | Result |
|--------|--------|--------|
| **View Screenshot** | Opens image preview | See payment proof |
| **Approve** | Marks as approved | User gets results |
| **Reject** | Marks as rejected | User sees reason |
| **HISTORY** | Shows all payments | Approved/rejected list |
| **LOGOUT** | Ends session | Returns to login |

---

## 📥 DOWNLOAD SCREENSHOT

Each pending payment card has a "View Screenshot" button:

1. Click **"View Screenshot"**
2. A modal opens showing the uploaded image
3. You can:
   - View full screenshot
   - See image properties
   - Right-click → "Save image as" to download locally

---

## 🚨 HANDLING DISPUTES

If a user disputes a rejection:

1. **Review original screenshot** (in History)
2. **Check rejection reason** provided
3. **Verify payment details** against user's claim
4. **Options**:
   - Approve if you made a mistake
   - Confirm rejection and ask user to resubmit
   - Ask user for alternative evidence

---

## 📈 MONITORING PAYMENTS

### Payment Lifecycle

```
Submitted (⏳ Pending)
    ↓
[Admin Reviews Screenshot]
    ↓
┌───────────────┬──────────────────┐
APPROVED ✅     REJECTED ❌
    ↓                ↓
User unlocked   User notified
results         Reason shown
    ↓                ↓
Payment         User can
Complete        Resubmit
```

---

## 🔧 TROUBLESHOOTING ADMIN ISSUES

### Problem: Admin Login Not Working

```powershell
# 1. Check admin key in .env.local
Get-Content .env.local | Select-String "ADMIN_SECRET_KEY"

# 2. Verify key matches what you're entering
#    (Watch for spaces, case sensitivity)

# 3. Restart server
npm run dev
```

### Problem: Screenshots Not Showing

```powershell
# 1. Check uploads directory exists
Test-Path "public/uploads/payments"

# 2. Check file permissions
Get-ChildItem "public/uploads/payments" -Force

# 3. Check browser cache
#    Ctrl+Shift+Delete to clear cache
```

### Problem: Admin Dashboard is Blank

```powershell
# 1. Check MongoDB is running
#    mongod should be running

# 2. Check database connection
#    See MongoDB logs

# 3. Refresh page
#    F5 or Ctrl+R
```

### Problem: Can't Approve/Reject

```powershell
# 1. Check admin key header is being sent
#    (Browser dev tools → Network tab)

# 2. Verify .env.local ADMIN_SECRET_KEY is set

# 3. Restart server and try again
```

---

## 🔐 PASSWORD MANAGEMENT

### Changing Admin Key

When ready for production:

```powershell
# Generate new secure key
$newKey = [Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Max 256)})) -replace '=+$'

Write-Host "New Admin Key: $newKey"

# Update .env.local
(Get-Content .env.local) -replace 'ADMIN_SECRET_KEY=.*', "ADMIN_SECRET_KEY=$newKey" | Set-Content .env.local

# Also update NEXT_PUBLIC_ADMIN_KEY
(Get-Content .env.local) -replace 'NEXT_PUBLIC_ADMIN_KEY=.*', "NEXT_PUBLIC_ADMIN_KEY=$newKey" | Set-Content .env.local

# Restart server
npm run dev
```

⚠️ **IMPORTANT**: Keep this key secure! Don't commit it to version control.

---

## 📞 SUPPORT

### Common Questions

**Q: How long should I wait before approving?**  
A: Review immediately, but take time to verify authenticity (30 seconds per payment)

**Q: What if payment screenshot is for a different user's number?**  
A: Request that they send from the correct number (0202979378)

**Q: Can users resubmit after rejection?**  
A: Yes, they'll see the rejection reason and can upload a new screenshot

**Q: How do I back up payments data?**  
A: Use MongoDB backup: `mongodump --db paraphrasing-x`

**Q: What if there's fraud?**  
A: Reject payment and keep detailed rejection reason notes

---

## 📋 ADMIN CHECKLIST

Print this and keep at your desk:

```
🔐 Admin Dashboard Checklist
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Admin key is secure and non-default
☐ HTTPS is enabled (production)
☐ MongoDB backups are running
☐ Payment screenshots are verified before approval
☐ Rejection reasons are clear and helpful
☐ Daily review of pending payments completed
☐ Weekly statistics reviewed
☐ No suspicious payment patterns detected
☐ Admin access logs reviewed (if available)
☐ Session logged out when done
```

---

**Admin Dashboard Status**: ✅ READY FOR USE

Start your admin session:
```
http://localhost:3002/admin
```
