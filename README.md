# Ayaan NX — Luxury Streetwear & Apparel

A high-performance dynamic e-commerce web platform engineered for luxury streetwear, boxy heavyweight hoodies, pleated cargo trousers, drop-shoulder graphic tees, and statement outerwear.

## 📁 Project Architecture

```
├── server.ts                    # Express + Vite full-stack server entry
├── src/
│   ├── types/
│   │   └── index.ts             # Products, Orders, Users, Reviews, Addresses
│   ├── server/
│   │   ├── db.ts                # In-memory + persistent datastore with seed data
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts# JWT authentication & admin authorization
│   │   └── routes/
│   │       ├── auth.ts          # Sign up, Login, Google Auth, Reset password
│   │       ├── products.ts      # Catalog, filters, live search suggestions, CRUD
│   │       ├── orders.ts        # Order processing, status tracking timeline
│   │       ├── checkout.ts      # Coupon discounts, Stripe & Razorpay simulation
│   │       └── admin.ts         # Revenue metrics, inventory management
│   ├── context/
│   │   ├── AuthContext.tsx      # User authentication session state
│   │   ├── CartContext.tsx      # Shopping bag state, quantities, coupon logic
│   │   ├── WishlistContext.tsx  # Customer wishlist state
│   │   └── ThemeContext.tsx     # Dark / Light luxury theme provider
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Brand wordmark, nav links, live search, cart
│   │   │   ├── Footer.tsx       # Ethos, links, newsletter
│   │   │   ├── SearchModal.tsx  # Instant autocomplete live search modal
│   │   │   └── QuickCartDrawer.tsx # Slide-out cart with coupon and free shipping
│   │   ├── ui/
│   │   │   ├── ProductImage.tsx # High-end image component with fallback luxury SVG
│   │   │   ├── Toast.tsx        # Toast alert system
│   │   │   ├── Skeleton.tsx     # Fluid loading skeleton states
│   │   │   └── SizeGuideModal.tsx # Measurement charts and fit guide
│   │   └── product/
│   │       ├── ProductCard.tsx  # Product card with hover zoom and quick add
│   │       └── ReviewSection.tsx# Verified buyer reviews and star ratings
│   ├── pages/
│   │   ├── HomePage.tsx         # Hero banner, featured drops, new arrivals, bestsellers
│   │   ├── ShopPage.tsx         # Category, size, color, price range filters, sorting
│   │   ├── ProductDetailPage.tsx# Gallery, size selector, stock indicator, reviews
│   │   ├── CartPage.tsx         # Quantity edit, coupons, order calculation
│   │   ├── CheckoutPage.tsx     # Shipping address, Stripe & Razorpay test modes
│   │   ├── OrderConfirmationPage.tsx # Receipt, tracking timeline, celebration
│   │   ├── AccountPage.tsx      # Orders, wishlist, saved addresses, profile
│   │   ├── AdminPage.tsx        # Inventory, order status updater, customer list
│   │   ├── AboutPage.tsx        # Brand ethos, fabric specifications, craftsmanship
│   │   ├── ContactPage.tsx      # Customer support and studio inquiry form
│   │   └── FAQPage.tsx          # Accordion FAQ with search
│   ├── App.tsx                  # Client router & modal controller
│   └── main.tsx                 # React entry point
└── package.json
```

---

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:3000`.

4. **Demo Credentials:**
   - **Admin Account**: `admin@ayaannx.com` / `password123`
   - **Customer Account**: `sahil@example.com` / `password123`
   - **Coupon Codes**:
     - `AYAAN10`: 10% off on all orders
     - `STREET20`: 20% off on orders over $150
     - `FREESHIP`: Free expedited courier shipping

---

## 🚀 Deployment Guide

### Option 1: Render (Full-Stack Express + Node)
1. Fork or push repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com), create a new **Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render auto-injects)
   - `JWT_SECRET`: your custom secure secret string

### Option 2: Vercel (Frontend SPA or Serverless)
1. In [Vercel Dashboard](https://vercel.com), import the Git repository.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. If running as separated frontend, point `VITE_API_URL` to your backend instance on Render or Railway.
