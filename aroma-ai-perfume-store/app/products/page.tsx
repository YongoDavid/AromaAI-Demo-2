"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { useCart } from "@/hooks/use-cart"
import { PERFUMES } from "@/lib/data"

export default function ProductsPage() {
  const { addItem } = useCart()
  const [favorites, setFavorites] = useState<number[]>([])
  const [selectedProfile, setSelectedProfile] = useState<string>("All")
  const [selectedSeason, setSelectedSeason] = useState<string>("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])

  const scentProfiles = [
    "All",
    "Floral & Woody",
    "Oriental & Woody",
    "Citrus & Fresh",
    "Aquatic & Fresh",
    "Amber & Warm",
    "Floral & Fruity",
    "Spicy & Woody",
    "Herbal & Fresh",
    "Floral & Romantic",
  ]
  const seasons = ["All", "Day", "Evening"]

  const filteredPerfumes = PERFUMES.filter((perfume) => {
    const profileMatch = selectedProfile === "All" || perfume.scentProfile === selectedProfile
    const seasonMatch = selectedSeason === "All" || perfume.season === selectedSeason
    const priceMatch = perfume.price >= priceRange[0] && perfume.price <= priceRange[1]
    return profileMatch && seasonMatch && priceMatch
  })

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Fragrance Collection
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">Explore our curated selection of premium fragrances</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="glass-dark rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent" />
                Filters
              </h3>

              {/* Scent Profile */}
              <div className="mb-8">
                <h4 className="font-semibold mb-3 text-foreground">Scent Profile</h4>
                <div className="space-y-2">
                  {scentProfiles.map((profile) => (
                    <label key={profile} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="profile"
                        value={profile}
                        checked={selectedProfile === profile}
                        onChange={(e) => setSelectedProfile(e.target.value)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {profile}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div className="mb-8">
                <h4 className="font-semibold mb-3 text-foreground">Season</h4>
                <div className="space-y-2">
                  {seasons.map((season) => (
                    <label key={season} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="season"
                        value={season}
                        checked={selectedSeason === season}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {season}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold mb-3 text-foreground">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full accent-accent"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPerfumes.map((perfume) => (
                <Link key={perfume.id} href={`/products/${perfume.id}`}>
                  <div className="group glass-dark rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-40 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-60 group-hover:opacity-80 transition-opacity blur-sm" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(perfume.id)
                        }}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-accent/50 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.includes(perfume.id) ? "fill-accent text-accent" : "text-foreground"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                        {perfume.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{perfume.description}</p>
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {perfume.notes.map((note, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-accent">
                            {note}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-accent">${perfume.price}</span>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            addItem(perfume)
                          }}
                          className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPerfumes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No fragrances match your filters. Try adjusting your selection.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
