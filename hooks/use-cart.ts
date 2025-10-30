"use client"

import { create } from "zustand"
import type { PERFUMES } from "@/lib/data"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (perfume: (typeof PERFUMES)[0]) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],

  addItem: (perfume) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === perfume.id)
      if (existing) {
        return {
          items: state.items.map((item) => (item.id === perfume.id ? { ...item, quantity: item.quantity + 1 } : item)),
        }
      }
      return {
        items: [
          ...state.items,
          {
            id: perfume.id,
            name: perfume.name,
            price: perfume.price,
            quantity: 1,
          },
        ],
      }
    })
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },

  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    }))
  },

  clearCart: () => {
    set({ items: [] })
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
}))
