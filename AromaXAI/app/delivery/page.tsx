"use client"

import { useState } from "react"
import { Package, Truck, MapPin, CheckCircle, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"

interface DeliveryStatus {
  id: string
  orderNumber: string
  status: "processing" | "shipped" | "in-transit" | "delivered"
  items: string[]
  estimatedDelivery: string
  currentLocation: string
  timeline: Array<{
    status: string
    date: string
    completed: boolean
  }>
}

const mockOrders: DeliveryStatus[] = [
  {
    id: "1",
    orderNumber: "ARO-ABC123XYZ",
    status: "in-transit",
    items: ["Midnight Bloom", "Citrus Dawn"],
    estimatedDelivery: "Dec 15, 2024",
    currentLocation: "Distribution Center, Chicago, IL",
    timeline: [
      { status: "Order Confirmed", date: "Dec 10, 2024", completed: true },
      { status: "Processing", date: "Dec 11, 2024", completed: true },
      { status: "Shipped", date: "Dec 12, 2024", completed: true },
      { status: "In Transit", date: "Dec 13, 2024", completed: true },
      { status: "Out for Delivery", date: "Dec 15, 2024", completed: false },
      { status: "Delivered", date: "Dec 15, 2024", completed: false },
    ],
  },
  {
    id: "2",
    orderNumber: "ARO-DEF456UVW",
    status: "delivered",
    items: ["Velvet Noir"],
    estimatedDelivery: "Dec 8, 2024",
    currentLocation: "Delivered to recipient",
    timeline: [
      { status: "Order Confirmed", date: "Dec 3, 2024", completed: true },
      { status: "Processing", date: "Dec 4, 2024", completed: true },
      { status: "Shipped", date: "Dec 5, 2024", completed: true },
      { status: "In Transit", date: "Dec 6, 2024", completed: true },
      { status: "Out for Delivery", date: "Dec 8, 2024", completed: true },
      { status: "Delivered", date: "Dec 8, 2024", completed: true },
    ],
  },
  {
    id: "3",
    orderNumber: "ARO-GHI789RST",
    status: "processing",
    items: ["Ocean Breeze", "Lavender Dreams", "Rose Garden"],
    estimatedDelivery: "Dec 18, 2024",
    currentLocation: "Warehouse, New York, NY",
    timeline: [
      { status: "Order Confirmed", date: "Dec 12, 2024", completed: true },
      { status: "Processing", date: "Dec 13, 2024", completed: true },
      { status: "Shipped", date: "Dec 14, 2024", completed: false },
      { status: "In Transit", date: "Dec 15, 2024", completed: false },
      { status: "Out for Delivery", date: "Dec 18, 2024", completed: false },
      { status: "Delivered", date: "Dec 18, 2024", completed: false },
    ],
  },
]

export default function DeliveryPage() {
  const [selectedOrder, setSelectedOrder] = useState<DeliveryStatus | null>(null)
  const [trackingNumber, setTrackingNumber] = useState("")

  const handleTrack = () => {
    const order = mockOrders.find((o) => o.orderNumber.toLowerCase() === trackingNumber.toLowerCase())
    if (order) {
      setSelectedOrder(order)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-accent" />
      case "in-transit":
        return <Truck className="w-6 h-6 text-primary" />
      case "shipped":
        return <Package className="w-6 h-6 text-secondary" />
      default:
        return <Clock className="w-6 h-6 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-accent"
      case "in-transit":
        return "text-primary"
      case "shipped":
        return "text-secondary"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedOrder ? (
          <>
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Track Your Delivery
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Monitor your fragrance orders in real-time with AI-powered tracking
              </p>
            </div>

            {/* Search */}
            <div className="glass-dark rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6">Find Your Order</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter order number (e.g., ARO-ABC123XYZ)"
                  className="flex-1 px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <Button
                  onClick={handleTrack}
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50"
                >
                  Track Order
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Try: ARO-ABC123XYZ, ARO-DEF456UVW, or ARO-GHI789RST</p>
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Recent Orders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="glass-dark rounded-xl p-6 text-left hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="text-sm text-muted-foreground">Order</p>
                          <p className="font-mono text-sm font-bold">{order.orderNumber}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Items</p>
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <p key={i} className="text-sm text-foreground">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <p className={`text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                        {order.status === "in-transit" ? "In Transit" : order.status}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Est. {order.estimatedDelivery}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-accent font-semibold">Click to view details →</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>

            {/* Order Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Tracking */}
              <div className="lg:col-span-2">
                <div className="glass-dark rounded-xl p-8 mb-8">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                      <p className="text-2xl font-bold font-mono">{selectedOrder.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-2">
                        {getStatusIcon(selectedOrder.status)}
                        <span className={`text-lg font-bold capitalize ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status === "in-transit" ? "In Transit" : selectedOrder.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Est. {selectedOrder.estimatedDelivery}</p>
                    </div>
                  </div>

                  {/* Current Location */}
                  <div className="glass rounded-lg p-4 mb-8 border border-accent/20">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Location</p>
                        <p className="font-semibold text-foreground">{selectedOrder.currentLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-bold mb-6 text-foreground">Delivery Timeline</h3>
                    <div className="space-y-4">
                      {selectedOrder.timeline.map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-4 h-4 rounded-full border-2 transition-all ${
                                event.completed ? "bg-accent border-accent" : "border-muted-foreground bg-transparent"
                              }`}
                            />
                            {index < selectedOrder.timeline.length - 1 && (
                              <div
                                className={`w-0.5 h-12 transition-all ${
                                  event.completed ? "bg-accent" : "bg-muted-foreground/30"
                                }`}
                              />
                            )}
                          </div>
                          <div className="pb-4">
                            <p
                              className={`font-semibold ${event.completed ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {event.status}
                            </p>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="glass-dark rounded-xl p-8">
                  <h3 className="font-bold mb-4 text-foreground">AI Delivery Insights</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                      <p className="text-sm text-muted-foreground">
                        Your package is on schedule and expected to arrive by{" "}
                        <span className="text-accent font-semibold">{selectedOrder.estimatedDelivery}</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                      <p className="text-sm text-muted-foreground">
                        Based on current weather and traffic patterns, delivery is expected in the morning
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                      <p className="text-sm text-muted-foreground">
                        You'll receive a notification 2 hours before delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="glass-dark rounded-xl p-6 sticky top-24">
                  <h3 className="font-bold mb-6 text-foreground">Order Summary</h3>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border/50">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0 flex items-center justify-center">
                          <div className="w-6 h-8 rounded bg-gradient-to-br from-primary to-secondary opacity-60" />
                        </div>
                        <p className="text-sm font-medium text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${(selectedOrder.items.length * 85).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span>${(selectedOrder.items.length * 85 * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border/50">
                      <span>Total</span>
                      <span className="text-accent">${(selectedOrder.items.length * 85 * 1.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
