"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import FeaturedProducts from "@/components/featured-products"
import ChatBot from "@/components/chatbot"

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <FeaturedProducts />

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-primary to-secondary glow-primary hover:scale-110 transition-transform duration-300"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Chat Widget */}
      {showChat && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-24px)]">
          <ChatBot onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  )
}
