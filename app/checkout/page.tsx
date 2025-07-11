"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/useCart"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    deliveryAddress: "",
    phone: "",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (items.length === 0) {
      return
    }

    setLoading(true)

    try {
      // Group items by store
      const itemsByStore = items.reduce(
        (acc, item) => {
          if (!acc[item.storeId]) {
            acc[item.storeId] = []
          }
          acc[item.storeId].push(item)
          return acc
        },
        {} as Record<string, typeof items>,
      )

      // Create orders for each store
      const orderPromises = Object.entries(itemsByStore).map(async ([storeId, storeItems]) => {
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: storeItems,
            storeId,
            deliveryAddress: formData.deliveryAddress,
            phone: formData.phone,
            notes: formData.notes,
          }),
        })

        if (!orderResponse.ok) {
          throw new Error("Failed to create order")
        }

        return orderResponse.json()
      })

      const orders = await Promise.all(orderPromises)

      // Create Stripe checkout session for the first order (simplified)
      const paymentResponse = await fetch("/api/payments/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orders[0]._id,
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error("Failed to create payment session")
      }

      const { url } = await paymentResponse.json()

      clearCart()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to process checkout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-4">You need to be signed in to checkout.</p>
            <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deliveryAddress">Delivery Address *</Label>
              <Textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                required
                placeholder="Enter your full delivery address"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Your phone number"
              />
            </div>

            <div>
              <Label htmlFor="notes">Special Instructions</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special delivery instructions"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(total + 5).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </form>
    </div>
  )
}
