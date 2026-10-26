# 🛒 NexCart — Premium Full Stack E-Commerce App

A professional, full-featured e-commerce application built with **React.js + Express.js + MongoDB**.

![NexCart](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200)

---

## ✨ Features

- 🛍️ **Product Listings** — Search, filter by category & price range, sort, paginate
- 🔍 **Product Detail Page** — Image gallery, star ratings, reviews, quantity selector
- 🛒 **Shopping Cart** — Persistent cart with quantity controls, price calculation
- 🔐 **User Auth** — JWT registration/login with protected routes
- 📦 **Order Processing** — Multi-step checkout with shipping + payment + review
- 📋 **Order History** — View all orders with real-time status tracking
- 🔑 **Admin Role** — Seed products, manage inventory

---

## 🏗️ Project Structure

```
CodeAlpha_NexCart/
├── client/          # React.js Frontend (Vite)
│   └── src/
│       ├── components/  # Layout, Product, Cart components
│       ├── context/     # AuthContext, CartContext
│       ├── pages/       # Home, Products, ProductDetail, Cart, etc.
│       └── services/    # Axios API service
│
├── server/          # Express.js Backend
│   ├── config/      # MongoDB connection
│   ├── controllers/ # Auth, Product, Order controllers
│   ├── middleware/  # JWT auth, error handler
│   ├── models/      # User, Product, Order schemas
│   ├── routes/      # API routes
│   └── seed/        # Sample product data
│
└── package.json     # Root convenience scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Install Dependencies

```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### 2. Configure Environment

Edit `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/nexcart   # or your Atlas URI
JWT_SECRET=your_super_secret_key
PORT=5000
```

### 3. Seed the Database

```bash
cd server && npm run seed
```

This creates 12 sample products + test accounts:
| Account | Email | Password |
|---------|-------|----------|
| Admin | admin@nexcart.com | admin123 |
| User  | john@nexcart.com  | test123  |

### 4. Run the App

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get profile |
| GET | `/api/products` | List products (search/filter/sort) |
| GET | `/api/products/:id` | Single product |
| GET | `/api/products/featured` | Featured products |
| POST | `/api/products/:id/reviews` | Add review |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my-orders` | User's orders |
| GET | `/api/orders/:id` | Order detail |
| PUT | `/api/orders/:id/cancel` | Cancel order |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Vite, React Router 6 |
| Styling | Vanilla CSS (custom dark design system) |
| State | Context API + useReducer |
| HTTP | Axios with interceptors |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Notifications | react-hot-toast |

---

## 🔒 Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT authentication with 30-day expiry
- Protected routes (frontend + backend)
- Admin role middleware
- Input validation & error handling

---

*Built with ❤️ as part of CodeAlpha Internship*
