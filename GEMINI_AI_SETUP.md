# 🤖 Gemini AI Chatbot Setup Guide

## Quick Setup (3 Steps)

### Step 1: Get Your Gemini API Key

1. Go to **[Google AI Studio](https://aistudio.google.com/apikey)**
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API Key"**
4. Copy your API key (starts with `AIza...`)

### Step 2: Add API Key to Backend

Open `backend/.env` and replace:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

With your actual key:

```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Restart the Backend Server

```bash
cd backend
npm run dev
```

---

## ✅ That's it! Your AI chatbot is now connected to Gemini!

The chatbot will:

- Respond intelligently to customer queries
- Know about your shop's products, services, and policies
- Maintain conversation context
- Fall back to preset responses if API is unavailable

---

## How It Works

```
User Message → Frontend → Backend API → Gemini AI → Response
                                ↓
                        Shop Context Injected
                        (products, services, policies)
```

### Features:

- **Context-aware**: AI knows about Shri Venkatesan Traders products
- **Conversation memory**: Remembers last 10 messages
- **Fallback support**: Works even if API fails
- **Rate limiting**: Gemini free tier includes 15 requests/minute

---

## API Details

**Endpoint:** `POST /api/chat`

**Request:**

```json
{
  "message": "What pipes do you sell?",
  "conversationHistory": []
}
```

**Response:**

```json
{
  "response": "We offer premium pipes including PVC, MS, GI...",
  "success": true
}
```

---

## Troubleshooting

| Issue                       | Solution                               |
| --------------------------- | -------------------------------------- |
| "AI service not configured" | Add GEMINI_API_KEY to .env             |
| Rate limit errors           | Wait 1 minute or upgrade API plan      |
| Empty responses             | Check API key validity                 |
| Fallback responses only     | Verify API key and internet connection |

---

## Free Tier Limits (Google AI Studio)

- ✅ 15 requests per minute
- ✅ 1 million tokens per month
- ✅ 1,500 requests per day

This is more than enough for most e-commerce chatbots!

---

## Need More?

- [Google AI Studio](https://aistudio.google.com/) - Manage API keys
- [Gemini API Docs](https://ai.google.dev/docs) - Full documentation
- [Pricing](https://ai.google.dev/pricing) - Upgrade options
