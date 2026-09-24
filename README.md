# Aureus - Product Admin Dashboard

**GitHub Repository**: [https://github.com/shiivaa19/atelier-admin.git](https://github.com/shiivaa19/atelier-admin.git)

A clean, modern Product Admin Dashboard built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **Axios**. All data logic (pagination, debouncing, request cancellation, state management, and URL sanitization) is hand-written without third-party data grid or query libraries.

---

## 📁 Simple Project Folder Structure

```
src/
├── app/                  # 1. Page Routes
│   ├── (auth)/login/     # Login Page
│   └── (dashboard)/      # Protected Dashboard
│       └── products/     # Product List & [id] Detail Page
├── components/           # 2. UI Components
│   ├── ui/               # Low-level primitives (Button, Input, Modal, Toast)
│   ├── layout/           # Layout structure (Sidebar, Topbar, MobileDrawer)
│   └── products/         # Product components (ProductTable, ProductCard, Filters, Pagination, ProductForm)
├── context/              # 3. State Management
│   ├── AuthContext.tsx   # Login token & user session
│   ├── LocalProductsContext.tsx # Local overlay for Add/Edit/Delete
│   └── ToastContext.tsx  # Toast notifications
├── hooks/                # 4. Custom Logic Hooks
│   ├── useProducts.ts    # Fetching + AbortController cancellation
│   ├── useProductParams.ts # URL query string parsing & sanitizing
│   └── useDebounce.ts   # Hand-written 400ms search debouncer
├── services/             # 5. API Layer (Axios)
│   ├── auth.service.ts
│   ├── products.service.ts
│   └── categories.service.ts
└── lib/                  # 6. Utilities & Config
    ├── axios.ts          # Central Axios instance + Interceptors
    └── validators.ts     # Hand-written form validation
```

---

## 💡 How to Explain This Project in 2 Minutes (Interview Cheat Sheet)

When explaining this project to an interviewer, break it down into **4 simple layers**:

### 1. Central API Layer (`src/lib/axios.ts` & `src/services/`)
> *"I created ONE centralized Axios instance in `axios.ts`. An interceptor automatically attaches the Bearer token to every request and auto-logouts the user on 401 errors. All API endpoints are isolated in service files (`products.service.ts`), so UI components never touch Axios directly."*

### 2. URL as Single Source of Truth (`src/hooks/useProductParams.ts`)
> *"Page number, page limit, search query, category, and sorting are kept in the URL query parameters. I wrote `useProductParams` to parse and sanitize bad URL inputs (like `?page=abc` or `?page=999`) into safe fallbacks without crashing."*

### 3. Race Condition & Search Protection (`src/hooks/useProducts.ts`)
> *"To handle fast typing in search, I used two layers in `useProducts.ts`: a hand-written `useDebounce` hook (400ms delay), plus `AbortController` cancellation so superseded API requests are cancelled before old data can overwrite newer search results."*

### 4. Client Local Overlay (`src/context/LocalProductsContext.tsx`)
> *"Since DummyJSON mock API endpoints do not persist `POST`, `PUT`, or `DELETE` requests on their backend, I built `LocalProductsContext`. It saves added, edited, and deleted items in `localStorage` and merges them on top of the API data seamlessly."*

---

## 🚀 Quick Setup & How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials
- **Username**: `emilys`
- **Password**: `emilyspass`

---

## 🧪 Testing Checklist

- [x] **Race Condition**: Type rapidly in search; previous requests are aborted via `AbortController`.
- [x] **Bad URL**: `?page=abc` defaults to `page=1`; `?page=999` clamps to max valid page.
- [x] **Double-Click Protection**: Form submit buttons disable immediately with loading spinner.
- [x] **Mutual Exclusion**: Search query disables category filter with an inline explanation banner.
