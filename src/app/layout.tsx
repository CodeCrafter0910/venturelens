import "./globals.css"
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"
import { Toaster } from "sonner"

export const metadata = {
  title: "VentureLens",
  description: "VC Intelligence Interface",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-slate-900 antialiased">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="border-r border-gray-200 bg-white">
            <Sidebar />
          </aside>

          {/* Main Area */}
          <div className="flex-1 flex flex-col">

            {/* Topbar */}
            <div className="border-b border-gray-200 bg-white">
              <Topbar />
            </div>

            {/* Page Content */}
            <main className="flex-1 px-10 py-8">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>

          </div>
        </div>

        {/* Global Toast System */}
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  )
}