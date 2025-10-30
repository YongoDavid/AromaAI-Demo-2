"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Trash2, ArrowLeft, CarIcon as CartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const total = getTotal()
  const tax = Math.round(total * 0.1 * 100) / 100
  const shipping = total > 100 ? 0 : 10
  const finalTotal = total + tax + shipping

  if (items.length === 0 && !isCheckingOut) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <CartIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Start exploring our fragrance collection</p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isCheckingOut ? (
          <>
            {/* Header */}
            <div className="mb-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
              <h1 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Shopping Cart
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="glass-dark rounded-xl p-6 flex items-center gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0 flex items-center justify-center">
                        <div className="w-16 h-20 rounded bg-gradient-to-br from-primary to-secondary opacity-60" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link href={`/products/${item.id}`} className="hover:text-accent transition-colors">
                          <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                        </Link>
                        <p className="text-accent font-semibold mb-4">${item.price}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 glass rounded-lg w-fit px-3 py-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-accent hover:text-primary transition-colors"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-accent hover:text-primary transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent mb-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="glass-dark rounded-xl p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-border/50">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold text-accent">${finalTotal.toFixed(2)}</span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground mb-6 p-3 rounded-lg bg-primary/10 border border-primary/20">
                      Add ${(100 - total).toFixed(2)} more for free shipping!
                    </p>
                  )}

                  <Button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 text-lg py-6"
                  >
                    Proceed to Checkout
                  </Button>

                  <button
                    onClick={clearCart}
                    className="w-full mt-3 px-4 py-2 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <CheckoutFlow
            total={finalTotal}
            onBack={() => setIsCheckingOut(false)}
            onComplete={() => {
              clearCart()
              setIsCheckingOut(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

interface CheckoutFlowProps {
  total: number
  onBack: () => void
  onComplete: () => void
}

function CheckoutFlow({ total, onBack, onComplete }: CheckoutFlowProps) {
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.firstName && formData.lastName && formData.address && formData.city && formData.zip) {
      setStep("payment")
    }
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.cardNumber && formData.cardExpiry && formData.cardCVC) {
      setStep("confirmation")
    }
  }

  if (step === "confirmation") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-dark rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <div className="glass rounded-lg p-6 mb-8 text-left">
            <p className="text-sm text-muted-foreground mb-2">Order Number</p>
            <p className="text-2xl font-bold text-accent mb-6">
              #ARO-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
            <p className="text-2xl font-bold">${total.toFixed(2)}</p>
          </div>
          <p className="text-muted-foreground mb-8">
            You'll receive a confirmation email shortly. Track your delivery in the Delivery section.
          </p>
          <div className="flex gap-4">
            <Link href="/delivery" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50">
                Track Delivery
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-accent/50 text-foreground hover:bg-accent/10 bg-transparent"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex gap-4 mb-12">
        {["shipping", "payment", "confirmation"].map((s, i) => (
          <div key={s} className="flex-1">
            <div
              className={`h-2 rounded-full transition-all ${
                step === s || (step === "confirmation" && i < 2)
                  ? "bg-gradient-to-r from-primary to-secondary"
                  : "bg-muted"
              }`}
            />
            <p className="text-xs text-muted-foreground mt-2 capitalize">{s}</p>
          </div>
        ))}
      </div>

      {/* Forms */}
      {step === "shipping" && (
        <form onSubmit={handleShippingSubmit} className="glass-dark rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              required
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 border-accent/50 text-foreground hover:bg-accent/10 bg-transparent"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50"
            >
              Continue to Payment
            </Button>
          </div>
        </form>
      )}

      {step === "payment" && (
        <form onSubmit={handlePaymentSubmit} className="glass-dark rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono"
            maxLength={19}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="cardExpiry"
              placeholder="MM/YY"
              value={formData.cardExpiry}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono"
              maxLength={5}
              required
            />
            <input
              type="text"
              name="cardCVC"
              placeholder="CVC"
              value={formData.cardCVC}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono"
              maxLength={4}
              required
            />
          </div>

          <div className="glass rounded-lg p-4 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-2">Order Total</p>
            <p className="text-2xl font-bold text-accent">${total.toFixed(2)}</p>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("shipping")}
              className="flex-1 border-accent/50 text-foreground hover:bg-accent/10"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50"
            >
              Complete Purchase
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
