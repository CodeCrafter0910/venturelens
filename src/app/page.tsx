"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { mockCompanies } from "@/lib/mockCompanies"

export default function DashboardPage() {
  const [totalLists, setTotalLists] = useState(0)
  const [savedSearches, setSavedSearches] = useState(0)
  const [enrichedCount, setEnrichedCount] = useState(0)

  useEffect(() => {
    const lists = localStorage.getItem("lists")
    const searches = localStorage.getItem("savedSearches")

    setTotalLists(lists ? JSON.parse(lists).length : 0)
    setSavedSearches(searches ? JSON.parse(searches).length : 0)

    // Count enrichment cache entries
    let count = 0
    mockCompanies.forEach((company) => {
      if (localStorage.getItem(`enrichment-${company.id}`)) {
        count++
      }
    })

    setEnrichedCount(count)
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 text-black">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to VentureLens — your lightweight venture intelligence system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">

        <div className="p-6 border rounded-xl">
          <p className="text-sm text-gray-500">Total Companies</p>
          <h2 className="text-2xl font-bold">
            {mockCompanies.length}
          </h2>
        </div>

        <div className="p-6 border rounded-xl">
          <p className="text-sm text-gray-500">Your Lists</p>
          <h2 className="text-2xl font-bold">
            {totalLists}
          </h2>
        </div>

        <div className="p-6 border rounded-xl">
          <p className="text-sm text-gray-500">Saved Searches</p>
          <h2 className="text-2xl font-bold">
            {savedSearches}
          </h2>
        </div>

        <div className="p-6 border rounded-xl">
          <p className="text-sm text-gray-500">Enriched Companies</p>
          <h2 className="text-2xl font-bold">
            {enrichedCount}
          </h2>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/companies"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Explore Companies
          </Link>

          <Link
            href="/lists"
            className="px-6 py-3 border rounded-lg hover:bg-gray-100 transition"
          >
            View Lists
          </Link>

          <Link
            href="/saved"
            className="px-6 py-3 border rounded-lg hover:bg-gray-100 transition"
          >
            Saved Searches
          </Link>
        </div>
      </div>

      {/* System Info */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          System Overview
        </h2>

        <div className="p-6 border rounded-xl text-sm text-gray-600">
          VentureLens allows you to search, enrich, organize, and export
          startup intelligence using real-time website analysis.
          <br /><br />
          Built using Next.js App Router, TypeScript, and localStorage-based
          persistence for fast prototype-level deployment.
        </div>
      </div>

    </div>
  )
}