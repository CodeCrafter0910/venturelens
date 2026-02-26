"use client"

import { useState, useEffect } from "react"
import { mockCompanies } from "@/lib/mockCompanies"

type ListType = {
  id: string
  name: string
  companies: string[]
}

export default function ListsPage() {
  const [lists, setLists] = useState<ListType[]>([])
  const [newListName, setNewListName] = useState("")

  // Load lists
  useEffect(() => {
    const stored = localStorage.getItem("lists")
    setLists(stored ? JSON.parse(stored) : [])
  }, [])

  const saveLists = (updatedLists: ListType[]) => {
    setLists(updatedLists)
    localStorage.setItem("lists", JSON.stringify(updatedLists))
  }

  const createList = () => {
    const trimmed = newListName.trim()
    if (!trimmed) return

    // Prevent duplicate names
    if (lists.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) {
      alert("List with this name already exists.")
      return
    }

    const newList: ListType = {
      id: `list-${Date.now()}`,
      name: trimmed,
      companies: [],
    }

    saveLists([...lists, newList])
    setNewListName("")
  }

  const deleteList = (listId: string) => {
    const updated = lists.filter((l) => l.id !== listId)
    saveLists(updated)
  }

  const removeCompany = (listId: string, companyId: string) => {
    const updated = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            companies: list.companies.filter((id) => id !== companyId),
          }
        : list
    )
    saveLists(updated)
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
  }

  const exportCSV = (list: ListType) => {
    const companiesData = list.companies
      .map((id) => mockCompanies.find((c) => c.id === id))
      .filter(Boolean)

    const header = "Name,Industry,Location,Stage,Website\n"

    const rows = companiesData
      .map(
        (c) =>
          `${c?.name},${c?.industry},${c?.location},${c?.stage},${c?.website}`
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
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Lists</h1>

      {/* Create List */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name..."
          className="px-4 py-2 border rounded-lg flex-1"
        />
        <button
          onClick={createList}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Create
        </button>
      </div>

      {/* Empty State */}
      {lists.length === 0 && (
        <div className="text-gray-500 text-sm">
          No lists created yet.
        </div>
      )}

      {/* Lists */}
      <div className="space-y-8">
        {lists.map((list) => (
          <div key={list.id} className="border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {list.name}
              </h2>

              <button
                onClick={() => deleteList(list.id)}
                className="text-red-600 text-sm"
              >
                Delete List
              </button>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => exportJSON(list)}
                className="px-3 py-1 bg-gray-200 rounded-lg text-sm"
              >
                Export JSON
              </button>

              <button
                onClick={() => exportCSV(list)}
                className="px-3 py-1 bg-gray-200 rounded-lg text-sm"
              >
                Export CSV
              </button>
            </div>

            {list.companies.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No companies added yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {list.companies.map((companyId) => {
                  const company = mockCompanies.find(
                    (c) => c.id === companyId
                  )

                  if (!company) return null

                  return (
                    <li
                      key={company.id}
                      className="flex justify-between items-center border p-3 rounded-lg"
                    >
                      <span>{company.name}</span>
                      <button
                        onClick={() =>
                          removeCompany(list.id, company.id)
                        }
                        className="text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}