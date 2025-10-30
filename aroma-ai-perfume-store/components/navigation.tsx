"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import MobileSearchModal from "./mobile-search-modal"

export default function Navigation() {
  const { items } = useCart()
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <nav className="sticky top-0 z-50 glass-dark border-b border-accent/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-primary/50">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all duration-300">
                AromaAI
              </span>
            </Link>

            {/* Search Bar - Desktop Only */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <Link href="/search" className="w-full">
                <div className="relative w-full cursor-pointer group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  <input
                    type="text"
                    placeholder="Search fragrances..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all group-hover:border-accent/50 cursor-pointer"
                    readOnly
                  />
                </div>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="md:hidden p-2 hover:bg-accent/20 rounded-lg transition-colors text-foreground"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link href="/products">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
                >
                  Shop
                </Button>
              </Link>
              <Link href="/cart" className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </Button>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs flex items-center justify-center font-bold animate-pulse-glow">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Modal */}
      <MobileSearchModal isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} />
    </>
  )
}
