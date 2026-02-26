"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type SavedSearch = {
  id: string
  name: string
  search: string
  industry: string
  sort: string
  savedAt?: string
}

export default function SavedPage() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("savedSearches")
    if (stored) {
      setTimeout(() => {
        setSavedSearches(JSON.parse(stored))
      }, 0)
    }
  }, [])

  const deleteSearch = (id: string) => {
    const search = savedSearches.find((s) => s.id === id)
    const updated = savedSearches.filter((s) => s.id !== id)
    setSavedSearches(updated)
    localStorage.setItem("savedSearches", JSON.stringify(updated))
    toast.success("Search deleted", {
      description: `"${search?.name}" has been removed.`,
    })
  }

  const runSearch = (search: SavedSearch) => {
    const query = new URLSearchParams({
      search: search.search,
      industry: search.industry,
      sort: search.sort,
    }).toString()

    toast("Running search", {
      description: `Loading results for "${search.name}"`,
    })

    router.push(`/companies?${query}`)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="card-premium p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Saved Searches
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {savedSearches.length} saved {savedSearches.length === 1 ? "search" : "searches"}
        </p>
      </div>

      {/* Empty State */}
      {savedSearches.length === 0 && (
        <div className="card-premium p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">
            No saved searches yet. Use the &quot;Save Search&quot; button on the Companies page.
          </p>
        </div>
      )}

      {/* Saved Searches */}
      <div className="space-y-3">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className="card-premium p-5 animate-fade-in"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 truncate">
                    {search.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="badge badge-primary">
                      {search.industry}
                    </span>
                    <span className="text-xs text-gray-400">
                      Sort: {search.sort}
                    </span>
                    {search.savedAt && (
                      <span className="text-xs text-gray-400">
                        · {new Date(search.savedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => runSearch(search)}
                  className="btn btn-primary text-xs px-4 py-2"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Run
                </button>
                <button
                  onClick={() => deleteSearch(search.id)}
                  className="btn btn-danger text-xs px-3 py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}