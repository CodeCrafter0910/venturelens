"use client"

import { usePathname } from "next/navigation"

export default function Topbar() {
  const pathname = usePathname()

  const getTitle = () => {
    if (pathname === "/") return "Dashboard"
    if (pathname.startsWith("/companies"))
      return "Companies"
    if (pathname.startsWith("/lists"))
      return "Lists"
    if (pathname.startsWith("/saved"))
      return "Saved Searches"
    return ""
  }

  return (
    <div className="flex items-center justify-between px-10 py-4 bg-white">

      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {getTitle()}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Manage and analyze your venture data.
        </p>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          System Active
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
          RK
        </div>

      </div>
    </div>
  )
}