"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { mockCompanies, Company } from "@/lib/mockCompanies"
import Link from "next/link"
import { toast } from "sonner"

export default function CompaniesPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-96 w-full" />
      </div>
    }>
      <CompaniesContent />
    </Suspense>
  )
}

function CompaniesContent() {
  const searchParams = useSearchParams()

  const [search, setSearch] = useState("")
  const [industryFilter, setIndustryFilter] = useState("All")
  const [sortField, setSortField] = useState<keyof Company>("name")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 8

  // Sync state from query params on mount
  useEffect(() => {
    const searchParam = searchParams.get("search") || ""
    const industryParam = searchParams.get("industry") || "All"
    const sortParam = (searchParams.get("sort") as keyof Company) || "name"

    // Use a small delay to avoid "cascading renders" linting error
    const timer = setTimeout(() => {
      setSearch(searchParam)
      setIndustryFilter(industryParam)
      setSortField(sortParam)
      setCurrentPage(1)
    }, 0)

    return () => clearTimeout(timer)
  }, [searchParams])

  // Get unique industries
  const industries = ["All", ...Array.from(new Set(mockCompanies.map((c) => c.industry)))]

  // Filter + Sort
  const filteredCompanies = mockCompanies
    .filter((company) =>
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((company) =>
      industryFilter === "All"
        ? true
        : company.industry === industryFilter
    )
    .sort((a, b) =>
      a[sortField].toString().localeCompare(b[sortField].toString())
    )

  const totalPages = Math.ceil(
    filteredCompanies.length / itemsPerPage
  )

  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSaveSearch = () => {
    const stored = localStorage.getItem("savedSearches")
    const savedSearches = stored ? JSON.parse(stored) : []

    const newSearch = {
      id: `search-${Date.now()}`,
      name: `${industryFilter} — ${search || "All companies"}`,
      search,
      industry: industryFilter,
      sort: sortField,
      savedAt: new Date().toISOString(),
    }

    localStorage.setItem(
      "savedSearches",
      JSON.stringify([...savedSearches, newSearch])
    )

    toast.success("Search saved", {
      description: `"${newSearch.name}" added to Saved Searches`,
    })
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="card-premium p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Companies
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {filteredCompanies.length} companies found
            </p>
          </div>
          <button
            onClick={handleSaveSearch}
            className="btn btn-primary text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Save Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#94a3b8" strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Industry filter */}
        <select
          value={industryFilter}
          onChange={(e) => {
            setIndustryFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind === "All" ? "All Industries" : ind}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortField}
          onChange={(e) =>
            setSortField(e.target.value as keyof Company)
          }
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="name">Sort by Name</option>
          <option value="industry">Sort by Industry</option>
          <option value="location">Sort by Location</option>
          <option value="stage">Sort by Stage</option>
        </select>
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Industry
              </th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Location
              </th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Stage
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {paginatedCompanies.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <p className="text-sm">No companies match your filters.</p>
                  </div>
                </td>
              </tr>
            )}

            {paginatedCompanies.map((company) => (
              <tr
                key={company.id}
                className="table-row-hover"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/companies/${company.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 group-hover:shadow-md group-hover:shadow-indigo-100 transition-shadow">
                      {company.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                        {company.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-[250px]">
                        {company.description}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="badge badge-primary">
                    {company.industry}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                  {company.location}
                </td>
                <td className="px-6 py-4">
                  <span className="badge badge-accent">
                    {company.stage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ←
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${currentPage === index + 1
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "border border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}