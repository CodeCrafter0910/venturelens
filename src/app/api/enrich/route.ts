import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { website } = await req.json()

    if (!website) {
      return NextResponse.json(
        { error: "Website is required" },
        { status: 400 }
      )
    }

    const response = await fetch(website, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; VentureLensBot/1.0)",
      },
    })

    const html = await response.text()

    // Remove scripts/styles
    const cleaned = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")

    const text = cleaned
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000)

    // Extract meta description
    const metaMatch = html.match(
      /<meta name="description" content="([^"]*)"/i
    )
    const metaDescription = metaMatch ? metaMatch[1] : null

    // Extract first meaningful sentence
    // Split into paragraphs
const paragraphs = cleaned
  .split("\n")
  .map((p) => p.trim())
  .filter((p) => p.length > 80)

// Business scoring keywords
const businessWords = [
  "platform",
  "software",
  "solution",
  "product",
  "service",
  "company",
  "technology",
  "ai",
  "fintech",
  "developer",
  "enterprise",
  "customers",
  "business",
]

// Score paragraphs
const scored = paragraphs.map((p) => {
  const lower = p.toLowerCase()
  let score = 0

  businessWords.forEach((word) => {
    if (lower.includes(word)) score++
  })

  return { text: p, score }
})

// Pick best paragraph
scored.sort((a, b) => b.score - a.score)

let summary = metaDescription || ""

if (!summary && scored.length > 0) {
  summary = scored[0].text
}

// Trim to first 2–3 sentences
if (summary) {
  const sentences = summary.split(". ")
  summary = sentences.slice(0, 3).join(". ")
}

    // Keyword extraction (basic frequency)
    const words = text
      .toLowerCase()
      .match(/\b[a-z]{4,}\b/g) || []

    const stopWords = [
      "this",
      "that",
      "with",
      "from",
      "have",
      "your",
      "about",
      "their",
      "they",
      "will",
      "more",
      "than",
      "into",
      "using",
      "also",
      "such",
      "where",
      "which",
    ]

    const freq: Record<string, number> = {}

    words.forEach((word) => {
      if (!stopWords.includes(word)) {
        freq[word] = (freq[word] || 0) + 1
      }
    })

    const keywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word)

    // Derived Signals
    const signals: string[] = []

    if (text.includes("saas")) signals.push("SaaS Business Model")
    if (text.includes("ai")) signals.push("AI-Focused")
    if (text.includes("machine learning"))
      signals.push("Uses Machine Learning")
    if (text.includes("api")) signals.push("API-Based Product")
    if (text.includes("developer"))
      signals.push("Developer Tools Focused")
    if (text.includes("fintech"))
      signals.push("Fintech Sector")
    if (text.includes("enterprise"))
      signals.push("Enterprise Customers")
    if (text.includes("startup"))
      signals.push("Startup-Focused")

    return NextResponse.json({
      summary,
      keywords,
      signals,
      sources: [
        {
          url: website,
          timestamp: new Date().toISOString(),
        },
      ],
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Enrichment failed" },
      { status: 500 }
    )
  }
}