# 🎯 MicroTask Platform

Full-stack micro-task platform — **React + Vite** frontend, **Node.js + Express + MongoDB** backend, **JWT** auth, **Cloudinary** image uploads, and **Stripe** payments.

---

## 📁 Repos

| Repo | Stack |
|---|---|
| `microtask-server` | Node.js + Express + MongoDB + JWT |
| `microtask-client` | React + Vite + Tailwind CSS |

---

## 🚀 Backend Setup (`microtask-server`)

### 1. Install
```bash
cd microtask-server
npm install
```

### 2. Environment variables
```bash
cp .env.example .env
```
Fill in your `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/microtask
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_oauth_client_id

STRIPE_SECRET_KEY=sk_test_...

CLIENT_URL=http://localhost:5173
```

### 3. Run
```bash
npm run dev    # development
npm start      # production
```

---

## 🖥️ Frontend Setup (`microtask-client`)

### 1. Install
```bash
cd microtask-client
npm install
```

### 2. Environment variables
```bash
cp .env.example .env
```
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run
```bash
npm run dev
```

---

## 🔐 Getting Credentials

### MongoDB Atlas
1. [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Database Access → Add user
3. Network Access → Allow `0.0.0.0/0`
4. Connect → Copy connection string

### Google OAuth
1. [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Type: **Web application**
4. Authorized origins: `http://localhost:5173`
5. Copy Client ID → use in BOTH `.env` files

### Cloudinary
1. [cloudinary.com](https://cloudinary.com) → Free account
2. Dashboard → copy Cloud Name, API Key, API Secret

### Stripe
1. [stripe.com](https://stripe.com) → Free account
2. Developers → API Keys
3. Copy Publishable Key (frontend) + Secret Key (backend)

---

## 👤 Creating Admin User

1. Register normally as any role
2. Open MongoDB Atlas → Browse Collections → `users`
3. Find your document → Edit `role` field → change to `"admin"`

---

## 🌐 API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/google` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/users` | Admin |
| PATCH | `/api/users/:id/role` | Admin |
| DELETE | `/api/users/:id` | Admin |
| GET | `/api/tasks` | Worker |
| GET | `/api/tasks/my` | Buyer |
| GET | `/api/tasks/all` | Admin |
| POST | `/api/tasks` | Buyer |
| DELETE | `/api/tasks/:id` | Buyer/Admin |
| POST | `/api/submissions` | Worker |
| GET | `/api/submissions/my` | Worker |
| PATCH | `/api/submissions/:id/approve` | Buyer |
| PATCH | `/api/submissions/:id/reject` | Buyer |
| POST | `/api/withdrawals` | Worker |
| GET | `/api/withdrawals/my` | Worker |
| GET | `/api/withdrawals` | Admin |
| PATCH | `/api/withdrawals/:id/approve` | Admin |
| PATCH | `/api/withdrawals/:id/reject` | Admin |
| GET | `/api/notifications` | Authenticated |
| POST | `/api/payments/create-payment-intent` | Buyer |
| POST | `/api/payments/confirm` | Buyer |
| GET | `/api/payments/my` | Buyer |

---

## 💰 Coin System

| Rule | Value |
|---|---|
| Worker signup | 10 coins |
| Buyer signup | 50 coins |
| Exchange rate | 20 coins = $1 |
| Min withdrawal | 200 coins = $10 |

---

## 📦 Push to GitHub

```bash
# Server repo
cd microtask-server
git init
git add .
git commit -m "feat: initial server setup"
git remote add origin https://github.com/YOUR_USERNAME/microtask-server.git
git push -u origin main

# Client repo
cd microtask-client
git init
git add .
git commit -m "feat: initial client setup"
git remote add origin https://github.com/YOUR_USERNAME/microtask-client.git
git push -u origin main
```

---

## 🚢 Deploy

- **Backend** → [Railway](https://railway.app) or [Render](https://render.com)
- **Frontend** → [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

> After deploying, update `CLIENT_URL` in server `.env` and `VITE_API_URL` in client `.env`
