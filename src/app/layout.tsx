import "./globals.css"
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"
import { Toaster } from "sonner"

export const metadata = {
  title: "VentureLens — VC Intelligence Interface",
  description:
    "Discover, enrich, and organize startup intelligence with AI-powered insights.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <Sidebar />

          {/* Main Area */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Topbar */}
            <Topbar />

            {/* Page Content */}
            <main className="flex-1 px-4 sm:px-8 lg:px-10 py-6 lg:py-8">
              <div className="max-w-6xl mx-auto animate-fade-in">
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
          toastOptions={{
            style: {
              fontFamily: "'Inter', sans-serif",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  )
}