"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CHATBOT_RESPONSES } from "@/lib/data"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatBotProps {
  onClose: () => void
}

export default function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm AromaAI 🌸 — your fragrance assistant. Need help finding your perfect scent?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    for (const [keyword, response] of Object.entries(CHATBOT_RESPONSES)) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return response
      }
    }

    return "That's a great question! I'd recommend exploring our collection or taking our scent quiz to find fragrances that match your preferences. What type of scent are you drawn to?"
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="glass-dark rounded-xl overflow-hidden flex flex-col h-96 shadow-2xl shadow-primary/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-accent/20 p-4 flex items-center justify-between">
        <h3 className="font-bold text-foreground">AromaAI Assistant</h3>
        <button onClick={onClose} className="p-1 hover:bg-accent/20 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-accent/20 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 px-3 py-2 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
