"use client"

import { useState, useEffect } from "react"

type Company = {
  id: string
  name: string
  website: string
  industry: string
  location: string
  stage: string
}

type EnrichmentType = {
  summary: string
  keywords: string[]
  signals: string[]
  sources: { url: string; timestamp: string }[]
}

type ListType = {
  id: string
  name: string
  companies: string[]
}

export default function CompanyProfileClient({
  company,
}: {
  company: Company
}) {
  const [loading, setLoading] = useState(false)
  const [enrichment, setEnrichment] = useState<EnrichmentType | null>(null)
  const [note, setNote] = useState("")
  const [lists, setLists] = useState<ListType[]>([])

  // 🔹 Sync data whenever company changes
  useEffect(() => {
    const enrichmentKey = `enrichment-${company.id}`
    const noteKey = `note-${company.id}`

    const savedNote = localStorage.getItem(noteKey)
    setNote(savedNote || "")

    const storedLists = localStorage.getItem("lists")
    setLists(storedLists ? JSON.parse(storedLists) : [])
  }, [company.id])

const handleEnrich = async () => {
  const enrichmentKey = `enrichment-${company.id}`

  const cached = localStorage.getItem(enrichmentKey)

  if (cached) {
    setEnrichment(JSON.parse(cached))
    return
  }

  setLoading(true)

  try {
    const res = await fetch("/api/enrich", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website: company.website }),
    })

    const data = await res.json()

    setEnrichment(data)

    localStorage.setItem(
      enrichmentKey,
      JSON.stringify(data)
    )
  } catch (error) {
    console.error("Enrichment failed:", error)
  }

  setLoading(false)
}

  const handleSaveNote = () => {
    localStorage.setItem(`note-${company.id}`, note)
  }

  const handleAddToList = (listId: string) => {
    if (!listId) return

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            companies: list.companies.includes(company.id)
              ? list.companies
              : [...list.companies, company.id],
          }
        : list
    )

    setLists(updatedLists)
    localStorage.setItem("lists", JSON.stringify(updatedLists))
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-black">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {company.name}
          </h1>
          <p className="text-gray-600">
            {company.industry} • {company.location}
          </p>
        </div>

        <a
          href={company.website}
          target="_blank"
          className="px-4 py-2 bg-black text-white rounded-lg text-sm"
        >
          Visit Website
        </a>
      </div>

      {/* Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Overview
        </h2>

        <div className="space-y-2 text-gray-700">
          <p><strong>Industry:</strong> {company.industry}</p>
          <p><strong>Location:</strong> {company.location}</p>
          <p><strong>Stage:</strong> {company.stage}</p>
          <p><strong>Website:</strong> {company.website}</p>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Notes
        </h2>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add your notes about this company..."
          className="w-full p-4 border rounded-xl min-h-[120px]"
        />

        <button
          onClick={handleSaveNote}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Save Note
        </button>
      </div>

      {/* Add to List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Add to List
        </h2>

        {lists.length === 0 ? (
          <p className="text-sm text-gray-500">
            No lists available. Create one in Lists page.
          </p>
        ) : (
          <select
            onChange={(e) => handleAddToList(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Select list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Enrichment */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Enrichment
        </h2>

        <button
          onClick={handleEnrich}
          className={`px-4 py-2 rounded-lg text-white transition ${
            loading ? "bg-gray-600" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Enriching..." : "Enrich Company"}
        </button>

        <div className="mt-8 space-y-8">

          {!enrichment && (
            <div className="p-6 bg-gray-50 rounded-xl border text-gray-500">
              No enrichment data yet. Click "Enrich Company" to fetch insights.
            </div>
          )}

          {enrichment && (
            <>
              {/* Summary */}
              <div className="p-6 bg-gray-50 rounded-xl border">
                <h3 className="font-semibold mb-2 text-lg">
                  Summary
                </h3>
                <p className="text-gray-700">
                  {enrichment.summary}
                </p>
              </div>

              {/* Keywords */}
{enrichment.keywords && enrichment.keywords.length > 0 && (
  <div className="p-6 bg-gray-50 rounded-xl border">
    <h3 className="font-semibold mb-4 text-lg">
      Extracted Keywords
    </h3>

    <div className="flex flex-wrap gap-2">
      {enrichment.keywords.map((keyword: string, i: number) => (
        <span
          key={i}
          className="px-3 py-1 bg-white border rounded-full text-sm"
        >
          {keyword}
        </span>
      ))}
    </div>
  </div>
)}

              {/* Signals */}
              <div className="p-6 bg-gray-50 rounded-xl border">
                <h3 className="font-semibold mb-4 text-lg">
                  Derived Signals
                </h3>

                <ul className="space-y-2">
                  {enrichment.signals.map((signal, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 bg-white rounded-lg border text-sm"
                    >
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sources */}
              <div className="p-6 bg-gray-50 rounded-xl border">
                <h3 className="font-semibold mb-2 text-lg">
                  Sources
                </h3>

                <a
                  href={enrichment.sources[0].url}
                  target="_blank"
                  className="text-blue-600 underline text-sm"
                >
                  {enrichment.sources[0].url}
                </a>

                <p className="text-xs text-gray-500 mt-1">
                  Retrieved at{" "}
                  {new Date(
                    enrichment.sources[0].timestamp
                  ).toLocaleString()}
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}