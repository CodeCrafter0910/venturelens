"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Companies", href: "/companies" },
    { name: "Lists", href: "/lists" },
    { name: "Saved Searches", href: "/saved" },
  ]

  return (
    <div className="w-64 h-full flex flex-col px-6 py-8">

      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          <span className="text-slate-900">Venture</span>
          <span className="text-indigo-600">Lens</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          VC Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" &&
              pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Spacer */}
      <div className="mt-auto pt-8 text-xs text-gray-400">
        VentureLens v1.0
      </div>

    </div>
  )
}