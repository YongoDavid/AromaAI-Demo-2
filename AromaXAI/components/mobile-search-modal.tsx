"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Mic, X } from "lucide-react"
import { generateAISuggestions, getContextualRecommendations, performIntelligentSearch } from "@/lib/search-utils"

interface MobileSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [aiSuggestions] = useState(() => generateAISuggestions())

  const results = useMemo(() => {
    if (!query.trim()) return []
    return performIntelligentSearch(query)
  }, [query])

  const contextualRecommendations = useMemo(() => {
    return getContextualRecommendations(query)
  }, [query])

  const handleVoiceSearch = () => {
    setIsListening(true)
    setTimeout(() => {
      setIsListening(false)
      const voiceQueries = [
        "fresh citrus fragrances",
        "warm amber scents",
        "floral evening perfumes",
        "daytime fragrances",
      ]
      setQuery(voiceQueries[Math.floor(Math.random() * voiceQueries.length)])
      setShowResults(true)
    }, 2000)
  }

  const handleSelectResult = () => {
    setShowResults(false)
    setQuery("")
    onClose()
  }

  const handleClose = () => {
    setQuery("")
    setShowResults(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex flex-col md:hidden">
        {/* Header */}
        <div className="glass-dark border-b border-accent/20 backdrop-blur-xl px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Search Fragrances</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-accent/20 rounded-lg transition-colors text-foreground"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setShowResults(true)
                    }}
                    placeholder="Search by name, notes, or scent profile..."
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  />
                  {query && (
                    <button
                      onClick={() => {
                        setQuery("")
                        setShowResults(false)
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleVoiceSearch}
                  disabled={isListening}
                  className={`p-3 rounded-lg transition-all flex-shrink-0 ${
                    isListening
                      ? "bg-accent/30 text-accent animate-pulse"
                      : "glass-dark hover:bg-accent/20 text-foreground"
                  }`}
                  title="Voice search"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              {isListening && (
                <p className="text-xs text-accent mt-2 animate-pulse">
                  Listening... Say something like "fresh citrus" or "evening fragrances"
                </p>
              )}

              {query && contextualRecommendations.length > 0 && (
                <div className="mt-3 text-xs text-accent/70 space-y-1">
                  {contextualRecommendations.map((rec, i) => (
                    <p key={i}>✨ {rec}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Search Results */}
            {showResults && query ? (
              <div className="glass-dark rounded-xl overflow-hidden">
                {results.length > 0 ? (
                  <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
                    {results.map((perfume) => (
                      <Link
                        key={perfume.id}
                        href={`/products/${perfume.id}`}
                        onClick={handleSelectResult}
                        className="p-4 hover:bg-primary/10 transition-colors flex items-start gap-3 group active:bg-primary/20"
                      >
                        <div className="w-12 h-16 rounded bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0 flex items-center justify-center">
                          <div className="w-8 h-10 rounded bg-gradient-to-br from-primary to-secondary opacity-60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold group-hover:text-accent transition-colors text-sm">
                            {perfume.name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">{perfume.description}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {perfume.notes.slice(0, 2).map((note, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded bg-primary/20 text-accent">
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-accent text-sm">${perfume.price}</p>
                          <p className="text-xs text-muted-foreground">{perfume.season}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground font-semibold">Nothing found</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Try adjusting your search. You can search by name, scent profile, price range, season, or specific
                      notes.
                    </p>
                    <p className="text-xs text-accent/70 mt-4">
                      💡 Example searches: "under $80", "evening fragrances", "floral", "citrus daytime"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* AI Suggestions */
              !query && (
                <div className="glass-dark rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-foreground text-sm">AI Suggestions</h3>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(suggestion)
                          setShowResults(true)
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/20 active:bg-primary/30 transition-colors text-sm text-muted-foreground hover:text-foreground"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}
