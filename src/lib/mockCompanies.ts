export type Company = {
  id: string
  name: string
  industry: string
  location: string
  stage: string
  website: string
}

export const mockCompanies: Company[] = [
  { id: "1", name: "FinCore", industry: "Fintech", location: "New York", stage: "Seed", website: "https://example.com" },
  { id: "2", name: "TaskFlow", industry: "Productivity", location: "San Francisco", stage: "Series A", website: "https://example.com" },
  { id: "3", name: "DevStack", industry: "Developer Tools", location: "Berlin", stage: "Pre-Seed", website: "https://example.com" },
  { id: "4", name: "PayBridge", industry: "Fintech", location: "London", stage: "Series B", website: "https://example.com" },
  { id: "5", name: "CloudNova", industry: "Developer Tools", location: "Toronto", stage: "Seed", website: "https://example.com" },

  { id: "6", name: "FlowSync", industry: "Productivity", location: "Austin", stage: "Series A", website: "https://example.com" },
  { id: "7", name: "DataForge", industry: "Developer Tools", location: "Singapore", stage: "Seed", website: "https://example.com" },
  { id: "8", name: "FinStack", industry: "Fintech", location: "Chicago", stage: "Series C", website: "https://example.com" },
  { id: "9", name: "TeamPilot", industry: "Productivity", location: "Boston", stage: "Seed", website: "https://example.com" },
  { id: "10", name: "CodeLift", industry: "Developer Tools", location: "Amsterdam", stage: "Series A", website: "https://example.com" },

  { id: "11", name: "WealthGrid", industry: "Fintech", location: "Dubai", stage: "Series B", website: "https://example.com" },
  { id: "12", name: "FocusBoard", industry: "Productivity", location: "Sydney", stage: "Pre-Seed", website: "https://example.com" },
  { id: "13", name: "APIWorks", industry: "Developer Tools", location: "Paris", stage: "Seed", website: "https://example.com" },
  { id: "14", name: "LedgerLoop", industry: "Fintech", location: "Zurich", stage: "Series A", website: "https://example.com" },
  { id: "15", name: "SprintOps", industry: "Productivity", location: "Tokyo", stage: "Series B", website: "https://example.com" },
]