# 🚀 QUICK START: PAYMENT SYSTEM TESTING

**Time to Complete**: 10 minutes  
**Prerequisites**: MongoDB running, Node.js installed

---

## ⚡ 5-STEP QUICK TEST

### Step 1: Start the Server (2 min)

```powershell
cd c:\Users\USER\Downloads\page_content\paraphrasing-x

# Start MongoDB (if not already running)
mongod

# In new PowerShell window, start dev server
npm run dev

# Wait for "ready - started server on 0.0.0.0:3000"
```

### Step 2: Complete a Paraphrase Task (2 min)

```
1. Open browser: http://localhost:3002
2. Enter any text in the text editor (at least 50 words)
3. Click "Paraphrase" button
4. Wait for processing (20-30 seconds)
5. You'll see the results preview with blurred text
```

### Step 3: Upload Payment Screenshot (2 min)

```
1. On the results page, scroll to payment section
2. You'll see:
   ┌──────────────────────────────┐
   │ 💳 Payment Instructions       │
   │ Amount: GHS 11.00            │
   │ Send to: 0202979378          │
   │ Network: Telecel Cash        │
   │ Name: Paraphrasing X         │
   └──────────────────────────────┘

3. Click "Choose File" or drag-drop a JPG/PNG image
4. Select any image file (screenshot.jpg, test.png, etc.)
5. Click "Upload Payment Proof"
6. Wait for upload (should show "Payment Pending")
```

### Step 4: Access Admin Dashboard (2 min)

```
1. Open browser: http://localhost:3002/admin
2. You'll see login screen
3. Admin Key: admin_key_change_in_production
4. Click "Login"
5. You'll see your pending payment!
```

### Step 5: Approve Payment (1 min)

```
1. In admin dashboard, click "View Screenshot"
2. You can see the uploaded image
3. Click "Approve" button
4. Payment status changes to "Approved"
5. Go back to paraphrase page - full results should be visible!
```

---

## ✅ VERIFICATION CHECKLIST

After completing 5 steps above, check off:

- [ ] Server started successfully (no errors)
- [ ] Paraphrase task completed
- [ ] Screenshot uploaded (got paymentId)
- [ ] Admin login successful
- [ ] Payment visible in admin dashboard
- [ ] Approved payment in admin panel
- [ ] User can see full results after approval

---

## 🔍 DEBUGGING: Quick Tests

### Test File Upload Directly

```powershell
# Get a payment ID from admin dashboard first
$paymentId = "copy-from-admin-dashboard"

# Then test status endpoint
Invoke-WebRequest -Uri "http://localhost:3002/api/payment/status/$paymentId"
```

### Test Admin API Directly

```powershell
$headers = @{
    "x-admin-key" = "admin_key_change_in_production"
}

Invoke-WebRequest -Uri "http://localhost:3002/api/admin/payments" -Headers $headers
```

### Check Screenshot Folder

```powershell
# Verify screenshots are being saved
Get-ChildItem "c:\Users\USER\Downloads\page_content\paraphrasing-x\public\uploads\payments\"
```

---

## 🎯 COMMON ISSUES & FIXES

| Issue | Solution |
|-------|----------|
| "File type not allowed" | Make sure file is JPG, JPEG, or PNG |
| "File size exceeds 5MB" | Use smaller image file |
| "Payment endpoint not found" | Restart server: `npm run dev` |
| "Admin key invalid" | Check case sensitivity in .env.local |
| "Can't upload screenshot" | Ensure `/public/uploads/payments/` exists |
| "Admin dashboard blank" | Clear browser cache (Ctrl+Shift+Delete) |

---

## 📋 PAYMENT STATUS AFTER EACH STEP

```
After Step 3 (Upload): status = "pending"
                      ↓
After Step 5 (Approve): status = "approved"
                      ↓
Full results unlocked!
```

---

## 💡 WHAT'S WORKING

✅ User paraphrases text  
✅ User uploads payment screenshot  
✅ Screenshot saved to disk  
✅ Payment recorded in MongoDB  
✅ Admin sees pending payments  
✅ Admin approves payment  
✅ User gets access to results  

---

## 🚨 IF SOMETHING FAILS

1. **Check server logs**: Look at terminal where `npm run dev` is running
2. **Clear cache**: Ctrl+Shift+Delete in browser
3. **Restart server**: Ctrl+C then `npm run dev` again
4. **Check MongoDB**: Ensure `mongod` is still running
5. **Check file**: Verify image file is valid JPG/PNG

---

**That's it! Your payment system is live and ready to test.** 🎉
