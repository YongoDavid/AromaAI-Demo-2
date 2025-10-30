"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ShoppingCart, Heart, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { useCart } from "@/hooks/use-cart"
import { PERFUMES } from "@/lib/data"

export default function ProductDetailPage() {
  const params = useParams()
  const id = Number.parseInt(params.id as string)
  const perfume = PERFUMES.find((p) => p.id === id)
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!perfume) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground text-lg">Product not found</p>
        </div>
      </div>
    )
  }

  // Get recommendations (similar scent profiles)
  const recommendations = PERFUMES.filter((p) => p.id !== id && p.scentProfile === perfume.scentProfile).slice(0, 3)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(perfume)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square rounded-2xl glass-dark overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
              <div className="w-48 h-64 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-70 blur-sm" />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass w-fit mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground">{perfume.season} Fragrance</span>
            </div>

            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {perfume.name}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">{perfume.description}</p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-dark rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Scent Profile</p>
                <p className="font-semibold text-foreground">{perfume.scentProfile}</p>
              </div>
              <div className="glass-dark rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Longevity</p>
                <p className="font-semibold text-foreground">{perfume.longevity}</p>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3 text-foreground">Fragrance Notes</h3>
              <div className="flex flex-wrap gap-2">
                {perfume.notes.map((note, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-accent/30 text-accent font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="glass-dark rounded-lg p-4 mb-8 border border-accent/20">
              <p className="text-sm text-muted-foreground mb-2">AI Recommendation</p>
              <p className="text-foreground">{perfume.recommendation}</p>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-bold text-accent">${perfume.price}</span>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-3 rounded-lg glass-dark hover:bg-accent/20 transition-colors"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? "fill-accent text-accent" : "text-foreground"}`} />
              </button>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center gap-3 glass-dark rounded-lg px-4 py-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-accent hover:text-primary transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-accent hover:text-primary transition-colors"
                >
                  +
                </button>
              </div>
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                You May Also Like
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Link key={rec.id} href={`/products/${rec.id}`}>
                  <div className="group glass-dark rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden flex items-center justify-center">
                      <div className="w-24 h-32 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-60 group-hover:opacity-80 transition-opacity blur-sm" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold mb-2 group-hover:text-accent transition-colors">{rec.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-accent">${rec.price}</span>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            addItem(rec)
                          }}
                          className="bg-gradient-to-r from-primary to-secondary"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
