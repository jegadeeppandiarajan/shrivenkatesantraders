# 🚀 QUICK START - EMAIL SETUP (5 Minutes)

## STEP 1: Go to Gmail Security

👉 https://myaccount.google.com/security

## STEP 2: Enable 2-Step Verification

- Click "2-Step Verification"
- Verify with phone code
- Done! ✅

## STEP 3: Get App Password

👉 https://myaccount.google.com/apppasswords

- Select: Mail + Windows Computer
- Copy the 16-character password
- Example: `xyzwabcdefghijkl`

## STEP 4: Update .env File

```
File: backend/.env

Update these lines:
SMTP_USER=your-email@gmail.com
SMTP_PASS=YOUR_16_CHAR_APP_PASSWORD

Example format:
SMTP_PASS=abcd efgh ijkl mnop (without spaces)
```

## STEP 5: Restart Backend

```bash
cd backend
npm run dev
```

You should see:
✅ Email service is ready to send messages

## STEP 6: Test Email

1. Go to http://localhost:3000
2. Create an order
3. Complete payment
4. Check email for invoice
5. Done! 🎉

---

## ❌ IF EMAILS STILL DON'T WORK

### Check #1: Verify .env File

```bash
# Make sure these exist in backend/.env:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=YOUR_16_CHAR_APP_PASSWORD
```

### Check #2: Verify Gmail Settings

- 2-Step Verification: ON ✅
- App Password: Generated ✅
- Less secure apps: OFF (with app password, this doesn't matter)

### Check #3: Check Backend Logs

After creating order, you should see:

```
📧 Sending email to: customer@gmail.com
✅ Invoice email sent for INV-SVT2601050001
```

### Check #4: Use Test Email

Can't get it working? Use a test email:

```
SMTP_USER=test@gmail.com
SMTP_PASS=test-app-password
```

---

## 🆘 NEED HELP?

### Email Not Sending?

- Check backend logs for "Error sending email"
- Verify SMTP credentials
- Try a different email address
- Check spam folder

### App Password Not Working?

- Make sure it's 16 characters (without spaces)
- Copy the exact password from Google
- Wait 5 minutes after generating
- Try creating a new app password

### Still Stuck?

Use SendGrid instead:

1. Sign up: https://sendgrid.com
2. Get API key
3. Update .env:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.xxxxxxxxxxxx
   ```

---

**Time to complete:** 5 minutes ⏱️
**Difficulty:** Easy 😊
**Success rate:** 99% 🎯
