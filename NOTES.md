# Simple Project Architecture & Interview Walkthrough Guide

---

## 🏗️ The 4 Simple Layers of the Architecture

To explain this project easily to anyone, think of it as 4 clean building blocks:

```
┌─────────────────────────────────────────────────────────┐
│ 1. UI Layer (src/app & src/components)                  │
│    - Renders desktop Table, mobile Cards, Filters, Form │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│ 2. Hooks Layer (src/hooks)                              │
│    - useProductParams (Sanitizes URL page/search/limit) │
│    - useProducts (Fetches data & cancels old requests)   │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│ 3. Context Overlay Layer (src/context)                  │
│    - LocalProductsContext (Merges Add/Edit/Delete in   │
│      localStorage over DummyJSON mock API responses)    │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│ 4. API Layer (src/lib/axios.ts & src/services)          │
│    - Central Axios instance with Bearer token & 401     │
│      auto-logout interceptor                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🗣️ How to Walk Someone Through Your Code (Step-by-Step)

### Step 1: Explain the Central Axios Setup (`src/lib/axios.ts`)
> *"We have one central Axios file (`axios.ts`). It automatically attaches the login token from cookies to every request and handles 401 errors by logging the user out. UI components don't call Axios directly—all API calls live cleanly in `src/services/`."*

### Step 2: Explain URL State Sanitization (`src/hooks/useProductParams.ts`)
> *"We keep page numbers, search queries, categories, and sort options in the URL query string (`?page=1&q=phone`). If someone enters invalid URL values like `?page=abc` or `?page=999`, `useProductParams` sanitizes and clamps them safely to valid defaults."*

### Step 3: Explain Fast Search & Race Conditions (`src/hooks/useProducts.ts`)
> *"When a user types fast in search, old requests can complete out of order. In `useProducts.ts`, we handle this with `AbortController` cancellation (aborting old pending requests) and a 400ms hand-written `useDebounce` hook."*

### Step 4: Explain How Add/Edit/Delete Persists (`src/context/LocalProductsContext.tsx`)
> *"DummyJSON is a read-only mock API that doesn't save additions or deletions on their server. We solved this with `LocalProductsContext`, which saves added/edited/deleted products in `localStorage` and merges them on top of the API results."*

---

## 📋 File-by-File Cheat Sheet

| Directory | What it does | Key File |
| :--- | :--- | :--- |
| `src/lib/` | API setup & validators | `axios.ts` (Interceptor), `validators.ts` (Form rules) |
| `src/services/` | API endpoint calls | `products.service.ts` (GET/POST/PUT/DELETE) |
| `src/hooks/` | Business logic | `useProducts.ts` (Fetching), `useProductParams.ts` (URL sanitizing) |
| `src/context/` | Global app state | `AuthContext.tsx` (Login), `LocalProductsContext.tsx` (Overlay) |
| `src/components/` | Visual components | `ProductTable.tsx` (Desktop), `ProductCard.tsx` (Mobile) |
| `src/app/` | Page routes | `/login` (Auth), `/products` (List), `/products/[id]` (Details) |
