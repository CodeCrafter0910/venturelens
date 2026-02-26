# VentureLens

**VC Intelligence Interface — Discover, Enrich, and Organize Startups with AI**

---

## Overview

VentureLens is a professional-grade venture intelligence interface built with **Next.js 16**, **TypeScript**, and **Tailwind CSS v4**. It allows users to explore a dataset of startups, perform **AI-powered live enrichment** on company websites, organize companies into custom lists, save and re-run filtered searches, and export structured data.

The application follows a workflow-driven design: **discover → open profile → enrich → take action** (save, note, follow, export).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Custom CSS |
| AI Enrichment | Groq AI (llama-3.1-8b-instant) |
| Typography | Inter (Google Fonts) |
| Notifications | Sonner (toast-based feedback) |
| Persistence | localStorage (client-side) |
| API | Server-side route (`/api/enrich`) |

---

## Features

### 1. Dashboard (`/`)
- Stats overview: Total Companies, Lists, Saved Searches, Enriched Companies
- Quick action cards with gradient accents
- Recent companies preview list
- Keyboard shortcut hint (⌘K)

### 2. Companies Explorer (`/companies`)
- Full-text search by name and description
- Industry filter (dynamic, derived from data)
- Sort by Name, Industry, Location, or Stage
- Pagination with 8 items per page
- Company avatars, industry/stage badges
- "Save Search" button with toast confirmation

### 3. Company Profile (`/companies/[id]`)
- **Tabbed interface**: Overview | Enrichment | Notes
- **Overview tab**: Company details grid, signals timeline
- **Enrichment tab**: AI-powered live enrichment with:
  - Summary (1-2 sentences)
  - "What They Do" bullets (3-6 items)
  - Keywords (5-10)
  - Derived signals (2-4 inferred from page structure)
  - Sources with URLs and timestamps
  - Loading skeleton animation
  - Error state with retry button
  - Cached results in localStorage
- **Notes tab**: Textarea with save/persist per company
- **Follow button**: Track companies you're interested in
- **Add to List**: Quick dropdown to add company to any list

### 4. Lists (`/lists`)
- Create named lists (with duplicate prevention)
- View companies in each list
- Remove companies from lists
- Delete lists
- Export as **CSV** or **JSON** with full company data
- Toast feedback on every action

### 5. Saved Searches (`/saved`)
- View all saved filter combinations
- Re-run any saved search (navigates to `/companies` with params)
- Delete saved searches
- Shows saved date and filter details

### 6. Global Search (⌘K / Ctrl+K)
- Command palette-style search modal
- Searches across company name, industry, and location
- Click result to navigate to company profile
- ESC to close

---

## Live Enrichment Architecture

```
User clicks "Enrich Company"
        │
        ▼
Frontend POST /api/enrich { website }
        │
        ▼
Server-side route (API keys NEVER exposed):
  1. Fetch website HTML (AI Scrape)
  2. Extract text, strip scripts/styles/nav/footer
  3. Detect page signals from HTML structure:
     - /careers → hiring signal
     - /blog → content marketing
     - /changelog → shipping updates
     - /pricing → monetized product
     - /docs → developer-focused
     - /api → platform play
  4. Send extracted text + signals to Gemini AI
  5. Parse structured JSON response
  6. Return: summary, whatTheyDo, keywords, signals, sources
        │
        ▼
Frontend caches result in localStorage
```

**Fallback**: If `GROQ_API_KEY` is not set, the route falls back to basic HTML-based extraction (word frequency, meta description) instead of failing.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes (for AI enrichment) | Groq API key. Get one at [Groq Console](https://console.groq.com/keys) |

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then add your API key:

```
GROQ_API_KEY=your_api_key_here
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- npm

### Install

```bash
cd venturelens
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## Deployment (Vercel)

1. Push repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add environment variable: `GROQ_API_KEY`
4. Deploy — Vercel auto-detects Next.js

---

## Folder Structure

```
venturelens/
├── .env.example              # Environment variables template
├── package.json
├── next.config.ts
├── tsconfig.json
└── src/
    ├── app/
    │   ├── layout.tsx          # Root layout (sidebar + topbar + toaster)
    │   ├── page.tsx            # Dashboard
    │   ├── globals.css         # Design system (Inter font, animations, badges, etc.)
    │   ├── companies/
    │   │   ├── page.tsx        # Companies explorer (search + filter + table)
    │   │   └── [id]/page.tsx   # Company profile (server component)
    │   ├── lists/
    │   │   └── page.tsx        # Lists management
    │   ├── saved/
    │   │   └── page.tsx        # Saved searches
    │   └── api/
    │       └── enrich/
    │           └── route.ts    # Server-side AI enrichment endpoint
    ├── components/
    │   ├── Sidebar.tsx         # Navigation sidebar (icons, mobile-responsive)
    │   ├── Topbar.tsx          # Top bar with global search modal (⌘K)
    │   └── CompanyProfileClient.tsx  # Company profile (tabs, enrichment, notes)
    └── lib/
        └── mockCompanies.ts    # Seed dataset (15 real startups)
```

---

## Design Decisions

- **Inter font** for premium SaaS typography
- **Indigo/cyan/emerald** color palette — professional and consistent
- **Staggered fade-in animations** for polished feel
- **Skeleton loading** during enrichment for perceived speed
- **Toast notifications** on every user action (save, export, enrich, follow)
- **Badge system** for industry, stage, and status indicators
- **Card-based layout** with subtle shadows and hover effects
- **Mobile-responsive** sidebar with hamburger menu + overlay

---

## Author

**Rishabh Khanna**
VentureLens — VC Intelligence Interface
