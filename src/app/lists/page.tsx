"use client"

import { useState, useEffect } from "react"
import { mockCompanies } from "@/lib/mockCompanies"
import { toast } from "sonner"

type ListType = {
  id: string
  name: string
  companies: string[]
}

export default function ListsPage() {
  const [lists, setLists] = useState<ListType[]>([])
  const [newListName, setNewListName] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("lists")
    if (stored) {
      setTimeout(() => {
        setLists(JSON.parse(stored))
      }, 0)
    }
  }, [])

  const saveLists = (updatedLists: ListType[]) => {
    setLists(updatedLists)
    localStorage.setItem("lists", JSON.stringify(updatedLists))
  }

  const createList = () => {
    const trimmed = newListName.trim()
    if (!trimmed) return

    if (lists.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Duplicate name", {
        description: "A list with this name already exists.",
      })
      return
    }

    const newList: ListType = {
      id: `list-${Date.now()}`,
      name: trimmed,
      companies: [],
    }

    saveLists([...lists, newList])
    setNewListName("")
    toast.success("List created", {
      description: `"${trimmed}" has been created.`,
    })
  }

  const deleteList = (listId: string) => {
    const list = lists.find((l) => l.id === listId)
    const updated = lists.filter((l) => l.id !== listId)
    saveLists(updated)
    toast.success("List deleted", {
      description: `"${list?.name}" has been removed.`,
    })
  }

  const removeCompany = (listId: string, companyId: string) => {
    const company = mockCompanies.find((c) => c.id === companyId)
    const updated = lists.map((list) =>
      list.id === listId
        ? {
          ...list,
          companies: list.companies.filter((id) => id !== companyId),
        }
        : list
    )
    saveLists(updated)
    toast("Company removed", {
      description: `${company?.name} removed from list.`,
    })
  }

  const exportJSON = (list: ListType) => {
    const companiesData = list.companies
      .map((id) => mockCompanies.find((c) => c.id === id))
      .filter(Boolean)

    const blob = new Blob(
      [JSON.stringify(companiesData, null, 2)],
      { type: "application/json" }
    )

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${list.name}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Exported as JSON", {
      description: `${list.name}.json downloaded.`,
    })
  }

  const exportCSV = (list: ListType) => {
    const companiesData = list.companies
      .map((id) => mockCompanies.find((c) => c.id === id))
      .filter(Boolean)

    const header = "Name,Industry,Location,Stage,Website,Description\n"
    const rows = companiesData
      .map(
        (c) =>
          `"${c?.name}","${c?.industry}","${c?.location}","${c?.stage}","${c?.website}","${c?.description}"`
      )
      .join("\n")

    const blob = new Blob(
      [header + rows],
      { type: "text/csv" }
    )

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${list.name}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Exported as CSV", {
      description: `${list.name}.csv downloaded.`,
    })
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="card-premium p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Lists</h1>
        <p className="text-sm text-gray-400 mt-1">
          Organize companies into custom lists and export them.
        </p>
      </div>

      {/* Create List */}
      <div className="card-premium p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Create New List
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createList()}
            placeholder="Enter list name..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <button
            onClick={createList}
            className="btn btn-primary text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create
          </button>
        </div>
      </div>

      {/* Empty State */}
      {lists.length === 0 && (
        <div className="card-premium p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" />
              <path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">
            No lists created yet. Create one above to get started.
          </p>
        </div>
      )}

      {/* Lists */}
      <div className="space-y-4">
        {lists.map((list) => (
          <div key={list.id} className="card-premium p-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center text-purple-600 text-sm font-bold shrink-0">
                  {list.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {list.name}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {list.companies.length} {list.companies.length === 1 ? "company" : "companies"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportJSON(list)}
                  className="btn btn-secondary text-xs px-3 py-1.5"
                >
                  JSON
                </button>
                <button
                  onClick={() => exportCSV(list)}
                  className="btn btn-secondary text-xs px-3 py-1.5"
                >
                  CSV
                </button>
                <button
                  onClick={() => deleteList(list.id)}
                  className="btn btn-danger text-xs px-3 py-1.5"
                >
                  Delete
                </button>
              </div>
            </div>

            {list.companies.length === 0 ? (
              <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-4 text-center">
                No companies added yet. Go to a company profile to add it here.
              </p>
            ) : (
              <div className="space-y-2">
                {list.companies.map((companyId) => {
                  const company = mockCompanies.find(
                    (c) => c.id === companyId
                  )
                  if (!company) return null

                  return (
                    <div
                      key={company.id}
                      className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                          {company.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {company.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {company.industry} · {company.location}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCompany(list.id, company.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-xs shrink-0 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}