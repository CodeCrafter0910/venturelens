import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

export async function POST(req: NextRequest) {
  try {
    const { website } = await req.json()

    if (!website) {
      return NextResponse.json(
        { error: "Website URL is required." },
        { status: 400 }
      )
    }

    // Step 1: Fetch the public website HTML (AI Scrape)
    let html: string
    try {
      const response = await fetch(website, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; VentureLensBot/1.0; +https://venturelens.app)",
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch website (HTTP ${response.status}).` },
          { status: 502 }
        )
      }

      html = await response.text()
    } catch {
      return NextResponse.json(
        {
          error:
            "Could not reach the company website. It may be blocking bots or temporarily unavailable.",
        },
        { status: 502 }
      )
    }

    // Step 2: Extract text from HTML
    const cleaned = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")

    const pageText = cleaned
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000)

    // Detect page signals from HTML structure
    const pageSignals: string[] = []
    const lowerHtml = html.toLowerCase()
    if (lowerHtml.includes("/careers") || lowerHtml.includes("/jobs"))
      pageSignals.push("Careers page detected — likely hiring")
    if (lowerHtml.includes("/blog") || lowerHtml.includes("blog"))
      pageSignals.push("Blog present — active content marketing")
    if (lowerHtml.includes("/changelog") || lowerHtml.includes("changelog"))
      pageSignals.push("Changelog found — shipping product updates")
    if (lowerHtml.includes("/pricing") || lowerHtml.includes("pricing"))
      pageSignals.push("Pricing page exists — monetized product")
    if (lowerHtml.includes("/docs") || lowerHtml.includes("documentation"))
      pageSignals.push("Developer docs available — developer-focused")
    if (lowerHtml.includes("/api") || lowerHtml.includes("api reference"))
      pageSignals.push("API available — platform play")
    if (lowerHtml.includes("open source") || lowerHtml.includes("github.com"))
      pageSignals.push("Open source presence detected")
    if (lowerHtml.includes("soc 2") || lowerHtml.includes("gdpr") || lowerHtml.includes("compliance"))
      pageSignals.push("Security/compliance focus — enterprise-ready")

    // Step 3: Send to Groq AI for structured extraction
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      // Fallback: return basic extraction without AI
      return NextResponse.json({
        summary:
          pageText.split(". ").slice(0, 2).join(". ") + ".",
        whatTheyDo: [
          "Information extracted from website content",
          "Visit the website for full details",
        ],
        keywords: extractKeywords(pageText),
        signals:
          pageSignals.length > 0
            ? pageSignals.slice(0, 4)
            : ["Website is publicly accessible"],
        sources: [
          {
            url: website,
            timestamp: new Date().toISOString(),
          },
        ],
      })
    }

    let responseText: string
    try {
      const groq = new Groq({ apiKey })

      const prompt = `You are a VC research analyst. Analyze the following website content and return a JSON object with these exact fields:

1. "summary": A concise 1-2 sentence description of what the company does.
2. "whatTheyDo": An array of 3-6 bullet points describing their core products/services.
3. "keywords": An array of 5-10 relevant keywords about the company.
4. "signals": An array of 2-4 derived investment signals (e.g., "Strong developer community", "Enterprise-ready product", "Growing team — actively hiring").

Also consider these page structure signals I detected: ${pageSignals.join(", ") || "none"}.

Website content:
${pageText}

IMPORTANT: Return ONLY valid JSON. No markdown, no code fences, no explanation.`

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a specialized JSON-only output bot. Output exactly what is requested with no conversational dialogue or markdown formatting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.1,
        response_format: { type: "json_object" },
      })

      responseText = completion.choices[0]?.message?.content || "{}"
    } catch (aiError: unknown) {
      console.error("Groq API error:", aiError)
      const message = aiError instanceof Error ? aiError.message : "Unknown AI error"
      // If Groq fails, return the fallback extraction instead of failing entirely
      return NextResponse.json({
        summary: pageText.split(". ").slice(0, 2).join(". ") + ".",
        whatTheyDo: ["AI analysis unavailable — basic extraction used"],
        keywords: extractKeywords(pageText),
        signals: pageSignals.length > 0 ? pageSignals.slice(0, 4) : ["Website is publicly accessible"],
        sources: [{ url: website, timestamp: new Date().toISOString() }],
        _aiError: message,
      })
    }

    // Parse the JSON from AI response
    let enrichmentData
    try {
      // Clean potential markdown code fences
      const cleanJson = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      enrichmentData = JSON.parse(cleanJson)
    } catch {
      // If JSON parsing fails, return the structured fallback
      return NextResponse.json({
        summary: pageText.split(". ").slice(0, 2).join(". ") + ".",
        whatTheyDo: ["Could not parse AI response — raw content was extracted"],
        keywords: extractKeywords(pageText),
        signals: pageSignals.slice(0, 4),
        sources: [
          {
            url: website,
            timestamp: new Date().toISOString(),
          },
        ],
      })
    }

    // Merge AI results with page-detected signals
    const mergedSignals = [
      ...(enrichmentData.signals || []),
      ...pageSignals,
    ].slice(0, 4)

    return NextResponse.json({
      summary: enrichmentData.summary || "",
      whatTheyDo: enrichmentData.whatTheyDo || [],
      keywords: enrichmentData.keywords || [],
      signals: mergedSignals,
      sources: [
        {
          url: website,
          timestamp: new Date().toISOString(),
        },
      ],
    })
  } catch (error: unknown) {
    console.error("Enrichment error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: `Enrichment failed: ${message}`,
      },
      { status: 500 }
    )
  }
}

// Basic keyword extraction fallback
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || []

  const stopWords = new Set([
    "this", "that", "with", "from", "have", "your",
    "about", "their", "they", "will", "more", "than",
    "into", "using", "also", "such", "where", "which",
    "been", "were", "when", "what", "some", "each",
    "does", "just", "only", "very", "most", "over",
    "here", "then", "them", "these", "those", "could",
    "would", "should", "every", "under", "after",
    "before", "other", "being", "between", "through",
  ])

  const freq: Record<string, number> = {}
  words.forEach((word) => {
    if (!stopWords.has(word)) {
      freq[word] = (freq[word] || 0) + 1
    }
  })

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word)
}