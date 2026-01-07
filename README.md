# Shri Venkatesan Traders - Pipes & Motors E-commerce Platform

A full-stack MERN application for trading industrial pipes and motors with Google OAuth, Stripe payments, and real-time order tracking.

## 🚀 Quick Start

### Running the Application

#### Option 1: Using Start Script (Windows)

```bash
start-dev.bat
```

#### Option 2: Manual Start

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

## 📌 Fixed Ports

The application now uses fixed ports to avoid conflicts:

- Frontend: **Port 3000** (strictPort enabled)
- Backend: **Port 5000**

If you get a port conflict error, make sure no other application is using these ports.

## 🏗️ Tech Stack

**Frontend:**

- React.js with Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- Material UI components
- Socket.IO Client for real-time updates
- Recharts for analytics visualization

**Backend:**

- Node.js & Express.js
- MongoDB with Mongoose ODM
- Passport.js for Google OAuth 2.0
- Stripe for payment processing
- Socket.IO for real-time notifications
- JWT for authentication

## 📦 Features

### User Features

- ✅ Google OAuth authentication
- ✅ Product browsing with filters
- ✅ Shopping cart management
- ✅ Secure Stripe checkout
- ✅ Order tracking with real-time updates
- ✅ Order history dashboard
- ✅ Wishlist functionality

### Admin Features

- ✅ Analytics dashboard with charts
- ✅ Product management (CRUD)
- ✅ Order management with status updates
- ✅ Payment transaction tracking
- ✅ Stock management with low-stock alerts
- ✅ Real-time order notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Google OAuth credentials
- Stripe account

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shrivenkatesan_traders
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=sk_test_xxx
CLIENT_URL=http://localhost:3000
```

5. Start the server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Configure environment variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_SOCKET_URL=http://localhost:5000
```

5. Start development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📊 Database Models

### User

- Google ID, name, email
- Role (admin/user)
- Address, phone
- Wishlist

### Product

- Name, description, category
- Price, stock, SKU
- Images, specifications
- Ratings & reviews
- Sales count, view count

### Order

- Order number (auto-generated)
- User reference
- Items with product details
- Shipping & billing address
- Payment & order status
- Status history with timeline
- Tracking details

### Payment

- Stripe session & payment intent IDs
- Amount, currency, status
- Card details (last 4 digits)
- Refund information

### Cart

- User reference
- Items with quantity & price
- Auto-calculated totals

## 🔐 Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent
3. Google redirects back with authorization code
4. Backend creates/updates user and generates JWT
5. Frontend receives token and stores it
6. Token included in subsequent API requests

## 💳 Payment Flow

1. User adds items to cart
2. Proceeds to checkout with shipping details
3. Creates order in database
4. Redirects to Stripe Checkout Session
5. Stripe webhook confirms payment
6. Order status updated to "confirmed"
7. Stock automatically decremented
8. Cart cleared

## 🔄 Real-time Features

Socket.IO provides real-time updates for:

- Order status changes
- Admin dashboard metrics
- Live order tracking for users

## 📱 Pages & Routes

### Public Routes

- `/` - Home page
- `/products` - Product listing
- `/products/:id` - Product details
- `/login` - Google OAuth login

### Protected User Routes

- `/dashboard` - User dashboard
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders` - Order history
- `/orders/:id` - Order tracking

### Admin Routes

- `/admin` - Analytics dashboard
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders
- `/admin/payments` - View payments

## 🎨 UI/UX Design

- Modern, clean interface with Tailwind CSS
- Fully responsive design
- Professional color scheme:
  - Primary: #0A5C80 (Brand blue)
  - Secondary: #F49D37 (Accent orange)
  - Success: #12B76A (Green)
  - Dark: #062C43

## 🛠️ API Endpoints

### Auth

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products

- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart

- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update item quantity
- `DELETE /api/cart/:productId` - Remove item

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update status (Admin)

### Payments

- `POST /api/payments/create-checkout-session` - Create Stripe session
- `POST /api/payments/webhook` - Stripe webhook handler

### Admin

- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/payments` - Payment transactions
- `GET /api/admin/customers` - Customer list

## 📈 Admin Dashboard Metrics

- Total revenue
- Total orders
- Total products
- Total customers
- Sales trend chart (30 days)
- Best-selling products
- Low stock alerts
- Recent payments

## 🔒 Security Features

- Helmet.js for HTTP headers
- CORS configuration
- JWT authentication
- Secure cookie handling
- Input validation & sanitization
- MongoDB injection prevention

## 🚢 Deployment

### Backend (Render/Railway/Heroku)

1. Set environment variables
2. Configure MongoDB Atlas connection
3. Deploy from GitHub

### Frontend (Vercel/Netlify)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variables

## 📝 License

ISC License - Shri Venkatesan Traders

## 👨‍💻 Developer Notes

- All routes are protected with JWT middleware
- Admin routes have additional role checks
- Stripe webhooks use raw body parsing
- Socket.IO connections auto-reconnect
- MongoDB indexes optimize query performance

---

Built with ❤️ for industrial supply chain management
