import { PERFUMES } from "./data"

export function parseSearchQuery(query: string) {
  const lowerQuery = query.toLowerCase()
  const filters = {
    priceMax: null as number | null,
    priceMin: null as number | null,
    season: null as string | null,
    scentProfiles: [] as string[],
    notes: [] as string[],
    keywords: [] as string[],
  }

  // Parse price ranges (e.g., "under $80", "over $85", "$70-$90")
  const priceUnderMatch = lowerQuery.match(/under\s*\$?(\d+)/)
  if (priceUnderMatch) {
    filters.priceMax = Number.parseInt(priceUnderMatch[1])
  }

  const priceOverMatch = lowerQuery.match(/over\s*\$?(\d+)/)
  if (priceOverMatch) {
    filters.priceMin = Number.parseInt(priceOverMatch[1])
  }

  const priceRangeMatch = lowerQuery.match(/\$?(\d+)\s*-\s*\$?(\d+)/)
  if (priceRangeMatch) {
    filters.priceMin = Number.parseInt(priceRangeMatch[1])
    filters.priceMax = Number.parseInt(priceRangeMatch[2])
  }

  // Parse season (day/evening/daytime/night)
  if (lowerQuery.includes("day") || lowerQuery.includes("daytime")) {
    filters.season = "Day"
  } else if (lowerQuery.includes("evening") || lowerQuery.includes("night")) {
    filters.season = "Evening"
  }

  // Parse scent profiles
  const scentProfiles = [
    "Floral",
    "Citrus",
    "Fresh",
    "Woody",
    "Amber",
    "Warm",
    "Spicy",
    "Oriental",
    "Aquatic",
    "Fruity",
    "Herbal",
    "Romantic",
  ]
  scentProfiles.forEach((profile) => {
    if (lowerQuery.includes(profile.toLowerCase())) {
      filters.scentProfiles.push(profile)
    }
  })

  // Parse specific notes
  const allNotes = [...new Set(PERFUMES.flatMap((p) => p.notes))]
  allNotes.forEach((note) => {
    if (lowerQuery.includes(note.toLowerCase())) {
      filters.notes.push(note)
    }
  })

  // Extract remaining keywords
  const keywords = lowerQuery
    .replace(/under\s*\$?\d+/g, "")
    .replace(/over\s*\$?\d+/g, "")
    .replace(/\$?\d+\s*-\s*\$?\d+/g, "")
    .replace(/day|evening|night|daytime/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !["and", "the", "for", "with"].includes(word))

  filters.keywords = keywords

  return filters
}

export function performIntelligentSearch(query: string): typeof PERFUMES {
  if (!query.trim()) return []

  const filters = parseSearchQuery(query)
  const lowerQuery = query.toLowerCase()

  return PERFUMES.filter((perfume) => {
    // Check price filters
    if (filters.priceMax !== null && perfume.price > filters.priceMax) {
      return false
    }
    if (filters.priceMin !== null && perfume.price < filters.priceMin) {
      return false
    }

    // Check season filter
    if (filters.season && perfume.season !== filters.season) {
      return false
    }

    // Check scent profile filters
    if (filters.scentProfiles.length > 0) {
      const hasMatchingProfile = filters.scentProfiles.some((profile) =>
        perfume.scentProfile.toLowerCase().includes(profile.toLowerCase()),
      )
      if (!hasMatchingProfile) {
        return false
      }
    }

    // Check notes filters
    if (filters.notes.length > 0) {
      const hasMatchingNote = filters.notes.some((note) =>
        perfume.notes.some((n) => n.toLowerCase().includes(note.toLowerCase())),
      )
      if (!hasMatchingNote) {
        return false
      }
    }

    // Check keywords in name, description, and notes
    if (filters.keywords.length > 0) {
      const hasKeywordMatch = filters.keywords.some(
        (keyword) =>
          perfume.name.toLowerCase().includes(keyword) ||
          perfume.description.toLowerCase().includes(keyword) ||
          perfume.notes.some((note) => note.toLowerCase().includes(keyword)) ||
          perfume.scentProfile.toLowerCase().includes(keyword),
      )
      if (!hasKeywordMatch) {
        return false
      }
    }

    // If no specific filters were applied, do basic keyword search
    if (
      filters.priceMax === null &&
      filters.priceMin === null &&
      !filters.season &&
      filters.scentProfiles.length === 0 &&
      filters.notes.length === 0 &&
      filters.keywords.length === 0
    ) {
      return (
        perfume.name.toLowerCase().includes(lowerQuery) ||
        perfume.description.toLowerCase().includes(lowerQuery) ||
        perfume.notes.some((note) => note.toLowerCase().includes(lowerQuery)) ||
        perfume.scentProfile.toLowerCase().includes(lowerQuery) ||
        perfume.season.toLowerCase().includes(lowerQuery)
      )
    }

    return true
  })
}

export function generateAISuggestions(): string[] {
  const suggestions: string[] = []

  // Get unique scent profiles from products
  const scentProfiles = [...new Set(PERFUMES.map((p) => p.scentProfile))]
  const seasons = [...new Set(PERFUMES.map((p) => p.season))]

  // Suggestion 1: Fresh scents for daytime
  const freshScents = PERFUMES.filter((p) => p.scentProfile.includes("Fresh"))
  if (freshScents.length > 0) {
    suggestions.push(`Show me fresh ${freshScents[0].scentProfile.toLowerCase()} fragrances`)
  }

  // Suggestion 2: Evening fragrances
  const eveningFragrances = PERFUMES.filter((p) => p.season === "Evening")
  if (eveningFragrances.length > 0) {
    suggestions.push(`Best perfumes for evening wear`)
  }

  // Suggestion 3: Budget-friendly options
  const budgetFriendly = PERFUMES.filter((p) => p.price < 80)
  if (budgetFriendly.length > 0) {
    suggestions.push(`Quality fragrances under $80`)
  }

  // Suggestion 4: Premium options
  const premium = PERFUMES.filter((p) => p.price >= 85)
  if (premium.length > 0) {
    suggestions.push(`Luxury fragrances over $85`)
  }

  // Suggestion 5: Specific scent profile
  const floral = PERFUMES.filter((p) => p.scentProfile.includes("Floral"))
  if (floral.length > 0) {
    suggestions.push(`Explore our floral collection`)
  }

  // Suggestion 6: Warm/cozy scents
  const warm = PERFUMES.filter((p) => p.scentProfile.includes("Warm") || p.scentProfile.includes("Amber"))
  if (warm.length > 0) {
    suggestions.push(`Warm and cozy fragrances`)
  }

  // Suggestion 7: Exotic/spicy options
  const exotic = PERFUMES.filter((p) => p.scentProfile.includes("Spicy") || p.scentProfile.includes("Oriental"))
  if (exotic.length > 0) {
    suggestions.push(`Bold and exotic scents`)
  }

  // Suggestion 8: Daytime fragrances
  const daytime = PERFUMES.filter((p) => p.season === "Day")
  if (daytime.length > 0) {
    suggestions.push(`Perfect fragrances for daytime wear`)
  }

  return suggestions.slice(0, 4) // Return top 4 suggestions
}

export function getContextualRecommendations(query: string): string[] {
  const lowerQuery = query.toLowerCase()
  const recommendations: string[] = []

  // Check for scent profile matches
  const matchingProfiles = PERFUMES.filter(
    (p) =>
      p.scentProfile.toLowerCase().includes(lowerQuery) || p.notes.some((n) => n.toLowerCase().includes(lowerQuery)),
  )

  if (matchingProfiles.length > 0) {
    recommendations.push(
      `Found ${matchingProfiles.length} fragrance${matchingProfiles.length > 1 ? "s" : ""} matching "${query}"`,
    )
  }

  // Check for season matches
  if (lowerQuery.includes("day") || lowerQuery.includes("daytime")) {
    const dayFragrances = PERFUMES.filter((p) => p.season === "Day")
    recommendations.push(`${dayFragrances.length} daytime fragrances available`)
  }

  if (lowerQuery.includes("evening") || lowerQuery.includes("night")) {
    const eveningFragrances = PERFUMES.filter((p) => p.season === "Evening")
    recommendations.push(`${eveningFragrances.length} evening fragrances available`)
  }

  // Check for price-based queries
  if (lowerQuery.includes("under") || lowerQuery.includes("budget")) {
    const affordable = PERFUMES.filter((p) => p.price < 80)
    recommendations.push(`${affordable.length} fragrances under $80`)
  }

  if (lowerQuery.includes("premium") || lowerQuery.includes("luxury")) {
    const premium = PERFUMES.filter((p) => p.price >= 85)
    recommendations.push(`${premium.length} premium fragrances available`)
  }

  return recommendations
}
