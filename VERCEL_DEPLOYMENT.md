# Vercel Deployment Guide

Follow these simple steps to deploy your **Product Admin Dashboard** to Vercel:

---

## 1. Push Code to GitHub

Open your terminal in the project folder and run:
```bash
git push -u origin main
```
*(Your repository `https://github.com/shiivaa19/atelier-admin.git` is already configured)*

---

## 2. Deploy on Vercel

1. Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New** -> **Project**.
3. Select your repository: `shiivaa19/atelier-admin` and click **Import**.

---

## 3. Vercel Project Settings

- **Framework Preset**: `Next.js` *(Vercel detects this automatically)*
- **Root Directory**: `./` *(default)*
- **Build Command**: `npm run build` *(default)*
- **Output Directory**: `.next` *(default)*

---

## 4. Environment Variables (Required for Vercel)

Under the **Environment Variables** section in Vercel, add this key-value pair:

| Key (Name) | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://dummyjson.com` |

---

## 5. Click Deploy

Click **Deploy**! In 1-2 minutes, Vercel will provide your live website URL (e.g. `https://atelier-admin.vercel.app`).
