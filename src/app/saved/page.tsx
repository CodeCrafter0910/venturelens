"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type SavedSearch = {
  id: string
  name: string
  search: string
  industry: string
  sort: string
}

export default function SavedPage() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("savedSearches")
    setSavedSearches(stored ? JSON.parse(stored) : [])
  }, [])

  const deleteSearch = (id: string) => {
    const updated = savedSearches.filter((s) => s.id !== id)
    setSavedSearches(updated)
    localStorage.setItem("savedSearches", JSON.stringify(updated))
  }

  const runSearch = (search: SavedSearch) => {
    const query = new URLSearchParams({
      search: search.search,
      industry: search.industry,
      sort: search.sort,
    }).toString()

    router.push(`/companies?${query}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-black">
      <h1 className="text-3xl font-bold mb-6">
        Saved Searches
      </h1>

      {savedSearches.length === 0 && (
        <p className="text-gray-500 text-sm">
          No saved searches yet.
        </p>
      )}

      <div className="space-y-6">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className="border rounded-xl p-6 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold text-lg">
                {search.name}
              </h2>
              <p className="text-sm text-gray-500">
                Industry: {search.industry} | Sort: {search.sort}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => runSearch(search)}
                className="px-3 py-1 bg-black text-white rounded-lg text-sm"
              >
                Run
              </button>

              <button
                onClick={() => deleteSearch(search.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}