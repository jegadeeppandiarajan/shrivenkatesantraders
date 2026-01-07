# Backend Startup Guide - Shri Venkatesan Traders

## ⚠️ Before Running the Backend

### **Step 1: Install Dependencies**

```bash
cd backend
npm install
```

This installs all required packages (Express, MongoDB, Stripe, Passport, Socket.IO, etc.)

### **Step 2: Create & Configure `.env` File**

```bash
cp .env.example .env
```

Edit `backend/.env` and add your configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/shrivenkatesan_traders

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Stripe (Get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Frontend
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### **Step 3: Setup MongoDB**

**Option A: Local MongoDB**

- Install MongoDB Community Edition
- Start MongoDB service: `mongod`
- Use: `MONGODB_URI=mongodb://localhost:27017/shrivenkatesan_traders`

**Option B: MongoDB Atlas (Cloud)**

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/shrivenkatesan_traders`
4. Update `.env`: `MONGODB_URI=your_connection_string`

### **Step 4: Setup Google OAuth**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

### **Step 5: Setup Stripe**

1. Create account at [Stripe.com](https://stripe.com)
2. Go to API Keys section
3. Copy Secret Key (starts with `sk_test_`)
4. Copy Publishable Key (starts with `pk_test_`)
5. Setup webhook endpoint at `http://localhost:5000/api/payments/webhook`
6. Copy Webhook Secret and add to `.env`

## ✅ Run Backend

### **Development Mode (with auto-reload)**

```bash
npm run dev
```

### **Production Mode**

```bash
npm start
```

You should see:

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🏭 Shri Venkatesan Traders - Pipes & Motors             ║
║                                                            ║
║   Server running in development mode                       ║
║   Port: 5000                                               ║
║   API: http://localhost:5000/api                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

## ❌ Troubleshooting

### **Error: Cannot find module 'express'**

```bash
npm install
```

### **Error: MONGODB_URI is not defined**

- Create `.env` file in backend directory
- Add `MONGODB_URI=mongodb://localhost:27017/shrivenkatesan_traders`

### **Error: connect ECONNREFUSED 127.0.0.1:27017**

- MongoDB is not running
- Start MongoDB: `mongod` (on Windows) or `brew services start mongodb-community`
- Or use MongoDB Atlas cloud instead

### **Error: Port 5000 already in use**

```bash
# Find process using port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Kill it or change PORT in .env
```

### **Error: GOOGLE_CLIENT_ID is undefined**

- Check `.env` file exists and has Google OAuth credentials
- Restart server after adding to `.env`

## 🧪 Test Backend

```bash
# Test if API is running
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Shri Venkatesan Traders API is running",
  "timestamp": "2025-12-28T10:00:00.000Z"
}
```

## 📋 Seed Sample Data

After backend is running:

```bash
npm run seed
```

This adds sample products to the database.

## 🚀 Full Setup Checklist

- [ ] Install Node.js (v16+)
- [ ] Run `npm install` in backend
- [ ] Create `.env` file with all required variables
- [ ] MongoDB running locally or Atlas configured
- [ ] Google OAuth credentials added to `.env`
- [ ] Stripe API keys added to `.env`
- [ ] Run `npm run dev`
- [ ] Backend running on http://localhost:5000
- [ ] Frontend configured to point to backend
- [ ] Run `npm run dev` in frontend directory

---

**Need help?** Make sure ALL environment variables in `.env` are set correctly.
