"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { mockCompanies, Company } from "@/lib/mockCompanies"
import Link from "next/link"

export default function CompaniesPage() {
  const searchParams = useSearchParams()

  const [search, setSearch] = useState("")
  const [industryFilter, setIndustryFilter] = useState("All")
  const [sortField, setSortField] = useState<keyof Company>("name")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  // Sync state from query params
  useEffect(() => {
    const searchParam = searchParams.get("search") || ""
    const industryParam = searchParams.get("industry") || "All"
    const sortParam =
      (searchParams.get("sort") as keyof Company) || "name"

    setSearch(searchParam)
    setIndustryFilter(industryParam)
    setSortField(sortParam)
    setCurrentPage(1)
  }, [searchParams])

  // Filter + Sort
  const filteredCompanies = mockCompanies
    .filter((company) =>
      company.name.toLowerCase().includes(search.toLowerCase())
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
      name: `${industryFilter} - ${search || "All"}`,
      search,
      industry: industryFilter,
      sort: sortField,
    }

    localStorage.setItem(
      "savedSearches",
      JSON.stringify([...savedSearches, newSearch])
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">
          Companies
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Search, filter and explore companies in your database.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">

        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2.5 w-64 border border-gray-300 rounded-lg text-slate-900 placeholder:text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
        />

        <select
          value={industryFilter}
          onChange={(e) => {
            setIndustryFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
        >
          <option value="All">All Industries</option>
          <option value="Fintech">Fintech</option>
          <option value="Productivity">Productivity</option>
          <option value="Developer Tools">Developer Tools</option>
        </select>

        <select
          value={sortField}
          onChange={(e) =>
            setSortField(e.target.value as keyof Company)
          }
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
        >
          <option value="name">Sort by Name</option>
          <option value="industry">Sort by Industry</option>
          <option value="location">Sort by Location</option>
        </select>

        <button
          onClick={handleSaveSearch}
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 transition text-sm"
        >
          Save Search
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left font-medium">
                Name
              </th>
              <th className="px-6 py-4 text-left font-medium">
                Industry
              </th>
              <th className="px-6 py-4 text-left font-medium">
                Location
              </th>
              <th className="px-6 py-4 text-left font-medium">
                Stage
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedCompanies.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No companies match your filters.
                </td>
              </tr>
            )}

            {paginatedCompanies.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  <Link
                    href={`/companies/${company.id}`}
                    className="hover:text-indigo-600 transition"
                  >
                    {company.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {company.industry}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {company.location}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {company.stage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 text-sm rounded-lg transition ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}