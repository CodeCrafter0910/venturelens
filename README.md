📄 VentureLens — VC Intelligence Interface
Overview

VentureLens is a lightweight venture intelligence interface built using Next.js App Router and TypeScript.

The goal of this project is to simulate a VC research workflow where users can:

Explore a dataset of companies

Filter, sort, and paginate results

View detailed company profiles

Enrich company data via an API

Create lists of companies

Save searches

Add notes

Export lists in CSV and JSON formats

This project focuses on clean UI, structured data flow, and frontend system design.

Tech Stack

Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

State: React Hooks

Persistence: localStorage (client-side)

API: Custom API route (/api/enrich)

Notifications: Sonner (toast system)

All requirements from the assignment were implemented using the specified stack.

Features
1. Companies Explorer

Search by company name

Filter by industry

Sort by name, industry, or location

Pagination (5 companies per page)

Clean table layout

Dynamic routing for individual company profiles

Dataset is based on the provided mock companies list as instructed.

2. Company Profile Page

Each company page includes:

Overview section

Notes section (persisted in localStorage)

Enrichment section (via API)

Add to List functionality

Cached enrichment results per company

Enrichment data is fetched only when the user clicks the "Enrich Company" button.

3. Enrichment API

API Route:

/api/enrich

This route:

Accepts a company website

Fetches metadata

Extracts signals (e.g. blog presence, changelog, etc.)

Returns structured enrichment data

Includes:

Summary

Derived signals

Source URL

Timestamp

Enrichment results are cached per company.

4. Lists System

Users can:

Create custom lists

Add companies to lists

Remove companies

Persist lists in localStorage

Export lists in:

CSV format

JSON format

Each list maintains references to company IDs.

5. Saved Searches

Users can save filtered search states.

Saved search includes:

Search keyword

Industry filter

Sort field

Search state is restored using URL query parameters.

6. Dashboard

Homepage includes:

Total Companies

Total Lists

Saved Searches count

Enriched Companies count

Quick navigation buttons

Designed as a lightweight SaaS-style dashboard.

UI / Design System

The UI follows a structured SaaS layout:

Sidebar navigation

Topbar with dynamic title

Card-based content containers

Subtle shadows and borders

Consistent spacing

Toast notifications for actions

Responsive layout

All styling is built using Tailwind CSS.

Folder Structure (Simplified)
src/
 ├── app/
 │   ├── page.tsx                (Dashboard)
 │   ├── companies/
 │   │    ├── page.tsx
 │   │    └── [id]/page.tsx
 │   ├── lists/page.tsx
 │   ├── saved/page.tsx
 │   └── api/enrich/route.ts
 │
 ├── components/
 │   ├── Sidebar.tsx
 │   ├── Topbar.tsx
 │   ├── CompanyProfileClient.tsx
 │   └── Card.tsx
 │
 └── lib/
     └── mockCompanies.ts
Design Decisions

Used localStorage instead of backend DB for fast prototyping.

Separated Server and Client components properly (App Router pattern).

Avoided unnecessary external libraries.

Focused on clean UI and predictable state flow.

Implemented reusable components (Card, layout structure).

How to Run
npm install
npm run dev

Then open:

http://localhost:3000
Future Improvements

If extended further:

Database persistence

Authentication system

Real external enrichment service

Role-based access

Advanced filtering (multi-field)

Dark mode toggle

Real-time search API

Author

Built by:

Rishabh Khanna
VentureLens — VC Intelligence Interface