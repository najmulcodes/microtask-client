# MicroTask Platform — Client

A full-stack micro-tasking platform where **Buyers** post tasks, **Workers** complete them, and an **Admin** manages the entire ecosystem. Built with React + Vite and deployed on Vercel.

🔗 **Live Site:** https://microtask-client-iota.vercel.app
   ** DEMO LOGIN:** {email:"admin@microtask.com",password:"Admin123",role:"Admin"}
---

## Features

### Worker
- Register with 10 free coins
- Browse and submit task completions
- Earn coins approved by Buyers
- Withdraw earnings (minimum 200 coins = $10)

### Buyer
- Register with 50 free coins
- Create tasks with coin rewards
- Review and approve/reject Worker submissions
- Purchase additional coins via Stripe

### Admin
- View platform-wide stats (users, tasks, payments)
- Manage all users (promote/remove)
- Moderate task submissions
- Manage withdrawal requests

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| @react-oauth/google | Google Sign-In |
| Stripe.js | Payment UI |
| React Query | Server state management |

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
git clone https://github.com/najmulcodes/microtask-client
cd microtask-client
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=https://microtask-server-cgj9.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Project Structure

```
microtask-client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── PrivateRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── dashboard/
│   │       ├── Worker/
│   │       ├── Buyer/
│   │       └── Admin/
│   ├── routes/
│   │   └── router.jsx
│   ├── api/
│   │   └── axios.js
│   ├── App.jsx
│   └── main.jsx
├── vercel.json
├── index.html
└── vite.config.js
```

---

## Deployment

Deployed on **Vercel** with the following `vercel.json` for React Router support:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Coin System

| Action | Coins |
|--------|-------|
| Worker signup bonus | 10 coins |
| Buyer signup bonus | 50 coins |
| Minimum withdrawal | 200 coins |
| 1 USD | 20 coins |

---

## Authentication

- JWT-based authentication stored in `localStorage`
- Google OAuth via `@react-oauth/google`
- Role-based route protection (Worker / Buyer / Admin)
