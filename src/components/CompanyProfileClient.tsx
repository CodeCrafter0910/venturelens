"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

type Company = {
  id: string
  name: string
  website: string
  industry: string
  location: string
  stage: string
  description: string
  founded: number
}

type EnrichmentType = {
  summary: string
  whatTheyDo: string[]
  keywords: string[]
  signals: string[]
  sources: { url: string; timestamp: string }[]
  error?: string
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
  const [enrichError, setEnrichError] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [lists, setLists] = useState<ListType[]>([])
  const [followed, setFollowed] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "enrichment" | "notes">("overview")

  // Load saved data on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    const timer = setTimeout(() => {
      const savedNote = localStorage.getItem(`note-${company.id}`)
      if (savedNote) setNote(savedNote)

      const storedLists = localStorage.getItem("lists")
      if (storedLists) setLists(JSON.parse(storedLists))

      const savedFollow = localStorage.getItem(`follow-${company.id}`)
      if (savedFollow) setFollowed(savedFollow === "true")

      const cached = localStorage.getItem(`enrichment-${company.id}`)
      if (cached) setEnrichment(JSON.parse(cached))
    }, 0)

    return () => clearTimeout(timer)
  }, [company.id])


  const handleEnrich = async () => {
    setLoading(true)
    setEnrichError(null)

    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: company.website }),
      })

      const data = await res.json()

      if (!res.ok) {
        setEnrichError(data.error || "Enrichment failed.")
        toast.error("Enrichment failed", {
          description: data.error,
        })
        setLoading(false)
        return
      }

      setEnrichment(data)
      localStorage.setItem(
        `enrichment-${company.id}`,
        JSON.stringify(data)
      )
      toast.success("Enrichment complete", {
        description: `Successfully enriched ${company.name}`,
      })
    } catch {
      setEnrichError("Network error. Please try again.")
      toast.error("Network error", {
        description: "Could not reach the enrichment API.",
      })
    }

    setLoading(false)
  }

  const handleSaveNote = () => {
    localStorage.setItem(`note-${company.id}`, note)
    toast.success("Note saved", {
      description: `Note for ${company.name} has been saved.`,
    })
  }

  const handleFollow = () => {
    const newState = !followed
    setFollowed(newState)
    localStorage.setItem(`follow-${company.id}`, String(newState))
    toast(newState ? "Following company" : "Unfollowed company", {
      description: company.name,
    })
  }

  const handleAddToList = (listId: string) => {
    if (!listId) return

    const targetList = lists.find((l) => l.id === listId)
    if (targetList?.companies.includes(company.id)) {
      toast.info("Already in list", {
        description: `${company.name} is already in "${targetList.name}"`,
      })
      return
    }

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
          ...list,
          companies: [...list.companies, company.id],
        }
        : list
    )

    setLists(updatedLists)
    localStorage.setItem("lists", JSON.stringify(updatedLists))
    toast.success("Added to list", {
      description: `${company.name} added to "${targetList?.name}"`,
    })
  }

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "enrichment" as const, label: "Enrichment" },
    { key: "notes" as const, label: "Notes" },
  ]

  // Signals timeline data
  const timelineItems = [
    { date: `Founded ${company.founded}`, label: "Company established", type: "info" as const },
    { date: company.stage, label: `Current funding stage`, type: "success" as const },
    ...(enrichment?.signals?.map((s) => ({
      date: "Signal",
      label: s,
      type: "accent" as const,
    })) || []),
  ]

  return (
    <div className="animate-fade-in">
      {/* Header Card */}
      <div className="card-premium p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-indigo-200">
              {company.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="badge badge-primary">{company.industry}</span>
                <span className="badge badge-accent">{company.stage}</span>
                <span className="text-sm text-gray-400">
                  📍 {company.location}
                </span>
              </div>
              {company.description && (
                <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                  {company.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleFollow}
              className={`btn text-sm ${followed
                ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                : "btn-secondary"
                }`}
            >
              {followed ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Following
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Follow
                </>
              )}
            </button>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Website
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.key
              ? "bg-white text-slate-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Company Info */}
              <div className="card-premium p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Company Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Industry", value: company.industry },
                    { label: "Location", value: company.location },
                    { label: "Stage", value: company.stage },
                    { label: "Founded", value: String(company.founded) },
                    { label: "Website", value: company.website, isLink: true },
                  ].map((item) => (
                    <div key={item.label} className={item.label === "Website" ? "col-span-2" : ""}>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      {item.isLink ? (
                        <a
                          href={item.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-700 transition"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-gray-900">
                          {item.value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Signals Timeline */}
              <div className="card-premium p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-5">
                  Signals Timeline
                </h2>
                <div className="space-y-0">
                  {timelineItems.map((item, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {/* Line */}
                      {i < timelineItems.length - 1 && (
                        <div className="absolute left-[15px] top-[28px] bottom-[-4px] w-[2px] bg-gray-100" />
                      )}
                      {/* Dot */}
                      <div className="mt-1.5 shrink-0">
                        <div
                          className={`w-[10px] h-[10px] rounded-full border-2 border-white z-10 relative shadow-sm ${item.type === "success"
                            ? "bg-emerald-500 shadow-emerald-200"
                            : item.type === "accent"
                              ? "bg-cyan-500 shadow-cyan-200"
                              : "bg-indigo-500 shadow-indigo-200"
                            }`}
                        />
                      </div>
                      {/* Content */}
                      <div className="pb-5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          {item.date}
                        </p>
                        <p className="text-sm text-gray-700 mt-0.5">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Enrichment Tab */}
          {activeTab === "enrichment" && (
            <div className="space-y-6">
              {/* Enrich button */}
              <div className="card-premium p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Live Enrichment
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Fetch real-time data from {company.website}
                    </p>
                  </div>
                  <button
                    onClick={handleEnrich}
                    disabled={loading}
                    className={`btn text-sm ${loading
                      ? "bg-gray-200 text-gray-500 cursor-wait"
                      : "btn-primary"
                      }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enriching...
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M23 6l-9.5 9.5-5-5L1 18" />
                          <path d="M17 6h6v6" />
                        </svg>
                        {enrichment ? "Re-Enrich" : "Enrich Company"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Loading skeleton */}
              {loading && (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="card-premium p-6">
                      <div className="skeleton h-5 w-32 mb-4" />
                      <div className="space-y-2">
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error state */}
              {enrichError && !loading && (
                <div className="card-premium border-red-200 bg-red-50 p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-red-700">
                        Enrichment Failed
                      </p>
                      <p className="text-sm text-red-600 mt-1">{enrichError}</p>
                      <button
                        onClick={handleEnrich}
                        className="mt-3 btn btn-danger text-xs"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* No enrichment yet */}
              {!enrichment && !loading && !enrichError && (
                <div className="card-premium p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                      <path d="M23 6l-9.5 9.5-5-5L1 18" />
                      <path d="M17 6h6v6" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">
                    No enrichment data yet. Click &quot;Enrich Company&quot; to fetch AI-powered insights.
                  </p>
                </div>
              )}

              {/* Enrichment results */}
              {enrichment && !loading && (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="card-premium p-6 animate-fade-in stagger-1">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Summary
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {enrichment.summary || "No summary available."}
                    </p>
                  </div>

                  {/* What They Do */}
                  {enrichment.whatTheyDo && enrichment.whatTheyDo.length > 0 && (
                    <div className="card-premium p-6 animate-fade-in stagger-2">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        What They Do
                      </h3>
                      <ul className="space-y-2">
                        {enrichment.whatTheyDo.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Keywords */}
                  {enrichment.keywords && enrichment.keywords.length > 0 && (
                    <div className="card-premium p-6 animate-fade-in stagger-3">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {enrichment.keywords.map((keyword: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Derived Signals */}
                  {enrichment.signals && enrichment.signals.length > 0 && (
                    <div className="card-premium p-6 animate-fade-in stagger-4">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Derived Signals
                      </h3>
                      <div className="space-y-2">
                        {enrichment.signals.map((signal, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-100"
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                                <path d="M23 6l-9.5 9.5-5-5L1 18" />
                              </svg>
                            </span>
                            <span className="text-sm text-emerald-700 font-medium">
                              {signal}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sources */}
                  <div className="card-premium p-6 animate-fade-in stagger-5">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Sources
                    </h3>
                    {enrichment.sources.map((source, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-700 transition truncate"
                        >
                          {source.url}
                        </a>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                          {new Date(source.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="card-premium p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Notes
              </h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your notes about this company..."
                className="w-full p-4 border border-gray-200 rounded-xl min-h-[200px] text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y"
              />
              <button
                onClick={handleSaveNote}
                className="mt-4 btn btn-primary text-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Note
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add to List */}
          <div className="card-premium p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Add to List
            </h3>
            {lists.length === 0 ? (
              <p className="text-xs text-gray-400">
                No lists yet. Create one from the Lists page.
              </p>
            ) : (
              <select
                onChange={(e) => handleAddToList(e.target.value)}
                defaultValue=""
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
              >
                <option value="">Select a list...</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name} ({list.companies.length})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card-premium p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Status</span>
                <span className={`badge ${followed ? "badge-success" : "badge-warning"}`}>
                  {followed ? "Following" : "Not following"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Enriched</span>
                <span className={`badge ${enrichment ? "badge-success" : "badge-warning"}`}>
                  {enrichment ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Lists</span>
                <span className="text-sm font-medium text-gray-700">
                  {lists.filter((l) => l.companies.includes(company.id)).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}