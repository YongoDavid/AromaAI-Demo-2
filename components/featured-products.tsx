"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { PERFUMES } from "@/lib/data"

export default function FeaturedProducts() {
  const { addItem } = useCart()
  const [favorites, setFavorites] = useState<number[]>([])

  const featured = PERFUMES.slice(0, 6)

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Featured Fragrances
          </span>
        </h2>
        <p className="text-muted-foreground text-lg">Handpicked by our AI to showcase the finest scents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((perfume, index) => (
          <Link key={perfume.id} href={`/products/${perfume.id}`}>
            <div
              className="group glass-dark rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col hover:scale-105 hover:-translate-y-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-40 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-60 group-hover:opacity-80 transition-opacity blur-sm group-hover:scale-110 duration-300" />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(perfume.id)
                  }}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-accent/50 transition-all duration-300 hover:scale-110"
                >
                  <Heart
                    className={`w-5 h-5 transition-all duration-300 ${
                      favorites.includes(perfume.id) ? "fill-accent text-accent scale-110" : "text-foreground"
                    }`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-300">
                  {perfume.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{perfume.description}</p>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {perfume.notes.map((note, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-primary/20 text-accent transition-all duration-300 group-hover:bg-primary/40"
                    >
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
                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-110"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
