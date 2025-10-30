"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Navigation from "@/components/navigation"
import SmartSearch from "@/components/smart-search"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Fragrance Search
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Use our AI-powered search to find your perfect fragrance. Search by name, scent notes, profile, or season.
          </p>
        </div>

        <SmartSearch />
      </div>
    </div>
  )
}
