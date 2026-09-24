# Aureus - Product Admin Dashboard

**GitHub Repository**: [https://github.com/shiivaa19/atelier-admin.git](https://github.com/shiivaa19/atelier-admin.git)

A clean, modern Product Admin Dashboard built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **Axios**. All data logic (pagination, debouncing, request cancellation, state management, and URL sanitization) is hand-written without third-party data grid or query libraries.

---

## 📁 Project Folder Structure

```
src/
├── app/                  # Page Routes
│   ├── (auth)/login/     # Login Page
│   └── (dashboard)/      # Protected Dashboard Routes
│       └── products/     # Product List & [id] Detail Page
├── components/           # UI Components
│   ├── ui/               # Low-level primitives (Button, Input, Modal, Toast)
│   ├── layout/           # Layout structure (Sidebar, Topbar, MobileDrawer)
│   └── products/         # Product components (ProductTable, ProductCard, Filters, Pagination, ProductForm)
├── context/              # State Management
│   ├── AuthContext.tsx   # Login token & user session
│   ├── LocalProductsContext.tsx # Local overlay for Add/Edit/Delete
│   └── ToastContext.tsx  # Toast notifications
├── hooks/                # Custom Logic Hooks
│   ├── useProducts.ts    # Fetching + AbortController cancellation
│   ├── useProductParams.ts # URL query string parsing & sanitizing
│   └── useDebounce.ts   # Hand-written 400ms search debouncer
├── services/             # API Layer (Axios)
│   ├── auth.service.ts
│   ├── products.service.ts
│   └── categories.service.ts
└── lib/                  # Utilities & Config
    ├── axios.ts          # Central Axios instance + Interceptors
    └── validators.ts     # Hand-written form validation
```

---

## 🛠️ Tech Stack & Constraints

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (Single instance with bearer token interceptor)
- **Icons**: `lucide-react`
- **Strict Constraints**:
  - Hand-crafted data fetching via custom `useProducts` hook (No React Query / SWR).
  - Standard HTML `<table>` for desktop (No TanStack Table).
  - All pagination, sorting, filtering, and modal logic written by hand.

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

## 📌 Architectural Decisions

### 1. Search vs. Category Mutual Exclusion
- **Behavior**: Typing a search query clears the category filter. Selecting a category clears the search query.
- **Inline UI Warning**: Displays an alert: *"Category filter is disabled while searching to preserve true server-side pagination."*
- **Reason**: The DummyJSON API does not support combining `q` and `category` parameters simultaneously (`/products/search?q=` vs `/products/category/{slug}`). Fetching all products client-side to combine them would break true server-side pagination, waste bandwidth, and give wrong total counts.

### 2. Local Overlay Strategy for Add/Edit/Delete
- **Behavior**: Added products, edited fields, and deleted IDs are stored in `LocalProductsContext` + `localStorage` and merged on top of API data.
- **Reason**: The DummyJSON API does not persist `POST`, `PUT`, or `DELETE` changes on its servers. The local overlay provides real persistence across page reloads and navigations.

---

## 🧪 Testing Checklist

- [x] **Race Condition**: Type rapidly in search; previous requests are aborted via `AbortController`.
- [x] **Bad URL**: `?page=abc` defaults to `page=1`; `?page=999` clamps to max valid page.
- [x] **Double-Click Protection**: Form submit buttons disable immediately with loading spinner.
- [x] **Mutual Exclusion**: Search query disables category filter with an inline explanation banner.
