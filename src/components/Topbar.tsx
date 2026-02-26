"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { mockCompanies } from "@/lib/mockCompanies"

export default function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const getTitle = () => {
    if (pathname === "/") return "Dashboard"
    if (pathname.startsWith("/companies")) return "Companies"
    if (pathname.startsWith("/lists")) return "Lists"
    if (pathname.startsWith("/saved")) return "Saved Searches"
    return ""
  }

  const getSubtitle = () => {
    if (pathname === "/") return "Overview of your venture intelligence"
    if (pathname.startsWith("/companies")) return "Search, filter, and explore companies"
    if (pathname.startsWith("/lists")) return "Organize companies into custom lists"
    if (pathname.startsWith("/saved")) return "Manage your saved search filters"
    return ""
  }

  // Keyboard shortcut: Cmd/Ctrl+K
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      setSearchOpen(true)
    }
    if (e.key === "Escape") {
      setSearchOpen(false)
      setSearchQuery("")
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  const filteredCompanies = searchQuery.trim()
    ? mockCompanies.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : []

  const handleSelect = (id: string) => {
    router.push(`/companies/${id}`)
    setSearchOpen(false)
    setSearchQuery("")
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-10 py-4 bg-white border-b border-gray-100">

        {/* Page Title */}
        <div className="pl-10 lg:pl-0">
          <h2 className="text-lg font-semibold text-slate-900">
            {getTitle()}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {getSubtitle()}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all bg-gray-50/50"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-400 border border-gray-200">
              ⌘K
            </kbd>
          </button>

          {/* Status */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-600 font-medium">Live</span>
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:shadow-md transition-shadow">
            RK
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 search-overlay flex items-start justify-center pt-[15vh]"
          onClick={() => {
            setSearchOpen(false)
            setSearchQuery("")
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search companies, industries, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-none"
              />
              <kbd className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-400 border border-gray-200">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {searchQuery.trim() === "" ? (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  Start typing to search across all companies...
                </div>
              ) : filteredCompanies.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  No companies match &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <div className="py-2">
                  <p className="px-5 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Companies
                  </p>
                  {filteredCompanies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleSelect(company.id)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                        {company.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {company.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {company.industry} · {company.location}
                        </p>
                      </div>
                      <span className="ml-auto badge badge-primary shrink-0">
                        {company.stage}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}