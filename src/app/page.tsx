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

    let count = 0
    mockCompanies.forEach((company) => {
      if (localStorage.getItem(`enrichment-${company.id}`)) {
        count++
      }
    })
    setEnrichedCount(count)
  }, [])

  const stats = [
    {
      label: "Total Companies",
      value: mockCompanies.length,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4v18" />
          <path d="M19 21V11l-6-4" />
        </svg>
      ),
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      label: "Your Lists",
      value: totalLists,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" />
          <path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" />
        </svg>
      ),
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
    },
    {
      label: "Saved Searches",
      value: savedSearches,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Enriched",
      value: enrichedCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <path d="M17 6h6v6" />
        </svg>
      ),
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
  ]

  const quickActions = [
    {
      label: "Explore Companies",
      href: "/companies",
      description: "Search & filter startups",
      primary: true,
    },
    {
      label: "View Lists",
      href: "/lists",
      description: "Manage your lists",
      primary: false,
    },
    {
      label: "Saved Searches",
      href: "/saved",
      description: "Re-run saved queries",
      primary: false,
    },
  ]

  return (
    <div className="space-y-6">

      {/* Welcome Header */}
      <div className="card-premium p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome to <span className="gradient-text">VentureLens</span>
            </h1>
            <p className="text-gray-500 mt-2 max-w-lg text-sm leading-relaxed">
              Your lightweight venture intelligence system. Discover, enrich, and organize startup intelligence with AI-powered insights.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`card-premium p-5 animate-fade-in stagger-${i + 1}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.textColor}`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {stat.value}
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card-premium p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`
                flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200
                ${action.primary
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300"
                  : "border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <div>
                <p className={`text-sm font-semibold ${action.primary ? "text-white" : "text-gray-900"}`}>
                  {action.label}
                </p>
                <p className={`text-xs mt-0.5 ${action.primary ? "text-indigo-100" : "text-gray-400"}`}>
                  {action.description}
                </p>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={action.primary ? "white" : "#94a3b8"}
                strokeWidth="2" className="ml-auto shrink-0"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Companies Preview */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Companies
          </h2>
          <Link
            href="/companies"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-2">
          {mockCompanies.slice(0, 5).map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                {company.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {company.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {company.description}
                </p>
              </div>
              <span className="badge badge-primary shrink-0">
                {company.industry}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-500 border border-gray-200 mx-0.5">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-500 border border-gray-200 mx-0.5">K</kbd> to search companies
        </p>
      </div>
    </div>
  )
}