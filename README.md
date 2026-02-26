VentureLens

VC Intelligence Interface

Overview

VentureLens is a lightweight venture intelligence interface built using Next.js (App Router) and TypeScript.

The application simulates a VC research workflow, allowing users to explore a dataset of companies, enrich company information, organize companies into lists, and export structured data.

The project focuses on clean architecture, structured state management, and professional SaaS-style UI design.

This implementation strictly follows the assignment requirements and uses the provided mock dataset.

Tech Stack

Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

State Management: React Hooks

Persistence: localStorage (client-side)

API: Custom API Route (/api/enrich)

Notifications: Toast-based feedback system

No external backend or database is used, as per assignment scope.

Core Features
1. Companies Explorer

Search by company name

Filter by industry

Sort by name, industry, or location

Pagination (5 companies per page)

Dynamic routing for company profile pages

Clean, structured table layout

The explorer operates strictly on the provided mock dataset.

2. Company Profile

Each company page includes:

Overview section

Notes section (persisted per company)

Enrichment section (manual trigger)

Add to List functionality

Cached enrichment results (per company)

Enrichment data is fetched only when the user explicitly clicks the "Enrich Company" button.

3. Enrichment API

API Route:

/api/enrich

The API:

Accepts a company website URL

Fetches metadata

Extracts structured signals

Returns:

Summary

Derived signals

Source reference

Timestamp

Results are cached in localStorage for performance and persistence.

4. Lists Management

Users can:

Create custom lists

Add companies to lists

Remove companies from lists

Persist lists in localStorage

Export lists in:

CSV format

JSON format

Each list stores company IDs referencing the dataset.

5. Saved Searches

Users can save filtered search states.

Each saved search stores:

Search query

Industry filter

Sort selection

Saved searches restore state via URL query parameters.

6. Dashboard

The homepage functions as a lightweight analytics dashboard displaying:

Total Companies

Total Lists

Saved Searches

Enriched Companies

Quick navigation actions

Designed with a SaaS-style layout using Sidebar + Topbar structure.

UI Architecture

The UI follows a structured layout:

Persistent Sidebar navigation

Dynamic Topbar

Card-based content containers

Consistent spacing and typography

Toast notifications for user actions

Responsive layout

Styling is implemented entirely using Tailwind CSS.

## Folder Structure

```
src/
├── app/
│   ├── page.tsx
│   ├── companies/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── lists/
│   │   └── page.tsx
│   ├── saved/
│   │   └── page.tsx
│   └── api/
│       └── enrich/
│           └── route.ts
│
├── components/
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── CompanyProfileClient.tsx
│   └── Card.tsx
│
└── lib/
    └── mockCompanies.ts
```
Design Decisions

Used the provided mock dataset as required.

Kept enrichment logic within a controlled API route.

Separated server and client components appropriately.

Used localStorage for prototype-level persistence.

Maintained clear separation between UI components and data logic.

Avoided unnecessary dependencies.

Running the Project

Install dependencies:

npm install

Run development server:

npm run dev

Open:

http://localhost:3000
Notes

The application is intentionally frontend-focused.

Data persistence is localStorage-based.

The dataset remains limited to the provided mock companies as per assignment requirements.

Author

Rishabh Khanna
VentureLens — VC Intelligence Interface.
