# 🏪 Sudarshan Bartan Store

A full-stack web application for Sudarshan Bartan Store — Kitchen & Stationery shop.
Built with **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Quick Setup (Step by Step)

### Step 1 — Install Node.js
Download and install from: https://nodejs.org (choose LTS version)

### Step 2 — Install MongoDB
Download and install from: https://www.mongodb.com/try/download/community
Start MongoDB service on your computer.

### Step 3 — Install project dependencies
Open terminal in this folder and run:
```
npm install
```

### Step 4 — Configure environment
Edit the `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sudarshan-bartan-store
SESSION_SECRET=your_secret_key_here
OWNER_USERNAME=admin
OWNER_PASSWORD=casa123
```
Change OWNER_USERNAME and OWNER_PASSWORD to your preferred credentials.

### Step 5 — Seed the database (optional)
This adds 10 default products to get you started:
```
node seed.js
```

### Step 6 — Start the server
```
npm start
```
Or for auto-restart during development:
```
npm run dev
```

### Step 7 — Open your website
Go to: http://localhost:3000

---

## 📁 Project Structure

```
sudarshan-bartan-store/
├── server.js              ← Main Node.js server
├── seed.js                ← Script to add default products
├── package.json           ← Dependencies
├── .env                   ← Your config (PORT, DB URL, passwords)
├── models/
│   ├── Product.js         ← Product database schema
│   └── Enquiry.js         ← Customer enquiry schema
├── routes/
│   ├── auth.js            ← Owner login/logout
│   ├── products.js        ← Add/delete/get products API
│   └── enquiries.js       ← Contact form API
└── public/
    └── index.html         ← Full website frontend
```

---

## 🔐 Owner Login
- Default username: `admin`
- Default password: `casa123`
- Change these in your `.env` file

---

## 🌐 API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/login | Owner login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Check session |

### Products
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/products | Get all products (public) |
| GET | /api/products?category=kitchen | Filter by category |
| GET | /api/products?search=bowl | Search products |
| POST | /api/products | Add product (owner only) |
| DELETE | /api/products/:id | Delete product (owner only) |
| GET | /api/products/admin/stats | Get stats (owner only) |

### Enquiries
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/enquiries | Submit enquiry (public) |
| GET | /api/enquiries | Get all enquiries (owner only) |
| PATCH | /api/enquiries/:id/read | Mark as read (owner only) |
| DELETE | /api/enquiries/:id | Delete enquiry (owner only) |

---

## ✨ Features
- 🛍️ Customer shop with category filter and search
- 🔐 Secure owner login with server-side sessions
- ➕ Add products with name, category, price, stock, emoji icon
- 🗑️ Delete products instantly
- 📊 Dashboard stats (total products, categories)
- 📩 Customer enquiries saved to MongoDB
- ✉️ Owner can read and delete enquiries
- 🔴 Unread enquiry badge notification
- 💾 All data stored in MongoDB (works across devices)
